import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  contracts: [],
  contractDetails: null,
  contractForm: {
    currentStep: 4,
    headerDetails: {},
    contractItems: [],
    isDirty: false,
  },
  pagination: {
    
  },
  filters: {
    
  },
  selectedContract: null,
};

const backToBackSlice = createSlice({
  name: "backToBack",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setContracts: (state, action) => {
      state.contracts = action.payload;
    },
    setContractDetails: (state, action) => {
      state.contractDetails = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.contractForm.currentStep = action.payload;
    },
    setHeaderDetails: (state, action) => {
      state.contractForm.headerDetails = { ...state.contractForm.headerDetails, ...action.payload };
      state.contractForm.isDirty = true;
    },
    setContractItems: (state, action) => {
      state.contractForm.contractItems = action.payload;
      state.contractForm.isDirty = true;
    },
    addContractItem: (state, action) => {
      state.contractForm.contractItems.push(action.payload);
      state.contractForm.isDirty = true;
    },
    updateContractItem: (state, action) => {
      const { index, data } = action.payload;
      state.contractForm.contractItems[index] = { ...state.contractForm.contractItems[index], ...data };
      state.contractForm.isDirty = true;
    },
    removeContractItem: (state, action) => {
      state.contractForm.contractItems.splice(action.payload, 1);
      state.contractForm.isDirty = true;
    },
    setFormDirty: (state, action) => {
      state.contractForm.isDirty = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedContract: (state, action) => {
      state.selectedContract = action.payload;
    },
    resetContractForm: (state) => {
      state.contractForm = initialState.contractForm;
    },
    resetBackToBack: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setContracts,
  setContractDetails,
  setCurrentStep,
  setHeaderDetails,
  setContractItems,
  addContractItem,
  updateContractItem,
  removeContractItem,
  setFormDirty,
  setPagination,
  setFilters,
  setSelectedContract,
  resetContractForm,
  resetBackToBack,
} = backToBackSlice.actions;

export default backToBackSlice.reducer;
