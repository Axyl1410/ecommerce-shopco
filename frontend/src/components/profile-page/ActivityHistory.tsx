"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// Local currency formatter to avoid external utils coupling
const formatCurrency = (amount: number, currency: string = "VND") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );
import type { Review } from "@/types/review.types";

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

function statusBadge(status: OrderStatus) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending payment</Badge>;
    case "paid":
      return <Badge>Paid</Badge>;
    case "shipped":
      return <Badge>Shipped</Badge>;
    case "delivered":
      return (
        <Badge className="bg-green-600 hover:bg-green-600 text-white">
          Delivered
        </Badge>
      );
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
  }
}

export function ActivityHistory({ orders, reviews }: ActivityHistoryProps) {
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
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.code}</TableCell>
                  <TableCell>
                    {new Date(o.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">{o.itemsCount}</TableCell>
                  <TableCell className="text-right">{formatCurrency(o.total)}</TableCell>
                  <TableCell>{statusBadge(o.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4 space-y-4">
          {reviews.length === 0 && (
            <div className="text-sm text-muted-foreground">No reviews yet.</div>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.user}</div>
                <div className="text-xs text-muted-foreground">
                  {r.date ? new Date(r.date).toLocaleDateString("en-US") : ""}
                </div>
              </div>
              <div className="text-yellow-500 text-sm">{"★".repeat(r.rating)}{"☆".repeat(Math.max(0, 5 - r.rating))}</div>
              {r.content && <p className="text-sm mt-1">{r.content}</p>}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
