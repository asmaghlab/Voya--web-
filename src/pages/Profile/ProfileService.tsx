import { authApi } from "@/utils/api";

export const updateUserImage = async (userId, imageUrl) => {
  const res = await authApi.put(`/users/${userId}`, { image: imageUrl });
  return res.data;
};
