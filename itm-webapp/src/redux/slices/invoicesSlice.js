import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  invoices: [],
  invoiceDetails: null,
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
  selectedInvoice: null,
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setInvoiceDetails: (state, action) => {
      state.invoiceDetails = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    resetInvoices: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setInvoices,
  setInvoiceDetails,
  setPagination,
  setFilters,
  setSelectedInvoice,
  resetInvoices,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
