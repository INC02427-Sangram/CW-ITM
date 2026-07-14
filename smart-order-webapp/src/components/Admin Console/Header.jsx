import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import adminConsoleAdminConfiguration from "./config";
import { useTranslation } from "react-i18next";
import { StyledTab } from "../../utility/TabPanelComponent";

const Header=({tabValue, setTabValue})=>{
  
  const { t, i18n: {changeLanguage, language} } = useTranslation();
    const fnTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
    const a11yProps = (index) => {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    };
    return (
        <>
         <div className="admin-Console-header">
        <Tabs
          value={tabValue}
          onChange={fnTabChange}
          aria-label="basic tabs example"
        >
          {adminConsoleAdminConfiguration(t)?.AdminConsoleFieldNames?.map((adminTab, index) => (
            <StyledTab label={adminTab?.tabLabel} {...a11yProps(index)} />
          ))}
        </Tabs>
      </div>
        </>
    )
}

export default Header;