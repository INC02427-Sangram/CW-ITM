import { Tooltip } from "@mui/material";
import { FooterControlButton as FooterButton } from "../../UIComponents/Button";
import { ButtonTypes } from "../../UIComponents/UITypes";
import { useTranslation } from "react-i18next";
import {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
  DOC_STATUS_QUEUED,
  DOC_STATUS_TO_BE_REVIEWED
} from "../../dataStore/docProcessStatus";

/**
 * Footer buttons component
 */
const FooterButtons = ({
  theme,
  isCSR,
  currentStatus,
  isLocked,
  isLoading,
  messagePopoverVisible,
  onApprovalClick,
  onRejectClick,
  onSaveLaterClick,
  onCancelClick,
  onSubmitClick,
}) => {
  const { t } = useTranslation();

  const isPendingApproval = currentStatus === DOC_STATUS_PENDING_FOR_APPROVAL;
  const isRejected = currentStatus === DOC_STATUS_REJECTED;

  // Button visibility logic
  const isNonCSR = !isCSR;
  const showRejectButton = isPendingApproval && isNonCSR;
  const showApprovalButtons = isCSR && (!isPendingApproval || isRejected);
  const showWaitingButton = isCSR && isPendingApproval;
  const showDirectButtons = !isCSR && !isRejected;

  const isDisabled = messagePopoverVisible || isLocked || isLoading;
  const isQueuedOrder = currentStatus === DOC_STATUS_QUEUED;
  return (
    <div className="footerButtons"
      style={{
        display: "flex",
        marginRight: "10px",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        rowGap:10,
        colGap:5
      }}>
      {/* Approval Button - for CSR */}
      {showApprovalButtons && (
        <FooterButton
          action={ButtonTypes.REQUEST}
          disabled={isDisabled}
          onClick={onApprovalClick}
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
        >
          <span>
            {isRejected ? "Resubmit for Approval" : "Request Approval"}
          </span>
        </FooterButton>
      )}

      {/* Reject Button - for non-CSR when pending approval */}
      {showRejectButton && (
        <FooterButton
          action={ButtonTypes.REJECT}
          disabled={isDisabled}
          onClick={onRejectClick}
        >
          <span>Reject Approval</span>
        </FooterButton>
      )}

      {/* Save Later Button - for non-CSR direct flow */}
      {showDirectButtons && (
        <Tooltip title={isQueuedOrder ? "This order is currently queued for submission." : ""} arrow placement="top">
          <span style={{ display: "inline-block" }}>
            <FooterButton
              disabled={isDisabled || isQueuedOrder}
              onClick={onSaveLaterClick}
              style={{
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              <span>{t("Save Later")}</span>
            </FooterButton>
          </span>
        </Tooltip>
      )}

      {/* Cancel PO Button */}
      {!(isCSR && isPendingApproval) && (
        <FooterButton
          action={ButtonTypes.CANCEL}
          disabled={messagePopoverVisible || isLocked}
          onClick={onCancelClick}
          style={{
            cursor: isLocked ? "not-allowed" : "pointer",
          }}
        >
          <span>{t("Cancel PO")}</span>
        </FooterButton>
      )}

      {/* Waiting for Approval Button */}
      {showWaitingButton && (
        <Tooltip
          title="This order is currently pending approval from the designated authority."
          arrow
          placement="top"
        >
          <span style={{ cursor: "not-allowed" }}>
            <FooterButton
              action={ButtonTypes.WAITING}
              disabled
            >
              <span>Waiting For Approval</span>
            </FooterButton>
          </span>
        </Tooltip>
      )}

      {/* Submit to SAP Button */}
      {showDirectButtons && (
        <Tooltip
          title={isQueuedOrder ? "This order is currently queued for submission." : ""}
          arrow
          placement="top"
        >
          <span style={{ display: "inline-block" }}>
            <FooterButton
              action={ButtonTypes.SAVE}
              disabled={messagePopoverVisible || isLocked || isQueuedOrder}
              onClick={onSubmitClick}
              style={{
                cursor: isLocked ? "not-allowed" : "pointer",
              }}
            >
              <span>{t("submitToSap")}</span>
            </FooterButton>
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default FooterButtons;
