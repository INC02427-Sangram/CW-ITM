import { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CustomMessagePopover from "../../utility/Custom Components/CustomMessagePopover";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import BusyIndicator from "../../utility/BusyIndicator";
import fnGetDistributionChannelName from "../../utility/fnGetDistributionChannelName";
import fnServiceRequest from "../../utility/fnServiceRequest";
import BasicDetails from "./BasicDetails";
import AdditionalOrderInfo from "./AdditionalOrderInfo";
import PoDetails from "./PoDetails";
// Constants
const DEBOUNCE_DELAY = 1000;
const SEARCH_MIN_LENGTH = 2;

const HeaderInfoNew = ({ gridItemWidth,
    editMode,
    splitScreenFlag,
    validate,
    setValidate,
    poAlreadyExistsToast,
    setPoAlreadyExistsToast,
    setPoWarning,
    getOrderHeaderById,
    poWarning,
}) => {
    const { t } = useTranslation();
    const [tabValue, setTabValue] = useState(0);
    const [busyIndicator, setBusyIndicator] = useState(false);
    const [errorFlag, setErrorFlag] = useState({ visibility: false, errorMessage: null });
    const headerInfo = useSelector((state) => state.appReducer.headerInfo);
    const workflowTaskDetails = useSelector(
        (state) => state.appReducer.workflowTaskDetails
    );
    const dispatch = useDispatch();
    const { orderHeaderId } = useParams();
    const [salesOrderData, setSalesOrderData] = useState([]);

    const salesOrderDetails = useSelector(
        (state) => state.appReducer.salesOrderDetails
    );


    useEffect(() => {
        // Hook automatically fetches data when orderHeaderId changes
        setSalesOrderData(salesOrderDetails);

    }, [salesOrderDetails]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <>
            {/* {busyIndicator && <BusyIndicator />} */}

            <Box sx={{
                pl:2
            }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    sx={{
                        "& .MuiTabs-flexContainer": { gap: 2 },
                        "& .MuiTab-root": {
                            minWidth: "auto",
                            px: 2,
                            textTransform: "none",
                        },
                    }}
                >
                    <Tab label="Basic Details" />
                    <Tab label="Additional Details" />
                    <Tab label="PO Details" />
                </Tabs>
            </Box>
            <Box sx={{ pl: 2 }}>
                {tabValue === 0 && (
                    <BasicDetails
                        gridItemWidth={gridItemWidth}
                        editMode={editMode}
                        salesOrderData={salesOrderData}
                        setSalesOrderData={setSalesOrderData}
                        splitScreenFlag={splitScreenFlag}
                        validate={validate}
                        setValidate={setValidate}
                        poAlreadyExistsToast={poAlreadyExistsToast}
                        setPoAlreadyExistsToast={setPoAlreadyExistsToast}
                        setPoWarning={setPoWarning}
                        poWarning={poWarning}
                        getOrderHeaderById={getOrderHeaderById}
                    />
                )}
                {tabValue === 1 && (
                    <AdditionalOrderInfo />
                )}
                {tabValue === 2 && (
                    <PoDetails />
                )}
            </Box>

        </>
    );
};

export default HeaderInfoNew;
