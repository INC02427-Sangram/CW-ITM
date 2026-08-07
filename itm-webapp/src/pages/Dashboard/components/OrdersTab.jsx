import { Grid } from "@mui/material";
import KpiRow from "../../../components/Common/KpiRow";
import ChartCard from "../../../components/Common/ChartCard";
import ReportTable from "../../../components/Common/ReportTable";
import {
  ordersKpis,
  ordersVolumeByMonth,
  ordersStatusPie,
  ordersValueTrend,
  ordersReportRows,
  ordersReportColumns,
} from "../../../dummydatas/dashboardDummyData";

export default function OrdersTab() {
  return (
    <>
      <KpiRow items={ordersKpis} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <ChartCard
            title="PO vs SO Volume"
            type="bar"
            data={ordersVolumeByMonth}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="Order Status"
            type="pie"
            data={ordersStatusPie}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <ChartCard
            title="Weekly Order Value"
            type="line"
            data={ordersValueTrend}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <ReportTable
            title="Recent Orders"
            rows={ordersReportRows}
            columns={ordersReportColumns}
          />
        </Grid>
      </Grid>
    </>
  );
}
