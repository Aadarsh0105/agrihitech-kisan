import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createBannerRecord,
  deleteBannerRecord,
  fetchBannerRecords,
  updateBannerRecord
} from "./api";
import type { BannerRecord } from "./types";

interface BannersState {
  items: BannerRecord[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: BannersState = {
  items: [],
  loading: false,
  saving: false,
  error: null
};

export const fetchBanners = createAsyncThunk("banners/fetch", fetchBannerRecords);

export const createBanner = createAsyncThunk(
  "banners/create",
  async (file: File, { dispatch }) => {
    await createBannerRecord(file);
    dispatch(fetchBanners());
  }
);

export const updateBanner = createAsyncThunk(
  "banners/update",
  async ({ id, file }: { id: string; file: File }, { dispatch }) => {
    await updateBannerRecord(id, file);
    dispatch(fetchBanners());
  }
);

export const deleteBanner = createAsyncThunk(
  "banners/delete",
  async (id: string, { dispatch }) => {
    await deleteBannerRecord(id);
    dispatch(fetchBanners());
  }
);

const bannersSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load banners";
      })
      .addCase(createBanner.pending, (state) => {
        state.saving = true;
      })
      .addCase(createBanner.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Failed to create banner";
      })
      .addCase(updateBanner.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateBanner.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Failed to update banner";
      })
      .addCase(deleteBanner.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteBanner.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message ?? "Failed to delete banner";
      });
  }
});

export default bannersSlice.reducer;
