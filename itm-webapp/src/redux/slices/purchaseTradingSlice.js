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
    supplier: null,
    searchQuery: "",
  },
  selectedTrade: null,
};

const purchaseTradingSlice = createSlice({
  name: "purchaseTrading",
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
    resetPurchaseTrading: () => initialState,
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
  resetPurchaseTrading,
} = purchaseTradingSlice.actions;

export default purchaseTradingSlice.reducer;
