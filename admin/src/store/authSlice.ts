import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RoleKey } from '../types';

export interface AuthState {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: RoleKey;
  roleName: string;
}

const initialState: AuthState = {
  id: 'usr_001',
  name: 'Rajeev Nandan',
  email: 'rajeev@agrihitechkisan.in',
  phone: '+91 98200 41122',
  avatar:
  'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&h=200&fit=crop&crop=faces',
  role: 'super_admin',
  roleName: 'Super Admin'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<Partial<AuthState>>) {
      Object.assign(state, action.payload);
    }
  }
});

export const { updateProfile } = authSlice.actions;
export const authReducer = authSlice.reducer;