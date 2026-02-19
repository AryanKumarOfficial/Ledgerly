import { createSlice } from "@reduxjs/toolkit";
import {
  initializeAuthThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from "./authThunks";
interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitializing: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  isInitializing: true,
  error: null,
};

const authSlice = createSlice({
  name: `auth`,
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuthThunk.pending, (state) => {
        state.isInitializing = true;
        state.error = null;
      })
      .addCase(initializeAuthThunk.fulfilled, (state, action) => {
        state.isInitializing = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(initializeAuthThunk.rejected, (state) => {
        state.isInitializing = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
