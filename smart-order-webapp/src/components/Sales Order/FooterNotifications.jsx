import CustomMessageToast from "../../utility/Custom Components/CustomMessageToast";
import CustomMessagePopover from "../../utility/Custom Components/CustomMessagePopover";
import CustomDeletePopover from "../../utility/Custom Components/CustomDeletePopover";
import { useTranslation } from "react-i18next";

/**
 * Footer notifications component
 */
const FooterNotifications = ({
  toastFlag,
  setToastFlag,
  lockOrderFlag,
  setLockOrderFlag,
  userEmailId,
  validationErrors,
  messagePopoverVisibility,
  messagePopoverStatus,
  cancelService,
  scheduleService,
  rejectDialogOpen,
  setRejectDialogOpen,
  rejectNotes,
  setRejectNotes,
  onConfirmReject,
  anchorPosition,
  errorFlagForNullMaterial,
  setErrorFlagForNullMaterial,
  errorFlagEmptyMaterialList,
  setErrorFlagEmptyMaterialList,
  open,
  setOpen,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Toast for general errors */}
      {toastFlag.visibility && (
        <CustomMessageToast
          open={toastFlag.visibility}
          setOpen={() => setToastFlag({ visibility: false, message: null })}
          messageType="error"
          messageDescription={toastFlag.message}
          anchorPosition={anchorPosition}
        />
      )}

      {/* Toast for lock order */}
      {lockOrderFlag && (
        <CustomMessageToast
          open={lockOrderFlag}
          setOpen={setLockOrderFlag}
          messageType="warning"
          messageDescription={`Another user is making some changes in this order ${userEmailId}`}
          anchorPosition={anchorPosition}
        />
      )}

      {/* Toast for null material */}
      {errorFlagForNullMaterial?.visiblity && (
        <CustomMessageToast
          open={true}
          setOpen={setOpen}
          messageType="error"
          messageDescription={errorFlagForNullMaterial.errorMessage}
          anchorPosition={anchorPosition}
          setErrorFlagForNullMaterial={setErrorFlagForNullMaterial}
        />
      )}

      {/* Toast for empty material list */}
      {errorFlagEmptyMaterialList?.visiblity && (
        <CustomMessageToast
          open={true}
          setOpen={setOpen}
          messageType="error"
          messageDescription={errorFlagEmptyMaterialList.errorMessage}
          anchorPosition={anchorPosition}
          setErrorFlagEmptyMaterialList={setErrorFlagEmptyMaterialList}
        />
      )}

      {/* Warning Popover */}
      {messagePopoverVisibility && messagePopoverStatus.status === "Warning" && (
        <CustomMessagePopover
          popOverMessageObj={messagePopoverStatus}
          cancelService={cancelService}
        />
      )}

      {/* Delete Popover */}
      {messagePopoverVisibility && messagePopoverStatus.status === "Delete" && (
        <CustomMessagePopover
          popOverMessageObj={messagePopoverStatus}
          deleteService={() => {
            console.warn("Delete service not implemented");
          }}
        />
      )}

      {/* Schedule Simulation Popover */}
      {messagePopoverVisibility &&
        messagePopoverStatus.status === "Schedule Simulation" && (
          <CustomMessagePopover
            popOverMessageObj={{ status: "Schedule Simulation" }}
            scheduleService={scheduleService}
          />
        )}

      {/* Error Popover */}
      {messagePopoverVisibility && messagePopoverStatus.status === "Error" && (
        <CustomMessagePopover popOverMessageObj={messagePopoverStatus} />
      )}

      {/* Reject Dialog */}
      <CustomDeletePopover
        open={rejectDialogOpen}
        onClose={() => {
          setRejectDialogOpen(false);
          setRejectNotes("");
        }}
        onConfirm={onConfirmReject}
        title={t("Confirm Rejection")}
        message={t("Are you sure you want to reject this approval?")}
        confirmText={t("Reject")}
        cancelText={t("Cancel")}
        showItemDetails={false}
        requireNotes={true}
        notes={rejectNotes}
        onNotesChange={setRejectNotes}
      />
    </>
  );
};

export default FooterNotifications;
