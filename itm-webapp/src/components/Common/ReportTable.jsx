import { Card, CardContent } from "@mui/material";
import ReusableTypography from "./ReusableTypography";
import ReusableDataGrid from "./ReusableDataGrid";

export default function ReportTable({ title, rows, columns, height = 320 }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid var(--divider-primary, #d1d5db)",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {title && (
          <ReusableTypography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 1.5 }}
          >
            {title}
          </ReusableTypography>
        )}
        <ReusableDataGrid
          rows={rows}
          columns={columns}
          height={height}
          pageSize={5}
          pageSizeOptions={[5, 10]}
          hidePagination={rows.length <= 5}
          density="compact"
        />
      </CardContent>
    </Card>
  );
}
