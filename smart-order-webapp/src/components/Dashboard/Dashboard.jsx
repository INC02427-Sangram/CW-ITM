import { Box, styled, Typography } from "@mui/material";
import Kpi from "./Kpi";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import CustomGraphComponent from "./GraphComponent";
import { useTranslation } from "react-i18next";
import { getDateRange } from "../../utility/utilityFunctions";
import { useTheme } from "@mui/material/styles";
import BusyIndicator from "../../utility/BusyIndicator";
import {
  getCountryCodes,
  getSalesOrgs,
} from "../Admin Console/fnAdminConsoleGetAll";

// Outer shell
const MainSection = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "calc(100vh - 64px)",
  overflowX: "hidden",
  overflowY: "hidden",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  WebkitOverflowScrolling: "touch",
}));

// Sticky header area
const StickyHeader = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.default,
  padding: "12px 16px 8px 16px",

  // Small screens: allow scrolling inside expanded accordion/header area
  [theme.breakpoints.down("md")]: {
    maxHeight: "55vh",
    overflowY: "auto",
    overflowX: "hidden",
    WebkitOverflowScrolling: "touch",
  },

  // Desktop: keep normal visible layout
  [theme.breakpoints.up("md")]: {
    overflow: "visible",
    maxHeight: "none",
  },
}));

// Scrollable graph section
const ScrollableContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  WebkitOverflowScrolling: "touch",
  boxSizing: "border-box",
  padding: "0 16px 16px 16px",
}));

const OtcDashboard = () => {
  const theme = useTheme();

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const dispatch = useDispatch();

  const appReducerState = useSelector((state) => state.appReducer);

  const appSettings = useSelector((state) => state.appReducer.appSettings);

  const showModule = appReducerState.sidePanelStatus;

  let range = getDateRange(appSettings.range);

  const [dateRange, setDateRange] = useState([range.startDate, range.endDate]);

  const [kpiLoading, setKpiLoading] = useState(false);

  const [graphLoading, setGraphLoading] = useState(false);

  const isDashboardLoading = kpiLoading || graphLoading;

  const initialRangeRef = useRef([range.startDate, range.endDate]);

  const [refreshKey, setRefreshKey] = useState(0);

  const [countries, setCountries] = useState([]);

  const [salesOrgs, setSalesOrgs] = useState([]);

  const [selectedCountryName, setSelectedCountryName] = useState("All");

  const [selectedCountryId, setSelectedCountryId] = useState("All");

  const [selectedCountryCode, setSelectedCountryCode] = useState("All");

  const [selectedSalesOrg, setSelectedSalesOrg] = useState("All");

  useEffect(() => {
    getCountryCodes({
      onSuccess: (data) => {
        setCountries(() => data || []);
      },

      onError: (err) => console.error("Error fetching countries:", err),

      dispatch,

      setBusy: () => {},
    });
  }, [dispatch]);

  useEffect(() => {
    if (countries.length === 1) {
      const country = countries[0];
      setSelectedCountryName(country.countryName || "All");
      setSelectedCountryId(country.countryId || "All");
      setSelectedCountryCode(country.countryCode || "All");
      handleCountryChange(country.countryName || "All");
      if(salesOrgs.length === 1) {
        setSelectedSalesOrg(salesOrgs[0] || "All");
      }
    }
  }, [countries,salesOrgs]);

  useEffect(() => {
    if (!appSettings?.range) return;

    const range = getDateRange(appSettings.range);

    const newRange = [range.startDate, range.endDate];

    setDateRange(newRange);

    initialRangeRef.current = newRange;
  }, [appSettings.range]);

  const handleCountryChange = (name) => {
    setSelectedCountryName(name || "");

    setSelectedSalesOrg("All");

    setSalesOrgs([]);

    const rec = (countries || []).find((c) => c.countryName === name);
    const cid = rec?.countryId || "All";

    const ccode = rec?.countryCode || "All";
    setSelectedCountryId(cid);

    setSelectedCountryCode(ccode);

    if (cid && cid !== "All") {
         getSalesOrgs({
        countryId: cid,
        onSuccess: (data) => {
          setSalesOrgs(data || []);
        },
        onError: (err) => console.error("Error fetching sales orgs:", err),
        dispatch,
        setBusy: () => {},
      });
    }
  };

  const handleSalesOrgChange = (org) => {
    setSelectedSalesOrg(org || "All");
  };

  const handleRefresh = () => {
    setDateRange(initialRangeRef.current);

    setSelectedCountryName("All");
    setSelectedCountryId("All");
    setSelectedCountryCode("All");
    setSelectedSalesOrg("All");
    setSalesOrgs([]);
    setRefreshKey((k) => k + 1);
  };

  return (
    <MainSection>
      {isDashboardLoading && <BusyIndicator />}

      <StickyHeader>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t("Dashboard")}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 1,
          }}
        >
          {t("This View Displays List of Charts")}
        </Typography>

        <Kpi
          key={refreshKey}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setLoading={setKpiLoading}
          onRefresh={handleRefresh}
          selectedCountryCode={selectedCountryCode}
          selectedSalesOrg={selectedSalesOrg}
          selectedCountryName={selectedCountryName}
          countries={countries}
          salesOrgs={salesOrgs}
          onCountryChange={handleCountryChange}
          onSalesOrgChange={handleSalesOrgChange}
        />
      </StickyHeader>

      <ScrollableContent>
        <CustomGraphComponent
          key={refreshKey}
          dateRange={dateRange}
          setLoading={setGraphLoading}
          selectedCountryCode={selectedCountryCode}
          selectedSalesOrg={selectedSalesOrg}
        />
      </ScrollableContent>
    </MainSection>
  );
};

export default OtcDashboard;
