import { auth } from "@/lib/auth";
import { RedisClient } from "@/lib/redis";
import { GetCartResponse } from "@/types/cart";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_BASE || process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Retrieve the authenticated user's cart, using a short-lived cache to reduce backend requests.
 *
 * Attempts to return the user's cart from cache; if not present, fetches it from the backend, stores it in cache for 60 seconds, and returns it. If there is no authenticated session, responds with a 401 Unauthorized error. If the backend base URL is not configured or an unexpected error occurs, responds with a 500 error.
 *
 * @returns The user's cart as JSON on success. On failure, a JSON error object with an appropriate HTTP status (401 for unauthorized, 500 for configuration or fetch errors).
 */
export async function GET() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (e) {
    console.error("Auth error:", e);
  }

  // ✅ Guest-safe
  if (!session) {
    return NextResponse.json({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    });
  }

  if (!BACKEND_BASE) {
    console.error("BACKEND_BASE is not configured");
    return NextResponse.json({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    });
  }

  const cacheKey = `cart:userId:${session.user.id}`;

  // ✅ Redis FAIL-SOFT
  try {
    if (RedisClient && !RedisClient.isOpen) {
      await RedisClient.connect();
    }

    const cached = await RedisClient.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }
  } catch (e) {
    console.warn("Redis skipped:", e);
  }

  // ✅ Backend FAIL-SOFT
  try {
    const { data } = await axios.get(
      `${BACKEND_BASE}/cart/user/${session.user.id}`,
    );

    try {
      await RedisClient.setEx(cacheKey, 60, JSON.stringify(data));
    } catch {}

    return NextResponse.json(data);
  } catch (e) {
    console.error("Backend cart error:", e);

    // ❗ TUYỆT ĐỐI KHÔNG return 500 cho cart global
    return NextResponse.json({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    });
  }
}

/**
 * Adds an item to the authenticated user's cart.
 *
 * Expects the request JSON body to contain `userId` (string), `variantId` (string),
 * and `quantity` (number > 0). `sessionId` may be provided but is ignored when calling the backend.
 *
 * @param req - Incoming Next.js request whose JSON body must include `userId`, `variantId`, and `quantity`
 * @returns On success, the backend's cart response JSON is returned with the backend's status code. On failure, a JSON object `{ error: string }` is returned with an appropriate HTTP status (401, 400, 403, or 500).
 */
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!BACKEND_BASE) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    userId?: string;
    variantId?: string;
    quantity?: number;
  } | null;

  if (
    !body ||
    body.userId !== session.user.id ||
    typeof body.variantId !== "string" ||
    typeof body.quantity !== "number" ||
    body.quantity <= 0
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const { data, status } = await axios.post(
      `${BACKEND_BASE}/cart`,
      {
        userId: body.userId,
        sessionId: null,
        variantId: body.variantId,
        quantity: body.quantity,
      },
      { headers: { "content-type": "application/json" } },
    );

    // Invalidate cache (FAIL-SOFT)
    try {
      if (!RedisClient.isOpen) {
        await RedisClient.connect();
      }
      await RedisClient.del(`cart:userId:${body.userId}`);
    } catch {}

    return NextResponse.json(data, { status });
  } catch (err) {
    console.error("POST /api/cart failed:", err);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}
