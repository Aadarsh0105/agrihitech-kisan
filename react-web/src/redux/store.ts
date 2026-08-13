import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import homeReducer from "./home/homeSlice";
import { uiReducer } from "./admin/uiSlice";
import { authReducer } from "./admin/authSlice";
import bannersReducer from "./admin/bannersSlice";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    ui: uiReducer,
    auth: authReducer,
    banners: bannersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
