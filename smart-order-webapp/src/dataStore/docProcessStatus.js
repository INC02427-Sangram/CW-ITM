// Shared document process status constants
export const DOC_STATUS_PENDING_FOR_APPROVAL = "Pending For Approval";
export const DOC_STATUS_REJECTED = "Rejected";
export const DOC_STATUS_TO_BE_REVIEWED = "To Be Reviewed";
export const DOC_STATUS_QUEUED = "Queued";
export const DOC_STATUS_CREATED_WITH_BLOCK = "Created With Block";

// UI / redux status keys (normalized)
export const UI_STATUS_TO_BE_REVIEWED = "toBeReviewed";

// Add other statuses here in future if needed

export default {
  DOC_STATUS_PENDING_FOR_APPROVAL,
  DOC_STATUS_REJECTED,
  DOC_STATUS_TO_BE_REVIEWED,
  DOC_STATUS_CREATED_WITH_BLOCK,
};
