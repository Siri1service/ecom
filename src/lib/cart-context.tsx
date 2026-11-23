"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductVariant, ACTIVE_COUPONS, Coupon } from "@/lib/catalog-data";

export interface CartItem {
  id: string; // unique item id: productId-variantId
  productId: string;
  variantId?: string;
  title: string;
  variantName?: string;
  sku: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  selected: boolean;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  selectedSubtotal: number;
  totalSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  taxAmount: number; // 7% VAT
  totalAmount: number;
  selectedCount: number;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleSelect: (cartItemId: string) => void;
  toggleSelectAll: (select: boolean) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("siam_cart_items");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Initial sample item in cart
        setItems([
          {
            id: "prod-002-var-4",
            productId: "prod-002",
            variantId: "var-4",
            title: "AeroTune Studio ANC Wireless Headphones",
            variantName: "สเปซแบล็ก",
            sku: "ECOM-AUDIO-ANC-BLK",
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
            unitPrice: 7490,
            quantity: 1,
            selected: true,
            stock: 50,
          },
        ]);
      }
    } catch {
      // Ignore read error
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("siam_cart_items", JSON.stringify(items));
    } catch {
      // Ignore write error
    }
  }, [items, mounted]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const variantId = variant?.id || "default";
    const itemId = `${product.id}-${variantId}`;
    const price = variant?.price ?? (product.salePrice || product.basePrice);
    const sku = variant?.sku || product.sku;
    const variantName = variant?.name;
    const stock = variant?.stock ?? product.stockQuantity;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId
            ? { ...i, quantity: Math.min(i.quantity + quantity, stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          variantId: variant?.id,
          title: product.title,
          variantName,
          sku,
          imageUrl: product.featuredImageUrl,
          unitPrice: price,
          quantity: Math.min(quantity, stock),
          selected: true,
          stock,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === cartItemId
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  };

  const toggleSelect = (cartItemId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, selected: !i.selected } : i))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, selected: select })));
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = ACTIVE_COUPONS.find((c) => c.code === cleanCode && c.isActive);

    if (!coupon) {
      return { success: false, message: "รหัสคูปองไม่ถูกต้องหรือหมดอายุแล้ว" };
    }

    if (selectedSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `คูปองนี้ต้องมียอดซื้อขั้นต่ำ ${coupon.minSpend} บาท`,
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `ใช้งานคูปอง "${coupon.title}" สำเร็จ` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => {
    setItems((prev) => prev.filter((i) => !i.selected));
    setAppliedCoupon(null);
  };

  // Calculations
  const selectedItems = items.filter((i) => i.selected);
  const selectedCount = selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const selectedSubtotal = selectedItems.reduce(
    (acc, curr) => acc + curr.unitPrice * curr.quantity,
    0
  );
  const totalSubtotal = items.reduce(
    (acc, curr) => acc + curr.unitPrice * curr.quantity,
    0
  );

  let initialShipping = selectedItems.length > 0 ? 50 : 0;
  let discountAmount = 0;

  if (appliedCoupon && selectedSubtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === "free_shipping") {
      initialShipping = 0;
    } else if (appliedCoupon.discountType === "shipping_fixed") {
      initialShipping = Math.max(0, initialShipping - appliedCoupon.discountValue);
    } else if (appliedCoupon.discountType === "fixed") {
      discountAmount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === "percent") {
      const calculated = (selectedSubtotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount
        ? Math.min(calculated, appliedCoupon.maxDiscount)
        : calculated;
    }
  }

  const shippingFee = initialShipping;
  const taxableAmount = Math.max(0, selectedSubtotal - discountAmount);
  // 7% VAT included or added based on Thai standard (7% of net)
  const taxAmount = Math.round(((taxableAmount * 7) / 107) * 100) / 100;
  const totalAmount = taxableAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        selectedSubtotal,
        totalSubtotal,
        shippingFee,
        discountAmount,
        taxAmount,
        totalAmount,
        selectedCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
