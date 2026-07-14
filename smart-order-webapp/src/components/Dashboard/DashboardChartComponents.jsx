import React, { useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Popover,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import NoDataFoundImg from "../../assets/NoDataFound.png";
import { downloadChart } from "./dashboardUtils";
import { styles } from "./dashboardStyles";

export const DownloadMenu = ({
  chartRef,
  data,
  filename,
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] =
    useState(null);

  const handleClick = (event) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () =>
    setAnchorEl(null);

  const handleDownload = (fmt) => {
    downloadChart(
      chartRef,
      data,
      filename,
      fmt
    );

    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          backgroundColor: "white",

          boxShadow:
            "0 1px 3px rgba(0,0,0,0.1)",

          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Download fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 160,

            boxShadow:
              "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        <MenuItem
          onClick={() =>
            handleDownload("png")
          }
        >
          {t("Download PNG")}
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleDownload("excel")
          }
        >
          {t("Download Excel")}
        </MenuItem>
      </Menu>
    </>
  );
};

export const ChartSelector = ({
  chartType,
  onChangeChartType,
  inline = false,
}) => {
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const toggleMenu = () =>
    setIsMenuOpen(!isMenuOpen);

  const selectChartType = (type) => {
    onChangeChartType(type);

    setIsMenuOpen(false);
  };

  return (
    <Box
      sx={
        inline
          ? styles.selectorInline
          : styles.selectorContainer
      }
    >
      <button
        onClick={toggleMenu}
        style={styles.hamburgerButton}
      >
        <div style={styles.hamburgerIcon}>
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
        </div>
      </button>

      {isMenuOpen && (
        <div style={styles.dropdownMenu}>
          {[
            {
              id: "bar",
              label: "Bar Chart",
            },
            {
              id: "pie",
              label: "Pie Chart",
            },
            {
              id: "line",
              label: "Line Chart",
            },
            {
              id: "donut",
              label: "Donut Chart",
            },
            {
              id: "table",
              label: "Table View",
            },
          ].map(({ id, label }) => (
            <div
              key={id}
              style={
                chartType === id
                  ? {
                      ...styles.menuItem,
                      ...styles.activeMenuItem,
                    }
                  : styles.menuItem
              }
              onClick={() =>
                selectChartType(id)
              }
            >
              {t(label)}
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export const TableView = ({ data }) => {
  const { t } = useTranslation();

  if (
    !data?.labels ||
    !data?.datasets?.length
  ) {
    return (
      <div style={styles.noDataContainer}>
        <div style={styles.noDataText}>
          {t("No Data Available")}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>
              {t("Customer")}
            </th>

            <th style={styles.tableHeader}>
              {t("Number of POs")}
            </th>
          </tr>
        </thead>

        <tbody>
          {data.labels.map(
            (label, index) => (
              <tr
                key={index}
                style={
                  index % 2 === 0
                    ? styles.tableRowEven
                    : styles.tableRowOdd
                }
              >
                <td style={styles.tableCell}>
                  {label}
                </td>

                <td style={styles.tableCell}>
                  {
                    data.datasets[0].data[
                      index
                    ]
                  }
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export const Chart = ({
  data,
  options,
  chartType,
  chartRef,
  allowZeroValues = false,
}) => {
  const { t } = useTranslation();

  const chartKey = `${chartType}-${JSON.stringify(
    options
  )}`;

  const isEmptyData =
    !data?.datasets?.length ||
    !data.datasets[0]?.data?.length ||
    (!allowZeroValues && data.datasets[0].data.every(
      (value) => value === 0
    ));

  if (isEmptyData) {
    return (
      <Box
        sx={{
          height: "100%",

          width: "100%",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          textAlign: "center",

          padding: 2,
        }}
      >
        <img
          src={NoDataFoundImg}
          alt="No Data Available"
          style={{
            width: "150px",
            maxWidth: "100%",
            marginBottom: "10px",
          }}
        />

        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#555",
          }}
        >
          {t("No Data Available")}
        </Typography>
      </Box>
    );
  }

  if (chartType === "table") {
    return <TableView data={data} />;
  }

  if (chartType === "bar") {
    return (
      <Bar
        ref={chartRef}
        key={chartKey}
        data={data}
        options={options}
      />
    );
  }

  if (chartType === "line") {
    return (
      <Line
        ref={chartRef}
        key={chartKey}
        data={data}
        options={options}
      />
    );
  }

  return (
    <Pie
      ref={chartRef}
      key={chartKey}
      data={data}
      options={options}
    />
  );
};

export const ChartPopover = ({
  open,
  onClose,
  title,
  data,
  options,
  chartType,
  chartRef,
}) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  if (isMobile) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen
      >
        <Box
          sx={{
            height: "100%",

            width: "100%",

            display: "flex",

            flexDirection: "column",

            padding: 2,

            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",

              fontWeight: 600,

              marginBottom: 2,

              textAlign: "center",
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              flex: 1,

              width: "100%",

              minHeight: 0,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <Chart
              data={data}
              options={options}
              chartType={chartType}
              chartRef={chartRef}
            />
          </Box>
        </Box>
      </Dialog>
    );
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      PaperProps={{
        style: {
          width: "90vw",
          maxWidth: "1000px",

          height: "80vh",

          maxHeight: "700px",

          padding: "20px",

          borderRadius: "12px",

          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",

          width: "100%",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            marginBottom: 2,

            fontSize: "18px",

            fontWeight: 600,

            color: "#333",

            textAlign: "center",
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            width: "100%",

            flex: 1,

            minHeight: 0,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <Chart
            data={data}
            options={options}
            chartType={chartType}
            chartRef={chartRef}
          />
        </Box>
      </Box>
    </Popover>
  );
};