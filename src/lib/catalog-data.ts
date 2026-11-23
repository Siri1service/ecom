export interface Category {
  id: string;
  name: string;
  slug: string;
  level: 1 | 2 | 3;
  parentId?: string;
  imageUrl?: string;
  types?: Category[];
  subtypes?: Category[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Space Black / 256GB"
  sku: string;
  price: number;
  stock: number;
  attributes: { [key: string]: string };
}

export interface ProductAttributeOption {
  name: string; // "สี" or "ความจุ" or "ขนาด"
  values: string[];
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  stockQuantity: number;
  featuredImageUrl: string;
  galleryImages: string[];
  videoUrl?: string;
  videoDurationSeconds?: number;
  attributeOptions: ProductAttributeOption[];
  variants: ProductVariant[];
  isFeatured?: boolean;
  isActive: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  lastViewedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: "fixed" | "percent" | "shipping_fixed" | "free_shipping";
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  client: string;
  completedAt: string;
}

export interface ContactInfo {
  phone: string;
  lineOa: string;
  lineId: string;
  facebookMessenger: string;
  telegramUsername: string;
  wechatId: string;
  address: string;
  workingHours: string;
}

// Sample Categories with 3 Levels: Category -> Type -> Subtype
export const CATEGORIES_TREE: Category[] = [
  {
    id: "cat-1",
    name: "อิเล็กทรอนิกส์และแกดเจ็ต",
    slug: "electronics",
    level: 1,
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    types: [
      {
        id: "type-1-1",
        name: "สมาร์ตโฟนและแท็บเล็ต",
        slug: "smartphones",
        level: 2,
        parentId: "cat-1",
        subtypes: [
          { id: "sub-1-1-1", name: "สมาร์ตโฟนเรือธง", slug: "flagship-phones", level: 3, parentId: "type-1-1" },
          { id: "sub-1-1-2", name: "แท็บเล็ตเพื่อการศึกษา", slug: "tablets", level: 3, parentId: "type-1-1" },
        ],
      },
      {
        id: "type-1-2",
        name: "อุปกรณ์เสริมและหูฟัง",
        slug: "audio-accessories",
        level: 2,
        parentId: "cat-1",
        subtypes: [
          { id: "sub-1-2-1", name: "หูฟังตัดเสียงรบกวน", slug: "anc-headphones", level: 3, parentId: "type-1-2" },
          { id: "sub-1-2-2", name: "หัวชาร์จเร็ว GaN", slug: "gan-chargers", level: 3, parentId: "type-1-2" },
        ],
      },
    ],
  },
  {
    id: "cat-2",
    name: "แฟชั่นและไลฟ์สไตล์",
    slug: "fashion",
    level: 1,
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    types: [
      {
        id: "type-2-1",
        name: "เสื้อผ้าและเครื่องแต่งกาย",
        slug: "apparel",
        level: 2,
        parentId: "cat-2",
        subtypes: [
          { id: "sub-2-1-1", name: "เสื้อยืดมินิมอล Oversize", slug: "oversize-tees", level: 3, parentId: "type-2-1" },
          { id: "sub-2-1-2", name: "แจ็กเก็ตกันลม", slug: "windbreakers", level: 3, parentId: "type-2-1" },
        ],
      },
    ],
  },
];

// Sample Products with Options, Variants, and WebP images
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    sku: "ECOM-PHONE-PRO",
    title: "SiamPro 16 Ultra Max (5G AI Phone)",
    slug: "siampro-16-ultra-max",
    categorySlug: "smartphones",
    categoryName: "สมาร์ตโฟนเรือธง",
    description: "สมาร์ตโฟนดีไซน์ Glassmorphism สเปกเรือธงชิปเซ็ต AI ประมวลผลขั้นสูง กล้องซูมเพอริสโคป 100x จอภาพ AMOLED 144Hz ความสว่างสูงสุด 3000 nits",
    basePrice: 38900,
    salePrice: 35900,
    stockQuantity: 45,
    featuredImageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    ],
    videoDurationSeconds: 15,
    attributeOptions: [
      { name: "สี", values: ["ไทเทเนียมธรรมชาติ", "ดำมิดไนท์", "เงินฟรอสต์"] },
      { name: "ความจุ", values: ["256GB", "512GB", "1TB"] },
    ],
    variants: [
      { id: "var-1", name: "ไทเทเนียมธรรมชาติ / 256GB", sku: "ECOM-PHONE-PRO-NAT-256", price: 35900, stock: 20, attributes: { "สี": "ไทเทเนียมธรรมชาติ", "ความจุ": "256GB" } },
      { id: "var-2", name: "ไทเทเนียมธรรมชาติ / 512GB", sku: "ECOM-PHONE-PRO-NAT-512", price: 39900, stock: 15, attributes: { "สี": "ไทเทเนียมธรรมชาติ", "ความจุ": "512GB" } },
      { id: "var-3", name: "ดำมิดไนท์ / 256GB", sku: "ECOM-PHONE-PRO-BLK-256", price: 35900, stock: 10, attributes: { "สี": "ดำมิดไนท์", "ความจุ": "256GB" } },
    ],
    isFeatured: true,
    isActive: true,
    tags: ["สมาร์ตโฟน", "5G", "AI", "เรือธง", "ลดราคา"],
    seoTitle: "ซื้อ SiamPro 16 Ultra Max 5G AI Phone | สยามคอมเมิร์ซฮับ",
    seoDescription: "สมาร์ตโฟนเรือธง SiamPro 16 Ultra Max ผ่อน 0% นาน 10 เดือน พร้อมรับแต้มสะสมและสิทธิ์ Affiliate",
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: "prod-002",
    sku: "ECOM-AUDIO-ANC",
    title: "AeroTune Studio ANC Wireless Headphones",
    slug: "aerotune-studio-anc",
    categorySlug: "anc-headphones",
    categoryName: "หูฟังตัดเสียงรบกวน",
    description: "หูฟังไร้สายระดับพรีเมียม ตัดเสียงรบกวนภายนอกได้สูงสุด 99% ด้วย Dual-Chamber Acoustic Driver แบตเตอรี่ใช้งานยาวนาน 50 ชั่วโมง ชาร์จเร็ว USB-C",
    basePrice: 8900,
    salePrice: 7490,
    stockQuantity: 80,
    featuredImageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    ],
    videoDurationSeconds: 22,
    attributeOptions: [
      { name: "สี", values: ["สเปซแบล็ก", "อาร์กติกไวท์"] },
    ],
    variants: [
      { id: "var-4", name: "สเปซแบล็ก", sku: "ECOM-AUDIO-ANC-BLK", price: 7490, stock: 50, attributes: { "สี": "สเปซแบล็ก" } },
      { id: "var-5", name: "อาร์กติกไวท์", sku: "ECOM-AUDIO-ANC-WHT", price: 7490, stock: 30, attributes: { "สี": "อาร์กติกไวท์" } },
    ],
    isFeatured: true,
    isActive: true,
    tags: ["หูฟัง", "บลูทูธ", "ตัดเสียงรบกวน", "เสียงดี"],
    seoTitle: "AeroTune Studio ANC หูฟังไร้สายระบบตัดเสียงรบกวน",
    seoDescription: "สัมผัสเสียงระดับสตูดิโอกับ AeroTune Studio ANC แบต 50 ชม. พร้อมส่งฟรีทั่วไทย",
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: "prod-003",
    sku: "ECOM-CHARGE-65W",
    title: "GaN Pro 65W Fast Charger (3-Port Multi-Device)",
    slug: "gan-pro-65w-fast-charger",
    categorySlug: "gan-chargers",
    categoryName: "หัวชาร์จเร็ว GaN",
    description: "หัวชาร์จเทคโนโลยี GaN ขนาดกะทัดรัด รองรับกำลังไฟ 65W มี 2 USB-C + 1 USB-A ชาร์จโน้ตบุ๊กและมือถือพร้อมกันได้อย่างปลอดภัย",
    basePrice: 1290,
    salePrice: 990,
    stockQuantity: 150,
    featuredImageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    ],
    attributeOptions: [
      { name: "สี", values: ["ขาวมุก", "ดำด้าน"] },
    ],
    variants: [
      { id: "var-6", name: "ขาวมุก", sku: "ECOM-CHARGE-65W-WHT", price: 990, stock: 90, attributes: { "สี": "ขาวมุก" } },
      { id: "var-7", name: "ดำด้าน", sku: "ECOM-CHARGE-65W-BLK", price: 990, stock: 60, attributes: { "สี": "ดำด้าน" } },
    ],
    isFeatured: false,
    isActive: true,
    tags: ["หัวชาร์จ", "GaN", "ชาร์จเร็ว", "65W"],
    lastViewedAt: new Date().toISOString(),
  },
  {
    id: "prod-004",
    sku: "ECOM-FASH-TEE",
    title: "Minimalist Heavy Cotton Oversized T-Shirt",
    slug: "minimalist-oversized-tee",
    categorySlug: "oversize-tees",
    categoryName: "เสื้อยืดมินิมอล Oversize",
    description: "เสื้อยืดผ้าฝ้ายพรีเมียม Combed Cotton 100% หนา นุ่ม อยู่ทรง ระบายอากาศดีเยี่ยม ไร้รอยต่อข้างลำตัว ดีไซน์ Oversize ทันสมัย",
    basePrice: 690,
    salePrice: 490,
    stockQuantity: 120,
    featuredImageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    ],
    attributeOptions: [
      { name: "สี", values: ["เบจออร์แกนิก", "ดำชาโคล", "เขียวเซจ"] },
      { name: "ขนาด", values: ["M", "L", "XL"] },
    ],
    variants: [
      { id: "var-8", name: "เบจออร์แกนิก / M", sku: "ECOM-TEE-BEG-M", price: 490, stock: 40, attributes: { "สี": "เบจออร์แกนิก", "ขนาด": "M" } },
      { id: "var-9", name: "เบจออร์แกนิก / L", sku: "ECOM-TEE-BEG-L", price: 490, stock: 40, attributes: { "สี": "เบจออร์แกนิก", "ขนาด": "L" } },
      { id: "var-10", name: "ดำชาโคล / L", sku: "ECOM-TEE-BLK-L", price: 490, stock: 40, attributes: { "สี": "ดำชาโคล", "ขนาด": "L" } },
    ],
    isFeatured: true,
    isActive: true,
    tags: ["เสื้อยืด", "Oversize", "มินิมอล", "Cotton 100%"],
    lastViewedAt: new Date().toISOString(),
  },
];

// Active Coupons
export const ACTIVE_COUPONS: Coupon[] = [
  {
    id: "cp-1",
    code: "WELCOME100",
    title: "ส่วนลดต้อนรับสมาชิกใหม่ 100 บาท",
    discountType: "fixed",
    discountValue: 100,
    minSpend: 500,
    startsAt: "2026-01-01T00:00:00Z",
    expiresAt: "2026-12-31T23:59:59Z",
    isActive: true,
  },
  {
    id: "cp-2",
    code: "FREESHIP",
    title: "คูปองส่งฟรีทั่วไทย ไม่มีขั้นต่ำ",
    discountType: "free_shipping",
    discountValue: 50,
    minSpend: 0,
    startsAt: "2026-01-01T00:00:00Z",
    expiresAt: "2026-12-31T23:59:59Z",
    isActive: true,
  },
  {
    id: "cp-3",
    code: "FLASH20",
    title: "ส่วนลด Flash Sale 20% สูงสุด 500 บาท",
    discountType: "percent",
    discountValue: 20,
    minSpend: 1000,
    maxDiscount: 500,
    startsAt: "2026-01-01T00:00:00Z",
    expiresAt: "2026-12-31T23:59:59Z",
    isActive: true,
  },
];

// Blog Posts
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "modern-ecommerce-security-2026",
    title: "แนวทางการรักษาความปลอดภัยและความเป็นส่วนตัวในระบบ E-commerce ยุค AI",
    excerpt: "เจาะลึกการปกป้องข้อมูลส่วนบุคคลตามกฎหมาย PDPA การจัดการ Session 60 วัน และการป้องกัน Webhook Replay Attack",
    content: "ในยุคที่การซื้อขายออนไลน์เติบโตอย่างรวดเร็ว ความปลอดภัยของข้อมูลผู้บริโภคถือเป็นสิ่งสำคัญอันดับหนึ่ง...",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    author: "ทีมวิศวกรรมสถาปัตยกรรมระบบ",
    publishedAt: "2026-11-20",
    readTime: "5 นาที",
  },
  {
    id: "blog-2",
    slug: "thai-tax-accounting-digital-invoicing",
    title: "ระบบเอกสารบัญชีไทยและใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax Invoice) ฉบับสมบูรณ์",
    excerpt: "ทำความเข้าใจการเชื่อมโยงเอกสาร QT → BL → INV → RE พร้อมการคำนวณภาษีมูลค่าเพิ่ม 7% อย่างถูกต้อง",
    content: "การจัดการระบบบัญชีที่มีประสิทธิภาพเริ่มต้นจากการมีโครงสร้างเอกสารที่เป็นมาตรฐาน...",
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    author: "ที่ปรึกษาบัญชีและภาษี",
    publishedAt: "2026-11-15",
    readTime: "7 นาที",
  },
];

// Portfolio / Showcase Items
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "port-1",
    title: "ระบบคลังสินค้าอัจฉริยะ Smart Warehouse 4.0",
    category: "Logistics Automation",
    description: "พัฒนาระบบสแกนบาร์โค้ดและพิมพ์ใบปะหน้าพัสดุอัตโนมัติ ลดเวลาจัดเตรียมสินค้าลง 65%",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    client: "กลุ่มพันธมิตรขนส่งไทย",
    completedAt: "2026-10",
  },
  {
    id: "port-2",
    title: "โซลูชันระบบชำระเงิน KBank QR & Real-time Webhook",
    category: "Fintech Integration",
    description: "ระบบรับชำระเงินแบบ PromptPay QR API 10 นาที ตรวจสอบความถูกต้องและแจ้งเตือนเข้า Telegram อัตโนมัติ",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    client: "ธนาคารกสิกรไทย พาร์ทเนอร์",
    completedAt: "2026-09",
  },
];

// Contact Channels
export const CONTACT_CHANNELS: ContactInfo = {
  phone: "02-123-4567, 089-888-9999",
  lineOa: "https://line.me/R/ti/p/@siamcommerce",
  lineId: "@siamcommerce",
  facebookMessenger: "https://m.me/siamcommercehub",
  telegramUsername: "siamcommerce_bot",
  wechatId: "siam_commerce_official",
  address: "เลขที่ 888 อาคารสยามทาวเวอร์ ชั้น 24 ถนนพระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330",
  workingHours: "จันทร์ - เสาร์: 08:30 - 18:00 น. (ระบบสั่งซื้อออนไลน์เปิดตลอด 24 ชม.)",
};
