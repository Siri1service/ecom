import { z } from "zod";

// Thai Banks Directory
export interface ThaiBank {
  code: string;
  acronym: string;
  nameTh: string;
  nameEn: string;
  color: string;
}

export const THAI_BANKS: ThaiBank[] = [
  { code: "002", acronym: "BBL", nameTh: "ธนาคารกรุงเทพ", nameEn: "Bangkok Bank", color: "#1e3799" },
  { code: "004", acronym: "KBANK", nameTh: "ธนาคารกสิกรไทย", nameEn: "Kasikornbank", color: "#138035" },
  { code: "006", acronym: "KTB", nameTh: "ธนาคารกรุงไทย", nameEn: "Krungthai Bank", color: "#00a5e5" },
  { code: "014", acronym: "SCB", nameTh: "ธนาคารไทยพาณิชย์", nameEn: "Siam Commercial Bank", color: "#4e2a84" },
  { code: "025", acronym: "BAY", nameTh: "ธนาคารกรุงศรีอยุธยา", nameEn: "Bank of Ayudhya", color: "#fec10d" },
  { code: "011", acronym: "TTB", nameTh: "ธนาคารทหารไทยธนชาต", nameEn: "TMBThanachart Bank", color: "#002d63" },
  { code: "030", acronym: "GSB", nameTh: "ธนาคารออมสิน", nameEn: "Government Savings Bank", color: "#eb1985" },
  { code: "034", acronym: "BAAC", nameTh: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร", nameEn: "BAAC", color: "#006633" },
];

// Checksum algorithm for Thai 13-digit National ID and Tax ID (MOD 11)
export function validateThaiTaxId(taxId: string): boolean {
  if (!/^[0-9]{13}$/.test(taxId)) return false;
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(taxId.charAt(i), 10) * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(taxId.charAt(12), 10);
}

// Thai Phone Number Validation (10 digits starting with 06, 08, 09, 02)
export function validateThaiPhone(phone: string): boolean {
  return /^0[0-9]{9}$/.test(phone);
}

// Cascaded Thai Address Data
export interface ThaiSubdistrict {
  name: string;
  zipcode: string;
}

export interface ThaiDistrict {
  name: string;
  subdistricts: ThaiSubdistrict[];
}

export interface ThaiProvince {
  name: string;
  districts: ThaiDistrict[];
}

export const THAI_ADDRESS_DATA: ThaiProvince[] = [
  {
    name: "กรุงเทพมหานคร",
    districts: [
      {
        name: "ปทุมวัน",
        subdistricts: [
          { name: "ปทุมวัน", zipcode: "10330" },
          { name: "ลุมพินี", zipcode: "10330" },
          { name: "รองเมือง", zipcode: "10330" },
          { name: "วังใหม่", zipcode: "10330" },
        ],
      },
      {
        name: "บางรัก",
        subdistricts: [
          { name: "บางรัก", zipcode: "10500" },
          { name: "มหาพฤฒาราม", zipcode: "10500" },
          { name: "สีลม", zipcode: "10500" },
          { name: "สุริยวงศ์", zipcode: "10500" },
        ],
      },
      {
        name: "จตุจักร",
        subdistricts: [
          { name: "ลาดยาว", zipcode: "10900" },
          { name: "เสนานิคม", zipcode: "10900" },
          { name: "จันทรเกษม", zipcode: "10900" },
          { name: "จอมพล", zipcode: "10900" },
          { name: "จตุจักร", zipcode: "10900" },
        ],
      },
    ],
  },
  {
    name: "เชียงใหม่",
    districts: [
      {
        name: "เมืองเชียงใหม่",
        subdistricts: [
          { name: "ศรีภูมิ", zipcode: "50200" },
          { name: "พระสิงห์", zipcode: "50200" },
          { name: "หายยา", zipcode: "50100" },
          { name: "ช้างคลาน", zipcode: "50100" },
          { name: "สุเทพ", zipcode: "50200" },
        ],
      },
      {
        name: "แม่ริม",
        subdistricts: [
          { name: "ริมใต้", zipcode: "50180" },
          { name: "ริมเหนือ", zipcode: "50180" },
          { name: "แม่สา", zipcode: "50180" },
        ],
      },
    ],
  },
  {
    name: "ชลบุรี",
    districts: [
      {
        name: "เมืองชลบุรี",
        subdistricts: [
          { name: "บางปลาสร้อย", zipcode: "20000" },
          { name: "มะขามหย่ง", zipcode: "20000" },
          { name: "แสนสุข", zipcode: "20130" },
        ],
      },
      {
        name: "บางละมุง",
        subdistricts: [
          { name: "หนองปรือ", zipcode: "20150" },
          { name: "นาเกลือ", zipcode: "20150" },
        ],
      },
    ],
  },
  {
    name: "ภูเก็ต",
    districts: [
      {
        name: "เมืองภูเก็ต",
        subdistricts: [
          { name: "ตลาดใหญ่", zipcode: "83000" },
          { name: "ตลาดเหนือ", zipcode: "83000" },
          { name: "เกาะแก้ว", zipcode: "83000" },
          { name: "ราไวย์", zipcode: "83130" },
        ],
      },
      {
        name: "กะทู้",
        subdistricts: [
          { name: "กะทู้", zipcode: "83120" },
          { name: "ป่าตอง", zipcode: "83150" },
          { name: "กมลา", zipcode: "83120" },
        ],
      },
    ],
  },
];

// Zod Validation Schemas
export const individualProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
    .regex(/^[a-zA-Zก-๙\s]+$/, "ชื่อต้องเป็นตัวอักษรภาษาไทยหรือภาษาอังกฤษเท่านั้น"),
  lastName: z
    .string()
    .min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร")
    .regex(/^[a-zA-Zก-๙\s]+$/, "นามสกุลต้องเป็นตัวอักษรภาษาไทยหรือภาษาอังกฤษเท่านั้น"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  phone: z
    .string()
    .length(10, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก")
    .refine(validateThaiPhone, "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0 และมี 10 หลัก"),
  address: z.string().min(5, "ที่อยู่ต้องมีความยาวอย่างน้อย 5 ตัวอักษร"),
  province: z.string().min(1, "กรุณาเลือกจังหวัด"),
  district: z.string().min(1, "กรุณาเลือกอำเภอ/เขต"),
  subdistrict: z.string().min(1, "กรุณาเลือกตำบล/แขวง"),
  zipcode: z.string().regex(/^[0-9]{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก"),
  bankName: z.string().min(1, "กรุณาเลือกธนาคาร"),
  bankAccountNumber: z
    .string()
    .regex(/^[0-9]{10,12}$/, "เลขบัญชีต้องเป็นตัวเลข 10-12 หลัก (รวมศูนย์นำหน้า)"),
  bankAccountName: z.string().min(2, "ชื่อบัญชีต้องมีอย่างน้อย 2 ตัวอักษร"),
  acceptedTerms: z.boolean().refine((v) => v === true, {
    message: "ท่านต้องยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว",
  }),
});

export const corporateProfileSchema = z.object({
  companyName: z.string().min(3, "ชื่อจดทะเบียนนิติบุคคลต้องมีอย่างน้อย 3 ตัวอักษร"),
  companyType: z.enum(["company_limited", "public_limited", "partnership"]),
  taxId: z
    .string()
    .length(13, "เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลข 13 หลัก")
    .refine(validateThaiTaxId, "เลขประจำตัวผู้เสียภาษี 13 หลักไม่ถูกต้องตามหลักการคำนวณภาษี"),
  contactEmail: z.string().email("รูปแบบอีเมลบริษัทไม่ถูกต้อง"),
  contactPhone: z
    .string()
    .length(10, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก")
    .refine(validateThaiPhone, "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0"),
  taxAddress: z.string().min(5, "ที่อยู่ใบกำกับภาษีต้องมีความยาวอย่างน้อย 5 ตัวอักษร"),
  isSameAddress: z.boolean(),
  shippingAddress: z.string().min(5, "ที่อยู่จัดส่งสินค้าต้องมีความยาวอย่างน้อย 5 ตัวอักษร"),
  contactName: z.string().min(2, "ชื่อผู้ติดต่อประสานงานต้องมีอย่างน้อย 2 ตัวอักษร"),
  bankName: z.string().min(1, "กรุณาเลือกธนาคาร"),
  bankAccountNumber: z
    .string()
    .regex(/^[0-9]{10,12}$/, "เลขบัญชีต้องเป็นตัวเลข 10-12 หลัก"),
  bankAccountName: z.string().min(2, "ชื่อบัญชีต้องมีอย่างน้อย 2 ตัวอักษร"),
  acceptedTerms: z.boolean().refine((v) => v === true, {
    message: "ท่านต้องยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว",
  }),
});
