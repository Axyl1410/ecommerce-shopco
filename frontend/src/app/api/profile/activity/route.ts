import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [orders, reviews] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNo: true,
        createdAt: true,
        finalAmount: true,
        orderStatus: true,
        _count: { select: { items: true } },
      },
      take: 20,
    }),
    prisma.review.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, productId: true, rating: true, title: true, body: true, createdAt: true },
      take: 20,
    }),
  ]);

  const orderSummaries = orders.map((o) => ({
    id: o.id,
    code: o.orderNo,
    createdAt: o.createdAt,
    total: Number(o.finalAmount),
    status: o.orderStatus,
    itemsCount: o._count.items,
  }));

  return NextResponse.json({ orders: orderSummaries, reviews });
}
