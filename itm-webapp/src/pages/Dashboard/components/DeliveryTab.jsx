import { Grid } from "@mui/material";
import KpiRow from "../../../components/Common/KpiRow";
import ChartCard from "../../../components/Common/ChartCard";
import ReportTable from "../../../components/Common/ReportTable";
import {
  deliveryKpis,
  deliveryStatusBars,
  deliveryModeSplit,
  deliveryLeadTimeTrend,
  deliveryReportRows,
  deliveryReportColumns,
} from "../../../dummydatas/dashboardDummyData";

export default function DeliveryTab() {
  return (
    <>
      <KpiRow items={deliveryKpis} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <ChartCard
            title="On-Time vs Delayed"
            type="bar"
            data={deliveryStatusBars}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChartCard
            title="Delivery Mode Mix"
            type="doughnut"
            data={deliveryModeSplit}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChartCard
            title="Lead Time Trend"
            type="line"
            data={deliveryLeadTimeTrend}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <ReportTable
            title="Active Deliveries"
            rows={deliveryReportRows}
            columns={deliveryReportColumns}
          />
        </Grid>
      </Grid>
    </>
  );
}
