import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material";
import { getThemeByMode } from "../theme/theme";

/**
 * Custom hook to manage application theme
 */
const useAppTheme = () => {
  const themeMode = useSelector((state) => state.appReducer.themeMode);
  const userPalette = useSelector((state) => state.appReducer.userPalette);

  const theme = useMemo(() => {
    const base = getThemeByMode(themeMode);
    const shouldApplyOverrides = themeMode === "light" && !!userPalette;

    return createTheme({
      ...base,
      palette: {
        ...base.palette,
        ...(shouldApplyOverrides ? userPalette : {}),
      },
    });
  }, [themeMode, userPalette]);

  const isDark = theme.palette.mode === "dark";

  return { theme, isDark };
};

export default useAppTheme;
