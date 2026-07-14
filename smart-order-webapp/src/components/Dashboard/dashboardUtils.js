import { format } from "date-fns";

// ──────────────────── Color Utilities ────────────────────

const PASTEL_PALETTE = [
  "#B79EFF",
  "#FFA6B3",
  "#FFD54F",
  "#AEe07A",
  "#6FD9FB",
  "#FFC371",
  "#DEDAB3",
];

export const mixWithWhite = (hex, fraction) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c) =>
    Math.round(c + (255 - c) * fraction)
      .toString(16)
      .padStart(2, "0");
  return `#${mix(r)}${mix(g)}${mix(b)}`;
};

export const generatePastelColors = (n) => {
  if (!n || n <= 0) return [];
  const base = PASTEL_PALETTE.slice(0, n);
  if (base.length === n) return base;

  const expanded = [];
  for (let i = 0; i < n; i++) {
    const idx = i % PASTEL_PALETTE.length;
    const hex = PASTEL_PALETTE[idx];
    if (i < PASTEL_PALETTE.length) expanded.push(hex);
    else {
      const mixFraction = Math.min(0.18, (i / n) * 0.18);
      expanded.push(mixWithWhite(hex, mixFraction));
    }
  }
  return expanded;
};

export const applyColorsToDataset = (labels, dataset) => {
  const colors = generatePastelColors(labels.length);
  return {
    ...dataset,
    backgroundColor: colors,
    hoverBackgroundColor: colors,
    borderColor: dataset.borderColor || "transparent",
  };
};

// ──────────────────── Download Utilities ────────────────────

export const convertToCSV = (data) => {
  if (!data || !data.labels || !data.datasets) return "";

  let csv = "Label,Value\n";
  data.labels.forEach((label, index) => {
    const value = data.datasets[0]?.data[index] || 0;
    csv += `"${label}",${value}\n`;
  });
  return csv;
};

export const downloadFile = (content, filename, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadChart = (chartRef, data, filename, fmt) => {
  if (fmt === "png" && chartRef?.current) {
    const canvas = chartRef.current.canvas;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = url;
    link.click();
  } else if (fmt === "csv" && data) {
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, `${filename}.csv`, "text/csv");
  } else if (fmt === "excel" && data) {
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
  }
};

// ──────────────────── Data Transform Utilities ────────────────────

export const formatKey = (k) => {
  if (!k) return k;
  return k
    .toString()
    .replace(/[_\-]/g, " ")
    .replace(/ Count$/i, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const adaptDataForType = (chartType, data) => {
  if (!data) return data;
  const cloned = {
    ...data,
    datasets: (data.datasets || []).map((ds) => ({ ...ds })),
  };

  cloned.datasets.forEach((ds, i) => {
    if (!ds.label) ds.label = "Series " + (i + 1);
  });

  if (chartType === "line") {
    cloned.datasets.forEach((ds) => {
      if (!ds.borderColor || ds.borderColor === "transparent") {
        const firstBg = Array.isArray(ds.backgroundColor)
          ? ds.backgroundColor[0]
          : ds.backgroundColor;
        ds.borderColor = firstBg || "#3b82f6";
      }
      ds.pointRadius = ds.pointRadius ?? 2;
      ds.fill = false;
      delete ds.barThickness;
    });
  }
  return cloned;
};

// ──────────────────── Filter / Query Utilities ────────────────────

export const buildFilterQS = (selectedCountryCode, selectedSalesOrg) => {
  const parts = [];
  const isAll = (v) => v === "All" || v === "" || v == null;
  if (isAll(selectedCountryCode)) parts.push(`country=All`);
  else parts.push(`country=${encodeURIComponent(selectedCountryCode)}`);
  if (isAll(selectedSalesOrg)) parts.push(`salesOrg=All`);
  else parts.push(`salesOrg=${encodeURIComponent(selectedSalesOrg)}`);
  return parts.length ? `&${parts.join("&")}` : "";
};

export const formatDateToMMDDYYYY = (date) => {
  return format(date, "MMddyyyy");
};

export const filterChartData = (originalData, searchTerm) => {
  if (!originalData) return null;
  if (!searchTerm) return originalData;

  const filteredLabels = [];
  const filteredData = [];
  const filteredIds = [];
  const ids = originalData.meta?.ids || [];
  const term = searchTerm.toLowerCase();

  originalData.labels.forEach((label, idx) => {
    const idMatch = (ids[idx] || "").toLowerCase().includes(term);
    const nameMatch = (label || "").toLowerCase().includes(term);
    if (idMatch || nameMatch) {
      filteredLabels.push(label);
      filteredData.push(originalData.datasets[0].data[idx]);
      if (ids.length > 0) filteredIds.push(ids[idx]);
    }
  });

  const ds = { ...originalData.datasets[0], data: filteredData };
  const result = {
    labels: filteredLabels,
    datasets: [applyColorsToDataset(filteredLabels, ds)],
  };
  if (originalData.meta) {
    result.meta = { ids: filteredIds };
  }
  return result;
};
