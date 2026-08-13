import api from "../../../api/admin/axios";

import type { BannerRecord } from "./types";

export async function fetchBannerRecords() {
  const { data } = await api.get("/banners");
  return (data?.banners ?? []).map((banner: Omit<BannerRecord, "id">) => ({
    ...banner,
    id: banner._id
  })) as BannerRecord[];
}

export async function createBannerRecord(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  await api.post("/banners/create", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export async function updateBannerRecord(id: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  await api.put(`/banners/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export async function deleteBannerRecord(id: string) {
  await api.delete(`/banners/${id}`);
}
