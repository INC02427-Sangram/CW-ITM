import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Button, Grid, Box } from "@mui/material";
import zoomPlugin from "chartjs-plugin-zoom";
import { useTranslation } from "react-i18next";
import { adaptDataForType, filterChartData } from "./dashboardUtils";
import { styles } from "./dashboardStyles";
import { buildChartOptions } from "./dashboardChartOptions";
import { DownloadMenu, ChartSelector, Chart, ChartPopover } from "./DashboardChartComponents";
import { useDashboardData } from "./useDashboardData";

const gridResponsiveConfig = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
  xl: 6,
};

const fullWidthGridConfig = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
};

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, zoomPlugin, LineElement, PointElement);


const GraphComponent = ({ dateRange, setLoading, selectedCountryCode, selectedSalesOrg }) => {
  const { t } = useTranslation();
  const [totalSalesPeriod, setTotalSalesPeriod] = useState(6);
  const [chartTypes, setChartTypes] = useState({
    chart1: "bar", chart2: "pie", chart3: "donut", chart4: "bar", chart5: "bar",
    chart6: "donut", chart7: "line", chart8: "line", chart9: "table", chart10: "bar",
  });

  const chartRefs = {
    chart1: useRef(null), chart2: useRef(null), chart3: useRef(null), chart4: useRef(null), chart5: useRef(null),
    chart6: useRef(null), chart7: useRef(null), chart8: useRef(null), chart9: useRef(null), chart10: useRef(null),
  };

  const { isLoading, chartData, fetchCustomerPOData, fetchTopItemQuantityData, fetchBottomItemQuantityData, fetchAgeOfPoData } = useDashboardData(
    dateRange,
    selectedCountryCode,
    selectedSalesOrg,
    totalSalesPeriod
  );

  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [bottomItemSearchTerm, setBottomItemSearchTerm] = useState("");
  const [customerPoDataFiltered, setCustomerPoDataFiltered] = useState(null);
  const [itemQuantityDataFiltered, setItemQuantityDataFiltered] = useState(null);
  const [bottomItemQuantityDataFiltered, setBottomItemQuantityDataFiltered] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElItem, setAnchorElItem] = useState(null);
  const [anchorElBottomItem, setAnchorElBottomItem] = useState(null);
  const [anchorElAge, setAnchorElAge] = useState(null);

  useEffect(() => {
    setLoading(Object.values(isLoading).some((v) => v));
  }, [isLoading, setLoading]);

  useEffect(() => {
    setCustomerPoDataFiltered(chartData.originalCustomerPo ? filterChartData(chartData.originalCustomerPo, customerSearchTerm) : chartData.customerPo);
  }, [customerSearchTerm, chartData.originalCustomerPo, chartData.customerPo]);

  useEffect(() => {
    setItemQuantityDataFiltered(chartData.originalItemQuantity ? filterChartData(chartData.originalItemQuantity, itemSearchTerm) : chartData.itemQuantity);
  }, [itemSearchTerm, chartData.originalItemQuantity, chartData.itemQuantity]);

  useEffect(() => {
    setBottomItemQuantityDataFiltered(chartData.originalBottomItemQuantity ? filterChartData(chartData.originalBottomItemQuantity, bottomItemSearchTerm) : chartData.bottomItemQuantity);
  }, [bottomItemSearchTerm, chartData.originalBottomItemQuantity, chartData.bottomItemQuantity]);

  const data = {
    chart1: customerPoDataFiltered,
    chart2: chartData.businessException,
    chart3: chartData.emailProcessing,
    chart4: chartData.orderTypes,
    chart5: chartData.poStatus,
    chart6: chartData.pdfNonPdf,
    chart7: itemQuantityDataFiltered,
    chart8: bottomItemQuantityDataFiltered,
    chart9: chartData.ageOfPo,
    chart10: chartData.totalSales,
  };

  const chartTitles = {
    chart1: t("Top 10 Customers Based on Processed POs"),
    chart2: t("Business Exceptions"),
    chart3: t("Email Processing Status"),
    chart4: t("Types Of Order Types in POs"),
    chart5: t("PO Status Summary"),
    chart6: t("Format Of POs"),
    chart7: t("Top 10 Items by Quantity"),
    chart8: t("Bottom 10 Items by Quantity"),
    chart9: t("PO Aging (Days)"),
    chart10: t("Sales Order Revenue Over Period"),
  };

  const popoverTitles = {
    chart1: t("All Customer POs"),
    chart7: t("Top 25 Items by Quantity"),
    chart8: t("Bottom 25 Items by Quantity"),
    chart9: t("All POs with Age (Days)"),
  };

  const popoverData = {
    chart1: chartData.allCustomerPo,
    chart7: chartData.allItemQuantity,
    chart8: chartData.allBottomItemQuantity,
    chart9: chartData.allAgeOfPo,
  };

  const popoverState = {
    chart1: { open: Boolean(anchorEl), onClose: () => setAnchorEl(null) },
    chart7: { open: Boolean(anchorElItem), onClose: () => setAnchorElItem(null) },
    chart8: { open: Boolean(anchorElBottomItem), onClose: () => setAnchorElBottomItem(null) },
    chart9: { open: Boolean(anchorElAge), onClose: () => setAnchorElAge(null) },
  };

  return (
    <Grid container spacing={3} width="100%">
      {Object.keys(data).map((chartKey) => (
        <Grid item key={chartKey} {...(chartKey === "chart7" || chartKey === "chart8" ? fullWidthGridConfig : gridResponsiveConfig)}>
          <Box sx={styles.box}>
            <Box sx={styles.headingRow}>
              <h3 style={styles.heading}>
                {chartTitles[chartKey]}
              </h3>

              <Box sx={styles.headingActions}>
                <ChartSelector
                  inline
                  chartType={chartTypes[chartKey]}
                  onChangeChartType={(type) =>
                    setChartTypes((prev) => ({
                      ...prev,
                      [chartKey]: type,
                    }))
                  }
                />

                <DownloadMenu
                  chartRef={chartRefs[chartKey]}
                  data={data[chartKey]}
                  filename={chartTitles[chartKey]
                    .replace(/\s+/g, "_")
                    .toLowerCase()}
                />
              </Box>
            </Box>

            <Box sx={styles.toolbarRow}>
              <Box sx={styles.toolbarLeft}>
                {chartKey === "chart1" && <Button variant="outlined" size="small" onClick={(e) => { setAnchorEl(e.currentTarget); fetchCustomerPOData(true); }}>{t("Show All")}</Button>}
                {chartKey === "chart7" && <Button variant="outlined" size="small" onClick={(e) => { setAnchorElItem(e.currentTarget); fetchTopItemQuantityData(true, 25); }}>{t("Top 25")}</Button>}
                {chartKey === "chart8" && <Button variant="outlined" size="small" onClick={(e) => { setAnchorElBottomItem(e.currentTarget); fetchBottomItemQuantityData(25); }}>{t("Bottom 25")}</Button>}
                {chartKey === "chart9" && <Button variant="outlined" size="small" onClick={(e) => { setAnchorElAge(e.currentTarget); fetchAgeOfPoData(true); }}>{t("Show All")}</Button>}
                {chartKey === "chart10" && (
                  <Box sx={styles.salesPeriodSelector}>
                    <select value={totalSalesPeriod} onChange={(e) => setTotalSalesPeriod(Number(e.target.value))} style={styles.selectInput}>
                      <option value={6}>Last 6 Months</option>
                      <option value={12}>Last 12 Months</option>
                    </select>
                  </Box>
                )}
              </Box>
              <Box sx={styles.toolbarRight}>
                {chartKey === "chart1" && (
                  <Box sx={styles.searchContainer}>
                    <input type="text" placeholder={t("Search customers")} value={customerSearchTerm} onChange={(e) => setCustomerSearchTerm(e.target.value)} style={styles.searchInput} />
                  </Box>
                )}
                {chartKey === "chart7" && (
                  <Box sx={styles.searchContainer}>
                    <input type="text" placeholder={t("Search ...")} value={itemSearchTerm} onChange={(e) => setItemSearchTerm(e.target.value)} style={styles.searchInput} />
                  </Box>
                )}
                {chartKey === "chart8" && (
                  <Box sx={styles.searchContainer}>
                    <input type="text" placeholder={t("Search ...")} value={bottomItemSearchTerm} onChange={(e) => setBottomItemSearchTerm(e.target.value)} style={styles.searchInput} />
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={styles.pieContainer}>
              <Chart data={adaptDataForType(chartTypes[chartKey], data[chartKey])} options={buildChartOptions(chartKey, chartTypes[chartKey])} chartType={chartTypes[chartKey]} chartRef={chartRefs[chartKey]} allowZeroValues={chartKey === "chart9"} />
            </Box>

            {popoverState[chartKey] && (
              <ChartPopover
                open={popoverState[chartKey].open}
                onClose={popoverState[chartKey].onClose}
                title={popoverTitles[chartKey]}
                data={adaptDataForType(chartTypes[chartKey], popoverData[chartKey])}
                options={buildChartOptions(chartKey, chartTypes[chartKey])}
                chart Type={chartTypes[chartKey]}
                chartRef={chartRefs[chartKey]}
              />
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default GraphComponent;