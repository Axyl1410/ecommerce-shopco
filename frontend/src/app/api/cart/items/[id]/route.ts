import { auth } from "@/lib/auth";
import { RedisClient } from "@/lib/redis";
import { GetCartResponse } from "@/types/cart";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id: cartItemId } = await params;
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

  const body = (await req.json().catch(() => null)) as {
    quantity?: number;
  } | null;

  if (!body || typeof body.quantity !== "number" || body.quantity <= 0) {
    return NextResponse.json(
      { error: "Invalid body: quantity must be a positive number" },
      { status: 400 },
    );
  }

  try {
    const { data, status } = await axios.put<GetCartResponse>(
      `${BACKEND_BASE}/cart/items/${cartItemId}`,
      { quantity: body.quantity },
      { headers: { "content-type": "application/json" } },
    );

    // Invalidate cache
    if (userId) {
      await RedisClient.del(cacheKey);
    }

    return NextResponse.json(data, { status });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;
  const { id: cartItemId } = await params;
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

  try {
    const { data, status } = await axios.delete<GetCartResponse>(
      `${BACKEND_BASE}/cart/items/${cartItemId}`,
    );

    if (userId) {
      await RedisClient.del(cacheKey);
    }

    return NextResponse.json(data, { status });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 },
    );
  }
}
