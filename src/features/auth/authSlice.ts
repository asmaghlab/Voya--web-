import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../utils/api";

// ---------------- Types --------------------
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  role: "user" | "admin";
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  resetEmail: string | null;
  otpVerified: boolean;
}

// ---------------- LocalStorage --------------------
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isLoggedIn: !!storedUser,
  isLoading: false,
  error: null,
  resetEmail: null,
  otpVerified: false,
};

// ---------------- Thunks --------------------

// Login
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await authApi.get<User[]>(`/users?email=${email}`);
    if (!res.data.length) return rejectWithValue("User not found");

    const user = res.data[0];
    if (user.password !== password) return rejectWithValue("Wrong password");

    return { user, token: "fake-jwt-token" };
  } catch {
    return rejectWithValue("Login failed");
  }
});

// Register
export const registerUser = createAsyncThunk<
  { user: User; token: string },
  {
    name: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    role: "user";
  },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const usersRes = await authApi.get<User[]>("/users");

    if (usersRes.data.find((u) => u.email === userData.email)) {
      return rejectWithValue("Email already registered");
    }

    const res = await authApi.post<User>("/users", userData);

    return { user: res.data, token: "fake-jwt-token" };
  } catch {
    return rejectWithValue("Registration failed");
  }
});

// Reset password
export const resetPassword = createAsyncThunk<
  User,
  { newPassword: string },
  { rejectValue: string; state: { auth: AuthState } }
>(
  "auth/resetPassword",
  async ({ newPassword }, { rejectWithValue, getState }) => {
    try {
      const { resetEmail, otpVerified } = getState().auth;

      if (!resetEmail || !otpVerified) return rejectWithValue("Unauthorized request");

      const res = await authApi.get<User[]>(`/users?email=${resetEmail}`);
      if (!res.data.length) return rejectWithValue("User not found");

      const user = res.data[0];

      const updatedUser = await authApi.put<User>(`/users/${user.id}`, {
        ...user,
        password: newPassword,
      });

      return updatedUser.data;
    } catch {
      return rejectWithValue("Failed to reset password");
    }
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk<
  User,
  { id: string; name: string; email: string; phone: string; country: string },
  { rejectValue: string; state: { auth: AuthState } }
>(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      if (!user) return rejectWithValue("User not found");

      if (userData.email !== user.email) {
        const usersRes = await authApi.get<User[]>(`/users?email=${userData.email}`);
        if (usersRes.data.length > 0) {
          return rejectWithValue("Email already in use");
        }
      }

      const updatedUser = await authApi.put<User>(`/users/${userData.id}`, {
        ...user,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
      });

      return updatedUser.data;
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  }
);

// ---------------- Slice --------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    updateAvatar(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.image = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    clearError(state) {
      state.error = null;
    },
    setResetEmail(state, action: PayloadAction<string>) {
      state.resetEmail = action.payload;
    },
    setOtpVerified(state, action: PayloadAction<boolean>) {
      state.otpVerified = action.payload;
    },
    clearResetData(state) {
      state.resetEmail = null;
      state.otpVerified = false;
      state.error = null;
    },
    updateUserLocally(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Registration failed";
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetEmail = null;
        state.otpVerified = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to reset password";
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to update profile";
      });
  },
});

export const { logout, clearError, setResetEmail, setOtpVerified, clearResetData, updateUserLocally, updateAvatar } = authSlice.actions;
export default authSlice.reducer;
