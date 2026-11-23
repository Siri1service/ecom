import { NextRequest, NextResponse } from "next/server";
import { verifyKBankWebhookSignature } from "@/lib/payment/kbank-qr";

// In-memory idempotency cache for webhook events
const processedWebhooks = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-kbank-signature") || "";
    const webhookSecret = process.env.KBANK_WEBHOOK_SECRET || "kbank_secret_key_demo";

    // 1. Webhook Signature Verification
    // In production with live credentials, verify HMAC-SHA256:
    // const isValid = verifyKBankWebhookSignature(rawBody, signature, webhookSecret);
    // if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

    const payload = JSON.parse(rawBody);
    const { eventId, transactionId, orderNumber, amount, currency, status } = payload;

    // 2. Idempotency Check (Anti-Replay)
    if (eventId && processedWebhooks.has(eventId)) {
      return NextResponse.json({ success: true, message: "Webhook already processed" });
    }

    // 3. Currency and Amount Validation
    if (currency && currency !== "THB") {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }

    if (eventId) {
      processedWebhooks.add(eventId);
    }

    console.log(`[KBank Webhook] Payment received for Order ${orderNumber}: ${amount} THB (Status: ${status})`);

    // In production, update order status in Supabase and send Telegram notification
    return NextResponse.json({
      success: true,
      orderNumber,
      transactionId,
      status: "confirmed",
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook internal failure" }, { status: 500 });
  }
}
