"use client";

import TimeDisplay from "@/components/TimeDisplay";
import { useEffect, useState } from "react";

export default function Home() {
  const [checkoutURL, setCheckoutURL] = useState("");
  const [checkoutFormfields, setCheckoutFormfields] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCheckoutFields() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/sepay/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operation: "PURCHASE",
            payment_method: "BANK_TRANSFER",
            order_invoice_number: "DH123",
            order_amount: 10000,
            currency: "VND",
            order_description: "Thanh toan don hang DH123",
            success_url: "https://example.com/order/DH123?payment=success",
            error_url: "https://example.com/order/DH123?payment=error",
            cancel_url: "https://example.com/order/DH123?payment=cancel",
          }),
        });
        if (!res.ok) throw new Error("Không thể lấy thông tin checkout");
        const data = await res.json();
        setCheckoutURL(data.checkoutURL);
        setCheckoutFormfields(data.checkoutFormfields);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    }
    fetchCheckoutFields();
  }, []);

  if (loading)
    return <div className="p-8">Đang tải thông tin thanh toán...</div>;
  if (error) return <div className="p-8 text-red-500">Lỗi: {error}</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">SSE Demo</h1>
        <TimeDisplay />
      </div>
      <form action={checkoutURL} method="POST">
        {Object.keys(checkoutFormfields).map((field) => (
          <input
            key={field}
            type="hidden"
            name={field}
            value={checkoutFormfields[field]}
          />
        ))}
        <button type="submit">Pay now</button>
      </form>
    </main>
  );
}
