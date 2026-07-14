import React, { useEffect, useState } from "react";
import {
  Paper,
  Stack,
  styled,
  Typography,
  Box,
  Grid,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Refresh } from "@cw/rds/icons";
import { useDispatch } from "react-redux";
import { DateRangePicker } from "rsuite";
import { addDays, format } from "date-fns";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import fnServiceRequest from "../../utility/fnServiceRequest";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import {
  buildFilterQS,
  formatDateToMMDDYYYY,
} from "./dashboardUtils";
import { useSelector } from "react-redux";
import { customDateTimeFormat } from "../../utility/customDateTimeFormat";
const gridResponsiveConfig = {
  xs: 12,
  sm: 6,
  md: 3,
  lg: 3,
  xl: 3,
};

const CustomKpiCard = styled(Paper)(({ bgColor }) => ({
  borderRadius: "10px",
  minHeight: "80px",
  maxHeight: "80px",
  height: "100%",
  width: "100%",
  cursor: "pointer",
  backgroundColor: bgColor,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 16px",
  boxSizing: "border-box",
}));

const KpiIconBox = styled(Box)`
  background-color: #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function formatKpiValue(value, type) {
  if (value === null || value === undefined) return "-";

  if (
    type === "salesOrders" ||
    type === "revenue" ||
    type === "serverUptime"
  ) {
    if (!isNaN(parseFloat(value))) {
      const numValue = parseFloat(value);

      return `${numValue.toFixed(2)}%`;
    }

    return "-";
  }

  if (type === "shippedUnits") {
    return value ? `${value} secs` : "-";
  }

  if (type === "processing") {
    return value ? `${value} hours` : "-";
  }

  return value;
}

const Kpi = ({
  dateRange,
  setDateRange,
  setLoading,
  onRefresh,
  selectedCountryCode,
  selectedSalesOrg,
  selectedCountryName,
  countries = [],
  salesOrgs = [],
  onCountryChange,
  onSalesOrgChange,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const theme = useTheme();

  // Accordion open/close state
  const [kpiExpanded, setKpiExpanded] = useState(false);

  const [kpiData, setKpiData] = useState({
    salesOrders: "-",
    revenue: "-",
    shippedUnits: "-",
    serverUptime: "-",
    processing: "-",
  });

  const dispatch = useDispatch();
  const appSettings = useSelector((state) => state.appReducer.appSettings);
  const predefinedRanges = [
    {
      label: "Today",
      value: [new Date(), new Date()],
      placement: "left",
    },
    {
      label: "Yesterday",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)],
      placement: "left",
    },
    {
      label: "Last 7 Days",
      value: [addDays(new Date(), -7), new Date()],
      placement: "left",
    },
    {
      label: "Last 30 Days",
      value: [addDays(new Date(), -30), new Date()],
      placement: "left",
    },
  ];

  const KpiTemplate = [
    {
      key: "kpi1",
      title: t("Automation Success Rate"),
      type: "salesOrders",
      icon: TaskOutlinedIcon,
      bgColor: "#ede3fa",
      iconColor: "#6835ab",
      tooltip:
        "Formula: (Total Sales Orders Created Automatically / Total Purchase Orders Received) * 100",
    },
    {
      key: "kpi2",
      title: t("Order Exception Rate"),
      type: "revenue",
      icon: TrendingDownIcon,
      bgColor: "#FFEBEE",
      iconColor: "#ad3648",
      tooltip:
        "Formula: (Total Purchase Orders Requiring Manual Review / Total Purchase Orders Received) * 100",
    },
    {
      key: "kpi3",
      title: t("Average PO Processing Time"),
      type: "shippedUnits",
      icon: TimerIcon,
      bgColor: "#FFF9C4",
      iconColor: "#ada137",
      tooltip:
        "Formula: Total Time Taken to Process All Orders / Total Orders Processed",
    },
    {
      key: "kpi4",
      title: t("Total POs Processed"),
      type: "totalPo",
      icon: CheckCircleOutlineIcon,
      bgColor: "#C8E6C9",
      iconColor: "#37ad3b",
      tooltip:
        "Formula: Total no of PO present in workbench + Total PO in unprocessed folder",
    },
  ];

  const fetchKpiData = () => {
    setLoading(true);

    const [startDate, endDate] = dateRange;

    const formattedStartDate =
      formatDateToMMDDYYYY(startDate);

    const formattedEndDate =
      formatDateToMMDDYYYY(endDate);

    const filterQS = buildFilterQS(
      selectedCountryCode,
      selectedSalesOrg
    );

    const apis = [
      {
        url: `/JavaServices_Oauth2/api/dashboard/getAutomationSuccessRate?startDate=${formattedStartDate}&endDate=${formattedEndDate}${filterQS}`,
        key: "salesOrders",
        transform: (response) => {
          if (
            response.status === "SUCCESS" &&
            response.data
          ) {
            return response.data.replace("%", "");
          }

          return null;
        },
      },
      {
        url: `/JavaServices_Oauth2/api/dashboard/getExceptionRate?startDate=${formattedStartDate}&endDate=${formattedEndDate}${filterQS}`,
        key: "revenue",
        transform: (response) => {
          if (
            response.status === "SUCCESS" &&
            response.data
          ) {
            return response.data.replace("%", "");
          }

          return null;
        },
      },
      {
        url: `/JavaServices_Oauth2/api/dashboard/getAvgProcessingTime?startDate=${formattedStartDate}&endDate=${formattedEndDate}${filterQS}`,
        key: "shippedUnits",
        transform: (response) => {
          if (
            response?.status === "SUCCESS" &&
            response?.data != null
          ) {
            const n = parseFloat(
              String(response.data)
            );

            return Number.isFinite(n)
              ? Math.round(n)
              : null;
          }

          return null;
        },
      },
      {
        url: `/JavaServices_Oauth2/api/dashboard/getTotalProcessed?startDate=${formattedStartDate}&endDate=${formattedEndDate}${filterQS}`,
        key: "totalPo",
        transform: (response) => {
          if (
            response.status === "SUCCESS" &&
            response.data
          ) {
            return String(response?.data);
          }

          return null;
        },
      },
    ];

    const promises = apis.map(
      (api) =>
        new Promise((resolve) => {
          fnServiceRequest(
            api.url,
            "GET",
            (response) =>
              resolve({
                key: api.key,
                value: api.transform
                  ? api.transform(response)
                  : response,
              }),
            () => {
              resolve({
                key: api.key,
                value: null,
              });
            }
          );
        })
    );

    Promise.all(promises).then((results) => {
      const newKpiData = {};

      results.forEach(({ key, value }) => {
        newKpiData[key] = value;
      });

      setKpiData(newKpiData);

      setLoading(false);
    });
  };

  useEffect(() => {
    if (
      !(
        dateRange &&
        dateRange[0] &&
        dateRange[1]
      )
    ) {
      return;
    }

    fetchKpiData();
  }, [dateRange, selectedSalesOrg]);

  const handleDateRangeChange = (
    newDateRange
  ) => {
    setDateRange(newDateRange);
  };

  const handleClickOpen = (kpiType) => {
    console.log(kpiType);
  };
  const convertMomentToDateFns = (format) => {
    if (!format) return "MM/dd/yyyy";

    return format
      .replace(/YYYY/g, "yyyy")
      .replace(/DD/g, "dd")
      .replace(/A/g, "a");
  };
  const safeFormat = convertMomentToDateFns(appSettings?.dateFormat);

  // ── Shared pieces — filters + cards, used in both desktop and mobile ──

  const filterRow = (
    <>
      <FormControl
        size="small"
        sx={{
          width: {
            xs: "100%",
            sm: 150,
          },
          "& .MuiInputBase-root": {
            height: 40,
          },
        }}
      >
        <Select
          displayEmpty
          value={selectedCountryName ?? ""}
          onChange={(e) => onCountryChange?.(e.target.value)}
        >
          <MenuItem value={"All"}>All Countries</MenuItem>
          {countries?.map?.((c, i) => (
            <MenuItem key={i} value={c.countryName}>
              {c.countryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          width: {
            xs: "100%",
            sm: 150,
          },
          "& .MuiInputBase-root": {
            height: 40,
          },
        }}
      >
        <Select
          displayEmpty
          value={selectedSalesOrg ?? ""}
          disabled={!selectedCountryName || selectedCountryName === "All"}
          onChange={(e) => onSalesOrgChange?.(e.target.value)}
        >
          <MenuItem value={"All"}>All Sales Orgs</MenuItem>
          {salesOrgs?.map?.((o, i) => (
            <MenuItem key={i} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "auto",
          },
          "& .rs-picker-toggle": {
            height: "40px !important",
            display: "flex",
            alignItems: "center",
            borderRadius: "4px",
          },
          "& .rs-picker-toggle-textbox": {
            height: "40px !important",
          },
          "& .rs-picker-input-group": {
            height: "40px",
          },
          "& .rs-picker-toggle-value": {
            display: "flex",
            alignItems: "center",
            height: "100%",
            fontSize: "13px",
          },
        }}
      >
        <DateRangePicker
          className="custom-date-picker"
          value={dateRange}
          onChange={handleDateRangeChange}
          ranges={predefinedRanges}
          showOneCalendar
          placement="bottomEnd"
          format={safeFormat}
          renderValue={(value) =>
            value && value.length === 2
              ? `${format(value[0], safeFormat)} ~ ${format(value[1], safeFormat)}`
              : ""
          }
        />
      </Box>

      <Tooltip title="Reset dashboard">
        <IconButton
          size="small"
          onClick={onRefresh}
          sx={{
            p: 0,
            width: 32,
            height: 32,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.text.primary,
          }}
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );

  const kpiCards = (
    <Grid container spacing={1.5} alignItems="stretch">
      {KpiTemplate?.map((item, index) => (
        <Grid item {...gridResponsiveConfig} key={item.key ?? index}>
          <Tooltip title={item.tooltip} arrow placement="bottom">
            <div>
              <CustomKpiCard
                onClick={() => handleClickOpen(item?.type ?? "")}
                bgColor={item.bgColor}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    height: "100%",
                    width: "100%",
                    gap: 2,
                  }}
                >
                  <Stack
                    sx={{
                      textAlign: "left",
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      component={"span"}
                      sx={{
                        fontSize: "14px",
                        color: "black",
                        fontWeight: 400,
                        lineHeight: "18px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item?.title ?? "-"}
                    </Typography>

                    <Typography
                      component={"span"}
                      sx={{
                        fontSize: "20px",
                        color: "#591c8a",
                        fontWeight: 400,
                      }}
                    >
                      {formatKpiValue(kpiData?.[item.type], item.type)}
                    </Typography>
                  </Stack>

                  <KpiIconBox>
                    {item.icon &&
                      React.createElement(item.icon, {
                        style: {
                          color: item.iconColor,
                          fontSize: "25px",
                        },
                      })}
                  </KpiIconBox>
                </Stack>
              </CustomKpiCard>
            </div>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {/*
        ── DESKTOP (md+) ─────────────────────────────────────────────
        Exact original flat layout — h4 + inline filter Stack + Grid.
        Hidden below md via sx on each child.
      */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          gap: 1,
          mb: 0.5,
        }}
      >
        <Stack
          display={"flex"}
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent={"space-between"}
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          spacing={1.5}
        >
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "left",
              padding: "2px 0px",
              color: theme.palette.primary.main,
              fontFamily: "'Roboto', sans-serif",
              margin: 0,
            }}
          >
            {t("Overall Processing Summary")}
          </h4>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
            justifyContent={"flex-end"}
            spacing={1}
            width={{
              xs: "100%",
              md: "auto",
            }}
          >
            {filterRow}
          </Stack>
        </Stack>

        {kpiCards}
      </Box>

      {/*
        ── MOBILE / TABLET (xs → below md) ──────────────────────────
        Accordion collapsed by default — user expands to see filters+KPIs.
      */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 0.5 }}>
        <Accordion
          expanded={kpiExpanded}
          onChange={() => setKpiExpanded((prev) => !prev)}
          disableGutters
          sx={{
            boxShadow: "0px 4px 6px -4px rgba(200, 205, 235, 0.9)",
            border: "1px solid #c4c4c4",
            borderRadius: "6px !important",
            backgroundColor: "#ffffff",
            mb: 1,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              minHeight: "40px",
              backgroundColor: "#E6E8F5",
              padding: "5px 10px",
              borderBottom: kpiExpanded ? "1px solid #c4c4c4" : "none",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "13px",
                color: "#000000DE",
              }}
            >
              {t("Overall Processing Summary")}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 2, backgroundColor: "#ffffff" }}>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              alignItems={{
                xs: "stretch",
                sm: "center",
              }}
              justifyContent={"flex-end"}
              spacing={1}
              width={"100%"}
              mb={2}
            >
              {filterRow}
            </Stack>

            {kpiCards}
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default Kpi;