import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  users: [],
  roles: [],
  permissions: [],
  systemSettings: {},
  auditLogs: [],
  pagination: {
    page: 0,
    pageSize: 10,
    totalCount: 0,
  },
  filters: {
    searchQuery: "",
    role: null,
    dateRange: null,
  },
};

const adminConsoleSlice = createSlice({
  name: "adminConsole",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    setSystemSettings: (state, action) => {
      state.systemSettings = { ...state.systemSettings, ...action.payload };
    },
    setAuditLogs: (state, action) => {
      state.auditLogs = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetAdminConsole: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setUsers,
  setRoles,
  setPermissions,
  setSystemSettings,
  setAuditLogs,
  setPagination,
  setFilters,
  resetAdminConsole,
} = adminConsoleSlice.actions;

export default adminConsoleSlice.reducer;
