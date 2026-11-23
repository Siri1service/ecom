// Thai Tax Accounting Document Engine (QT, BL, INV, RE, CA)

export type DocType = "QT" | "BL" | "INV" | "RE" | "CA";
export type DocStatus = "draft" | "approved" | "issued" | "void" | "revised";

export interface CompanyProfile {
  nameTh: string;
  nameEn: string;
  taxId: string; // 13 digits
  branch: string; // e.g. "สำนักงานใหญ่ (Head Office)"
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  nameTh: "บริษัท สยาม คอมเมิร์ซ ฮับ จำกัด",
  nameEn: "Siam Commerce Hub Co., Ltd.",
  taxId: "0105566012345",
  branch: "สำนักงานใหญ่",
  address: "เลขที่ 888 อาคารสยามทาวเวอร์ ชั้น 24 ถนนพระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330",
  phone: "02-123-4567",
  email: "accounting@siamcommerce.co.th",
};

export interface AccountingItem {
  id: string;
  title: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface AccountingDocument {
  id: string;
  docType: DocType;
  docNumber: string; // e.g. QT2026110004
  referenceDocNumber?: string; // Chained reference
  orderNumber?: string;
  status: DocStatus;
  company: CompanyProfile;
  customer: {
    name: string;
    taxId?: string;
    address: string;
    phone: string;
  };
  items: AccountingItem[];
  subtotal: number;
  discount: number;
  vatRate: number; // 7.00
  vatAmount: number;
  grandTotal: number;
  paymentMethod?: "cash" | "cheque" | "transfer";
  paymentDetails?: string;
  notes?: string;
  issuedAt: string;
  createdBy: string;
  approvedBy?: string;
}

/**
 * Converts numeric amount to official Thai Baht text format (e.g. "เจ็ดพันสี่ร้อยเก้าสิบบาทถ้วน")
 */
export function arabicToThaiBahtText(amount: number): string {
  if (isNaN(amount) || amount === 0) return "ศูนย์บาทถ้วน";

  const numWords = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const unitWords = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  const [bahtStr, satangStr = "00"] = amount.toFixed(2).split(".");
  let bahtVal = parseInt(bahtStr, 10);
  const satangVal = parseInt(satangStr.slice(0, 2), 10);

  function convertGroup(n: number): string {
    let s = "";
    const digits = String(n).split("").map(Number);
    const len = digits.length;

    for (let i = 0; i < len; i++) {
      const d = digits[i];
      const pos = len - i - 1;
      if (d !== 0) {
        if (pos === 0 && d === 1 && len > 1) {
          s += "เอ็ด";
        } else if (pos === 1 && d === 2) {
          s += "ยี่สิบ";
        } else if (pos === 1 && d === 1) {
          s += "สิบ";
        } else {
          s += numWords[d] + unitWords[pos];
        }
      }
    }
    return s;
  }

  let text = "";
  if (bahtVal >= 1000000) {
    const millionPart = Math.floor(bahtVal / 1000000);
    text += convertGroup(millionPart) + "ล้าน";
    bahtVal = bahtVal % 1000000;
  }

  if (bahtVal > 0) {
    text += convertGroup(bahtVal);
  }
  text += "บาท";

  if (satangVal === 0) {
    text += "ถ้วน";
  } else {
    text += convertGroup(satangVal) + "สตางค์";
  }

  return text;
}

/**
 * Sequential Doc Number Generator e.g. QT2026110004
 */
export function generateDocNumber(type: DocType, seq: number): string {
  const ym = new Date().toISOString().slice(0, 7).replace("-", "");
  const paddedSeq = String(seq).padStart(4, "0");
  return `${type}${ym}${paddedSeq}`;
}

export const SAMPLE_ACCOUNTING_DOCS: AccountingDocument[] = [
  {
    id: "doc-001",
    docType: "QT",
    docNumber: "QT2026110001",
    status: "approved",
    company: DEFAULT_COMPANY_PROFILE,
    customer: {
      name: "บริษัท ดิจิทัล โซลูชันส์ คอนซัลติง จำกัด",
      taxId: "0105555099887",
      address: "เลขที่ 99/1 อาคารไอทีพลาซ่า ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กทม. 10400",
      phone: "02-888-9999",
    },
    items: [
      {
        id: "item-1",
        title: "AeroTune Studio ANC Wireless Headphones",
        quantity: 5,
        unit: "เครื่อง",
        unitPrice: 7490,
        totalPrice: 37450,
      },
    ],
    subtotal: 37450,
    discount: 1000,
    vatRate: 7.00,
    vatAmount: 2551.50,
    grandTotal: 39001.50,
    issuedAt: "2026-11-20",
    createdBy: "Admin Accounting",
    notes: "ยืนยันราคาภายใน 30 วันนับจากวันที่ออกเอกสาร",
  },
  {
    id: "doc-002",
    docType: "INV",
    docNumber: "INV2026110002",
    referenceDocNumber: "BL2026110001",
    orderNumber: "ORD2026110001",
    status: "issued",
    company: DEFAULT_COMPANY_PROFILE,
    customer: {
      name: "คุณสมชาย ใจดีพร้อม",
      address: "123/45 ถนนพระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330",
      phone: "081-234-5678",
    },
    items: [
      {
        id: "item-2",
        title: "AeroTune Studio ANC Wireless Headphones",
        quantity: 1,
        unit: "เครื่อง",
        unitPrice: 7490,
        totalPrice: 7490,
      },
    ],
    subtotal: 7490,
    discount: 100,
    vatRate: 7.00,
    vatAmount: 517.30,
    grandTotal: 7390,
    paymentMethod: "transfer",
    paymentDetails: "ชำระผ่าน KBank QR Code PromptPay",
    issuedAt: "2026-11-23",
    createdBy: "System Automation",
    approvedBy: "Head of Accounting",
  },
];
