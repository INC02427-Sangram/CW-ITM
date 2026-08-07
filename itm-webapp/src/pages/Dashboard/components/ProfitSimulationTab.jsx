import { Grid } from "@mui/material";
import KpiRow from "../../../components/Common/KpiRow";
import ChartCard from "../../../components/Common/ChartCard";
import ReportTable from "../../../components/Common/ReportTable";
import {
  profitKpis,
  profitMarginTrend,
  profitByMaterial,
  profitScenarioCompare,
  profitReportRows,
  profitReportColumns,
} from "../../../dummydatas/dashboardDummyData";

export default function ProfitSimulationTab() {
  return (
    <>
      <KpiRow items={profitKpis} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <ChartCard
            title="Margin Trend vs Simulation"
            type="line"
            data={profitMarginTrend}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChartCard
            title="Scenario Comparison"
            type="bar"
            data={profitScenarioCompare}
            options={{ plugins: { legend: { display: false } } }}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChartCard
            title="Profit by Material"
            type="bar"
            data={profitByMaterial}
            options={{
              indexAxis: "y",
              plugins: { legend: { display: false } },
            }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <ReportTable
            title="Simulation Scenarios"
            rows={profitReportRows}
            columns={profitReportColumns}
          />
        </Grid>
      </Grid>
    </>
  );
}
