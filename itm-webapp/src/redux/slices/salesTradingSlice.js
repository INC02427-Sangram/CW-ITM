import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  trades: [],
  tradeDetails: null,
  pagination: {
    page: 0,
    pageSize: 10,
    totalCount: 0,
  },
  filters: {
    status: "all",
    dateRange: null,
    customer: null,
    searchQuery: "",
  },
  selectedTrade: null,
};

const salesTradingSlice = createSlice({
  name: "salesTrading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTrades: (state, action) => {
      state.trades = action.payload;
    },
    setTradeDetails: (state, action) => {
      state.tradeDetails = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedTrade: (state, action) => {
      state.selectedTrade = action.payload;
    },
    resetSalesTrading: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setTrades,
  setTradeDetails,
  setPagination,
  setFilters,
  setSelectedTrade,
  resetSalesTrading,
} = salesTradingSlice.actions;

export default salesTradingSlice.reducer;
