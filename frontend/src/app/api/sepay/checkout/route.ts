import client from "@/lib/sepay-client";
import { NextResponse } from "next/server";
import { z } from "zod";

const CheckoutBodySchema = z.object({
  operation: z.enum(["PURCHASE"]).optional(),
  payment_method: z.enum(["BANK_TRANSFER", "NAPAS_BANK_TRANSFER"]).optional(),
  order_invoice_number: z.string(),
  order_amount: z.number(),
  currency: z.enum(["VND", "USD"]),
  order_description: z.string().optional(),
  success_url: z.string().url(),
  error_url: z.string().url(),
  cancel_url: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CheckoutBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const {
      operation = "PURCHASE",
      payment_method = "BANK_TRANSFER",
      order_invoice_number,
      order_amount,
      currency,
      order_description = "",
      success_url,
      error_url,
      cancel_url,
    } = parsed.data;

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
