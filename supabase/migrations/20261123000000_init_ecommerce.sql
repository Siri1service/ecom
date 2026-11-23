-- ====================================================================
-- SIAM COMMERCE HUB - PRODUCTION SUPABASE DATABASE SCHEMA
-- Migration: 20261123000000_init_ecommerce.sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('guest', 'member', 'admin', 'super_admin');
CREATE TYPE member_type AS ENUM ('individual', 'corporate');
CREATE TYPE order_status AS ENUM ('pending_payment', 'paid', 'preparing', 'shipped', 'completed', 'cancelled', 'refunded');
CREATE TYPE payment_method_type AS ENUM ('kbank_qr', 'credit_card', 'bank_transfer', 'cash_on_delivery');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'expired', 'failed');
CREATE TYPE doc_type_enum AS ENUM ('QT', 'BL', 'INV', 'RE', 'CA');
CREATE TYPE doc_status_enum AS ENUM ('draft', 'approved', 'issued', 'void', 'revised');
CREATE TYPE affiliate_status_enum AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- 3. PROFILES & USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'member' NOT NULL,
    member_type member_type DEFAULT 'individual' NOT NULL,
    email TEXT UNIQUE NOT NULL,
    -- Individual Fields
    first_name TEXT,
    last_name TEXT,
    phone VARCHAR(10),
    address TEXT,
    province TEXT,
    district TEXT,
    subdistrict TEXT,
    zipcode VARCHAR(5),
    bank_name TEXT,
    bank_account_number TEXT,
    bank_account_name TEXT,
    -- Corporate Fields
    company_name TEXT,
    company_type TEXT,
    tax_id VARCHAR(13),
    tax_address TEXT,
    shipping_address TEXT,
    is_same_address BOOLEAN DEFAULT TRUE,
    contact_name TEXT,
    contact_phone VARCHAR(10),
    contact_email TEXT,
    -- Security & Affiliate Fields
    is_affiliate_approved BOOLEAN DEFAULT FALSE,
    affiliate_code TEXT UNIQUE,
    terms_version_accepted TEXT DEFAULT '1.0',
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    session_valid_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '60 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Department / Permission Mapping
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    department TEXT NOT NULL, -- 'inventory', 'orders', 'accounting', 'marketing', 'support', 'system'
    can_read BOOLEAN DEFAULT TRUE,
    can_write BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, department)
);

-- 4. TERMS & ACCEPTANCE LOGS
CREATE TABLE IF NOT EXISTS public.terms_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(20) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    effective_date TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.terms_acceptance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CATEGORIES (Hierarchical: Category -> Type -> Subtype)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    level INT DEFAULT 1, -- 1: Category, 2: Type, 3: Subtype
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCTS & VARIANTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(64) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    base_price DECIMAL(12, 2) NOT NULL,
    sale_price DECIMAL(12, 2),
    stock_quantity INT DEFAULT 0 NOT NULL,
    attributes JSONB DEFAULT '[]'::jsonb, -- e.g. [{"name": "Color", "options": ["Black", "White"]}, {"name": "Size", "options": ["S", "M", "L"]}]
    variants JSONB DEFAULT '[]'::jsonb, -- variant combinations with custom price/stock/sku
    featured_image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    seo_title TEXT,
    seo_description TEXT,
    last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEDIA ASSETS (Google Drive Integration Metadata)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    file_type VARCHAR(10) NOT NULL, -- 'image' or 'video'
    mime_type VARCHAR(50) NOT NULL,
    original_filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    duration_seconds INT DEFAULT 0, -- <= 30 seconds for videos
    google_drive_file_id TEXT NOT NULL,
    google_drive_folder_path TEXT NOT NULL, -- e.g. "2026/11/23/PROD001-Smartphone"
    public_proxy_url TEXT NOT NULL,
    owner_id UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COUPONS & PROMOTIONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'fixed', 'percent', 'shipping_fixed', 'free_shipping'
    discount_value DECIMAL(10, 2) NOT NULL,
    min_spend DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2),
    starts_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) UNIQUE NOT NULL, -- e.g. ORD2026110001
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_session_id TEXT, -- For guest checkouts
    status order_status DEFAULT 'pending_payment' NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL, -- 7% VAT
    fee_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method payment_method_type NOT NULL,
    payment_status payment_status DEFAULT 'pending' NOT NULL,
    coupon_id UUID REFERENCES public.coupons(id),
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    shipping_carrier TEXT,
    tracking_number TEXT,
    idempotency_key VARCHAR(128) UNIQUE,
    affiliate_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    sku TEXT NOT NULL,
    variant_selection JSONB DEFAULT '{}'::jsonb,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PAYMENTS (KBank QR, Credit Card, Bank Transfer with Slip Verification)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'kbank', 'omise', 'bank_transfer'
    transaction_reference VARCHAR(128),
    qr_code_payload TEXT,
    qr_expires_at TIMESTAMPTZ, -- 10 mins expiry for KBank QR
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'THB' NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    slip_image_url TEXT,
    slip_verified_at TIMESTAMPTZ,
    slip_verified_by UUID REFERENCES public.profiles(id),
    webhook_payload JSONB,
    idempotency_key VARCHAR(128) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AFFILIATE MARKETING
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    affiliate_code VARCHAR(32) UNIQUE NOT NULL,
    status affiliate_status_enum DEFAULT 'pending' NOT NULL,
    default_commission_rate DECIMAL(5, 2) DEFAULT 5.00 NOT NULL,
    total_clicks INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_sales DECIMAL(12, 2) DEFAULT 0,
    estimated_commission DECIMAL(12, 2) DEFAULT 0,
    approved_commission DECIMAL(12, 2) DEFAULT 0,
    paid_commission DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    target_url TEXT NOT NULL, -- Whitelisted internally
    clicks_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT,
    commission_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'estimated', -- 'estimated', 'approved', 'rejected', 'paid'
    order_date TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    notes TEXT
);

-- 12. ACCOUNTING & DOCUMENTS (QT, BL, INV, RE, CA)
CREATE TABLE IF NOT EXISTS public.accounting_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_type doc_type_enum NOT NULL, -- QT, BL, INV, RE, CA
    doc_number VARCHAR(32) UNIQUE NOT NULL, -- e.g. QT2026110004
    reference_doc_id UUID REFERENCES public.accounting_documents(id),
    order_id UUID REFERENCES public.orders(id),
    status doc_status_enum DEFAULT 'draft' NOT NULL,
    company_profile JSONB NOT NULL,
    customer_info JSONB NOT NULL,
    items JSONB NOT NULL, -- [{ title, qty, unit, unit_price, total }]
    subtotal DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    vat_rate DECIMAL(5, 2) DEFAULT 7.00 NOT NULL,
    vat_amount DECIMAL(12, 2) NOT NULL,
    grand_total DECIMAL(12, 2) NOT NULL,
    payment_method_display TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    approved_by UUID REFERENCES public.profiles(id),
    issued_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Number Sequences
CREATE TABLE IF NOT EXISTS public.document_sequences (
    doc_type doc_type_enum NOT NULL,
    year_month VARCHAR(6) NOT NULL, -- e.g. '202611'
    current_seq INT DEFAULT 0 NOT NULL,
    PRIMARY KEY(doc_type, year_month)
);

-- Atomic Document Sequence Generator Function
CREATE OR REPLACE FUNCTION generate_next_doc_number(p_doc_type doc_type_enum)
RETURNS TEXT AS $$
DECLARE
    v_ym VARCHAR(6);
    v_seq INT;
    v_res TEXT;
BEGIN
    v_ym := TO_CHAR(NOW(), 'YYYYMM');
    
    INSERT INTO public.document_sequences (doc_type, year_month, current_seq)
    VALUES (p_doc_type, v_ym, 1)
    ON CONFLICT (doc_type, year_month)
    DO UPDATE SET current_seq = public.document_sequences.current_seq + 1
    RETURNING current_seq INTO v_seq;
    
    v_res := p_doc_type::TEXT || v_ym || LPAD(v_seq::TEXT, 4, '0');
    RETURN v_res;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. SHIPPING LABELS
CREATE TABLE IF NOT EXISTS public.shipping_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_number TEXT NOT NULL,
    carrier TEXT NOT NULL,
    sender_info JSONB NOT NULL,
    receiver_info JSONB NOT NULL,
    barcode_data TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. UNIFIED CHAT INBOX (LINE, Messenger, Telegram, WeChat)
CREATE TABLE IF NOT EXISTS public.chat_inbox_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel VARCHAR(32) NOT NULL,
    external_sender_id TEXT NOT NULL,
    sender_name TEXT,
    message_text TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_safe BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    changes JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_acceptance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check User Role
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper Function: Check Inactivity Timeout (2 months = 60 days)
CREATE OR REPLACE FUNCTION auth.is_session_active()
RETURNS BOOLEAN AS $$
    SELECT (NOW() <= session_valid_until) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles can be created upon auth sign up"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT USING (
        auth.uid() = id OR
        auth.get_user_role() IN ('admin', 'super_admin')
    );

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (
        (auth.uid() = id AND auth.is_session_active()) OR
        auth.get_user_role() = 'super_admin'
    );

-- Products & Categories (Public read, Admin manage)
CREATE POLICY "Anyone can view active categories"
    ON public.categories FOR SELECT USING (is_active = TRUE OR auth.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL USING (auth.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Anyone can view active products"
    ON public.products FOR SELECT USING (is_active = TRUE OR auth.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL USING (auth.get_user_role() IN ('admin', 'super_admin'));

-- Orders & Order Items
CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT USING (
        auth.uid() = user_id OR
        auth.get_user_role() IN ('admin', 'super_admin')
    );

CREATE POLICY "Users can create orders"
    ON public.orders FOR INSERT WITH CHECK (
        auth.uid() = user_id OR user_id IS NULL
    );

CREATE POLICY "Admins can update orders"
    ON public.orders FOR UPDATE USING (
        auth.get_user_role() IN ('admin', 'super_admin')
    );

CREATE POLICY "Users can view own order items"
    ON public.order_items FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.user_id = auth.uid() OR auth.get_user_role() IN ('admin', 'super_admin'))
        )
    );

-- Payments Policies
CREATE POLICY "Admins and Order Owners can view payments"
    ON public.payments FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = payments.order_id
            AND (o.user_id = auth.uid() OR auth.get_user_role() IN ('admin', 'super_admin'))
        )
    );

CREATE POLICY "Service and Admins can manage payments"
    ON public.payments FOR ALL USING (auth.get_user_role() IN ('admin', 'super_admin'));

-- Affiliate Policies
CREATE POLICY "Affiliates can view own affiliate account"
    ON public.affiliates FOR SELECT USING (
        auth.uid() = user_id OR auth.get_user_role() IN ('admin', 'super_admin')
    );

CREATE POLICY "Admins can manage affiliate accounts"
    ON public.affiliates FOR ALL USING (auth.get_user_role() IN ('admin', 'super_admin'));

-- Accounting Documents Policies
CREATE POLICY "Admins can manage accounting documents"
    ON public.accounting_documents FOR ALL USING (auth.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Customer can view their approved invoices/receipts"
    ON public.accounting_documents FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = accounting_documents.order_id AND o.user_id = auth.uid()
        ) AND status IN ('approved', 'issued')
    );

-- Terms Policies
CREATE POLICY "Anyone can view active terms"
    ON public.terms_conditions FOR SELECT USING (is_active = TRUE OR auth.get_user_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can manage terms"
    ON public.terms_conditions FOR ALL USING (auth.get_user_role() IN ('admin', 'super_admin'));

-- ====================================================================
-- SEED DATA
-- ====================================================================

-- Default Categories (Level 1, 2, 3)
INSERT INTO public.categories (id, name, slug, level, display_order)
VALUES
    ('a0000001-0000-0000-0000-000000000001', 'อิเล็กทรอนิกส์และไอที', 'electronics', 1, 1),
    ('a0000001-0000-0000-0000-000000000002', 'แฟชั่นและเครื่องแต่งกาย', 'fashion', 1, 2),
    ('a0000001-0000-0000-0000-000000000003', 'สุขภาพและความงาม', 'health-beauty', 1, 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (id, name, slug, parent_id, level, display_order)
VALUES
    ('a0000002-0000-0000-0000-000000000001', 'สมาร์ตโฟนและแท็บเล็ต', 'smartphones', 'a0000001-0000-0000-0000-000000000001', 2, 1),
    ('a0000002-0000-0000-0000-000000000002', 'หูฟังและอุปกรณ์เสริมเสียง', 'audio', 'a0000001-0000-0000-0000-000000000001', 2, 2)
ON CONFLICT (slug) DO NOTHING;

-- Initial Terms and Conditions v1.0
INSERT INTO public.terms_conditions (version, title, content)
VALUES (
    '1.0',
    'ข้อกำหนดการใช้งานและนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA) v1.0',
    'ยินดีต้อนรับสู่แพลตฟอร์ม Siam Commerce Hub แพลตฟอร์มนี้ดำเนินการภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ข้อมูลส่วนตัวของท่าน เช่น ชื่อ ที่อยู่ เบอร์โทรศัพท์ และเลขประจำตัวผู้เสียภาษี จะถูกนำมาใช้เพื่อวัตถุประสงค์ในการประมวลผลคำสั่งซื้อ การจัดส่งสินค้า การออกเอกสารทางบัญชี และการสะสมคะแนนเท่านั้น ข้อมูลของท่านจะได้รับการเข้ารหัสและเก็บรักษาตามมาตรฐานความปลอดภัยสูงสุด'
) ON CONFLICT (version) DO NOTHING;

-- Default Coupons
INSERT INTO public.coupons (code, title, discount_type, discount_value, min_spend, max_discount, starts_at, expires_at, usage_limit)
VALUES
    ('WELCOME100', 'ส่วนลดต้อนรับสมาชิกใหม่ 100 บาท', 'fixed', 100.00, 500.00, 100.00, NOW(), NOW() + INTERVAL '1 year', 1000),
    ('FREESHIP', 'โค้ดส่งฟรีทั่วไทย', 'free_shipping', 50.00, 300.00, 50.00, NOW(), NOW() + INTERVAL '1 year', 500)
ON CONFLICT (code) DO NOTHING;
