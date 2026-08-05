import { Box } from "@mui/material";

const ScrollContainer = ({ children, sx = {}, ...props }) => {
  return (
    <Box
      sx={{
        overflow: "auto",

        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },

        scrollbarWidth: "thin", // Firefox
        scrollbarColor: "#888 #f1f1f1",

        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ScrollContainer;