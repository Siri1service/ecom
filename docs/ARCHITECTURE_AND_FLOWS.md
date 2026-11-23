# แผนผังสถาปัตยกรรมระบบ (System Architecture & Integration Flows)
## Siam Commerce Hub - Next.js, Supabase, Google Drive, KBank QR, Telegram & Accounting

---

### 1. ภาพรวมสถาปัตยกรรมระบบ (High-Level Architecture)

```mermaid
flowchart TD
    UserClient["ผู้ใช้งาน / Web & Mobile (Capacitor/PWA)"]
    AdminClient["เจ้าหน้าที่หลังบ้าน / Backoffice Admin"]

    subgraph Frontend["Next.js App Router (SSR & RSC)"]
      Storefront["Storefront (SEO, Products, Cart)"]
      CheckoutFlow["Checkout & KBank QR Generator"]
      AffiliateDash["Affiliate Link & Attribution Engine"]
      AdminCMS["Admin Backoffice (Stock, Audit, Backup)"]
      MediaProxy["/api/media/[fileId] Caching Proxy"]
    end

    subgraph Backend_Services["Backend & External Cloud Services"]
      SupabaseDB["Supabase PostgreSQL (RLS & Sequences)"]
      GoogleDrive["Google Drive API (YYYY/MM/DD/ProductID)"]
      KBankGateway["Kasikornbank QR API (10-Min Dynamic QR)"]
      TelegramBot["Telegram Bot Assistant & Notifications"]
      LogisticsAPI["Flash / Thailand Post Logistics API"]
    end

    UserClient --> Storefront
    UserClient --> CheckoutFlow
    UserClient --> AffiliateDash
    AdminClient --> AdminCMS

    CheckoutFlow --> KBankGateway
    CheckoutFlow --> SupabaseDB
    AdminCMS --> SupabaseDB
    AdminCMS --> GoogleDrive
    AdminCMS --> TelegramBot
    AdminCMS --> LogisticsAPI
    MediaProxy --> GoogleDrive
    Storefront --> MediaProxy
```

---

### 2. แผนผังการจัดเก็บสื่อและแปลงไฟล์ (Media & Google Drive Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as ผู้ดูแลระบบ (Admin)
    participant Client as Frontend (Canvas WebP)
    participant Server as Next.js Media API (/api/media/upload)
    participant Drive as Google Drive Cloud Storage
    participant DB as Supabase PostgreSQL (media_assets)

    Admin->>Client: เลือกรูปภาพ หรือ วิดีโอ
    Client->>Client: ตรวจสอบความยาววิดีโอ (<= 30 วินาที)
    Client->>Client: แปลงรูปภาพเป็น .webp (คุณภาพ 85%)
    Client->>Server: ส่ง Multipart Form Data (Buffer, ProductID, Slug)
    Server->>Server: ตรวจสอบ MIME Type & File Size บนเซิร์ฟเวอร์
    Server->>Server: สร้าง Folder: YYYY/MM/DD/ProductID-Slug
    Server->>Drive: อัปโหลดไฟล์ด้วย Service Account Server-side
    Drive-->>Server: ส่งกลับ Google Drive File ID
    Server->>DB: บันทึกข้อมูลอ้างอิง (Drive File ID, MIME, Folder Path, Size)
    Server-->>Client: ส่งกลับ Proxy URL (/api/media/[fileId]) พร้อม Caching Header
```

---

### 3. แผนผังกระบวนการสั่งซื้อและชำระเงิน KBank QR 10 นาที (Payment Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as ผู้ซื้อ (Buyer)
    participant Web as หน้าร้าน /checkout
    participant API as Server Calculator & Order Engine
    participant KBank as KBank QR API Service
    participant Webhook as /api/payments/kbank-webhook
    participant TG as Telegram Bot Notification

    Buyer->>Web: เลือกสินค้า ยืนยันที่อยู่จัดส่ง และเลือก KBank QR
    Web->>API: ส่งรายการสินค้า (Product IDs, Variant IDs, Qty, Coupon)
    API->>API: ตรวจสอบราคาสินค้าจริงจากฐานข้อมูล & เช็กสต็อกคงเหลือ
    API->>API: คำนวณ Subtotal, ส่วนลดคูปอง, ค่าจัดส่ง, VAT 7%
    API->>KBank: ร้องขอสร้าง Dynamic QR Code (กำหนดอายุ 10 นาที)
    KBank-->>API: ส่งกลับ EMVCo QR Code Payload
    API-->>Web: แสดงหน้า /orders/[orderNumber] พร้อม QR และนาฬิกานับถอยหลัง 10:00
    Buyer->>KBank: สแกนชำระเงินผ่านแอปธนาคาร (K PLUS, SCB, BBL, etc.)
    KBank->>Webhook: ส่ง Webhook แจ้งเตือนยอดเงินสำเร็จ (HMAC Signature)
    Webhook->>Webhook: ตรวจสอบ Signature & Idempotency Key ป้องกัน Replay
    Webhook->>API: ปรับสถานะคำสั่งซื้อเป็น "PAID"
    API->>TG: ส่งแจ้งเตือนคำสั่งซื้อใหม่และยอดเงินเข้า Telegram Admin ทันที
    Web-->>Buyer: หน้าจออัปเดตเป็น "ชำระเงินเรียบร้อยแล้ว" แบบ Real-time
```

---

### 4. แผนผังการส่งต่อเอกสารบัญชีภาษีไทย (Thai Tax Document Chaining)

```mermaid
flowchart LR
    QT["ใบเสนอราคา (QT)\nQuotation"] -->|ลูกค้าตกลงซื้อ| BL["ใบวางบิล / แจ้งหนี้ (BL)\nBilling Note"]
    BL -->|ส่งมอบสินค้า| INV["ใบกำกับภาษี (INV)\nTax Invoice (VAT 7%)"]
    INV -->|รับชำระเงินเรียบร้อย| RE["ใบเสร็จรับเงิน (RE)\nReceipt"]
    
    subgraph Numbering["มาตรฐานเลขที่เอกสาร"]
      Rule["รหัสเอกสาร (2 หลัก) + ปีเดือน (YYYYMM) + เลขลำดับ (0001)\nเช่น QT2026110004, INV2026110002"]
    end
```

---

### 5. แนวทางและข้อจำกัดของแอปบน iOS และ Android (Capacitor & PWA)

#### สถาปัตยกรรม Capacitor / PWA:
1. **Web Core:** รัน Next.js App Router แบบ Responsive รองรับหน้าจอสมาร์ตโฟน 100%
2. **Capacitor Integration:** สามารถเพิ่ม `@capacitor/core`, `@capacitor/ios`, `@capacitor/android` เพื่อห่อหุ้ม Webview เป็น Native App บน App Store และ Google Play Store

#### ตารางข้อจำกัดของแต่ละแพลตฟอร์ม (Platform Limitations):

| คุณสมบัติ | Web Browser (PWA) | iOS (Safari / WebKit) | Android (Chrome / WebView) |
| :--- | :--- | :--- | :--- |
| **การติดตั้งลงเครื่อง** | Add to Home Screen | Add to Home Screen (ต้องกดยืนยันผ่าน Share Sheet) | WebAPK ติดตั้งได้โดยตรงเหมือน Native App |
| **Push Notifications** | Web Push API (ต้องได้รับ Consent) | รองรับตั้งแต่ iOS 16.4+ (ต้องติดตั้งแบบ PWA ก่อน) | รองรับสมบูรณ์ผ่าน Firebase Cloud Messaging (FCM) |
| **อายุ Session** | จัดการผ่าน Server-side Activity (2 เดือน) | WebKit ITP อาจล้าง Client Cookie หากไม่ได้เข้านานเกิน 7 วัน (ต้องใช้ Server Token) | เก็บ Session ใน LocalStorage/Cookies ได้คงทน |
| **การสแกน QR Code** | ใช้ Camera API (HTML5 Canvas) | ต้องขออนุญาตกล้องผ่าน Safari Permission | รองรับ WebRTC & BarcodeDetector API |
| **ข้อจำกัดสโตร์** | ไม่มีค่าธรรมเนียม Store | Apple Review Guidelines 3.1.1 (สินค้าดิจิทัลต้องใช้ IAP, สินค้ากายภาพใช้ KBank QR ได้) | Google Play Policy (สินค้าจัดส่งทางกายภาพยกเว้นจาก Google Billing ได้) |
