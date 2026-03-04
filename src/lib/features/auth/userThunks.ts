import { updateProfile } from "@/lib/api/user.api";
import { UpdateProfile } from "@/types/user.type";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateProfileThunk = createAsyncThunk(
  "user/update",
  async (data: UpdateProfile, { rejectWithValue }) => {
    try {
      const res = await updateProfile(data);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error?.message || `Failed to update Profile`);
    }
  },
);
