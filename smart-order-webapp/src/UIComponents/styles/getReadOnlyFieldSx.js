export const getReadOnlyFieldSx = (theme) => ({
  backgroundColor: theme.palette.background.paper,
  padding: "8px 12px",
  borderRadius: "4px",
  minHeight: "40px",   // 👈 base height
  border: "1px solid #e9ecef",

  height: "auto",      // 👈 allow growth
  display: "flex",
  alignItems: "center", // for single-line alignment

  "& .MuiInputBase-input": {
    fontSize: "0.875rem",
    whiteSpace: "normal",   // 👈 allow wrapping
    wordBreak: "break-word" // 👈 prevent overflow
  },
});