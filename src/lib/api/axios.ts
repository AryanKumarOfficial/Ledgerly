import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  timeout: 10000,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      return Promise.reject(null);
    }
    return Promise.reject(error);
  },
);
