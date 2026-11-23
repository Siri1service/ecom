"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "guest" | "member" | "admin" | "super_admin";
export type MemberType = "individual" | "corporate";

export interface UserProfile {
  id: string;
  role: UserRole;
  memberType: MemberType;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  zipcode?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  companyName?: string;
  companyType?: string;
  taxId?: string;
  taxAddress?: string;
  shippingAddress?: string;
  isSameAddress?: boolean;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  isAffiliateApproved: boolean;
  affiliateCode?: string;
  termsVersionAccepted: string;
  lastActiveAt: string;
  sessionValidUntil: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  isSessionExpired: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsAdmin: (password: string, adminId?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  acceptTerms: (version: string) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

// Initial demo profile for member
const defaultMemberProfile: UserProfile = {
  id: "u-member-001",
  role: "member",
  memberType: "individual",
  email: "somchai.dev@gmail.com",
  firstName: "สมชาย",
  lastName: "ใจดีพร้อม",
  phone: "0812345678",
  address: "123/45 ถนนพระราม 4",
  province: "กรุงเทพมหานคร",
  district: "ปทุมวัน",
  subdistrict: "ลุมพินี",
  zipcode: "10330",
  bankName: "KBANK",
  bankAccountNumber: "0041234567",
  bankAccountName: "สมชาย ใจดีพร้อม",
  isAffiliateApproved: true,
  affiliateCode: "SOMCHAI2026",
  termsVersionAccepted: "1.0",
  lastActiveAt: new Date().toISOString(),
  sessionValidUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(defaultMemberProfile);
  const [role, setRole] = useState<UserRole>("member");
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Check 2-month inactivity limit on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("siam_auth_user");
      if (savedUser) {
        const parsed: UserProfile = JSON.parse(savedUser);
        const lastActive = new Date(parsed.lastActiveAt).getTime();
        const twoMonthsMs = 60 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - lastActive > twoMonthsMs) {
          setIsSessionExpired(true);
          setUser(null);
          setRole("guest");
          localStorage.removeItem("siam_auth_user");
          return;
        }

        // Refresh activity timestamp
        parsed.lastActiveAt = new Date().toISOString();
        setUser(parsed);
        setRole(parsed.role);
        localStorage.setItem("siam_auth_user", JSON.stringify(parsed));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      // In production, invoke supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })
      // For immediate preview/demo flow:
      const newUser: UserProfile = {
        ...defaultMemberProfile,
        lastActiveAt: new Date().toISOString(),
        sessionValidUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setUser(newUser);
      setRole("member");
      localStorage.setItem("siam_auth_user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async (password: string, adminId: string = "admin@siamcommerce.co.th"): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (password === "admin1234" || password === "superadmin1234") {
        const targetRole: UserRole = password.includes("super") ? "super_admin" : "admin";
        const adminProfile: UserProfile = {
          id: targetRole === "super_admin" ? "u-super-001" : "u-admin-001",
          role: targetRole,
          memberType: "individual",
          email: adminId,
          firstName: targetRole === "super_admin" ? "ผู้ดูแลสูงสุด" : "ผู้ดูแลระบบ",
          lastName: "สยามฮับ",
          phone: "0899999999",
          isAffiliateApproved: true,
          termsVersionAccepted: "1.0",
          lastActiveAt: new Date().toISOString(),
          sessionValidUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        };
        setUser(adminProfile);
        setRole(targetRole);
        localStorage.setItem("siam_auth_user", JSON.stringify(adminProfile));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setRole("guest");
    localStorage.removeItem("siam_auth_user");
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated: UserProfile = {
      ...user,
      ...profileData,
      lastActiveAt: new Date().toISOString(),
    };
    setUser(updated);
    localStorage.setItem("siam_auth_user", JSON.stringify(updated));
    return true;
  };

  const acceptTerms = async (version: string) => {
    if (!user) return;
    await updateProfile({ termsVersionAccepted: version });
  };

  const switchDemoRole = (newRole: UserRole) => {
    if (newRole === "guest") {
      setUser(null);
      setRole("guest");
    } else if (newRole === "member") {
      setUser(defaultMemberProfile);
      setRole("member");
      localStorage.setItem("siam_auth_user", JSON.stringify(defaultMemberProfile));
    } else {
      const adminProfile: UserProfile = {
        id: newRole === "super_admin" ? "u-super-001" : "u-admin-001",
        role: newRole,
        memberType: "individual",
        email: `${newRole}@siamcommerce.co.th`,
        firstName: newRole === "super_admin" ? "Super Admin" : "Department Admin",
        lastName: "Master",
        phone: "0800000000",
        isAffiliateApproved: true,
        termsVersionAccepted: "1.0",
        lastActiveAt: new Date().toISOString(),
        sessionValidUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setUser(adminProfile);
      setRole(newRole);
      localStorage.setItem("siam_auth_user", JSON.stringify(adminProfile));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isSessionExpired,
        loginWithGoogle,
        loginAsAdmin,
        logout,
        updateProfile,
        acceptTerms,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
