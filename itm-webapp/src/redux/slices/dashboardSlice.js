import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  dashboardData: null,
  metrics: {
    totalContracts: 0,
    activeContracts: 0,
    pendingOrders: 0,
    completedOrders: 0,
  },
  recentActivity: [],
  filters: {
    dateRange: "last30days",
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setMetrics: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    setRecentActivity: (state, action) => {
      state.recentActivity = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetDashboard: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setDashboardData,
  setMetrics,
  setRecentActivity,
  setFilters,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
