import { useState } from "react";
import { Box } from "@mui/material";
import EmailManagement from "./EmailManagement/EmailManagement";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import TemplateDesigner from "./TemplateDesigner/TemplateDesigner";
import { Tab, Tabs } from "@cw/rds";
import { useSelector } from "react-redux";

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  minWidth: 120,
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 96,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
}));

const NotificationConfig = () => {
  const [activeTab, setActiveTab] = useState(0);
  const moduleAccess = useSelector((state) => state.appReducer.moduleAccess);

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        paddingTop: { xs: "16px", sm: "24px" },
        paddingRight: { xs: 1, sm: "15px" },
        paddingLeft: { xs: 1, sm: 0 },
        overflowX: "hidden",
        overflowY: { xs: "auto", md: "visible" },
      }}
    >
      
            <Box sx={{
              pl: { xs: 0, sm: 2 },
              maxWidth: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
            }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  "& .MuiTabs-scrollButtons": {
                    display: "flex",
                    opacity: 1,
                    width: { xs: 28, sm: 32 },
                    flexShrink: 0,
                  },
                  "& .MuiTabs-scrollButtons.Mui-disabled": {
                    opacity: 0.35,
                  },
                }}
              >
                <StyledTab
                  icon={<EmailIcon />}
                  label="Email Management"
                  iconPosition="start"
                />
                {moduleAccess["Template Designer"] && (
                  <StyledTab
                    icon={<DesignServicesIcon />}
                    label="Template Designer"
                    iconPosition="start"
                  />
                )}
              </Tabs>
            </Box>

      {activeTab === 0 && <EmailManagement />}
      {activeTab === 1 && moduleAccess["Template Designer"] && <TemplateDesigner/>}
    </Box>
  );
};

export default NotificationConfig;
