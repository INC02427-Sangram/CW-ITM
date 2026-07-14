import { useEffect, useState } from "react";
import CustomMessageToast from "./CustomMessageToast";
import AttachmentDialogHeader from "./AttachmentDialogHeader";
import { DialogActions } from "@mui/material";
import { Stack } from "@mui/material";
import AttachmentDialogTable from "./AttachmentDialogTable";
import AttachmentDragAndDrop from "./AttachmentDragAndDrop";
import { Grid } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import { useTranslation } from "react-i18next";
import { Dialog, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import { HeaderControlButton as HeaderButton } from "../../UIComponents/Button";
import {
  setFileUploadMessage,
  setTotalRecords,
  setSmartOrderList,
} from "../../redux/reducers/appReducer";
import { useDispatch, useSelector } from "react-redux";
import fetchWrapper from "../fetchWrapper";
import { getCountryCodes } from "../../components/Admin Console/fnAdminConsoleGetAll";
import { ButtonTypes } from "../../UIComponents/UITypes";

const gridResponsiveConfig = {
  dragDrop: {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
  },
  formTable: {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
  },
};

const AttachmentDialog = ({
  dialogVisibility,
  setDialogVisibility,
  busyIndicatorFlag,
  setBusyIndicatorFlag,
}) => {
  const theme = useTheme();
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [anchorPosition, setAnchorPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const [errorFlagForUploadPo, setErrorFlagForUploadPo] = useState({
    visiblity: false,
    errorMessage: null,
  });
  let timer;

  const [attachment, setAttachment] = useState({
    name: null,
    base64: null,
  });
  const [openFlag, setOpenFlag] = useState(false);
  // these two states will be send as payload for the manual upload file service
  const [salesOrg, setSalesOrg] = useState(null);
  const [distributionChannel, setDistributionChannel] = useState(null);
  const [languagePayload, setLanguagePayload] = useState("null");
  const [poType, setPoType] = useState(null);
  const [country, setCountry] = useState(null);
  const [division, setDivision] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [countryCodesList, setCountryCodesList] = useState([]);

  // console.log("Are u rendering??");

  const handleClick = (event) => {
    setDialogVisibility(event.currentTarget);
  };

  const handleClose = () => {
    setDialogVisibility(null);
    // Clear all form fields when closing
    setAttachment((prev) => {
      return {
        ...prev,
        name: null,
        base64: null,
      };
    });
    setSalesOrg(null);
    setDistributionChannel(null);
    setPoType(null);
    setCountry(null);
    setDivision(null);
    setLanguagePayload("null");
    setCountryCode(null);
  };

  const open = Boolean(dialogVisibility);
  const id = open ? "simple-popover" : undefined;

  // Fetch country codes when component mounts
  useEffect(() => {
    getCountryCodes({
      onSuccess: (data) => {
        setCountryCodesList(data);
        // console.log("Country codes fetched:", data);
      },
      onError: (err) => console.error("Error fetching country codes:", err),
      dispatch,
      setBusy: setBusyIndicatorFlag,
    });
  }, []);

  // Update country code when country changes
  useEffect(() => {
    // console.log("Country changed to:", country);
    // console.log("Available country codes:", countryCodesList);

    if (country && countryCodesList.length > 0) {
      const selectedCountry = countryCodesList.find(c => c.countryName === country);
      // console.log("Selected country object:", selectedCountry);

      if (selectedCountry) {
        setCountryCode(selectedCountry.countryCode);
        // console.log("Country code set to:", selectedCountry.countryCode);
      } else {
        // console.log("No matching country found for:", country);
        setCountryCode(null);
      }
    } else {
      setCountryCode(null);
    }
  }, [country, countryCodesList]);

  const handleDragAndDropUpload = (file) => {
    // here before setting the state of attachment we need to keep a check on the number of pages present in the document
    
    // Validate file exists
    if (!file || !file[0] || !file[0].file) {
      return;
    }
    
    // Check if file is an image format
    const fileName = file[0].file.name.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif', '.ico'];
    const isImage = imageExtensions.some(ext => fileName.endsWith(ext));
    
    if (isImage) {
      dispatch(
        setFileUploadMessage({
          visiblity: true,
          message: "Image formats are not supported for manual upload",
          type: "error",
        })
      );
      return;
    }

    // Allow PDF and Excel files to proceed normally
    setAttachment((prev) => {
      return {
        ...prev,
        name: file[0].file.name,
        base64: file[0].data.split("base64")?.[1].slice(1),
      };
    });
  };

  // Invalidate sales orders query to trigger refetch in SalesOrder component
  const refreshSalesOrders = () => {
    queryClient.invalidateQueries({ queryKey: ['salesOrders'] });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: theme.palette.background.default,
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const fnCancelFileSelected = () => {
    setDialogVisibility(null);
    setAttachment((prev) => {
      return {
        ...prev,
        name: null,
        base64: null,
      };
    });
    setSalesOrg(null);
    setDistributionChannel(null);
    setPoType(null);
    setCountry(null);
    setDivision(null);
    setLanguagePayload("null");
    setCountryCode(null);
  };
  const fnSaveFileSelected = () => {
    const sUploadUrl = `/JavaServices_Oauth/api/v1/manual/uploadDocument`;

    // Ensure country code is set if it's missing
    let finalCountryCode = countryCode;
    if (!countryCode && country && countryCodesList.length > 0) {
      const selectedCountry = countryCodesList.find(c => c.countryName === country);
      if (selectedCountry) {
        finalCountryCode = selectedCountry.countryCode;
        setCountryCode(selectedCountry.countryCode);
        // console.log("Country code set during upload:", finalCountryCode);
      }
    }

    const oPayload = {
      base64: attachment?.base64,
      fileName: attachment?.name,
      distChannel: distributionChannel,
      salesOrg: salesOrg,
      language: languagePayload || "en",
      poType: poType,
      countryCode: finalCountryCode,
      division: division,
    };
    setBusyIndicatorFlag(true);
    // console.log("Final Upload Payload:", oPayload);
    let requestOptions = {
      method: "POST",
      body: JSON.stringify(oPayload),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
    fetchWrapper(sUploadUrl, requestOptions)
      .then((res) => {
        // console.log(res);
        if (!res.ok) {
          throw { status: res.status };
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);

        // Check for error responses first
        if (data?.status === "BAD_REQUEST" || data?.statusCode === 400) {
          dispatch(
            setFileUploadMessage({
              visiblity: true,
              message: data?.message || "Failed to Upload PO!",
              type: "error",
            })
          );
          // setDialogVisibility(null);
          // setBusyIndicatorFlag(false);
          // return;
        }

        else if (
          data?.message ==
          "Cann't Process The PDF's which has Pages more than 20"
        ) {
          dispatch(
            setFileUploadMessage({
              visiblity: true,
              message: t("pdfPageLimitErrorMessage"),
              type: "error",
            })
          );
        } else if (
          data?.message == "Unable to Process The PO as Multiple Sheets Exists"
        ) {
          dispatch(
            setFileUploadMessage({
              visiblity: true,
              message: t("multiplePageErrorMessage"),
              type: "error",
            })
          );
        } else if (data?.message == "Cann't Process The Excel") {
          dispatch(
            setFileUploadMessage({
              visiblity: true,
              message: t("excelPageErrorMessage"),
              type: "error",
            })
          );
        } else if (data?.message == "Invalid token Exception") {
          dispatch(
            setFileUploadMessage({
              visiblity: true,
              message: t("invalidException"),
              type: "error",
            })
          );
        } else if (data?.message == "PO Already Exist") {
          dispatch(
            setFileUploadMessage({
              visiblity: true,
              message: t("poalreadyExists"),
              type: "error",
            })
          );
        }
        else if (data?.message == "error") {
          dispatch(
            setFileUploadMessage({
              visiblity: true,
              message: t("Unable to Upload PO Document."),
              type: "error",
            })
          );
        }

        else {

          dispatch(
            setFileUploadMessage({
              visiblity: true,
              message: "PO Document Succesfully Uploaded",
              type: "info",
            })
          );
        }

        // Clear all form fields on successful upload
        setAttachment((prev) => {
          return {
            ...prev,
            name: null,
            base64: null,
          };
        });
        setSalesOrg(null);
        setDistributionChannel(null);
        setPoType(null);
        setCountry(null);
        setDivision(null);
        setLanguagePayload("null");
        setCountryCode(null);



        setDialogVisibility(null);
        setBusyIndicatorFlag(false);
        refreshSalesOrders();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      })
      .catch((error) => {
        // console.log(error);

        // Handle different types of errors
        let errorMessage = "Unable to Upload PO Document";

        if (error.status === 400) {
          errorMessage = "Bad Request: Please check your input data";
        } else if (error.status === 401) {
          errorMessage = "Unauthorized: Please login again";
        } else if (error.status === 403) {
          errorMessage = "Forbidden: You don't have permission to upload";
        } else if (error.status === 404) {
          errorMessage = "Service not found";
        } else if (error.status === 500) {
          errorMessage = "Server error: Please try again later";
        }

        dispatch(
          setFileUploadMessage({
            visiblity: true,
            message: errorMessage,
            type: "error",
          })
        );
        setDialogVisibility(null);
        setBusyIndicatorFlag(false);
      });
  };
  useEffect(() => {


    return () => {
      // console.log("component gets unmounted");

      setAttachment((prev) => {
        return {
          ...prev,
          name: null,
          base64: null,
        };
      });
      setCountry(null);
      setSalesOrg(null);
      setDistributionChannel(null);
      setPoType(null);
      setDivision(null);
      setCountryCode(null);
      clearTimeout(timer);
    };
  }, [dialogVisibility]);
  return (
    <>
      {errorFlagForUploadPo.visiblity && (
        <CustomMessageToast
          open={true}
          setOpen={setOpenFlag}
          messageType={"error"}
          messageDescription={errorFlagForUploadPo.errorMessage}
          anchorPosition={anchorPosition}
          setErrorFlagForUploadPo={setErrorFlagForUploadPo}
        />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: { xs: "95%", sm: "90%", md: "80%", lg: "60%" },
              maxHeight: { xs: "95vh", sm: "90vh" },
              margin: { xs: 1, sm: 2 },
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <AttachmentDialogHeader
          title={t("uploadDocument")}
          onClose={handleClose}
        />
        <DialogContent 
          class="remove-border" 
          sx={{ 
            overflow: "auto",
            flex: 1,
            padding: { xs: 1, sm: 2 },
          }}
        >
          <Grid 
            container 
            spacing={{ xs: 2, sm: 2, md: 3 }}
          >
            <Grid item {...gridResponsiveConfig.dragDrop}>
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  boxShadow: 2,
                  bgcolor: theme.palette.background.default,
                  height: "100%",
                  minHeight: { xs: "250px", sm: "300px" },
                  maxHeight: { xs: "400px", sm: "500px" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ marginTop: "24px", flex: 1 }}>
                  <AttachmentDragAndDrop
                    maxFileSize={2}
                    handleUpload={handleDragAndDropUpload}
                    filesLimit={1}
                    dropzoneText={t("dropPoDocument")}
                  />
                </div>
              </Box>
            </Grid>

            <Grid item {...gridResponsiveConfig.formTable}>
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  boxShadow: 2,
                  bgcolor: theme.palette.background.default,
                  height: "100%",
                  minHeight: { xs: "250px", sm: "300px" },
                  maxHeight: { xs: "600px", sm: "500px" },
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
                id="attachment-view-model-table-container"
              >
                <AttachmentDialogTable
                  attachment={attachment}
                  setAttachment={setAttachment}
                  salesOrgPayload={salesOrg}
                  setSalesOrgPayload={setSalesOrg}
                  poTypePayload={poType}
                  setPoTypePayload={setPoType}
                  distributionChannelPayload={distributionChannel}
                  setDistributionChannelPayload={setDistributionChannel}
                  setBusyIndicatorFlag={setBusyIndicatorFlag}
                  languagePayload={languagePayload}
                  setLanguagePayload={setLanguagePayload}
                  country={country}
                  setCountry={setCountry}
                  division={division}
                  setDivision={setDivision}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: { xs: 2, sm: 3 }, flexShrink: 0 }}>
          <Stack
            sx={{
              width: "100%",
              justifyContent: "flex-end",
            }}
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <HeaderButton
              action={ButtonTypes.CANCEL}
              // className="cancel-selected-po"
              onClick={() => fnCancelFileSelected()}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              {t("cancel")}
            </HeaderButton>
            <HeaderButton
              action={ButtonTypes.SAVE}
              // className="save-selected-po"
              disabled={
                !(
                  Boolean(attachment?.base64) &&
                  Boolean(salesOrg) &&
                  Boolean(poType) &&
                  Boolean(country)
                )
              }
              sx={{ width: { xs: "100%", sm: "auto" } }}
              onClick={() => {
                  if (
                    !Boolean(attachment?.base64) ||
                    !Boolean(salesOrg) ||
                    !Boolean(poType) ||
                    !Boolean(country)
                  ) {
                    setErrorFlagForUploadPo({
                      visiblity: true,
                      errorMessage: "Please fill all the required fields",
                    });
                  } else {
                    fnSaveFileSelected();
                  }
                }}
              >
                {t("upload")}
              </HeaderButton>
            </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttachmentDialog;

