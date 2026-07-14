import { useState, useEffect } from "react";
import fnServiceRequest from "../../utility/fnServiceRequest";
import {
  applyColorsToDataset,
  formatKey,
  buildFilterQS,
  formatDateToMMDDYYYY,
  filterChartData,
} from "./dashboardUtils";

export const useDashboardData = (dateRange, selectedCountryCode, selectedSalesOrg, totalSalesPeriod) => {
  const getFilterQS = () => buildFilterQS(selectedCountryCode, selectedSalesOrg);

  const [isLoading, setIsLoading] = useState({
    businessExceptions: false,
    customerPO: false,
    pdfNonPdf: false,
    emailProcessing: false,
    itemQuantity: false,
    ageOfPO: false,
    totalSales: false,
  });

  const [chartData, setChartData] = useState({
    businessException: null,
    poStatus: null,
    orderTypes: null,
    pdfNonPdf: null,
    emailProcessing: null,
    totalSales: null,
    customerPo: null,
    originalCustomerPo: null,
    allCustomerPo: null,
    itemQuantity: null,
    originalItemQuantity: null,
    allItemQuantity: null,
    bottomItemQuantity: null,
    originalBottomItemQuantity: null,
    allBottomItemQuantity: null,
    ageOfPo: null,
    allAgeOfPo: null,
  });

  const updateLoading = (key, value) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

  const updateChartData = (key, value) => {
    setChartData((prev) => ({ ...prev, [key]: value }));
  };

  const fetchBusinessExceptions = () => {
    updateLoading("businessExceptions", true);
    const [startDate, endDate] = dateRange;
    const sUrl = `/JavaServices_Oauth2/api/dashboard/getAllException?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        const exceptionData = response.data || {};
        const values = Object.values(exceptionData).map((v) => Number(v || 0));
        if (values.every((v) => v === 0) || !values.length) {
          updateChartData("businessException", null);
        } else {
          const labels = Object.keys(exceptionData);
          updateChartData("businessException", {
            labels,
            datasets: [applyColorsToDataset(labels, { label: "Exceptions", data: values })],
          });
        }
        updateLoading("businessExceptions", false);
      },
      () => {
        updateLoading("businessExceptions", false);
        updateChartData("businessException", null);
      }
    );
  };

  const fetchPoStatusData = () => {
    const [startDate, endDate] = dateRange;
    const sUrl = `/JavaServices_Oauth2/api/dashboard/getPoStatus?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}`;

    fnServiceRequest(sUrl, "GET", (response) => {
      const entries = Object.entries(response?.data || {}).map(([k, v]) => [formatKey(k), Number(v || 0)]);
      const total = entries.reduce((acc, [, val]) => acc + val, 0);
      if (total > 0) {
        const labels = entries.map(([k]) => k);
        const values = entries.map(([, v]) => v);
        updateChartData("poStatus", {
          labels,
          datasets: [applyColorsToDataset(labels, { label: "PO Status", data: values, borderWidth: 1, barThickness: 40 })],
        });
      } else {
        updateChartData("poStatus", null);
      }
    }, () => updateChartData("poStatus", null));
  };

  const fetchCustomerPOData = (showAll = false) => {
    updateLoading("customerPO", true);
    const [startDate, endDate] = dateRange;
    let sUrl = `/JavaServices_Oauth2/api/dashboard/getSoldToNamePO?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}`;
    sUrl += showAll ? `&top=0` : `&top=10`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        if (response.status === "SUCCESS" && response.data?.length) {
          const chartData = {
            labels: response.data.map((item) => item.name),
            datasets: [
              applyColorsToDataset(
                response.data.map((item) => item.name),
                {
                  label: "Number of POs",
                  data: response.data.map((item) => Number(item.count || 0)),
                  borderColor: "transparent",
                  borderWidth: 1,
                  barThickness: 30,
                }
              ),
            ],
          };
          if (showAll) {
            updateChartData("allCustomerPo", chartData);
          } else {
            updateChartData("originalCustomerPo", chartData);
            updateChartData("customerPo", chartData);
          }
        } else {
          updateChartData(showAll ? "allCustomerPo" : "customerPo", null);
          if (!showAll) updateChartData("originalCustomerPo", null);
        }
        updateLoading("customerPO", false);
      },
      () => {
        updateLoading("customerPO", false);
        updateChartData(showAll ? "allCustomerPo" : "customerPo", null);
        if (!showAll) updateChartData("originalCustomerPo", null);
      }
    );
  };

  const fetchPdfNonPdfData = () => {
    updateLoading("pdfNonPdf", true);
    const [startDate, endDate] = dateRange;
    const sUrl = `/JavaServices_Oauth2/api/dashboard/getPdfNonPdfCount?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        const entries = Object.entries(response?.data || {}).map(([k, v]) => [formatKey(k), Number(v || 0)]);
        const filtered = entries.filter(([, val]) => val > 0);
        if (filtered.length && filtered.reduce((acc, [, val]) => acc + val, 0) > 0) {
          updateChartData("pdfNonPdf", {
            labels: filtered.map(([k]) => k),
            datasets: [applyColorsToDataset(filtered.map(([k]) => k), { label: "File Count", data: filtered.map(([, v]) => v) })],
          });
        } else {
          updateChartData("pdfNonPdf", null);
        }
        updateLoading("pdfNonPdf", false);
      },
      () => {
        updateLoading("pdfNonPdf", false);
        updateChartData("pdfNonPdf", null);
      }
    );
  };

  const fetchEmailProcessingData = () => {
    updateLoading("emailProcessing", true);
    const [startDate, endDate] = dateRange;
    const sUrl = `/JavaServices_Oauth2/api/dashboard/getEmailProcessedUnprocessedCount?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        if (response.status === "SUCCESS" && (response.data?.["Processed Folder Count"] > 0 || response.data?.["UnProcessed Folder Count"] > 0)) {
          const labels = ["Processed", "Unprocessed"];
          const values = [Number(response.data["Processed Folder Count"] || 0), Number(response.data["UnProcessed Folder Count"] || 0)];
          updateChartData("emailProcessing", {
            labels,
            datasets: [applyColorsToDataset(labels, { label: "Emails", data: values })],
          });
        } else {
          updateChartData("emailProcessing", null);
        }
        updateLoading("emailProcessing", false);
      },
      () => {
        updateLoading("emailProcessing", false);
        updateChartData("emailProcessing", null);
      }
    );
  };

  const fetchOrderTypesData = () => {
    const [startDate, endDate] = dateRange;
    const sUrl = `/JavaServices_Oauth2/api/dashboard/getOrderTypes?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}`;

    fnServiceRequest(sUrl, "GET", (response) => {
      const entries = Object.entries(response?.data || {});
      if (entries.length) {
        updateChartData("orderTypes", {
          labels: entries.map(([k]) => formatKey(k)),
          datasets: [
            applyColorsToDataset(
              entries.map(([k]) => formatKey(k)),
              { label: "Order Types", data: entries.map(([, v]) => Number(v || 0)), borderColor: "transparent", borderWidth: 1, barThickness: 30 }
            ),
          ],
        });
      } else {
        updateChartData("orderTypes", null);
      }
    }, () => updateChartData("orderTypes", null));
  };

  const fetchTopItemQuantityData = (showAll = false, limitOverride) => {
    updateLoading("itemQuantity", true);
    const [startDate, endDate] = dateRange;
    let sUrl = `/JavaServices_Oauth2/api/dashboard/getTopItemQuantity?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}`;
    sUrl += `&limit=${limitOverride ?? (showAll ? 0 : 10)}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        if (response?.status === "SUCCESS" && response.data?.length) {
          const chartDataObj = {
            labels: response.data.map((it) => it.name),
            datasets: [
              applyColorsToDataset(
                response.data.map((it) => it.name),
                { label: "Item Description", data: response.data.map((it) => Number(it.count || 0)), borderColor: "transparent", borderWidth: 1, barThickness: 30 }
              ),
            ],
            meta: { ids: response.data.map((it) => String(it.id ?? "")) },
          };
          if (showAll) {
            updateChartData("allItemQuantity", chartDataObj);
          } else {
            updateChartData("originalItemQuantity", chartDataObj);
            updateChartData("itemQuantity", chartDataObj);
          }
        } else {
          updateChartData(showAll ? "allItemQuantity" : "itemQuantity", null);
          if (!showAll) updateChartData("originalItemQuantity", null);
        }
        updateLoading("itemQuantity", false);
      },
      () => {
        updateLoading("itemQuantity", false);
        updateChartData(showAll ? "allItemQuantity" : "itemQuantity", null);
        if (!showAll) updateChartData("originalItemQuantity", null);
      }
    );
  };

  const fetchBottomItemQuantityData = (limitOverride) => {
    updateLoading("itemQuantity", true);
    const [startDate, endDate] = dateRange;
    const sUrl = `/JavaServices_Oauth2/api/dashboard/getBottomItemQuantity?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}&limit=${limitOverride ?? 10}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        if (response?.status === "SUCCESS" && response.data?.length) {
          const chartDataObj = {
            labels: response.data.map((it) => it.name),
            datasets: [
              applyColorsToDataset(
                response.data.map((it) => it.name),
                { label: "Item Description", data: response.data.map((it) => Number(it.count || 0)), borderColor: "transparent", borderWidth: 1, barThickness: 30 }
              ),
            ],
            meta: { ids: response.data.map((it) => String(it.id ?? "")) },
          };
          if (limitOverride > 10) {
            updateChartData("allBottomItemQuantity", chartDataObj);
          } else {
            updateChartData("originalBottomItemQuantity", chartDataObj);
            updateChartData("bottomItemQuantity", chartDataObj);
          }
        } else {
          updateChartData(limitOverride > 10 ? "allBottomItemQuantity" : "bottomItemQuantity", null);
          if (!limitOverride || limitOverride <= 10) updateChartData("originalBottomItemQuantity", null);
        }
        updateLoading("itemQuantity", false);
      },
      () => {
        updateLoading("itemQuantity", false);
        updateChartData(limitOverride > 10 ? "allBottomItemQuantity" : "bottomItemQuantity", null);
        if (!limitOverride || limitOverride <= 10) updateChartData("originalBottomItemQuantity", null);
      }
    );
  };

  const fetchAgeOfPoData = (showAll = false) => {
    updateLoading("ageOfPO", true);
    const [startDate, endDate] = dateRange;
    const sUrl = `/JavaServices_Oauth2/api/dashboard/getAgeOfPO?startDate=${formatDateToMMDDYYYY(startDate)}&endDate=${formatDateToMMDDYYYY(endDate)}${getFilterQS()}&limit=${showAll ? 0 : 10}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => {
        if (response?.status === "SUCCESS" && response.data?.length) {
          const map = new Map();
          for (const row of response.data) {
            const po = String(row?.PO ?? "");
            const age = Number(row?.Age ?? 0);
            map.set(po, Math.max(age, map.get(po) ?? 0));
          }
          const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
          const chartDataObj = {
            labels: entries.map(([po]) => po),
            datasets: [
              applyColorsToDataset(
                entries.map(([po]) => po),
                { label: "PO Number", data: entries.map(([, age]) => age), borderColor: "transparent", borderWidth: 1, barThickness: 30 }
              ),
            ],
          };
          updateChartData(showAll ? "allAgeOfPo" : "ageOfPo", chartDataObj);
        } else {
          updateChartData(showAll ? "allAgeOfPo" : "ageOfPo", null);
        }
        updateLoading("ageOfPO", false);
      },
      () => {
        updateLoading("ageOfPO", false);
        updateChartData(showAll ? "allAgeOfPo" : "ageOfPo", null);
      }
    );
  };

  const fetchTotalSalesData = () => {
    updateLoading("totalSales", true);
    const isAll = (v) => v === "All" || v === "" || v == null;
    const requestBody = {
      country: isAll(selectedCountryCode) ? "ALL" : selectedCountryCode,
      salesOrg: isAll(selectedSalesOrg) ? "ALL" : selectedSalesOrg,
      group: "MONTH",
      limit: totalSalesPeriod,
    };

    fnServiceRequest(
      `/JavaServices_Oauth2/api/dashboard/totalSalePerMonth`,
      "POST",
      (response) => {
        if (response.status === "SUCCESS" && response.data?.length) {
          const chronologicalData = [...response.data].reverse();
          updateChartData("totalSales", {
            labels: chronologicalData.map((item) => item.DATE),
            datasets: [applyColorsToDataset(chronologicalData.map((item) => item.DATE), { label: "Total Sales", data: chronologicalData.map((item) => item.TOTAL_AMOUNT) })],
          });
        } else {
          updateChartData("totalSales", null);
        }
        updateLoading("totalSales", false);
      },
      () => {
        updateLoading("totalSales", false);
        updateChartData("totalSales", null);
      },
      requestBody
    );
  };

  useEffect(() => {
    if (dateRange?.[0] && dateRange?.[1]) {
      fetchBusinessExceptions();
      fetchCustomerPOData(false);
      fetchPdfNonPdfData();
      fetchEmailProcessingData();
      fetchPoStatusData();
      fetchOrderTypesData();
      fetchTopItemQuantityData(false);
      fetchBottomItemQuantityData();
      fetchAgeOfPoData(false);
    }
  }, [dateRange, selectedSalesOrg]);

  useEffect(() => {
    fetchTotalSalesData();
  }, [totalSalesPeriod]);

  return {
    isLoading,
    chartData,
    fetchCustomerPOData,
    fetchTopItemQuantityData,
    fetchBottomItemQuantityData,
    fetchAgeOfPoData,
  };
};
