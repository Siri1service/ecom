// Affiliate Marketing Engine & Anti-Open Redirect Guard

export interface CommissionRule {
  categorySlug?: string;
  productId?: string;
  ratePercent: number; // e.g. 5.0 for 5%
}

export interface AttributionPolicy {
  cookieWindowDays: number; // e.g. 30 days
  attributionModel: "last_click" | "first_click";
  minPayoutThreshold: number; // e.g. 500 THB
  holdPeriodDays: number; // e.g. 7 days holding for return window
}

export const DEFAULT_ATTRIBUTION_POLICY: AttributionPolicy = {
  cookieWindowDays: 30,
  attributionModel: "last_click",
  minPayoutThreshold: 500,
  holdPeriodDays: 7,
};

export const CATEGORY_COMMISSION_RATES: CommissionRule[] = [
  { categorySlug: "electronics", ratePercent: 4.5 },
  { categorySlug: "fashion", ratePercent: 10.0 },
  { categorySlug: "health-beauty", ratePercent: 12.0 },
  { categorySlug: "audio-accessories", ratePercent: 8.0 },
];

/**
 * Anti-Open Redirect Guard
 * Ensures shortened affiliate links can ONLY redirect to legitimate internal application paths
 * and completely prevents phishing or malicious redirection to external URLs.
 */
export function validateSafeRedirectUrl(targetUrl: string, allowedHost?: string): {
  isSafe: boolean;
  safeUrl: string;
} {
  try {
    // Relative paths starting with '/' are inherently safe
    if (targetUrl.startsWith("/") && !targetUrl.startsWith("//")) {
      return { isSafe: true, safeUrl: targetUrl };
    }

    const parsed = new URL(targetUrl);
    const host = parsed.hostname;

    // Check against allowed host
    if (allowedHost && host === allowedHost) {
      return { isSafe: true, safeUrl: targetUrl };
    }

    // Disallow external domains for safety
    return { isSafe: false, safeUrl: "/" };
  } catch {
    return { isSafe: false, safeUrl: "/" };
  }
}

/**
 * Calculates commission for an order
 */
export function calculateOrderCommission(
  items: Array<{ categorySlug?: string; totalPrice: number }>,
  defaultRate: number = 5.0
): number {
  let totalCommission = 0;

  for (const item of items) {
    const rule = CATEGORY_COMMISSION_RATES.find(
      (r) => r.categorySlug === item.categorySlug
    );
    const rate = rule ? rule.ratePercent : defaultRate;
    totalCommission += (item.totalPrice * rate) / 100;
  }

  return Math.round(totalCommission * 100) / 100;
}
