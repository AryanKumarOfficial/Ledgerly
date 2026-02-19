import type { Login, Register, Reset } from "@/types/auth.type";
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
  try {
    const res = await api.get(`/auth/me`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      return null;
    }
    throw err;
  }
};

export const logoutUser = async () => {
  await api.post(`/auth/logout`);
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await api.post(`/auth/forgot-password`, { email });
    return res;
  } catch (err: any) {
    throw (
      err.response?.data || {
        success: false,
        message: `Something went wrong`,
      }
    );
  }
};

export const resetPassword = async (data: Reset) => {
  try {
    const res = await api.post(`/auth/reset-password`, data);
    console.log("API response:", res);
    return res.data;
  } catch (err: any) {
    throw (
      err.response?.data || {
        success: false,
        message: `Something went wrong`,
      }
    );
  }
};
