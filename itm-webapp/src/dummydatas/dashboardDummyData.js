/** Dummy datasets for Dashboard tabs — replace with API responses later */

export const chartColors = {
  blue: "#7f86ca",
  peach: "#f1a957",
  green: "#8bc882",
  sky: "#61b0ee",
  pink: "#fd78b6",
  beige: "#ceae9f",
  violet: "#9177d3",
  purple: "#cb7ad5",
  coral: "#ff826f",
  yellow: "#f2c276",
  primary: "#3026B9",
};

/* ─── Contracts ─────────────────────────────────────────────── */
export const contractsKpis = [
  { id: "active", label: "Active Contracts", value: "128", trend: "+8%", trendUp: true, subtitle: "vs last month" },
  { id: "value", label: "Total Contract Value", value: "$42.6M", trend: "+12%", trendUp: true, subtitle: "YTD" },
  { id: "expiring", label: "Expiring in 30 Days", value: "14", trend: "-3", trendUp: false, subtitle: "needs renewal" },
  { id: "utilization", label: "Avg. Utilization", value: "78%", trend: "+5%", trendUp: true, subtitle: "volume committed" },
];

export const contractsVolumeTrend = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "New Contracts",
      data: [12, 18, 15, 22, 19, 25, 28],
      borderColor: chartColors.primary,
      backgroundColor: "rgba(48, 38, 185, 0.12)",
      fill: true,
      tension: 0.35,
    },
    {
      label: "Renewals",
      data: [8, 10, 9, 14, 12, 16, 18],
      borderColor: chartColors.green,
      backgroundColor: "rgba(139, 200, 130, 0.12)",
      fill: true,
      tension: 0.35,
    },
  ],
};

export const contractsByType = {
  labels: ["B2B Supply", "Purchase", "Sales", "Spot", "Framework"],
  datasets: [
    {
      label: "Contracts",
      data: [42, 28, 24, 18, 16],
      backgroundColor: [
        chartColors.primary,
        chartColors.sky,
        chartColors.green,
        chartColors.peach,
        chartColors.violet,
      ],
      borderWidth: 0,
    },
  ],
};

export const contractsStatusBreakdown = {
  labels: ["Active", "Pending Approval", "Draft", "Expired"],
  datasets: [
    {
      data: [128, 22, 15, 31],
      backgroundColor: [chartColors.green, chartColors.peach, chartColors.sky, chartColors.coral],
      borderWidth: 0,
    },
  ],
};

export const contractsReportRows = [
  { id: 1, contractNo: "CTC-2026-0142", counterparty: "BASF SE", type: "B2B Supply", value: "$2.4M", status: "Active", expiry: "2026-12-15" },
  { id: 2, contractNo: "CTC-2026-0138", counterparty: "LyondellBasell", type: "Purchase", value: "$1.8M", status: "Active", expiry: "2026-09-30" },
  { id: 3, contractNo: "CTC-2026-0131", counterparty: "Dow Chemical", type: "Sales", value: "$3.1M", status: "Pending Approval", expiry: "2027-03-01" },
  { id: 4, contractNo: "CTC-2026-0125", counterparty: "SABIC", type: "Framework", value: "$5.0M", status: "Active", expiry: "2026-08-20" },
  { id: 5, contractNo: "CTC-2026-0119", counterparty: "Ineos", type: "Spot", value: "$0.6M", status: "Draft", expiry: "—" },
];

export const contractsReportColumns = [
  { field: "contractNo", headerName: "Contract No.", flex: 1, minWidth: 130 },
  { field: "counterparty", headerName: "Counterparty", flex: 1.2, minWidth: 140 },
  { field: "type", headerName: "Type", flex: 1, minWidth: 110 },
  { field: "value", headerName: "Value", flex: 0.8, minWidth: 90 },
  { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
  { field: "expiry", headerName: "Expiry", flex: 0.9, minWidth: 110 },
];

/* ─── Profit Simulation ─────────────────────────────────────── */
export const profitKpis = [
  { id: "gross", label: "Gross Margin", value: "18.4%", trend: "+1.2%", trendUp: true, subtitle: "simulated avg" },
  { id: "net", label: "Net Profit (Sim)", value: "$3.8M", trend: "+6%", trendUp: true, subtitle: "next quarter" },
  { id: "spread", label: "Buy–Sell Spread", value: "$42/MT", trend: "-$3", trendUp: false, subtitle: "weighted avg" },
  { id: "scenarios", label: "Active Scenarios", value: "7", trend: "+2", trendUp: true, subtitle: "what-if models" },
];

export const profitMarginTrend = {
  labels: ["Q1", "Q2", "Q3", "Q4 (Sim)", "Q1+1 (Sim)"],
  datasets: [
    {
      label: "Actual Margin %",
      data: [15.2, 16.8, 17.5, null, null],
      borderColor: chartColors.primary,
      backgroundColor: chartColors.primary,
      tension: 0.3,
      spanGaps: false,
    },
    {
      label: "Simulated Margin %",
      data: [null, null, 17.5, 18.4, 19.1],
      borderColor: chartColors.peach,
      borderDash: [6, 4],
      backgroundColor: chartColors.peach,
      tension: 0.3,
      spanGaps: false,
    },
  ],
};

export const profitByMaterial = {
  labels: ["Glycol", "Methanol", "Acetone", "Ethylene", "Propylene"],
  datasets: [
    {
      label: "Profit ($K)",
      data: [820, 640, 510, 980, 720],
      backgroundColor: chartColors.blue,
      borderRadius: 4,
    },
  ],
};

export const profitScenarioCompare = {
  labels: ["Base", "Bullish", "Bearish", "FX Up", "Volume+"],
  datasets: [
    {
      label: "Net Profit ($M)",
      data: [3.2, 4.5, 2.1, 3.6, 4.1],
      backgroundColor: [
        chartColors.primary,
        chartColors.green,
        chartColors.coral,
        chartColors.sky,
        chartColors.violet,
      ],
      borderRadius: 4,
    },
  ],
};

export const profitReportRows = [
  { id: 1, scenario: "Base Case", buyPrice: "$80/MT", sellPrice: "$122/MT", volume: "12,000 MT", margin: "18.4%", netProfit: "$3.2M" },
  { id: 2, scenario: "Bullish Demand", buyPrice: "$78/MT", sellPrice: "$135/MT", volume: "14,500 MT", margin: "22.1%", netProfit: "$4.5M" },
  { id: 3, scenario: "Bearish Market", buyPrice: "$85/MT", sellPrice: "$110/MT", volume: "9,800 MT", margin: "12.6%", netProfit: "$2.1M" },
  { id: 4, scenario: "FX Appreciation", buyPrice: "$80/MT", sellPrice: "$128/MT", volume: "12,000 MT", margin: "19.8%", netProfit: "$3.6M" },
];

export const profitReportColumns = [
  { field: "scenario", headerName: "Scenario", flex: 1.2, minWidth: 140 },
  { field: "buyPrice", headerName: "Buy Price", flex: 0.9, minWidth: 100 },
  { field: "sellPrice", headerName: "Sell Price", flex: 0.9, minWidth: 100 },
  { field: "volume", headerName: "Volume", flex: 1, minWidth: 110 },
  { field: "margin", headerName: "Margin", flex: 0.7, minWidth: 90 },
  { field: "netProfit", headerName: "Net Profit", flex: 0.9, minWidth: 100 },
];

/* ─── Orders ────────────────────────────────────────────────── */
export const ordersKpis = [
  { id: "open", label: "Open Orders", value: "246", trend: "+18", trendUp: true, subtitle: "PO + SO" },
  { id: "fulfillment", label: "Fulfillment Rate", value: "94%", trend: "+2%", trendUp: true, subtitle: "this month" },
  { id: "backlog", label: "Order Backlog", value: "$8.2M", trend: "-4%", trendUp: false, subtitle: "value pending" },
  { id: "avgCycle", label: "Avg. Cycle Time", value: "4.2d", trend: "-0.5d", trendUp: true, subtitle: "order to confirm" },
];

export const ordersVolumeByMonth = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Purchase Orders",
      data: [45, 52, 48, 61, 55, 70, 68],
      backgroundColor: chartColors.primary,
      borderRadius: 4,
    },
    {
      label: "Sales Orders",
      data: [38, 44, 41, 55, 50, 62, 65],
      backgroundColor: chartColors.sky,
      borderRadius: 4,
    },
  ],
};

export const ordersStatusPie = {
  labels: ["Confirmed", "In Progress", "Pending", "Cancelled"],
  datasets: [
    {
      data: [140, 62, 32, 12],
      backgroundColor: [chartColors.green, chartColors.sky, chartColors.peach, chartColors.coral],
      borderWidth: 0,
    },
  ],
};

export const ordersValueTrend = {
  labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
  datasets: [
    {
      label: "Order Value ($K)",
      data: [420, 380, 510, 465, 590, 540],
      borderColor: chartColors.violet,
      backgroundColor: "rgba(145, 119, 211, 0.15)",
      fill: true,
      tension: 0.35,
    },
  ],
};

export const ordersReportRows = [
  { id: 1, orderNo: "PO-45821", type: "Purchase", counterparty: "BASF SE", material: "Glycol-2114", qty: "500 MT", status: "Confirmed", value: "$40,000" },
  { id: 2, orderNo: "SO-22910", type: "Sales", counterparty: "ChemTrade Inc", material: "Methanol", qty: "320 MT", status: "In Progress", value: "$28,800" },
  { id: 3, orderNo: "PO-45830", type: "Purchase", counterparty: "Dow Chemical", material: "Acetone", qty: "200 MT", status: "Pending", value: "$18,500" },
  { id: 4, orderNo: "SO-22945", type: "Sales", counterparty: "EuroChem", material: "Ethylene", qty: "1,000 MT", status: "Confirmed", value: "$95,000" },
];

export const ordersReportColumns = [
  { field: "orderNo", headerName: "Order No.", flex: 1, minWidth: 110 },
  { field: "type", headerName: "Type", flex: 0.7, minWidth: 90 },
  { field: "counterparty", headerName: "Counterparty", flex: 1.2, minWidth: 130 },
  { field: "material", headerName: "Material", flex: 1, minWidth: 110 },
  { field: "qty", headerName: "Qty", flex: 0.8, minWidth: 90 },
  { field: "status", headerName: "Status", flex: 0.9, minWidth: 100 },
  { field: "value", headerName: "Value", flex: 0.8, minWidth: 90 },
];

/* ─── Delivery ──────────────────────────────────────────────── */
export const deliveryKpis = [
  { id: "ontime", label: "On-Time Delivery", value: "91%", trend: "+3%", trendUp: true, subtitle: "OTIF rate" },
  { id: "inTransit", label: "In Transit", value: "37", trend: "+5", trendUp: true, subtitle: "shipments" },
  { id: "delayed", label: "Delayed", value: "6", trend: "-2", trendUp: true, subtitle: "past ETA" },
  { id: "avgLead", label: "Avg. Lead Time", value: "6.8d", trend: "-0.4d", trendUp: true, subtitle: "plant to customer" },
];

export const deliveryStatusBars = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "On Time",
      data: [42, 48, 45, 55, 52, 60, 58],
      backgroundColor: chartColors.green,
      borderRadius: 4,
    },
    {
      label: "Delayed",
      data: [5, 4, 7, 3, 6, 4, 6],
      backgroundColor: chartColors.coral,
      borderRadius: 4,
    },
  ],
};

export const deliveryModeSplit = {
  labels: ["Road", "Rail", "Sea", "Air"],
  datasets: [
    {
      data: [48, 22, 25, 5],
      backgroundColor: [chartColors.primary, chartColors.sky, chartColors.blue, chartColors.peach],
      borderWidth: 0,
    },
  ],
};

export const deliveryLeadTimeTrend = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Avg Lead Time (days)",
      data: [7.8, 7.5, 7.2, 7.0, 6.9, 6.8, 6.8],
      borderColor: chartColors.peach,
      backgroundColor: "rgba(241, 169, 87, 0.15)",
      fill: true,
      tension: 0.35,
    },
  ],
};

export const deliveryReportRows = [
  { id: 1, deliveryNo: "OD-88201", orderRef: "SO-22910", destination: "Rotterdam", mode: "Sea", eta: "2026-08-12", status: "In Transit" },
  { id: 2, deliveryNo: "OD-88215", orderRef: "SO-22945", destination: "Houston", mode: "Rail", eta: "2026-08-09", status: "On Time" },
  { id: 3, deliveryNo: "OD-88190", orderRef: "SO-22880", destination: "Antwerp", mode: "Road", eta: "2026-08-06", status: "Delayed" },
  { id: 4, deliveryNo: "OD-88230", orderRef: "SO-22960", destination: "Singapore", mode: "Sea", eta: "2026-08-18", status: "Scheduled" },
];

export const deliveryReportColumns = [
  { field: "deliveryNo", headerName: "Delivery No.", flex: 1, minWidth: 110 },
  { field: "orderRef", headerName: "Order Ref", flex: 0.9, minWidth: 100 },
  { field: "destination", headerName: "Destination", flex: 1, minWidth: 110 },
  { field: "mode", headerName: "Mode", flex: 0.7, minWidth: 80 },
  { field: "eta", headerName: "ETA", flex: 0.9, minWidth: 100 },
  { field: "status", headerName: "Status", flex: 0.9, minWidth: 100 },
];

/* ─── Invoice ───────────────────────────────────────────────── */
export const invoiceKpis = [
  { id: "outstanding", label: "Outstanding AR", value: "$6.4M", trend: "-8%", trendUp: true, subtitle: "receivables" },
  { id: "overdue", label: "Overdue", value: "$1.1M", trend: "+$120K", trendUp: false, subtitle: "> 30 days" },
  { id: "collected", label: "Collected (MTD)", value: "$2.9M", trend: "+11%", trendUp: true, subtitle: "this month" },
  { id: "dso", label: "DSO", value: "32d", trend: "-2d", trendUp: true, subtitle: "days sales outstanding" },
];

export const invoiceAging = {
  labels: ["Current", "1–30d", "31–60d", "61–90d", "90d+"],
  datasets: [
    {
      label: "Amount ($K)",
      data: [2800, 1500, 980, 620, 480],
      backgroundColor: [
        chartColors.green,
        chartColors.sky,
        chartColors.peach,
        chartColors.yellow,
        chartColors.coral,
      ],
      borderRadius: 4,
    },
  ],
};

export const invoiceCollectionTrend = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Invoiced ($K)",
      data: [2100, 2300, 2450, 2200, 2600, 2750, 2900],
      borderColor: chartColors.primary,
      backgroundColor: "rgba(48, 38, 185, 0.1)",
      fill: true,
      tension: 0.35,
    },
    {
      label: "Collected ($K)",
      data: [1900, 2100, 2280, 2050, 2400, 2550, 2700],
      borderColor: chartColors.green,
      backgroundColor: "rgba(139, 200, 130, 0.1)",
      fill: true,
      tension: 0.35,
    },
  ],
};

export const invoiceTypeSplit = {
  labels: ["Customer Invoice", "Credit Memo", "Debit Memo", "Proforma"],
  datasets: [
    {
      data: [180, 24, 12, 18],
      backgroundColor: [chartColors.primary, chartColors.green, chartColors.peach, chartColors.violet],
      borderWidth: 0,
    },
  ],
};

export const invoiceReportRows = [
  { id: 1, invoiceNo: "INV-91042", customer: "ChemTrade Inc", amount: "$128,400", dueDate: "2026-08-15", aging: "Current", status: "Open" },
  { id: 2, invoiceNo: "INV-91018", customer: "EuroChem", amount: "$95,000", dueDate: "2026-07-20", aging: "31–60d", status: "Overdue" },
  { id: 3, invoiceNo: "INV-90995", customer: "BASF SE", amount: "$210,000", dueDate: "2026-08-01", aging: "1–30d", status: "Partial" },
  { id: 4, invoiceNo: "INV-90970", customer: "LyondellBasell", amount: "$67,500", dueDate: "2026-06-30", aging: "61–90d", status: "Overdue" },
];

export const invoiceReportColumns = [
  { field: "invoiceNo", headerName: "Invoice No.", flex: 1, minWidth: 110 },
  { field: "customer", headerName: "Customer", flex: 1.2, minWidth: 130 },
  { field: "amount", headerName: "Amount", flex: 0.9, minWidth: 100 },
  { field: "dueDate", headerName: "Due Date", flex: 0.9, minWidth: 100 },
  { field: "aging", headerName: "Aging", flex: 0.8, minWidth: 90 },
  { field: "status", headerName: "Status", flex: 0.8, minWidth: 90 },
];
