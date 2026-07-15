import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3026B9",
    },
    background: {
      default: '#ffffff',
      paper: '#fafaff',
      disabled: 'f5f5f5',
      datagridHeader: '#EAE9FF',
      rowclicked: '#e4f1ff', // 
    },
    dropdown: {
      hover: "#E6E8F5",
    },
    text: {
      primary: '#000000',
      secondary: '#4b4b4bff',
      disabled: '#9e9e9e',
      default: "#ffffff",
      paper: "#fafaff",
      disabled: "f5f5f5",
      datagridHeader: "#EAE9FF",
      rowclicked: "#e4f1ff",
      logoSubText: '#797979ff',
    },
    buttonStyles: {
      save: {
        bg: "#3026B9",
        text: "#fafaff",
        hover: "#3026B9",
        disabledBg: "#9ca3af",
        disabledText: "#fafaff",
      },
      clear: {
        bg: "#fafaff",
        text: "#3026B9",
        hover: "#fafaff",
        disabledBg: "#9ca3af",
        disabledText: "#1f1f1f",
      },
      edit: {
        bg: "#fafaff",
        text: "#3026B9",
        hover: "#fafaff",
        disabledBg: "#9ca3af",
        disabledText: "#1f1f1f",
      },
      delete: {
        bg: "#dd5252ff",
        text: "#fafaff",
        hover: "#ed7664ff",
        disabledBg: "#9ca3af",
        disabledText: "#1f1f1f",
      },
      waiting: {
        bg: "#fff3e0",
        text: "#e65100",
        hover: "#fff3e0",
        disabledBg: "#f3e0c1",
        disabledText: "#e65100",
      },
      reject: {
        bg: "#d32f2f",
        text: "#fafaff",
        hover: "#d32f2f",
        disabledBg: "#9ca3af",
        disabledText: "#3026B9",
      },


    },
    statusChips: {
      toBeReviewed: {
        bg: "#f9ede7", // light peach
        text: "#dd742d", // soft orange
        border: "#f29a5a",
      },
      queued: {
        bg: "#ebe1f2ff",
        text: "#822cc3",
        border: "#a55eea",
      },
      created: {
        bg: "#e9eaf5",
        text: "#61b0ee",
        border: "#64b5f6",
      },
      cancelled: {
        bg: "#dfe4ea",
        text: "#222f3e",
        border: "#222f3e",
      },
      pendingForApproval: {
        bg: "#e0f7fa", // Light Cyan
        text: "#006064", // Dark Teal
        border: "#80deea",
      },
      rejected: {
        bg: "#fdecea",
        text: "#d32f2f",
        border: "#f5c6cb",
      },
    },
    exceptionChips: {
      default: {
        bg: "#fce9ed",
        text: "#a9001a",
      },
    },
    azureChips: {
      active: {
        bg: "#e0f7e9",
        text: "#2e7d32",
      },
      inactive: {
        bg: "#ffecec",
        text: "#c62828",
      },
    },
    priorityChips: {
      error: {
        bg: "#ffecec", // red-ish for high priority
        text: "#c62828",
      },
      warning: {
        bg: "#fff4e6", // amber-ish for medium
        text: "#e65100",
      },
      success: {
        bg: "#e8f5e9", // green-ish for low
        text: "#2e7d32",
      },
      default: {
        bg: "#e0e0e0",
        text: "#424242",
      },
    },
    orderBlockChips: {
      default: {
        bg: "#e0f7fa", // light cyan for light mode
        text: "#006064", // dark teal
      },
    },
    summaryChips: {
      netQuantity: { bg: "#E3F2FD", text: "#1976d2" },
      netPrice: { bg: "#E8F5E8", text: "#2e7d32" },
      sapNetQuantity: { bg: "#E3F2FD", text: "#1976d2" },
      sapNetPrice: { bg: "#E8F5E8", text: "#2e7d32" },
      totalItems: { bg: "#FFF3E0", text: "#ed6c02" },
      validItems: { bg: "#E8F5E8", text: "#2e7d32" },
      invalidItems: { bg: "#FFEBEE", text: "#d32f2f" },
      otherExceptions: { bg: "#F3E5F5", text: "#9c27b0" },
      default: { bg: "#E0E0E0", text: "#424242" },
    },
    icons: {
      contained: "#fafaff",
      outlined: "#3026B9",
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8d8dff",
    },
    dropdown: {
      hover: "#E6E8F5",
    },
    background: {
      default: "#141414",
      paper: "#1f1f1f",
      disabled: "rgba(255, 255, 255, 0.12)",
      datagridHeader: "#2b2b40",
      rowclicked: "#b3c7ddff",
    },
    buttonStyles: {
      save: {
        bg: "#005b2a",
        text: "#ffffff",
        hover: "#26b979",
        disabledBg: "#9ca3af",
        disabledText: "#1f1f1f",
      },
      clear: {
        bg: "#a9001a",
        text: "#ffffff",
        hover: "#e1404e",
        disabledBg: "#9ca3af",
        disabledText: "#1f1f1f",
      },
      edit: {
        bg: "#1976d2",
        text: "#ffffff",
        hover: "#1565c0",
        disabledBg: "#9ca3af",
        disabledText: "#1f1f1f",
      },
      delete: {
        bg: "#dd5252ff",
        text: "#fafaff",
        hover: "#ed7664ff",
        disabledBg: "#9ca3af",
        disabledText: "#1f1f1f",
      },
      add: {
        bg: "#4caf50",
        text: "#ffffff",
        hover: "#43a047",
        disabledBg: "#c8e6c9",
        disabledText: "#f1f8e9",
      },
    },
    statusChips: {
      toBeReviewed: {
        bg: "#2b2b2b",
        text: "#f28c38",
        border: "#f28c38",
      },
      queued: {
        bg: "#2b2b2b",
        text: "#822cc3",
        border: "#822cc3",
      },
      created: {
        bg: "#2b2b2b",
        text: "#61b0ee",
        border: "#42a5f5",
      },
      cancelled: {
        bg: "#3b1f1f",
        text: "#f66",
        border: "#616161",
      },
      pendingForApproval: {
        bg: "#004d40", // Dark Teal Background
        text: "#80cbc4", // Light Cyan Text
        border: "#26a69a",
      },
      rejected: {
        bg: "#3b1f1f",
        text: "#ff8a80",
        border: "#e53935",
      },
    },
    exceptionChips: {
      invalidMaterial: {
        bg: "#2b2b2b",
        text: "#e1404e",
      },
      multipleMaterialsFound: {
        bg: "#2b2b2b",
        text: "#e1404e",
      },
      uomIssue: {
        bg: "#2b2b2b",
        text: "#e1404e",
      },
      default: {
        bg: "#2b2b2b",
        text: "#e1404e",
      },
    },
    azureChips: {
      active: {
        bg: "#1f1f1f",
        text: "#2e7d32",
      },
      inactive: {
        bg: "#1f1f1f",
        text: "#e1404e",
      },
    },
    priorityChips: {
      error: {
        bg: "#1f1f1f",
        text: "#c62828",
      },
      warning: {
        bg: "#1f1f1f",
        text: "#e65100",
      },
      success: {
        bg: "#1f1f1f",
        text: "#2e7d32",
      },
      default: {
        bg: "#1f1f1f",
        text: "#e0e0e0",
      },
    },
    orderBlockChips: {
      default: {
        bg: "#1f1f1f",
        text: "#e0e0e0",
      },
    },
    summaryChips: {
      netQuantity: { bg: "#1f1f1f", text: "#1976d2" },
      netPrice: { bg: "#1f1f1f", text: "#2e7d32" },
      sapNetQuantity: { bg: "#1f1f1f", text: "#1976d2" },
      sapNetPrice: { bg: "#1f1f1f", text: "#2e7d32" },
      totalItems: { bg: "#1f1f1f", text: "#ed6c02" },
      validItems: { bg: "#1f1f1f", text: "#2e7d32" },
      invalidItems: { bg: "#1f1f1f", text: "#d32f2f" },
      otherExceptions: { bg: "#1f1f1f", text: "#9c27b0" },
      default: { bg: "#1f1f1f", text: "#424242" },
    },
    text: {
      primary: '#f5f5f5ff',
      secondary: '#cccccc',
      disabled: '#9e9e9e',
      logoSubText: '#cccccc',
    },
  },
});

export { lightTheme, darkTheme };

export const getThemeByMode = (mode) => {
  return mode === "dark" ? darkTheme : lightTheme;
};
