import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

const storedUser = JSON.parse(localStorage.getItem("user") || "null");

const persistUser = (user) => localStorage.setItem("user", JSON.stringify(user));

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

// Re-reads the profile from the server so role/store changes made elsewhere
// (store created, admin approval) show up without forcing a re-login.
export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Could not load profile");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    // Called right after a vendor creates their store, so the dashboard
    // unlocks immediately instead of waiting for the next login.
    setStore: (state, action) => {
      if (!state.user) return;
      state.user.store = action.payload;
      persistUser(state.user);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("token", action.payload.token);
        persistUser(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("token", action.payload.token);
        persistUser(action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        if (!state.user) return;
        // Keep the existing token — /auth/me doesn't return one.
        state.user = { ...state.user, ...action.payload, token: state.user.token };
        persistUser(state.user);
      });
  },
});

export const { logout, clearAuthError, setStore } = authSlice.actions;
export default authSlice.reducer;
