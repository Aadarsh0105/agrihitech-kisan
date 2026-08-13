import api from "../../../api/admin/axios";
import type { AuthResponse, AdminUser } from "./types";

export async function sendAdminOtp(mobile: string) {
  const { data } = await api.post("/auth/send-otp", {
    mobile,
    role: "ADMIN"
  });
  return data;
}

export async function verifyAdminOtp(mobile: string, otp: string): Promise<AuthResponse> {
  const { data } = await api.post("/auth/verify-otp", {
    mobile,
    otp,
    role: "ADMIN"
  });
  return data;
}

export async function fetchAdminMe(): Promise<AdminUser> {
  const { data } = await api.get("/auth/me");
  return data.user as AdminUser;
}
