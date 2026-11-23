# คู่มือการติดตั้ง ตั้งค่า และ Deploy ระบบ (Deployment & Setup Guide)
## Siam Commerce Hub

---

### 1. ความต้องการของระบบ (Prerequisites)
- **Node.js**: เวอร์ชัน 20.x ขึ้นไป (แนะนำ Node 22 หรือ 24)
- **Database**: Supabase PostgreSQL (มีบัญชีที่ [supabase.com](https://supabase.com))
- **Google Cloud**: Google Service Account สำหรับ Google Drive API v3
- **Payment Gateway**: บัญชี Kasikornbank Merchant API (หรือ KBank Payment Gateway)
- **Telegram Bot**: บอทจาก @BotFather และ Admin Chat ID

---

### 2. ขั้นตอนการติดตั้งโปรเจกต์ (Local Development Setup)

1. **คัดลอกไฟล์การตั้งค่าสภาพแวดล้อม:**
   ```bash
   cp .env.example .env.local
   ```
2. **กรอกค่า Credentials ใน `.env.local`** (ดูคำอธิบายในหัวข้อที่ 3)
3. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```
4. **รันเซิร์ฟเวอร์สำหรับพัฒนา:**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

### 3. การตั้งค่าบริการภายนอก (External Service Configurations)

#### ก. Supabase PostgreSQL & RLS Migrations:
1. ไปที่ Supabase Dashboard -> **SQL Editor**
2. เปิดไฟล์ `supabase/migrations/20261123000000_init_ecommerce.sql`
3. คัดลอกโค้ดทั้งหมดแล้ววางลงใน SQL Editor จากนั้นกด **Run**
4. ระบบจะสร้าง:
   - ตารางทั้งหมด (`profiles`, `products`, `orders`, `payments`, `affiliates`, `accounting_documents`, ฯลฯ)
   - Function สร้างเลขที่เอกสารอัตโนมัติ `generate_next_doc_number`
   - Row Level Security (RLS) Policies ครบทุกบทบาท
   - ข้อมูลเริ่มต้น (Seed data: หมวดหมู่, คูปอง WELCOME100, ข้อกำหนด PDPA v1.0)

#### ข. Google Drive API (สำหรับจัดเก็บรูปภาพและวิดีโอ 30s):
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/) -> เปิดใช้งาน **Google Drive API**
2. ไปที่ **IAM & Admin** -> **Service Accounts** -> สร้าง Service Account ใหม่
3. สร้าง Key แบบ **JSON** แล้วนำค่า `client_email` และ `private_key` มาใส่ใน `.env.local`
4. สร้าง Folder บน Google Drive เพื่อเป็นโฟลเดอร์หลักของโปรเจกต์ แล้วกดแชร์โฟลเดอร์ให้แก่ `client_email` ด้วยสิทธิ์ **Editor**
5. นำ Folder ID จาก URL มาใส่ใน `GOOGLE_DRIVE_ROOT_FOLDER_ID`

#### ค. Kasikornbank (KBank) QR Payment API:
1. เข้าสู่ระบบ Kasikornbank Developer Portal
2. กำหนด Webhook URL ไปที่:
   `https://your-domain.com/api/payments/kbank-webhook`
3. บันทึก Webhook Secret Key ลงใน `KBANK_WEBHOOK_SECRET` เพื่อใช้ตรวจสอบลายมือชื่อ HMAC-SHA256 ป้องกัน Replay Attack
4. กำหนดเวลาหมดอายุของ QR เป็น **10 นาที** ตามมาตรฐานของธนาคาร

#### ง. Telegram Assistant Bot:
1. สนทนากับ `@BotFather` บน Telegram และพิมพ์ `/newbot` เพื่อรับ Bot Token
2. นำ Bot Token ใส่ใน `TELEGRAM_BOT_TOKEN`
3. สนทนากับบอทของท่าน และส่งข้อความใดก็ได้ จากนั้นเข้าไปดู Chat ID แล้วใส่ใน `TELEGRAM_ADMIN_CHAT_ID`

---

### 4. การ Deploy สู่ Production (Vercel / Cloud Run / VPS)

#### การ Deploy บน Vercel:
1. นำโค้ดขึ้น GitHub Repository
2. เข้าสู่ [vercel.com](https://vercel.com) -> New Project -> Import Repository
3. ในหน้า Environment Variables ให้นำค่าจาก `.env.local` มาใส่ให้ครบถ้วน
4. กด **Deploy**

#### การ Build และ Run บน Docker / VPS:
```bash
npm run build
npm run start
```

---

### 5. การสำรองข้อมูลและการกู้คืนฉุกเฉิน (Backup & Disaster Recovery)

1. **การสำรองข้อมูล (Backup):**
   - เข้าสู่ระบบหลังบ้านด้วยสิทธิ์ **Super Admin**
   - ไปที่เมนู `สำรอง & ย้ายระบบ` (`/admin/backup`)
   - กดปุ่ม **"ดาวน์โหลดชุดสำรองข้อมูลทั้งระบบ (.ZIP)"**
2. **การกู้คืนข้อมูล (Restore):**
   - เข้าหน้า `/admin/backup`
   - ปลดล็อกขั้นตอนยืนยันความปลอดภัย 2 ชั้น (Two-Step Confirmation)
   - พิมพ์รหัสยืนยัน `RESTORE-CONFIRM-2026`
   - ระบบจะดำเนินการกู้คืน Snapshot พร้อมบันทึกประวัติการกระทำลงใน Audit Log
