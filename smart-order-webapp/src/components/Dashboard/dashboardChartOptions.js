const getBaseOptions = (chartId) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: { usePointStyle: true },
    },
    tooltip: {
      callbacks: {
        label: function (ctx) {
          const label = ctx.label ?? "";
          const value = ctx.formattedValue ?? "";
          if (chartId !== "chart7") return `${label}: ${value}`;
          const ids = ctx?.chart?.data?.meta?.ids || [];
          const id = ids[ctx.dataIndex] ? ` (ID: ${ids[ctx.dataIndex]})` : "";
          return `${label}: ${value}${id}`;
        },
      },
    },
  },
});

export const buildChartOptions = (chartId, chartType) => {
  const baseOptions = getBaseOptions(chartId);

  if (chartType === "line") {
    return {
      ...baseOptions,
      scales: {
        x: { grid: { display: false }, offset: true },
        y: { beginAtZero: true, grid: { display: true } },
      },
      elements: {
        line: { tension: 0.3, borderWidth: 2 },
        point: { radius: 2 },
      },
    };
  }

  if (chartType === "bar" && chartId === "chart1") {
    return {
      ...baseOptions,
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: { display: false },
          ticks: { callback: (v) => (Number.isInteger(v) ? v : null) },
        },
        y: {
          type: "category",
          grid: { display: false },
          ticks: { autoSkip: false },
        },
      },
      plugins: {
        ...baseOptions.plugins,
        zoom: {
          pan: { enabled: true, mode: "y" },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "y" },
        },
      },
    };
  }

  if (chartType === "bar" && (chartId === "chart9" || chartId === "chart10")) {
    return {
      ...baseOptions,
      scales: {
        y: { beginAtZero: true, grid: { display: true } },
        x: { grid: { display: false } },
      },
      elements:
        chartId === "chart10"
          ? { line: { tension: 0.3, borderWidth: 2 }, point: { radius: 2 } }
          : undefined,
      plugins: {
        ...baseOptions.plugins,
        zoom: {
          pan: { enabled: true, mode: "x" },
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" },
        },
      },
    };
  }

  if (chartType === "donut") {
    return {
      ...baseOptions,
      cutout: "60%",
      elements: { arc: { borderWidth: 0.5, borderColor: "#ffffff" } },
    };
  }

  if (chartType === "pie") {
    return {
      ...baseOptions,
      cutout: "0%",
      elements: { arc: { borderWidth: 0.5, borderColor: "#ffffff" } },
    };
  }

  return {
    ...baseOptions,
    scales: {
      y: { beginAtZero: true, grid: { display: true } },
      x: { grid: { display: false } },
    },
  };
};
