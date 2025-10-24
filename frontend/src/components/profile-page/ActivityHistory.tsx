"use client";

import React, { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Review } from "@/types/review.types";

// Memoized currency formatter
const formatCurrency = (amount: number, currency: string = "VND") =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(amount);

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export type OrderSummary = {
  id: string;
  code: string;
  createdAt: string | Date;
  total: number;
  status: OrderStatus;
  itemsCount: number;
};

export type ActivityHistoryProps = {
  orders: OrderSummary[];
  reviews: Review[];
};

// Memoized status badge component
const StatusBadge = memo(({ status }: { status: OrderStatus }) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending Payment</Badge>;
    case "paid":
      return <Badge>Paid</Badge>;
    case "shipped":
      return <Badge>Shipping</Badge>;
    case "delivered":
      return (
        <Badge className="bg-green-600 hover:bg-green-600 text-white">
          Delivered
        </Badge>
      );
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
  }
});

StatusBadge.displayName = "StatusBadge";

// Memoized order row component
const OrderRow = memo(({ order }: { order: OrderSummary }) => (
  <TableRow key={order.id}>
    <TableCell className="font-medium">{order.code}</TableCell>
    <TableCell>
      {new Date(order.createdAt).toLocaleDateString("vi-VN", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric" 
      })}
    </TableCell>
    <TableCell className="text-right">{order.itemsCount}</TableCell>
    <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
    <TableCell><StatusBadge status={order.status} /></TableCell>
  </TableRow>
));

OrderRow.displayName = "OrderRow";

// Memoized review card component
const ReviewCard = memo(({ review }: { review: Review }) => (
  <div className="rounded-md border p-4">
    <div className="flex items-center justify-between">
      <div className="font-medium">{review.user}</div>
      <div className="text-xs text-muted-foreground">
        {new Date(review.date).toLocaleDateString("vi-VN")}
      </div>
    </div>
    <div className="text-yellow-500 text-sm">
      {"★".repeat(review.rating)}{"☆".repeat(Math.max(0, 5 - review.rating))}
    </div>
    <p className="text-sm mt-1">{review.content}</p>
  </div>
));

ReviewCard.displayName = "ReviewCard";

export const ActivityHistory = memo(({ orders, reviews }: ActivityHistoryProps) => {
  // Memoize empty state checks
  const hasOrders = useMemo(() => orders.length > 0, [orders.length]);
  const hasReviews = useMemo(() => reviews.length > 0, [reviews.length]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Activity History</h2>
      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Code</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasOrders && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
              {hasOrders && orders.map((o) => <OrderRow key={o.id} order={o} />)}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4 space-y-4">
          {!hasReviews && (
            <div className="text-sm text-muted-foreground">No reviews yet.</div>
          )}
          {hasReviews && reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </TabsContent>
      </Tabs>
    </Card>
  );
});

ActivityHistory.displayName = "ActivityHistory";
