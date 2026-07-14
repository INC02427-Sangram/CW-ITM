import { createSlice } from "@reduxjs/toolkit";

// ---------- load persisted values (safe-parse) ----------
const loadPalette = () => {
  try {
    const raw = localStorage.getItem("userPalette");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const loadMode = () => localStorage.getItem("themeMode") || "light";

//Reducer for the COM application. All global params
export const appReducer = createSlice({
  name: "appReducer",
  initialState: {
    userDetails: {}, // to capture the details of user when user signs into application
    currentModule: "",
    previousModule: null,

    oCurrentPayload: {
      filterData: {
        createdDateFrom: "",
        createdDateTo: "",
        customerId: "",
        exceptionType: [],
        poNumber: "",
        salesGroup: "",
        salesOffice: "",
        isRushOrder: "",
        salesOrg: [],
        status: "",
        orderHeaderId: "",
        sapOrderId: "",
        orderType: "",
        distChannel: "",
        senderEmail: "",
        country: "",
      },
      pageNumber: 1,
      pageSize: 50,
    },

    aSmartOrderList: [],
    totalRecords: 0,
    listPage: 0,
    shouldRefetchLineItems: true,
    lineItemList: [],
    salesItemdata: {},
    status: null,
    exceptionScreenFlag: false,
    themeMode: loadMode(),
    userPalette: loadPalette(),
    fileUploadMessage: {
      visiblity: false,
      message: "",
      type: "",
    },
    busyIndicatorForAdminConsole: false,
    allCustomers: [],
    messagePopoverVisibility: false,
    messagePopoverStatus: {
      status: null,
      orderId: null,
    },
    busyIndicatorForDetailScreen: false,
    manualScreenDetails: {},
    messageToastForInvalidLineItem: {
      visiblity: false,
      message: null,
    },
    messageToastForAdminConsole: {
      visiblity: false,
      message: null,
      type: null,
    },
    distributionChannelList: [],
    filterOptions: {
      createdDateFrom: "",
      createdDateTo: "",
      customerId: "",
      exceptionType: [],
      poNumber: "",
      salesGroup: "",
      salesOffice: "",
      isRushOrder: "",
      salesOrg: [],
      status: "",
      orderHeaderId: "",
      sapOrderId: "",
      orderType: "",
      distChannel: "",
      senderEmail: "",
      country: "",
    },
    salesOrderDetails: {},
    poDetails: {},
    additionalDetails: {},
    headerInfo: {},
    viewDocumentServiceResponse: {},
    userRoles: [],
    deletedItems: [],
    multipleCustomerOption: 0,
    currentCountry: null,
    language: "E",
    salesOrgListSet: [],
    currentSalesOrg: null,
    // currentSalesOrg: "*",
    countrySetSet: [],
    salesOrgFilterValue: {},
    salesOrgObject: {},
    aCurrentColumnsList: [],
    userEmailId: "",
    concurrentUserData: {},
    columnCustomization: {
      visibleColumns: [], // to store the columns that are currently visible
      hiddenColumns: [], // to store the columns that are hidden
    },
    soColumnList: [],
    detailColumnList: [],
    yPosition: 0,
    clickedIndex: "",
    selectedStatusTab: 0, // Add this new state
    dateRange: [new Date(), new Date()], // Add this new state
    availableLanguages: [],
    translations: {},
    // Access map controlling module visibility from backend
    moduleAccess: {},
    appSettings: {
      //dateFormat: "DD MMM YYYY",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "hh:mm:ss A",
      range: 25,
      defaultModule: "/salesOrder",
      language: "en",
    },
    userList: [], 
    groupList: [],
    workflowTaskDetails: null,
    dataLevelAccess: [],
    orgCache: {
      countries: [],
      salesOrgs: {},
      distributionChannels: {},
      divisions: {},
    },
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setGroupList: (state, action) => {
      state.groupList = action.payload;
    },
    setCurrentModule: (state, action) => {
      state.previousModule = state.currentModule;
      state.currentModule = action.payload;
    },
    setCurrentPayload: (state, action) => {
      const currentPageNumber = state.oCurrentPayload.pageNumber;
      console.log("currentPageNumber:", currentPageNumber);
     
      // Check if this is a filter operation (which should reset page to 1)
      // Only reset page if filterData is explicitly provided AND pageNumber is not provided
      // This allows pagination changes to work even when filterData exists
      const isFilterOperation = action.payload.filterData !== undefined && action.payload.pageNumber === undefined;
     
      console.log("setCurrentPayload called:", {
        action: action.payload,
        currentPageNumber,
        isFilterOperation,
        willSetPageTo: isFilterOperation ? 1 : (action.payload.pageNumber !== undefined ? action.payload.pageNumber : currentPageNumber)
      });
     
      state.oCurrentPayload = {
        ...state.oCurrentPayload,
        ...action.payload,
        // Only reset page to 1 for actual filter operations, otherwise preserve current page
        pageNumber: isFilterOperation
          ? 1
          : (action.payload.pageNumber !== undefined
              ? action.payload.pageNumber
              : currentPageNumber)
      };
      // If pageSize is changing, update it in the state
      if (
        action.payload.pageSize &&
        state.oCurrentPayload.pageSize !== action.payload.pageSize
      ) {
        state.oCurrentPayload.pageSize = action.payload.pageSize;
      }
    },

    setSmartOrderList: (state, action) => {
      state.aSmartOrderList = action.payload;
    },
    setTotalRecords: (state, action) => {
      state.totalRecords = action.payload;
    },
    setListPage: (state, action) => {
      state.listPage = action.payload;
    },
    setShouldRefetchLineItems: (state, action) => {
      state.shouldRefetchLineItems = action.payload;
    },
    setLineItemList: (state, action) => {
      state.lineItemList = action.payload;
    },
    setSalesItemdata: (state, action) => {
      state.salesItemdata = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setExceptionScreenFlag: (state, action) => {
      state.exceptionScreenFlag = action.payload;
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
      // persist mode
      try {
        localStorage.setItem("themeMode", action.payload);
      } catch {}
    },

    setFileUploadMessage: (state, action) => {
      state.fileUploadMessage = action.payload;
    },
    setBusyIndicatorForAdminConsole: (state, action) => {
      state.busyIndicatorForAdminConsole = action.payload;
    },
    setAllCustomer: (state, action) => {
      state.allCustomers = action.payload;
    },
    // For visibility of submit to sap popover
    setMessagePopoverVisibility: (state, action) => {
      state.messagePopoverVisibility = action.payload;
    },
    // For content of submit to sap popover
    setMessagePopoverStatus: (state, action) => {
      state.messagePopoverStatus = action.payload;
    },

    setMessageToastForInvalidLineItem: (state, action) => {
      state.messageToastForInvalidLineItem = action.payload;
    },
    setMessageToastForAdminConsole: (state, action) => {
      state.messageToastForAdminConsole = action.payload;
    },
    setDistributionChannelList: (state, action) => {
      state.distributionChannelList = action.payload;
    },
    setManualScreenDetails: (state, action) => {
      state.manualScreenDetails = action.payload;
    },
    setFilterOptions: (state, action) => {
      state.filterOptions = action.payload;
    },
    setSalesOrderDetails: (state, action) => {
      state.salesOrderDetails = action.payload;
    },
    setPoDetails: (state, action) => {
      state.poDetails = action.payload;
    },
    setAdditionalDetails: (state, action) => {
      state.additionalDetails = action.payload;
    },
    setHeaderInfo: (state, action) => {
      state.headerInfo = action.payload;
    },
    setviewDocumentServiceResponse: (state, action) => {
      state.viewDocumentServiceResponse = action.payload;
    },
    setUserRoles: (state, action) => {
      state.userRoles = action.payload;
    },
    setModuleAccess: (state, action) => {
      state.moduleAccess = action.payload || {};
    },
    setDeletedItems: (state, action) => {
      state.deletedItems = action.payload;
    },
    setMultipleCustomerOption: (state, action) => {
      state.multipleCustomerOption = action.payload;
    },
    setCurrentCountry: (state, action) => {
      state.currentCountry = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setSalesOrgListSet: (state, action) => {
      state.salesOrgListSet = action.payload;
    },
    setCurrentSalesOrg: (state, action) => {
      state.currentSalesOrg = action.payload;
    },
    setCountrySetSet: (state, action) => {
      state.countrySetSet = action.payload;
    },
    setSalesOrgFilterValue: (state, action) => {
      state.salesOrgFilterValue = action.payload;
    },
    setBusyIndicatorForDetailScreen: (state, action) => {
      state.busyIndicatorForDetailScreen = action.payload;
    },
    setSalesOrgObject: (state, action) => {
      state.salesOrgObject = action.payload;
    },
    setCurrentColumnsList: (state, action) => {
      state.aCurrentColumnsList = action.payload;
    },
    setUserEmailId: (state, action) => {
      state.userEmailId = action.payload;
    },
    setConcurrentUserData: (state, action) => {
      state.concurrentUserData = action.payload;
    },
    setVisibleColumns: (state, action) => {
      state.columnCustomization.visibleColumns = action.payload;
    },
    setHiddenColumns: (state, action) => {
      state.columnCustomization.hiddenColumns = action.payload;
    },
    resetColumnCustomization: (state) => {
      state.columnCustomization.visibleColumns = [];
      state.columnCustomization.hiddenColumns = [];
    },
    setSoColumnList: (state, action) => {
      state.soColumnList = action.payload;
      localStorage.setItem("soColumnList", JSON.stringify(action.payload));
    },
    setDetailColumnList: (state, action) => {
      state.detailColumnList = action.payload;
      localStorage.setItem("detailColumnList", JSON.stringify(action.payload));
    },
    setScrollPosition: (state, action) => {
      state.yPosition = action.payload;
    },
    setClickedIndex: (state, action) => {
      state.clickedIndex = action.payload;
    },
    setSelectedStatusTab: (state, action) => {
      state.selectedStatusTab = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setAvailableLanguages: (state, action) => {
      state.availableLanguages = action.payload;
    },
    setTranslations: (state, action) => {
      state.translations = action.payload;
    },
    appSettingsUpdate: (state, action) => {
      if (!action.payload) return;
      const { dateFormat, timeFormat, range, defaultModule, language } =
        action.payload;

      if (dateFormat !== undefined) {
        state.appSettings.dateFormat = dateFormat;
      }
      if (timeFormat !== undefined) {
        state.appSettings.timeFormat = timeFormat;
      }
      if (range !== undefined) {
        state.appSettings.range = range;
      }
      if (defaultModule !== undefined) {
        state.appSettings.defaultModule = defaultModule;
      }
      if (language !== undefined) {
        state.appSettings.language = language;
      }
    },
    logoutUser: (state) => {
      state.userDetails = null;
      state.userRoles = [];
    },
    setWorkflowTaskDetails: (state, action) => {
      state.workflowTaskDetails = action.payload;
    },
    setDataLevelAccess: (state, action) => {
      state.dataLevelAccess = action.payload;
    },
    setOrgCountries: (state, action) => {
      state.orgCache.countries = action.payload;
    },
    setOrgSalesOrgs: (state, action) => {
      state.orgCache.salesOrgs[action.payload.key] = action.payload.data;
    },
    setOrgDistChannels: (state, action) => {
      state.orgCache.distributionChannels[action.payload.key] = action.payload.data;
    },
    setOrgDivisions: (state, action) => {
      state.orgCache.divisions[action.payload.key] = action.payload.data;
    },
  },

 extraReducers: (builder) => {
  builder.addCase("PALETTE/UPDATE", (state, action) => {
    state.userPalette = action.payload;
    try {
      if (action.payload) {
        localStorage.setItem("userPalette", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("userPalette");
      }
    } catch {}
  });
},
});

// Action creators are generated for each case reducer function
export const {
  setUserDetails,
  setCurrentModule,
  setCurrentPayload,
  setSmartOrderList,
  setTotalRecords,
  setListPage,
  setShouldRefetchLineItems,
  setLineItemList,
  setSalesItemdata,
  setStatus,
  setExceptionScreenFlag,
  setThemeMode,
  setFileUploadMessage,
  setBusyIndicatorForAdminConsole,
  setAllCustomer,
  setMessagePopoverVisibility,
  setMessagePopoverStatus,
  setCurrentColumnsList,
  setMessageToastForInvalidLineItem,
  setMessageToastForAdminConsole,
  setManualScreenDetails,
  setDistributionChannelList,
  setFilterOptions,
  setHeaderInfo,
  setSalesOrderDetails,
  setPoDetails,
  setAdditionalDetails,
  setviewDocumentServiceResponse,
  setUserRoles,
  setDeletedItems,
  setMultipleCustomerOption,
  setCurrentCountry,
  setLanguage,
  setSalesOrgListSet,
  setCurrentSalesOrg,
  setCountrySetSet,
  setSalesOrgFilterValue,
  setBusyIndicatorForDetailScreen,
  setSalesOrgObject,
  setNetQuantity,
  setNetPrice,
  setUserEmailId,
  setConcurrentUserData,
  setVisibleColumns,
  setHiddenColumns,
  resetColumnCustomization,
  setSoColumnList,
  setDetailColumnList,
  setScrollPosition,
  setClickedIndex,
  setSelectedStatusTab,
  setDateRange,
  setAvailableLanguages,
  setTranslations,
  setModuleAccess,
  appSettingsUpdate,
  logoutUser,
  setUserList,
  setGroupList,
  setWorkflowTaskDetails,
  setDataLevelAccess,
  setOrgCountries,
  setOrgSalesOrgs,
  setOrgDistChannels,
  setOrgDivisions,
} = appReducer.actions;

export default appReducer.reducer;
