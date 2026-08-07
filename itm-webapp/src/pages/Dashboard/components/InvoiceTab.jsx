import { Grid } from "@mui/material";
import KpiRow from "../../../components/Common/KpiRow";
import ChartCard from "../../../components/Common/ChartCard";
import ReportTable from "../../../components/Common/ReportTable";
import {
  invoiceKpis,
  invoiceAging,
  invoiceCollectionTrend,
  invoiceTypeSplit,
  invoiceReportRows,
  invoiceReportColumns,
} from "../../../dummydatas/dashboardDummyData";

export default function InvoiceTab() {
  return (
    <>
      <KpiRow items={invoiceKpis} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <ChartCard
            title="AR Aging Buckets"
            type="bar"
            data={invoiceAging}
            options={{ plugins: { legend: { display: false } } }}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChartCard
            title="Invoice Types"
            type="doughnut"
            data={invoiceTypeSplit}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Invoiced vs Collected"
            type="line"
            data={invoiceCollectionTrend}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReportTable
            title="Open Invoices"
            rows={invoiceReportRows}
            columns={invoiceReportColumns}
          />
        </Grid>
      </Grid>
    </>
  );
}
