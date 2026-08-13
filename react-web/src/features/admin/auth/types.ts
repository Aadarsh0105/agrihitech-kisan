export type AdminRole = "ADMIN";

export interface AdminUser {
  _id: string;
  mobile: string;
  role: AdminRole;
  firmName?: string;
  proprietorName?: string;
  profileimage?: string;
  public_id?: string;
  isVerified?: boolean;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}
