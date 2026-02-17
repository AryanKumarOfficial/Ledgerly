import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../../api/auth.api";
import { Login, Register } from "@/types/auth.type";

export const initializeAuthThunk = createAsyncThunk(
  "auth/init",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser();
      return data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: Login, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to login");
    }
  },
);
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: Register, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);
      return res.message || "Please check your email to verify your account.";
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to register",
      );
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to logout");
    }
  },
);
