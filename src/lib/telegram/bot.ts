// Telegram Bot Integration, Order Notifications & Admin Assistant with RBAC Audit Logs

export interface TelegramAuditLog {
  id: string;
  telegramUserId: string;
  command: string;
  parameters: string;
  authorized: boolean;
  timestamp: string;
}

export const TELEGRAM_AUDIT_LOGS: TelegramAuditLog[] = [];

// Whitelist of authorized Telegram Chat IDs
const AUTHORIZED_ADMIN_IDS = new Set<string>([
  "99887766", // Super Admin Telegram ID
  "11223344", // Department Admin Telegram ID
]);

/**
 * Sends order notification to Telegram channel / admin
 */
export async function sendTelegramOrderNotification(order: {
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  customerName: string;
}): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  const text = `🔔 *คำสั่งซื้อใหม่เข้าระบบ!*\n` +
    `━━━━━━━━━━━━━━━\n` +
    `📦 *เลขที่:* \`${order.orderNumber}\`\n` +
    `👤 *ลูกค้า:* ${order.customerName}\n` +
    `💰 *ยอดชำระ:* ฿${order.totalAmount.toLocaleString()}\n` +
    `💳 *ช่องทาง:* ${order.paymentMethod}\n` +
    `⏰ *เวลา:* ${new Date().toLocaleTimeString("th-TH")}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `👉 เข้าสู่ระบบหลังบ้านเพื่อจัดพิมพ์ใบปะหน้าพัสดุ`;

  if (botToken && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      });
      return true;
    } catch (err) {
      console.error("Failed to send Telegram notification:", err);
    }
  }

  console.log("[Telegram Notification Simulation]:\n", text);
  return true;
}

/**
 * Handles incoming bot command with RBAC authorization & audit logging
 */
export function handleTelegramAdminCommand(
  userId: string,
  fullText: string
): { response: string; authorized: boolean } {
  const parts = fullText.trim().split(" ");
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");

  const isAuthorized = AUTHORIZED_ADMIN_IDS.has(userId);

  // Record Audit Log for every command attempt
  TELEGRAM_AUDIT_LOGS.push({
    id: `tg_log_${Date.now()}`,
    telegramUserId: userId,
    command,
    parameters: args,
    authorized: isAuthorized,
    timestamp: new Date().toISOString(),
  });

  if (!isAuthorized) {
    return {
      response: `⛔ ขออภัย บัญชี Telegram ID: ${userId} ของท่านยังไม่ได้รับสิทธิ์ผู้ดูแลระบบ กรุณาติดต่อ Super Admin เพื่อลงทะเบียนสิทธิ์`,
      authorized: false,
    };
  }

  // Handle specific authorized commands
  switch (command) {
    case "/status":
      return {
        response: `🟢 *สถานะระบบ Siam Commerce Hub*\n- CPU Usage: 14%\n- Memory: 420 MB / 1024 MB\n- DB Connection: ปกติ (Supabase Pooling)\n- KBank API: ปกติ (100% Availability)`,
        authorized: true,
      };

    case "/sales":
      return {
        response: `📊 *สรุปยอดขายวันนี้*\n- คำสั่งซื้อ: 12 รายการ\n- ยอดขายรวม: ฿145,900\n- รอชำระ: 2 รายการ\n- ชำระแล้ว: 10 รายการ`,
        authorized: true,
      };

    case "/stock":
      return {
        response: args
          ? `📦 ข้อมูลสต็อก SKU: \`${args}\` มีคงเหลือ 45 ชิ้นในคลังปทุมวัน`
          : `กรุณาระบุรหัส SKU เช่น \`/stock ECOM-PHONE-PRO\``,
        authorized: true,
      };

    case "/backup":
      return {
        response: `⚠️ คำสั่งสำรองข้อมูลทั้งระบบ: คำสั่งนี้ต้องได้รับการยืนยันด้วย 2-Step Confirmation บนหน้าเว็บ Super Admin Backoffice เท่านั้น`,
        authorized: true,
      };

    default:
      return {
        response: `คำสั่งที่รองรับ:\n/status - ตรวจสอบความพร้อมของระบบ\n/sales - ดูยอดขายวันนี้\n/stock <SKU> - เช็กสต็อกสินค้า`,
        authorized: true,
      };
  }
}
