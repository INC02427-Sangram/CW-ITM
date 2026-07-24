import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  deliveries: [],
  deliveryDetails: null,
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
  selectedDelivery: null,
};

const outboundDeliverySlice = createSlice({
  name: "outboundDelivery",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDeliveries: (state, action) => {
      state.deliveries = action.payload;
    },
    setDeliveryDetails: (state, action) => {
      state.deliveryDetails = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedDelivery: (state, action) => {
      state.selectedDelivery = action.payload;
    },
    resetOutboundDelivery: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setDeliveries,
  setDeliveryDetails,
  setPagination,
  setFilters,
  setSelectedDelivery,
  resetOutboundDelivery,
} = outboundDeliverySlice.actions;

export default outboundDeliverySlice.reducer;
