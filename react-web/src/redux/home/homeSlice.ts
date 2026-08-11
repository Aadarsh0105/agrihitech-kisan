import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHomeData } from "./homeApi";

export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async () => {
    return await getHomeData();
  }
);

interface HomeState {
  loading: boolean;
  data: any;
  error: string | null;
}

const initialState: HomeState = {
  loading: false,
  data: null,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default homeSlice.reducer;