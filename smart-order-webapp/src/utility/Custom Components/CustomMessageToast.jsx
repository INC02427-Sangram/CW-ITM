
import React from "react";
// import { Alert } from '@cw/rds';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { setFileUploadMessage } from "../../redux/reducers/appReducer"
import { useDispatch } from "react-redux";
import { setMessageToastForInvalidLineItem, setMessageToastForAdminConsole } from "../../redux/reducers/appReducer";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const CustomMessageToast = ({
  // custom Message toast which receives open as true, message type as error, warning, information or success
  // and messageDescription is the message we want to show on Snackbar
  // anchorPosition is position of toaster
  open,
  setOpen,
  messageType,
  messageDescription,
  anchorPosition,
  isSessionTimeoutWarning = false,
  setErrorFlagForPoDocument,
  setErrorFlagForUploadPo,
  setErrorFlagForNullMaterial,
  setErrorFlagForInvalidDate,
  setErrorFlagForNullQuantity,
  setErrorFlagEmptyMaterialList,
  setErrorFlagForSalesEmployee

}) => {

  const dispatch = useDispatch();
  const handleClose = (event, reason) => {

    if (isSessionTimeoutWarning) {
      return;
    }


    setOpen(false);
    dispatch(setFileUploadMessage({
      visiblity: false,
      message: "",
      type: ""
    }))
    dispatch(setMessageToastForInvalidLineItem(false))
    dispatch(setMessageToastForAdminConsole(
      {
        visiblity: false,
        message: null,
        type: null
      }
    ))
    // setErrorFlagForPoDocument(false);
    if (setErrorFlagForPoDocument) {
      setErrorFlagForPoDocument({
        visiblity: false,
        errorMessage: true
      });
    }
    if (setErrorFlagForUploadPo) {
      setErrorFlagForUploadPo({
        visiblity: false,
        errorMessage: null,
      })
    }
    if (setErrorFlagForNullMaterial) {
      setErrorFlagForNullMaterial({
        visiblity: false,
        errorMessage: null,
      })
    }
    if (setErrorFlagForInvalidDate) {
      setErrorFlagForInvalidDate({
        visiblity: false,
        errorMessage: null,
      })
    }
    if (setErrorFlagForNullQuantity) {
      setErrorFlagForNullQuantity({
        visiblity: false,
        errorMessage: null,
      })
    }
    if (setErrorFlagEmptyMaterialList) {
      setErrorFlagEmptyMaterialList({
        visiblity: false,
        errorMessage: null,
      })
    }
    if (setErrorFlagForSalesEmployee) {
      setErrorFlagForSalesEmployee({
        visiblity: false,
        errorMessage: null,
      })
    }
  };

  return (
    <>
      <Snackbar
        open={Boolean(open)}
        autoHideDuration={
          isSessionTimeoutWarning
            ? null
            : (messageDescription === "PO Document Succesfully Uploaded" ||
              messageDescription === "Unable to Upload PO  Document")
              ? 7000
              : 4000
        }
        onClose={handleClose}
        // ContentProps={{
        //     sx: {
        //       background: "red"
        //     }
        //   }}
        anchorOrigin={{
          vertical: anchorPosition.vertical,
          horizontal: anchorPosition.horizontal,
        }}
      >
        <Alert onClose={isSessionTimeoutWarning ? undefined : handleClose} severity={messageType}>
          {messageDescription}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomMessageToast;

