import React from 'react'
import { useTranslation } from "react-i18next";
import { Button, useTheme } from '@mui/material';
import "./Style.css"

export default function MatchButton({matchButtonClickHandler}) {
    const {
        t,
        i18n: { changeLanguage, language },
      } = useTranslation();
    const theme = useTheme();
    
    return (
        <div>
            <Button
                onClick={(oEvent) => {
                    matchButtonClickHandler(oEvent);
                }}
                sx={{
                    minWidth: "50px",
                    padding: "6px 16px",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    backgroundColor: theme.palette.buttonStyles.save.bg,
                    color: theme.palette.buttonStyles.save.text,
                    ":hover": {
                      backgroundColor: theme.palette.buttonStyles.save.hover,
                    },
                    "&.Mui-disabled": {
                      backgroundColor: theme.palette.buttonStyles.save.disabledBg,
                      color: theme.palette.buttonStyles.save.disabledText,
                    },
                }}
            >
                {t("match")}
            </Button>
        </div>
    )
}
