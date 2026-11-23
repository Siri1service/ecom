import { NextRequest, NextResponse } from "next/server";
import { calculateOrderServerSide, OrderItemInput } from "@/lib/order/calculator";
import { createKBankQRPayment } from "@/lib/payment/kbank-qr";

// Temporary in-memory order store for demo / initial testing
const orderStore = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      couponCode,
      paymentMethod,
      shippingAddress,
      billingAddress,
      idempotencyKey,
      affiliateCode,
    } = body;

    // Prevent double processing via idempotency key
    if (idempotencyKey && orderStore.has(idempotencyKey)) {
      return NextResponse.json(orderStore.get(idempotencyKey));
    }

    // 1. Server-side recalculation and stock validation
    const calculation = calculateOrderServerSide(items as OrderItemInput[], couponCode, paymentMethod);
    if (!calculation.valid) {
      return NextResponse.json({ error: calculation.error }, { status: 400 });
    }

    // 2. Generate unique Order Number
    const yearMonth = new Date().toISOString().slice(0, 7).replace("-", "");
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD${yearMonth}${randomSeq}`;

    // 3. Payment Processing
    let paymentData: any = {
      provider: paymentMethod,
      status: "pending",
    };

    if (paymentMethod === "kbank_qr") {
      // Create 10-minute KBank QR code
      const qr = await createKBankQRPayment({
        orderNumber,
        amount: calculation.totalAmount,
      });
      paymentData = {
        provider: "kbank",
        qrCodeUrl: qr.qrCodeUrl,
        rawPayload: qr.rawPayload,
        expiresAt: qr.expiresAt,
        transactionId: qr.transactionId,
        status: "pending",
      };
    }

    // 4. Build complete order object
    const newOrder = {
      orderNumber,
      status: "pending_payment",
      items: calculation.items,
      subtotal: calculation.subtotal,
      discountAmount: calculation.discountAmount,
      shippingFee: calculation.shippingFee,
      taxAmount: calculation.taxAmount,
      totalAmount: calculation.totalAmount,
      paymentMethod,
      payment: paymentData,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      affiliateCode,
      trackingNumber: `TH${Date.now().toString().slice(-8)}EXP`,
      shippingCarrier: "Flash Express",
      createdAt: new Date().toISOString(),
    };

    // Save order
    orderStore.set(orderNumber, newOrder);
    if (idempotencyKey) {
      orderStore.set(idempotencyKey, { success: true, order: newOrder });
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");

  if (!orderNumber || !orderStore.has(orderNumber)) {
    // Return sample mock order for immediate demonstration
    const sample = {
      orderNumber: orderNumber || "ORD2026110001",
      status: "pending_payment",
      items: [
        {
          productId: "prod-002",
          title: "AeroTune Studio ANC Wireless Headphones",
          sku: "ECOM-AUDIO-ANC-BLK",
          unitPrice: 7490,
          quantity: 1,
          totalPrice: 7490,
        },
      ],
      subtotal: 7490,
      discountAmount: 100,
      shippingFee: 0,
      taxAmount: 483.46,
      totalAmount: 7390,
      paymentMethod: "kbank_qr",
      payment: {
        provider: "kbank",
        qrCodeUrl: "",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        status: "pending",
      },
      shippingAddress: {
        fullName: "สมชาย ใจดีพร้อม",
        phone: "0812345678",
        address: "123/45 ถนนพระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330",
      },
      trackingNumber: "TH88921473EXP",
      shippingCarrier: "Flash Express",
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ order: sample });
  }

  return NextResponse.json({ order: orderStore.get(orderNumber) });
}
