import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import CustomSelect from "../../UIComponents/CustomSelect";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import adminConsoleAdminConfiguration from "../../components/Admin Console/config";
import fnGetDistributionChannelList from "../fnGetDistributionChannelList";
import CustomMessageToast from "./CustomMessageToast";
import { getCountryCodes, getSalesOrgs, getDistributionChannels, getDivisions } from "../../components/Admin Console/fnAdminConsoleGetAll";
import AppTypography from "../../UIComponents/AppTypography";

const filterAutoCompleteSX = {
  width: "100%",
  "& input": {
    height: "1rem",
    fontSize: "0.875rem",
  },
  "& .MuiOutlinedInput-root": {
    padding: "5px 9px !important",
  },
};

const filterAutoCompleteTextfieldSX = {
  fontWeight: "300",
  fontSize: "0.5",
  lineHeight: "1rem",
};

const AttachmentDialogCard = ({
  attachment,
  setAttachment,
  salesOrgPayload,
  setSalesOrgPayload,
  poTypePayload,
  setPoTypePayload,
  distributionChannelPayload,
  setDistributionChannelPayload,
  setBusyIndicatorFlag,
  languagePayload,
  setLanguagePayload,
  country,
  setCountry,
  division,
  setDivision,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userLanguage = useSelector((state) => state.appReducer.userLanguage);
  const distributionChannelList = useSelector(
    (state) => state.appReducer.distributionChannelList
  );
  const salesOrgListSet = useSelector(
    (state) => state.appReducer.salesOrgListSet
  );
  const currentSalesOrg = useSelector(
    (state) => state.appReducer.currentSalesOrg
  );
  const { orderTypeDropdown } = adminConsoleAdminConfiguration(t);

  const filteredSalesOrgList = salesOrgListSet.filter((item) =>
    currentSalesOrg?.includes(item.SalesOrg)
  );

  const [isInValidInput, setIsInvalidInput] = useState(false);
  const [distChannelList, setDistChannelList] = useState([]);
  const [salesOrgValue, setSalesOrgValue] = useState(null);
  const [salesOrgInput, setSalesOrgInput] = useState("");
  const [distChannelValue, setDistChanelValue] = useState("");
  const [poTypeValue, setPoTypeValue] = useState(null);
  const [poTypeInput, setPoTypeInput] = useState("");

  // State variables for cascading dropdowns (using props from parent)
  const [countries, setCountries] = useState([]);
  const [salesOrgOptions, setSalesOrgOptions] = useState([]);
  const [distributionOptions, setDistributionOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);

  // Fetch countries on component mount
  useEffect(() => {
    getCountryCodes({
      onSuccess: (data) => setCountries(data),
      onError: (err) => console.error("Error fetching countries:", err),
      dispatch,
      setBusy: setBusyIndicatorFlag,
    });
  }, []);

  // Fetch sales org list when country changes
  const fetchSalesOrgList = (countryId) =>
    getSalesOrgs({
      countryId,
      onSuccess: (data) => setSalesOrgOptions(data),
      onError: (err) => console.error("Error fetching sales org list:", err),
      dispatch,
      setBusy: setBusyIndicatorFlag,
    });

  // Fetch distribution channel list when sales org changes
  const fetchDistributionChannelList = (countryId, org) =>
    getDistributionChannels({
      countryId,
      salesOrg: org,
      onSuccess: (data) => setDistributionOptions(data),
      onError: (err) =>
        // console.error("Error fetching distribution channels:", err),
        dispatch,
      setBusy: setBusyIndicatorFlag,
    });

  // Fetch division list when distribution channel changes
  const fetchDivisionList = (countryId, org, distChannel) =>
    getDivisions({
      countryId,
      salesOrg: org,
      distChannel,
      onSuccess: (data) => setDivisionOptions(data),
      onError: (err) => console.error("Error fetching division list:", err),
      dispatch,
      setBusy: setBusyIndicatorFlag,
    });

  const fnCloseUploadedPo = () => {
    setAttachment((prev) => ({ ...prev, name: null, base64: null }));
  };

  // Handle country change
  const handleCountryChange = (event) => {
    const selectedName = event.target.value;
    const selectedCountry = countries.find(
      (c) => c.countryName === selectedName
    );

    setCountry(selectedName);
    setSalesOrgValue(null);
    setSalesOrgPayload(null);
    setDistChanelValue("");
    setDistributionChannelPayload(null);
    setDivision(null);
    setSalesOrgOptions([]);
    setDistributionOptions([]);
    setDivisionOptions([]);

    if (selectedCountry?.countryId) {
      fetchSalesOrgList(selectedCountry.countryId);
    }
  };

  // Handle sales org change
  const handleSalesOrgChange = (event) => {
    const selectedOrg = event.target.value;
    setSalesOrgValue(selectedOrg);
    setSalesOrgPayload(selectedOrg);

    setDistChanelValue("");
    setDistributionChannelPayload(null);
    setDivision(null);
    setDistributionOptions([]);
    setDivisionOptions([]);

    const selectedCountry = countries.find((c) => c.countryName === country);
    if (selectedCountry?.countryId && selectedOrg) {
      fetchDistributionChannelList(selectedCountry.countryId, selectedOrg);
    }
  };

  // Handle distribution channel change
  const handleDistChange = (event) => {
    const selectedChannel = event.target.value;
    setDistChanelValue(selectedChannel);
    setDistributionChannelPayload(selectedChannel);

    setDivision(null);
    setDivisionOptions([]);

    const selectedCountry = countries.find((c) => c.countryName === country);
    if (selectedCountry?.countryId && salesOrgValue && selectedChannel) {
      fetchDivisionList(selectedCountry.countryId, salesOrgValue, selectedChannel);
    }
  };

  // Handle division change
  const handleDivisionChange = (event) => {
    const selectedDivision = event.target.value;
    setDivision(selectedDivision);
  };

  const fnHandleChangeForOrderType = (newValue) => {
    const poType = newValue?.key;
    setPoTypePayload(poType);
    setPoTypeValue(newValue);
    setLanguagePayload(newValue?.Language);
  };

  return (
    <>
      {isInValidInput && (
        <CustomMessageToast
          open={isInValidInput}
          setOpen={setIsInvalidInput}
          messageType={"warning"}
          messageDescription={"Please Enter a  valid Input"}
          anchorPosition={{ vertical: "bottom", horizontal: "center" }}
        />
      )}

      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          maxHeight: { xs: "600px", sm: "500px", md: "450px" },
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={{ xs: 1, sm: 0 }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={550}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {attachment.name == null ? t("noPoSelected") : t("POName")}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ borderBottom: `${attachment.name ? `3px solid ${theme.palette.primary.main}` : "none"}`, width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "space-between", sm: "flex-end" } }}
          >
            <Tooltip title={attachment?.name || ""}>
              <Typography sx={{
                color: theme.palette.text.primary,
                fontWeight: 550,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: { xs: "200px", sm: "300px" },
              }}>
                {attachment?.name
                  ? attachment.name.length > 22
                    ? `${attachment.name.slice(0, 22)}…`
                    : attachment.name
                  : ""}
              </Typography>
            </Tooltip>
            <IconButton
              aria-label="close-Window"
              title="Close the selected PO"
              onClick={fnCloseUploadedPo}
              sx={{
                visibility: attachment.name == null ? "hidden" : "visible",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "max-content 1fr" },
            rowGap: { xs: 1.5, sm: 2 },
            columnGap: 2,
            alignItems: "center",
          }}
        >
          <Typography sx={{ whiteSpace: "nowrap" }}>
            <span style={{ color: theme.palette.text.primary }}>* </span>
            {t("Country")}
          </Typography>
          <CustomSelect
            options={countries.map((countryObj) => ({ key: countryObj.countryName, value: countryObj.countryName }))}
            value={country || ""}
            onChange={(e) => {
              handleCountryChange({ target: { value: e.target.value } });
            }}
            placeholder="Select a Country"
            sx={{ width: "100%" }}
          />

          <Typography sx={{ whiteSpace: "nowrap" }}>
            <span style={{ color: theme.palette.text.primary }}>* </span>
            {t("salesOrg")}
          </Typography>
          <CustomSelect
            options={salesOrgOptions.map((org) => ({ key: org, value: org }))}
            value={salesOrgValue || ""}
            onChange={(e) => {
              handleSalesOrgChange({ target: { value: e.target.value } });
            }}
            placeholder={!country ? "Select Country First" : "Select Sales Org"}
            disabled={!country}
            sx={{ width: "100%" }}
          />

          <Typography sx={{ whiteSpace: "nowrap" }}>
            {t("distributionChannel")}
          </Typography>
          <CustomSelect
            options={distributionOptions.map((channel) => ({ key: channel, value: channel }))}
            value={distChannelValue || ""}
            onChange={(e) => {
              handleDistChange({ target: { value: e.target.value } });
            }}
            placeholder={!country || !salesOrgValue ? "Select Sales Org First" : distributionOptions.length === 0 ? "No Dist. Channel maintained" : "Select Distribution Channel"}
            disabled={!country || !salesOrgValue}
            sx={{ width: "100%" }}
          />

          <Typography sx={{ whiteSpace: "nowrap" }}>
            {t("Division")}
          </Typography>
          <CustomSelect
            options={divisionOptions.map((div) => ({ key: div, value: div }))}
            value={division || ""}
            onChange={handleDivisionChange}
            disabled={!country || !salesOrgValue || !distChannelValue}
            placeholder={!distChannelValue ? "Select Dist Channel First" : divisionOptions.length === 0 ? "No Division maintained" : "Select Division"}
            sx={{ width: "100%" }}
          />

          <Typography sx={{ whiteSpace: "nowrap" }}>
            <span style={{ color: theme.palette.text.primary }}>* </span>
            {t("orderType")}
          </Typography>
          <CustomSelect
            options={orderTypeDropdown.map((orderType) => ({ key: orderType.key, value: orderType.value }))}
            value={poTypeValue?.key || ""}
            onChange={(e) => {
              const selectedOrderType = orderTypeDropdown.find(item => item.key === e.target.value);
              setPoTypeValue(selectedOrderType);
              fnHandleChangeForOrderType(selectedOrderType);
            }}
            placeholder={!country || !salesOrgValue ? "Select Sales Org First" : "Select Order Type"}
            disabled={!country || !salesOrgValue}
            sx={{ width: "100%" }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default AttachmentDialogCard;

