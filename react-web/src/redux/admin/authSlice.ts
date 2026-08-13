import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/admin/axios";
import { fetchAdminMe, sendAdminOtp, verifyAdminOtp } from "../../features/admin/auth/api";
import type { AdminUser } from "../../features/admin/auth/types";
import type { RoleKey } from "../../types/admin";

export interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  otpLoading: boolean;
  error: string | null;
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: RoleKey;
  roleName: string;
}

// The admin marker prevents a valid B2C/B2B session from entering admin routes.
const storedToken = localStorage.getItem("ahk_admin_token");

const initialState: AuthState = {
  token: storedToken,
  user: null,
  isAuthenticated: Boolean(storedToken),
  loading: false,
  otpLoading: false,
  error: null,
  id: "usr_001",
  name: "Admin User",
  email: "admin@example.com",
  phone: "",
  avatar: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&h=200&fit=crop&crop=faces",
  role: "super_admin",
  roleName: "Super Admin"
};

const syncLegacyFields = (state: AuthState, user: AdminUser | null) => {
  if (!user) return;
  state.id = user._id;
  state.name = user.proprietorName || user.firmName || "Admin User";
  state.email = user.mobile ? `${user.mobile}@admin.local` : "admin@example.com";
  state.phone = user.mobile;
  state.avatar = user.profileimage || state.avatar;
  state.role = "super_admin";
  state.roleName = "Super Admin";
};

export const requestAdminOtp = createAsyncThunk(
  "auth/requestOtp",
  async (mobile: string) => sendAdminOtp(mobile)
);

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({ mobile, otp }: { mobile: string; otp: string }) => {
    const data = await verifyAdminOtp(mobile, otp);
    return data;
  }
);

export const bootstrapAdmin = createAsyncThunk("auth/bootstrap", async () => {
  const user = await fetchAdminMe();
  return user;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<Partial<AuthState>>) {
      Object.assign(state, action.payload);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.otpLoading = false;
      state.error = null;
      localStorage.removeItem("ahk_admin_token");
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    },
    hydrateToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      if (!action.payload) {
        localStorage.removeItem("ahk_admin_token");
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
      } else {
        localStorage.setItem("ahk_admin_token", action.payload);
        localStorage.setItem("token", action.payload);
        api.defaults.headers.common.Authorization = `Bearer ${action.payload}`;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestAdminOtp.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(requestAdminOtp.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(requestAdminOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.error.message ?? "Failed to request OTP";
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        syncLegacyFields(state, action.payload.user);
        localStorage.setItem("ahk_admin_token", action.payload.token);
        localStorage.setItem("token", action.payload.token);
        api.defaults.headers.common.Authorization = `Bearer ${action.payload.token}`;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to login";
      })
      .addCase(bootstrapAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(bootstrapAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        syncLegacyFields(state, action.payload);
      })
      .addCase(bootstrapAdmin.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("ahk_admin_token");
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
      });
  }
});

export const { logout, hydrateToken, updateProfile } = authSlice.actions;
export const authReducer = authSlice.reducer;
