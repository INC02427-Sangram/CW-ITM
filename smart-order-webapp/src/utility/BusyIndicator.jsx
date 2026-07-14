import React from "react";
import loadingIcon from "../assets/favicon.ico";
import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";

const BusyIndicator = ({
  message = "Your request is being processed. Do not close or refresh the page.",
}) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
      open={true} // Always open
    >
      <Box sx={{ position: "relative", textAlign: "center" }}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            size={60}
            thickness={3}
            sx={{
              background: "rgba(0, 0, 0, 0)",
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "beep 1.5s infinite",
              "@keyframes beep": {
                "0%": { transform: "scale(1)", opacity: 1 },
                "50%": { transform: "scale(1.1)", opacity: 0.7 },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          >
            <img src={loadingIcon} width="28px" alt="loading icon" />
          </Box>
        </Box>
        <Typography
          component="div"
          sx={{
            marginTop: 2,
            color: "#d7dae0",
            opacity: 0.9,
            // backgroundColor: "rgba(59, 48, 200, 0.5)",
            padding: "8px 12px",
            borderRadius: "4px",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default BusyIndicator;
