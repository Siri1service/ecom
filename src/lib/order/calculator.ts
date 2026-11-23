import { SAMPLE_PRODUCTS, ACTIVE_COUPONS, Product, Coupon } from "@/lib/catalog-data";

export interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CalculatedOrderItem {
  productId: string;
  variantId?: string;
  title: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderCalculationResult {
  valid: boolean;
  error?: string;
  items: CalculatedOrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxableAmount: number;
  taxAmount: number; // 7% VAT
  paymentFee: number;
  totalAmount: number;
  appliedCoupon?: Coupon;
}

export function calculateOrderServerSide(
  itemsInput: OrderItemInput[],
  couponCode?: string,
  paymentMethod: string = "kbank_qr"
): OrderCalculationResult {
  if (!itemsInput || itemsInput.length === 0) {
    return {
      valid: false,
      error: "ไม่มีรายการสินค้าในคำสั่งซื้อ",
      items: [],
      subtotal: 0,
      discountAmount: 0,
      shippingFee: 0,
      taxableAmount: 0,
      taxAmount: 0,
      paymentFee: 0,
      totalAmount: 0,
    };
  }

  const calculatedItems: CalculatedOrderItem[] = [];
  let subtotal = 0;

  for (const input of itemsInput) {
    const product = SAMPLE_PRODUCTS.find((p) => p.id === input.productId);
    if (!product || !product.isActive) {
      return {
        valid: false,
        error: `ไม่พบสินค้า ID: ${input.productId} หรือสินค้านี้ถูกปิดการขายแล้ว`,
        items: [],
        subtotal: 0,
        discountAmount: 0,
        shippingFee: 0,
        taxableAmount: 0,
        taxAmount: 0,
        paymentFee: 0,
        totalAmount: 0,
      };
    }

    let unitPrice = product.salePrice ?? product.basePrice;
    let sku = product.sku;
    let stock = product.stockQuantity;

    if (input.variantId) {
      const variant = product.variants.find((v) => v.id === input.variantId);
      if (variant) {
        unitPrice = variant.price;
        sku = variant.sku;
        stock = variant.stock;
      }
    }

    if (input.quantity > stock) {
      return {
        valid: false,
        error: `สินค้า "${product.title}" มีจำนวนในสต็อกคงเหลือ ${stock} ชิ้น ไม่เพียงพอกับจำนวนที่ท่านเลือก (${input.quantity} ชิ้น)`,
        items: [],
        subtotal: 0,
        discountAmount: 0,
        shippingFee: 0,
        taxableAmount: 0,
        taxAmount: 0,
        paymentFee: 0,
        totalAmount: 0,
      };
    }

    const itemTotal = unitPrice * input.quantity;
    subtotal += itemTotal;

    calculatedItems.push({
      productId: product.id,
      variantId: input.variantId,
      title: product.title,
      sku,
      unitPrice,
      quantity: input.quantity,
      totalPrice: itemTotal,
    });
  }

  // Shipping fee calculation
  let shippingFee = subtotal > 0 ? 50 : 0;
  let discountAmount = 0;
  let appliedCoupon: Coupon | undefined;

  if (couponCode) {
    const clean = couponCode.trim().toUpperCase();
    const coupon = ACTIVE_COUPONS.find((c) => c.code === clean && c.isActive);
    if (coupon && subtotal >= coupon.minSpend) {
      appliedCoupon = coupon;
      if (coupon.discountType === "free_shipping") {
        shippingFee = 0;
      } else if (coupon.discountType === "shipping_fixed") {
        shippingFee = Math.max(0, shippingFee - coupon.discountValue);
      } else if (coupon.discountType === "fixed") {
        discountAmount = coupon.discountValue;
      } else if (coupon.discountType === "percent") {
        const disc = (subtotal * coupon.discountValue) / 100;
        discountAmount = coupon.maxDiscount ? Math.min(disc, coupon.maxDiscount) : disc;
      }
    }
  }

  // Payment fee: transparent and compliant with merchant terms
  // Credit card: 2.5% fee if applicable; KBank QR / Transfer / Cash: 0 fee
  let paymentFee = 0;
  if (paymentMethod === "credit_card") {
    // 0% promotional surcharge or transparent fee
    paymentFee = 0;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  // VAT 7% portion included in net
  const taxAmount = Math.round(((taxableAmount * 7) / 107) * 100) / 100;
  const totalAmount = taxableAmount + shippingFee + paymentFee;

  return {
    valid: true,
    items: calculatedItems,
    subtotal,
    discountAmount,
    shippingFee,
    taxableAmount,
    taxAmount,
    paymentFee,
    totalAmount,
    appliedCoupon,
  };
}
