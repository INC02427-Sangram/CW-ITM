import { Grid } from "@mui/material";
import KpiCard from "./KpiCard";

export default function KpiRow({ items = [] }) {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {items.map((kpi) => (
        <Grid item xs={12} sm={6} md={3} key={kpi.id || kpi.label}>
          <KpiCard {...kpi} />
        </Grid>
      ))}
    </Grid>
  );
}
