import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  orders: [],
  orderDetails: null,
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
  selectedOrder: null,
};

const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    resetPurchaseOrders: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setOrders,
  setOrderDetails,
  setPagination,
  setFilters,
  setSelectedOrder,
  resetPurchaseOrders,
} = purchaseOrdersSlice.actions;

export default purchaseOrdersSlice.reducer;
