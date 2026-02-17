import type { Login, Register } from "@/types/auth.type";
import { api } from "./axios";

export const loginUser = async (data: Login) => {
  const res = await api.post(`/auth/login`, data);
  return res.data;
};

export const registerUser = async (data: Register) => {
  const res = await api.post(`/auth/register`, data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get(`/auth/me`);
  console.log("cur user: ", res?.data);
  return res.data;
};

export const logoutUser = async () => {
  await api.post(`/auth/logout`);
};
