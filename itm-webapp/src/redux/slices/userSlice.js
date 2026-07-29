import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  isAuthenticated: true,
  userInfo: {
    id: "USR-001",
    username: "john.doe",
    email: "john.doe@itm-trading.com",
    firstName: "John",
    lastName: "Doe",
    role: "Trading Manager",
    permissions: [
      "view_contracts",
      "create_contracts",
      "view_orders",
      "create_orders",
      "view_dashboard",
    ],
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  preferences: {
    theme: "light",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setSession: (state, action) => {
      state.session = { ...state.session, ...action.payload };
    },
    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload.userInfo;
      state.session = action.payload.session;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.userInfo = initialState.userInfo;
      state.session = initialState.session;
    },
    updatePermissions: (state, action) => {
      state.userInfo.permissions = action.payload;
    },
    resetUser: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setAuthenticated,
  setUserInfo,
  setPreferences,
  setSession,
  loginUser,
  logoutUser,
  updatePermissions,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
