import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation cho webhook payload từ SePay
const SePayWebhookSchema = z.object({
  id: z.number(), // ID giao dịch trên SePay
  gateway: z.string(), // Brand name của ngân hàng
  transactionDate: z.string(), // Thời gian xảy ra giao dịch
  accountNumber: z.string(), // Số tài khoản ngân hàng
  code: z.string().optional(), // Mã code thanh toán
  content: z.string(), // Nội dung chuyển khoản
  transferType: z.enum(["in", "out"]), // Loại giao dịch
  transferAmount: z.number(), // Số tiền giao dịch
  accumulated: z.number(), // Số dư tài khoản (lũy kế)
  subAccount: z.string().optional(), // Tài khoản ngân hàng phụ
  referenceCode: z.string(), // Mã tham chiếu của tin nhắn sms
  description: z.string(), // Toàn bộ nội dung tin nhắn sms
});

/**
 * Match transaction với Order dựa vào code field từ SePay
 * Code field là mã code thanh toán mà SePay tự nhận diện dựa vào cấu hình
 */
async function matchOrderByCode(code: string | undefined) {
  if (!code) {
    return null;
  }

  // Tìm Order theo orderNo (code có thể là orderNo)
  const order = await prisma.order.findFirst({
    where: {
      orderNo: code,
    },
    include: {
      payments: true,
    },
  });

  return order;
}

/**
 * Cập nhật trạng thái thanh toán của Order khi nhận được webhook
 */
async function updateOrderPaymentStatus(
  orderId: string,
  transactionAmount: number,
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    return;
  }

  const finalAmount = Number(order.finalAmount);

  // Kiểm tra số tiền có khớp không (cho phép sai số nhỏ do làm tròn)
  const amountDiff = Math.abs(transactionAmount - finalAmount);
  const isAmountMatch = amountDiff < 1000; // Cho phép sai số < 1000 VND

  if (isAmountMatch && order.payStatus === "PENDING") {
    // Cập nhật trạng thái thanh toán
    await prisma.order.update({
      where: { id: orderId },
      data: {
        payStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
    });

    // Tạo Payment record
    await prisma.payment.create({
      data: {
        orderId: orderId,
        provider: "SePay",
        status: "success",
        amount: transactionAmount,
        providerTxnId: String(transactionAmount), // Có thể dùng sepayId
        metadata: {
          gateway: "SePay",
          transactionDate: new Date().toISOString(),
        },
      },
    });

    // Tạo OrderStatusHistory
    await prisma.orderStatusHistory.create({
      data: {
        orderId: orderId,
        status: "CONFIRMED",
        notes: "Thanh toán đã được xác nhận qua SePay",
        changedBy: "SYSTEM",
      },
    });
  }
}

/**
 * POST /api/sepay/webhook
 *
 * Nhận webhook từ SePay khi có giao dịch chuyển khoản
 *
 * Flow:
 * 1. Validate webhook payload
 * 2. Kiểm tra duplicate transaction (dựa vào sepayId)
 * 3. Lưu transaction vào database
 * 4. Tự động match với Order nếu có thể
 * 5. Cập nhật trạng thái thanh toán nếu match được
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload
    const parsed = SePayWebhookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook payload",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      id: sepayId,
      gateway,
      transactionDate,
      accountNumber,
      code,
      content,
      transferType,
      transferAmount,
      accumulated,
      subAccount,
      referenceCode,
      description,
    } = parsed.data;

    // Chỉ xử lý giao dịch tiền vào
    if (transferType !== "in") {
      return NextResponse.json(
        {
          success: true,
          message: "Transaction ignored (not incoming payment)",
        },
        { status: 200 },
      );
    }

    // Kiểm tra duplicate transaction
    const existingTransaction = await prisma.sePayTransaction.findUnique({
      where: { sepayId },
    });

    if (existingTransaction) {
      return NextResponse.json(
        {
          success: true,
          message: "Transaction already processed",
          transactionId: existingTransaction.id,
        },
        { status: 200 },
      );
    }

    // Match Order bằng code field từ SePay (nếu có)
    let matchedOrder = null;
    let orderId: string | null = null;

    if (code) {
      matchedOrder = await matchOrderByCode(code);
      if (matchedOrder) {
        orderId = matchedOrder.id;
      }
    }

    // Lưu transaction vào database
    const transaction = await prisma.sePayTransaction.create({
      data: {
        sepayId,
        gateway,
        transactionDate,
        accountNumber,
        code: code ?? null,
        content,
        transferType,
        transferAmount,
        accumulated,
        subAccount: subAccount ?? null,
        referenceCode,
        description,
        orderId,
        processed: orderId !== null,
        processedAt: orderId !== null ? new Date() : null,
        processingNotes: orderId
          ? `Tự động match với Order: ${matchedOrder?.orderNo} thông qua code field`
          : code
            ? `Không tìm thấy Order với code: ${code}`
            : "Không có code field để match với Order",
      },
    });

    // Nếu match được Order, cập nhật trạng thái thanh toán
    if (orderId && matchedOrder) {
      await updateOrderPaymentStatus(orderId, transferAmount);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed successfully",
        transactionId: transaction.id,
        orderMatched: orderId !== null,
        orderId: orderId ?? undefined,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("SePay webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/sepay/webhook
 *
 * Health check endpoint cho webhook
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "SePay webhook endpoint is active",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
