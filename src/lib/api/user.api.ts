import { UpdateProfile } from "@/types/user.type";
import { api } from "./axios";

export const updateProfile = async (data: UpdateProfile) => {
  try {
    const res = await api.patch("/user", data);
    return res.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: `Something Went wrong`,
      }
    );
  }
};
