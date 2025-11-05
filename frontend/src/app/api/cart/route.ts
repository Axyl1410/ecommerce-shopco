import { auth } from "@/lib/auth";
import { RedisClient } from "@/lib/redis";
import { GetCartResponse } from "@/types/cart";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

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

export async function POST(req: NextRequest) {
  if (!BACKEND_BASE) {
    return NextResponse.json(
      { error: "BACKEND_URL not configured" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    userId?: string;
    sessionId?: string | null;
    variantId: string;
    quantity: number;
  } | null;

  if (!body || !body.variantId || !body.quantity || !body.userId) {
    return NextResponse.json(
      {
        error: "Invalid body: require variantId, quantity, and userId",
      },
      { status: 400 },
    );
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
    return NextResponse.json(data, { status });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}
