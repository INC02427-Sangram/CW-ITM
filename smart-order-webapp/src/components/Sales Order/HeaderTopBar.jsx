import ArrowBackIosTwoToneIcon from "@mui/icons-material/ArrowBackIosTwoTone";
import { HeaderControlButton } from "../../UIComponents/Button";
import { IconButton } from "@mui/material";
import { ButtonGroup, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import fnServiceRequest from "../../utility/fnServiceRequest";
import { useParams } from "react-router-dom";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { useTheme } from "@mui/material/styles";
import {
  setLineItemList,
  setStatus,
  setDeletedItems,
  setBusyIndicatorForDetailScreen,
  setShouldRefetchLineItems,
} from "../../redux/reducers/appReducer";
import { useDispatch, useSelector } from "react-redux";
import applicationConfig from "../../dataStore/applicationConfig";
import { useTranslation } from "react-i18next";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {
  setExceptionScreenFlag,
} from "../../redux/reducers/appReducer";
import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import fnDeleteConcurrentUser from "../../utility/fnDeleteConcurrentUser";
import moment from "moment";
import { Chip } from "@cw/rds";
import { ButtonTypes } from "../../UIComponents/UITypes";
import { Button } from "antd";
import Header from "./Exception Match/Header";
import { customDateTimeFormat } from "../../utility/CustomDateTimeFormat";
const HeaderTopBar = ({
  setEditMode,
  setHeaderInfoEdited,
  headerInfoEdited,
  splitScreenFlag,
  setSplitScreenFlag,
  editMode,
  viewDocumentServiceResponse,
  auditLogData,
  setAuditLogData,
  errorFlagForPoDocument,
  setErrorFlagForPoDocument,
  setGridItemWidth,
}) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const appSettings = useSelector((state) => state.appReducer.appSettings);
  const theme = useTheme();

  const headerInfo = useSelector((state) => state.appReducer.headerInfo);
  const salesOrderDetails = useSelector(
    (state) => state.appReducer.salesOrderDetails
  );
  const currentSalesOrg = useSelector(
    (state) => state.appReducer.currentSalesOrg
  );
  const salesOrgObject = useSelector(
    (state) => state.appReducer.salesOrgObject
  );
  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const manualScreenDetails = useSelector(
    (state) => state.appReducer.manualScreenDetails
  );
  // console.log("g ,", userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.appReducer.status);
  // console.log(status);
  const mid = useSelector((state) => state.appReducer.mid);
  const [anchorEl, setAnchorEl] = useState(null);
  const { orderHeaderId } = useParams();
  const [lockOrderFlag, setLockOrderFlag] = useState(false);
  var concurrentUserData = useSelector(
    (state) => state.appReducer.concurrentUserData
  );
  var userEmailId = useSelector((state) => state.appReducer.userEmailId);
  const [anchorPosition, setAnchorPosition] = useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickForChangeLog = (event) => {
    setAnchorEl(event.currentTarget);
    getAuditLogInfo(orderHeaderId);
  };

  const getAuditLogInfo = (orderHeaderId) => {
    const sUrl = `/JavaServices_Oauth/api/audit/getAuditInfo?requestId=${orderHeaderId}`;
    dispatch(setBusyIndicatorForDetailScreen(true));
    fnServiceRequest(
      sUrl,
      "GET",
      (response) => fnSuccessHandlerForAudit(response),
      (error) => fnErrorHandlerForAudit(error)
    );
  };
  function fnSuccessHandlerForAudit(response) {
    // console.log("A", response.length);
    // console.log("A", response);
    setAuditLogData(response.data);
    dispatch(setBusyIndicatorForDetailScreen(false));
  }
  // console.log(auditLogData);
  function fnErrorHandlerForAudit(error) {
    dispatch(setBusyIndicatorForDetailScreen(false));
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const exceptionTypeArray = [];
  let exceptions = salesOrderDetails?.exceptionType?.split(",") || [];
  if (salesOrderDetails?.exceptionType === "") {
    exceptions = [];
  }
  exceptions.forEach((exception) => {
    exceptionTypeArray.push(exception);
  });

  const fnViewPoDocument = () => {
    if (errorFlagForPoDocument.errorMessage) {
      setErrorFlagForPoDocument({
        visiblity: true,
        errorMessage: true,
      });
    } else {
      setSplitScreenFlag(true);
      setGridItemWidth(6);
    }
  };

  // console.log("Edit Mode:", editMode);

  const backButtonHandler = () => {
    dispatch(setLineItemList([]));
    dispatch(setDeletedItems([]));
    dispatch(setStatus(null));
    dispatch(setExceptionScreenFlag(false));

    fnDeleteConcurrentUser(orderHeaderId, userDetails);
    dispatch(setShouldRefetchLineItems(true));
    navigate(`/salesOrder`);
  };
  function stringAvatar(name) {
    let [firstName, lastName] = (name || "").split(".");
    firstName = (firstName || "").trim();
    lastName = (lastName || "").trim();

    return {
      sx: {
        bgcolor: "#C3E6FF",
        color: "black",
        width: 42,
        height: 42,
      },
      children: `${firstName[0] || ""}${lastName[0] || ""}`,
    };
  }



  return (
    <>
      {lockOrderFlag && (
        <CustomMessageToast
          open={lockOrderFlag}
          setOpen={setLockOrderFlag}
          messageType={"warning"}
          messageDescription={
            "Another user is making some changes in this order" +
            "  " +
            userEmailId
          }
          anchorPosition={anchorPosition}
        />
      )}
      <Grid
        container
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          position: "sticky",
          top: "0",
          padding: "1rem 1rem",
        }}
      >
        <Grid
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "0.5rem",
          }}
        >
          <button className="icon-btn bg-none-border-none">
            <ArrowCircleLeftOutlinedIcon
              fontSize="small"
              className="icon"
              sx={{ cursor: "pointer" }}
              onClick={() => backButtonHandler()}
            />
          </button>
          {status === "Created" ? (
            <h4
              style={{
                fontSize: "17.6px",
                fontFamily: "'Roboto', sans-serif",
                margin: 0,
              }}
            >
              {applicationConfig(t)?.detailScreenHeader[status]}{" "}
              {salesOrderDetails?.sapOrderId}
            </h4>
          ) : status === "pendingForApproval" ? (
            <h4
              style={{
                fontSize: "17.6px",
                fontFamily: "'Roboto', sans-serif",
                margin: 0,
              }}
            >
              Sales Order Details Request ID: {orderHeaderId}
            </h4>
          ) : status === "rejected" ? (
            <h4
              style={{
                fontSize: "17.6px",
                fontFamily: "'Roboto', sans-serif",
                margin: 0,
              }}
            >
              Sales Order Details Request ID: {orderHeaderId}
            </h4>
          ) : status === "createdWithBlock" ? (
            <h4
              style={{
                fontSize: "17.6px",
                fontFamily: "'Roboto', sans-serif",
                margin: 0,
              }}
            >
              {applicationConfig(t)?.detailScreenHeader[status]}{" "}
              {salesOrderDetails?.sapOrderId}
            </h4>
          ) : status === "toBeReviewed" ? (
            <h4
              style={{
                fontSize: "17.6px",
                fontFamily: "'Roboto', sans-serif",
                margin: 0,
              }}
            >
              Sales Order Details Request ID: {orderHeaderId}
            </h4>
          ) : (
            <h4
              style={{
                fontSize: "17.6px",
                fontFamily: "'Roboto', sans-serif",
                margin: 0,
              }}
            >
              Sales Order Details Request ID: {orderHeaderId}
            </h4>
          )}

          {status === "Created" ? (
            <Chip
              label="Created"
              style={{
                height: "2rem",
                backgroundColor: theme.palette.statusChips.created.bg,
                color: theme.palette.statusChips.created.text,
                border: `1px solid ${theme.palette.statusChips.created.bg}`,
              }}
            />
          ) : status === "pendingForApproval" ? (
            <Chip
              label="Pending For Approval"
              style={{
                height: "2rem",
                backgroundColor: theme.palette.statusChips.pendingForApproval.bg,
                color: theme.palette.statusChips.pendingForApproval.text,
                border: `1px solid ${theme.palette.statusChips.pendingForApproval.bg}`,
              }}
            />
          ) : status === "rejected" ? (
            <Chip
              label="Rejected"
              style={{
                height: "2rem",
                backgroundColor: theme.palette.statusChips.rejected.bg,
                color: theme.palette.statusChips.rejected.text,
                border: `1px solid ${theme.palette.statusChips.rejected.bg}`,
              }}
            />
          ) : status === "createdWithBlock" ? (
            <Chip
              label="Created With Block"
              style={{
                height: "2rem",
                backgroundColor: theme.palette.statusChips.created.bg,
                color: theme.palette.statusChips.created.text,
                border: `1px solid ${theme.palette.statusChips.created.bg}`,
              }}
            />
          ) : status === "toBeReviewed" ? (
            <Chip
              label="To Be Reviewed"
              style={{
                height: "2rem",
                backgroundColor: theme.palette.statusChips.toBeReviewed.bg,
                color: theme.palette.statusChips.toBeReviewed.text,
                border: `1px solid ${theme.palette.statusChips.toBeReviewed.bg}`,
              }}
            />
          )
            : status === "Queued" ? (
              <Chip
                label="Queued"
                style={{
                  height: "2rem",
                  backgroundColor: theme.palette.statusChips.queued.bg,
                  color: theme.palette.statusChips.queued.text,
                  border: `1px solid ${theme.palette.statusChips.queued.bg}`,
                }}
              />
            )
              : status === "Cancelled" ? (
                <Chip
                  label="Cancelled"
                  style={{
                    height: "2rem",
                    backgroundColor: theme.palette.statusChips.cancelled.bg,
                    color: theme.palette.statusChips.cancelled.text,
                    border: `1px solid ${theme.palette.statusChips.cancelled.bg}`,
                  }}
                />
              ) : (
                // Handle other cases if needed
                <div></div>
              )}
        </Grid>
        <Grid className="detail-header-actions" sx={{
          marginLeft: "auto",
        }}>
          <ButtonGroup
            className="create-mode"
            variant="text"
            style={{
              alignItems: "center",
            }}
          >

            <HeaderControlButton
              action={ButtonTypes.VIEW}
              onClick={handleClickForChangeLog}
              startIcon={<ReceiptLongIcon style={{ fontSize: "15px" }} />}
              title={t("changeLog")}
            >
              {t("changeLog")}
            </HeaderControlButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box
                sx={{
                  width: 350,
                  height: 400,
                }}
              >
                <Box
                  sx={{
                    height: 50,
                    backgroundColor: "#F1E9F5",
                  }}
                >
                  <div
                    className="auditLogHeader"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "6px",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    }}
                  >
                    <Typography sx={{ padding: "7px" }}>
                      {t("changeLog")}
                    </Typography>
                    <IconButton onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                </Box>
                <div className="auditContainer" style={{ padding: "20px" }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: "400",
                      paddingBottom: "12px",
                    }}
                  >
                    <strong>
                      {status === "Created" ? (
                        <>
                          {applicationConfig(t)?.detailScreenHeader[status]}{" "}
                          {salesOrderDetails?.sapOrderId}
                        </>
                      ) : status === "createdWithBlock" ? (
                        <>
                          {applicationConfig(t)?.detailScreenHeader[status]}{" "}
                          {salesOrderDetails?.sapOrderId}
                        </>
                      ) : (
                        <>
                          {t("Sales Order Details Request ID:")} {orderHeaderId}
                        </>
                      )}
                    </strong>
                  </Typography>
                  {auditLogData?.map?.((item, index) => (
                    <div
                      key={index}
                      style={{
                        paddingBottom: "20px",
                        borderBottom:
                          index < auditLogData.length - 1
                            ? "1px solid #f0f0f0"
                            : "none",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginBottom: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {customDateTimeFormat(appSettings, item?.createdDate, undefined, true)}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "flex-start",
                        }}
                      >
                        <Avatar {...stringAvatar(item?.createdBy)} />
                        <div style={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#333",
                              marginBottom: "4px",
                            }}
                          >
                            {item?.createdBy}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#666",
                              marginBottom: "8px",
                            }}
                          >
                            {item?.remarks}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
            </Popover>
            <HeaderControlButton
              action={ButtonTypes.VIEW}
              // className="view-Po bg-none-border-none"
              onClick={() => fnViewPoDocument()}
              title={t("viewPoDocument")}
            >
              {t("viewPoDocument")}
            </HeaderControlButton>
            {/* ...everything inside ButtonGroup stays exactly the same... */}
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
};

export default HeaderTopBar;
