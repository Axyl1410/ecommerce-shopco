import client from "@/lib/sepay-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Với API thực tế cần validate input body, ví dụ order data
    const {
      operation = "PURCHASE",
      payment_method = "BANK_TRANSFER",
      order_invoice_number = "DH123",
      order_amount = 10000,
      currency = "VND",
      order_description = "Thanh toan don hang DH123",
      success_url = "https://example.com/order/DH123?payment=success",
      error_url = "https://example.com/order/DH123?payment=error",
      cancel_url = "https://example.com/order/DH123?payment=cancel",
    } = await req.json();

    // Khởi tạo checkout url và fields
    const checkoutURL = client.checkout.initCheckoutUrl();
    const checkoutFormfields = client.checkout.initOneTimePaymentFields({
      operation,
      payment_method,
      order_invoice_number,
      order_amount,
      currency,
      order_description,
      success_url,
      error_url,
      cancel_url,
    });

    return NextResponse.json({
      checkoutURL,
      checkoutFormfields,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi xử lý SePay checkout", details: String(error) },
      { status: 400 },
    );
  }
}
