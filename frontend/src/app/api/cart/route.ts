import { auth } from "@/lib/auth";
import { RedisClient } from "@/lib/redis";
import { GetCartResponse } from "@/types/cart";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

/**
 * Retrieve the authenticated user's cart, using a short-lived cache to reduce backend requests.
 *
 * Attempts to return the user's cart from cache; if not present, fetches it from the backend, stores it in cache for 60 seconds, and returns it. If there is no authenticated session, responds with a 401 Unauthorized error. If the backend base URL is not configured or an unexpected error occurs, responds with a 500 error.
 *
 * @returns The user's cart as JSON on success. On failure, a JSON error object with an appropriate HTTP status (401 for unauthorized, 500 for configuration or fetch errors).
 */
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session?.user.id;
  const cacheKey = `cart:userId:${userId}`;

  if (!RedisClient.isOpen) {
    await RedisClient.connect();
  }

  if (!BACKEND_BASE) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 500 },
    );
  }

  // BACKEND_BASE should include /api, e.g. http://localhost:8080/api
  const path = `/cart/user/${userId}`;

  try {
    const cached = await RedisClient.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return NextResponse.json(parsed);
    }

    const { data } = await axios.get<GetCartResponse>(`${BACKEND_BASE}${path}`);

    await RedisClient.setEx(cacheKey, 60, JSON.stringify(data));

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
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
    sessionId?: string | null;
    variantId?: string;
    quantity?: number;
  } | null;

  if (
    !body ||
    typeof body.userId !== "string" ||
    typeof body.variantId !== "string" ||
    typeof body.quantity !== "number" ||
    body.quantity <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid body: require userId (string), variantId (string), quantity (>0)",
      },
      { status: 400 },
    );
  }

  // Ensure the userId in body matches the authenticated user
  if (body.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // BACKEND_BASE should include /api, e.g. http://localhost:8080/api
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
    // Invalidate cache for this user
    try {
      if (!RedisClient.isOpen) {
        await RedisClient.connect();
      }
      const cacheKey = `cart:userId:${body.userId}`;
      await RedisClient.del(cacheKey);
    } catch {}

    return NextResponse.json(data, { status });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}