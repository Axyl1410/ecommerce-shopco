import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Map Prisma OrderStatus enum to frontend status
function mapOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "pending",
    CONFIRMED: "paid",
    PROCESSING: "paid",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    RETURNED: "cancelled",
    REFUNDED: "cancelled",
  };
  return statusMap[status] || "pending";
}

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
      select: {
        id: true,
        productId: true,
        rating: true,
        title: true,
        body: true,
        createdAt: true,
        product: {
          select: { name: true },
        },
      },
      take: 20,
    }),
  ]);

  const orderSummaries = orders.map((o) => ({
    id: o.id,
    code: o.orderNo,
    createdAt: o.createdAt,
    total: Number(o.finalAmount),
    status: mapOrderStatus(o.orderStatus),
    itemsCount: o._count.items,
  }));

  // Map reviews to match the frontend Review type
  const reviewSummaries = reviews.map((r) => ({
    id: r.id,
    user: r.product?.name || "Product",
    content: r.title ? `${r.title}${r.body ? ` - ${r.body}` : ""}` : (r.body || ""),
    rating: r.rating,
    date: r.createdAt.toISOString(),
  }));

  return NextResponse.json({ orders: orderSummaries, reviews: reviewSummaries });
}
