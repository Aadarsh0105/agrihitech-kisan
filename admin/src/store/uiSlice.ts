import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LanguageCode } from '../types';

export interface UiState {
  sidebarCollapsed: boolean;
  mobileDrawerOpen: boolean;
  theme: 'light' | 'dark';
  contentLanguage: LanguageCode;
  commandOpen: boolean;
}

const storedTheme =
typeof window !== 'undefined' ? localStorage.getItem('ahk_admin_theme') as 'light' | 'dark' | null : null;

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileDrawerOpen: false,
  theme: storedTheme ?? 'light',
  contentLanguage: 'en',
  commandOpen: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileDrawer(state, action: PayloadAction<boolean>) {
      state.mobileDrawerOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      if (typeof window !== 'undefined') localStorage.setItem('ahk_admin_theme', action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') localStorage.setItem('ahk_admin_theme', state.theme);
    },
    setContentLanguage(state, action: PayloadAction<LanguageCode>) {
      state.contentLanguage = action.payload;
    },
    setCommandOpen(state, action: PayloadAction<boolean>) {
      state.commandOpen = action.payload;
    }
  }
});

export const {
  toggleSidebar,
  setMobileDrawer,
  setTheme,
  toggleTheme,
  setContentLanguage,
  setCommandOpen
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;