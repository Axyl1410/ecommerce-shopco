import { RedisClient } from "@/lib/redis";
import { GetCartResponse } from "@/types/cart";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
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

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
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
    const res = await fetch(`${BACKEND_BASE}/cart`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        userId: body.userId,
        sessionId: null,
        variantId: body.variantId,
        quantity: body.quantity,
      }),
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}
