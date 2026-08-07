import { useMemo } from "react";
import { Card, CardContent, Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import ReusableTypography from "./ReusableTypography";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const chartMap = {
  line: Line,
  bar: Bar,
  doughnut: Doughnut,
  pie: Pie,
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 12,
        font: { size: 11 },
      },
    },
  },
};

/** Staggered delay helper — each bar / segment animates slightly after the previous */
const staggerDelay = (ctx) => (ctx.dataIndex ?? 0) * 80;

const animationByType = {
  line: {
    animation: {
      duration: 1400,
      easing: "easeOutQuart",
    },
    animations: {
      x: {
        type: "number",
        easing: "easeOutQuart",
        duration: 1400,
        from: NaN, // skip — animate y from baseline
      },
      y: {
        type: "number",
        easing: "easeOutQuart",
        duration: 1400,
        from: ({ chart }) => chart.scales.y?.getPixelForValue(0) ?? 0,
        delay: staggerDelay,
      },
    },
    transitions: {
      active: {
        animation: { duration: 400 },
      },
    },
  },
  bar: {
    animation: {
      duration: 1200,
      easing: "easeOutCubic",
      delay: staggerDelay,
    },
    animations: {
      y: {
        from: ({ chart }) =>
          chart.scales.y?.getPixelForValue(0) ?? chart.height,
      },
      colors: {
        type: "color",
        duration: 1000,
        properties: ["backgroundColor", "borderColor"],
      },
    },
    transitions: {
      active: {
        animation: { duration: 350 },
      },
    },
  },
  doughnut: {
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1400,
      easing: "easeOutBack",
      delay: (ctx) => (ctx.dataIndex ?? 0) * 60,
    },
    transitions: {
      active: {
        animation: { duration: 300 },
      },
    },
  },
  pie: {
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1400,
      easing: "easeOutBack",
      delay: (ctx) => (ctx.dataIndex ?? 0) * 60,
    },
    transitions: {
      active: {
        animation: { duration: 300 },
      },
    },
  },
};

export default function ChartCard({
  title,
  type = "line",
  data,
  options,
  height = 260,
}) {
  const ChartComponent = chartMap[type] || Line;

  const mergedOptions = useMemo(() => {
    const typeAnims = animationByType[type] || animationByType.line;
    return {
      ...baseOptions,
      ...typeAnims,
      ...options,
      plugins: {
        ...baseOptions.plugins,
        ...(options?.plugins || {}),
      },
      animation: {
        ...typeAnims.animation,
        ...(options?.animation || {}),
      },
      animations: {
        ...(typeAnims.animations || {}),
        ...(options?.animations || {}),
      },
    };
  }, [type, options]);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid var(--divider-primary, #d1d5db)",
        borderRadius: "8px",
        backgroundColor: "#fff",
        "@keyframes chartCardIn": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        animation: "chartCardIn 0.45s ease-out both",
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
        <Box
          sx={{
            height,
            width: "100%",
            "@keyframes chartDrawIn": {
              from: { opacity: 0.35 },
              to: { opacity: 1 },
            },
            animation: "chartDrawIn 0.6s ease-out both",
          }}
        >
          <ChartComponent data={data} options={mergedOptions} />
        </Box>
      </CardContent>
    </Card>
  );
}
