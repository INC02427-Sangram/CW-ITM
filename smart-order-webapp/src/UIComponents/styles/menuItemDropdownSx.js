export const menuItemDropdownSx =(theme) => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "8px 8px",
    fontSize: "0.875rem",
    position: "relative",
    height: "40px",
    marginBottom: "4px",
    borderRadius: 1,
    "&:hover": {
        backgroundColor: theme.palette?.dropdown?.hover,
    },
    
});