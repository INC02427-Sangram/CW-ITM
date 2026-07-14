export const styles = {
  pieContainer: {
    width: "100%",
    flex: 1,
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  box: {
    border: "1px solid #ddd",
    borderRadius: "10px",

    // same sizing behavior from latest code
    padding: "20px",

    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",

    display: "flex",

    flexDirection: "column",

    width: "100%",

    height: "100%",

    minHeight: "400px",

    position: "relative",

    overflow: "hidden",

    backgroundColor: "#fff",

    // old layout consistency
    justifyContent: "space-between",
  },

  headingRow: {
    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "8px",

    marginBottom: "8px",
  },

  heading: {
    margin: "0",

    // keep old typography
    fontSize: "16px",

    fontWeight: "bold",

    textAlign: "center",

    flex: 1,
  },

  headingActions: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",
  },

  selectorContainer: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",
  },

  selectorInline: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",
  },

  searchContainer: {
    display: "flex",

    alignItems: "center",
  },

  searchInput: {
    // keep old sizing
    padding: "4px 8px",

    fontSize: "12px",

    border: "1px solid #ddd",

    borderRadius: "4px",

    width: "120px",

    outline: "none",

    backgroundColor: "white",

    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },

  hamburgerButton: {
    background: "none",

    border: "none",

    cursor: "pointer",

    width: "30px",

    height: "30px",

    padding: "5px",

    borderRadius: "4px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "white",

    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },

  hamburgerIcon: {
    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    width: "16px",

    height: "12px",
  },

  hamburgerLine: {
    width: "100%",

    height: "2px",

    backgroundColor: "#333",

    borderRadius: "1px",
  },

  dropdownMenu: {
    position: "absolute",

    top: "40px",

    right: "0",

    backgroundColor: "white",

    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",

    borderRadius: "4px",

    width: "120px",

    zIndex: 20,
  },

  menuItem: {
    padding: "8px 12px",

    cursor: "pointer",

    fontSize: "14px",

    color: "#333",

    borderBottom: "1px solid #f0f0f0",

    ":hover": {
      backgroundColor: "#f5f5f5",
    },
  },

  activeMenuItem: {
    backgroundColor: "#f0f0f0",

    fontWeight: "bold",
  },

  topResultsContainer: {
    display: "flex",

    alignItems: "center",

    flexWrap: "wrap",
  },

  topResultsButton: {
    border: "1px solid #ddd",

    cursor: "pointer",

    padding: "6px 12px",

    borderRadius: "4px",

    fontSize: "12px",

    color: "#333",

    display: "flex",

    alignItems: "center",

    gap: "5px",

    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",

    minWidth: "70px",
  },

  dropdownArrow: {
    fontSize: "10px",

    color: "#666",
  },

  topResultsMenu: {
    position: "absolute",

    top: "35px",

    left: "0",

    backgroundColor: "white",

    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",

    borderRadius: "4px",

    width: "100px",

    zIndex: 20,
  },

  tableContainer: {
    width: "100%",

    height: "100%",

    minHeight: "300px",

    overflowY: "auto",

    display: "flex",

    justifyContent: "center",
  },

  toolbarRow: {
    width: "100%",

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    flexWrap: "wrap",

    gap: "8px",

    marginBottom: "8px",
  },

  toolbarLeft: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",
  },

  toolbarRight: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",

    justifyContent: "flex-end",
  },

  table: {
    width: "90%",

    borderCollapse: "collapse",

    marginTop: "10px",

    fontSize: "12px",

    fontFamily: "Roboto, sans-serif",
  },

  tableHeader: {
    backgroundColor: "#f5f5f5",

    padding: "8px 12px",

    textAlign: "left",

    fontWeight: "bold",

    borderBottom: "1px solid #ddd",

    position: "sticky",

    top: 0,
  },

  tableRowEven: {
    backgroundColor: "#ffffff",
  },

  tableRowOdd: {
    backgroundColor: "#f9f9f9",
  },

  tableCell: {
    padding: "8px 12px",

    borderBottom: "1px solid #eee",
  },

  noDataContainer: {
    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    height: "100%",
  },

  noDataText: {
    fontSize: "14px",

    fontWeight: "500",

    color: "#555",
  },

  salesPeriodSelector: {
    display: "flex",

    alignItems: "center",

    flexWrap: "wrap",
  },

  selectInput: {
    height: "31px",

    padding: "3px 9px",

    fontFamily: "inherit",

    fontSize: "13px",

    fontWeight: 500,

    textTransform: "uppercase",

    cursor: "pointer",

    borderRadius: "4px",

    outline: "none",

    color: "#3026B9",

    border: "1px solid #3026B9",

    transition:
      "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

    appearance: "none",

    WebkitAppearance: "none",

    MozAppearance: "none",

    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%233026B9" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')`,

    backgroundRepeat: "no-repeat",

    backgroundPosition: "right 5px center",

    paddingRight: "30px",

    // keep old compact width
    width: "160px",
  },
};