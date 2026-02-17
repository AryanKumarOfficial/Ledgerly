import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, loginUser, registerUser } from "../../api/auth.api";
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
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: Register, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
