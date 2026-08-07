import { Grid } from "@mui/material";
import KpiRow from "../../../components/Common/KpiRow";
import ChartCard from "../../../components/Common/ChartCard";
import ReportTable from "../../../components/Common/ReportTable";
import {
  contractsKpis,
  contractsVolumeTrend,
  contractsByType,
  contractsStatusBreakdown,
  contractsReportRows,
  contractsReportColumns,
} from "../../../dummydatas/dashboardDummyData";

export default function ContractsTab() {
  return (
    <>
      <KpiRow items={contractsKpis} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <ChartCard
            title="Contract Volume Trend"
            type="line"
            data={contractsVolumeTrend}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Status Breakdown"
            type="doughnut"
            data={contractsStatusBreakdown}
            height={260}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Contracts by Type"
            type="bar"
            data={contractsByType}
            options={{ plugins: { legend: { display: false } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReportTable
            title="Recent Contracts"
            rows={contractsReportRows}
            columns={contractsReportColumns}
          />
        </Grid>
      </Grid>
    </>
  );
}
