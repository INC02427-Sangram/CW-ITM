import React from 'react'
import { useTranslation } from "react-i18next";
import { Button, useTheme } from '@mui/material';
import { HeaderControlButton as FooterButton } from '../../UIComponents/Button';
import { ButtonTypes } from '../../UIComponents/UITypes';
import "./Style.css"

export default function MatchListFooter({
    unmatchButtonHandler,
    isMatchedListTable,
    handlePreview
}
) {
    const {
        t,
        i18n: { changeLanguage, language },
    } = useTranslation();
    const theme = useTheme();

    return (
        <div className='matchlist-footer'>
            <div>
                <FooterButton
                    action={ButtonTypes.APPLY}
                    onClick={handlePreview}
                >
                    {t("preview")}
                </FooterButton>
            </div>
            {isMatchedListTable && (
                <div className="unMatchButton">
                    <FooterButton
                        action={ButtonTypes.CANCEL}
                        onClick={(oEvent) => {
                            unmatchButtonHandler(oEvent);
                        }}
                    >
                        {t("unmatch")}
                    </FooterButton>
                </div>
            )}
        </div>
    )
}
