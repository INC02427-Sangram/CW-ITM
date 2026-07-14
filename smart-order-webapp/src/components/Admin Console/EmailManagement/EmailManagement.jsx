import { Box, Grid } from "@mui/material";
import { useEmailManagement } from "./useEmailManagement";
import EmailManagementForm from "./EmailManagementForm";
import EmailManagementStats from "./EmailManagementStats";
import EmailManagementList from "./EmailManagementList";
import CustomMessageToast from "../../../utility/Custom Components/CustomMessageToast";
import CustomDeletePopover from "../../../utility/Custom Components/CustomDeletePopover";
import { emailGroups } from "./emailManagementConfig";

const EmailManagement = () => {
  const {
    // Email state
    emailId,
    emailList,
    isEmailValid,
    emailError,
    filteredEmailList,
    notificationTypes,

    // Form state
    activeStep,
    setActiveStep,
    selectedGroup,
    setSelectedGroup,
    selectedNotifications,
    handleNotificationTypeChange,

    // Organization state
    selectedCountry,
    setSelectedCountry,
    selectedSalesOrg,
    setSelectedSalesOrg,
    countries,
    salesOrganizations,

    // UI state
    isSubmitting,
    showSuccessAlert,
    setShowSuccessAlert,
    duplicateEmailAlertOpen,
    setDuplicateEmailAlertOpen,
    alertMessage,
    alertType,
    deleteDialogOpen,
    setDeleteDialogOpen,
    emailToDelete,

    // Search state
    searchTerm,
    setSearchTerm,

    // Actions
    handleEmailInputChange,
    handleSubmit,
    handleDeleteConfirm,
    handleDeleteAction,
  } = useEmailManagement();

  const anchorPosition = { vertical: 'bottom', horizontal: 'center' };

  const handleEdit = (row) => {
    console.log("Edit email:", row);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        marginLeft: { xs: 0, md: "20px" },
        paddingTop: 1,
        paddingRight: { xs: 0, md: 2 },
        overflowX: "hidden",
      }}
    >
      {/* Success Alert */}
      <CustomMessageToast
        open={showSuccessAlert}
        setOpen={setShowSuccessAlert}
        messageType={alertType}
        messageDescription={alertMessage}
        anchorPosition={anchorPosition}
      />

      {/* Duplicate Email Alert */}
      <CustomMessageToast
        open={duplicateEmailAlertOpen}
        setOpen={setDuplicateEmailAlertOpen}
        messageType="warning"
        messageDescription="This email already exists for the selected Country and Sales Organization combination."
        anchorPosition={anchorPosition}
      />

      <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
        {/* Form Section */}
        <Grid item xs={12} lg={8}>
          <EmailManagementForm
            emailId={emailId}
            isEmailValid={isEmailValid}
            emailError={emailError}
            handleEmailInputChange={handleEmailInputChange}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedSalesOrg={selectedSalesOrg}
            setSelectedSalesOrg={setSelectedSalesOrg}
            countries={countries}
            salesOrganizations={salesOrganizations}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            selectedNotifications={selectedNotifications}
            handleNotificationTypeChange={handleNotificationTypeChange}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            notificationTypes={notificationTypes}
          />
        </Grid>

        {/* Stats Section */}
        <Grid item xs={12} lg={4}>
          <EmailManagementStats emailList={emailList} />
        </Grid>

        {/* List Section */}
        <EmailManagementList
          emailList={emailList}
          filteredEmailList={filteredEmailList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleEdit={handleEdit}
          handleDeleteAction={handleDeleteAction}
        />
      </Grid>

      {/* Delete Confirmation Dialog */}
      <CustomDeletePopover
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Removal"
        message="Are you sure you want to remove this email from the Notification list?"
        confirmText="Delete"
        cancelText="Cancel"
        itemName={
          emailToDelete !== null && emailList[emailToDelete]
            ? `Mail Box Address: ${emailList[emailToDelete]?.emailId || ""}`
            : ""
        }
        itemDescription={
          emailToDelete !== null && emailList[emailToDelete]
            ? `Country: ${emailList[emailToDelete].countryName || "-"} | Sales Org: ${
                emailList[emailToDelete].salesOrg || "-"
              } | Group: ${
                emailGroups.find((g) => g.id === emailList[emailToDelete].recipientType)?.label ||
                emailList[emailToDelete].recipientType ||
                "-"
              }`
            : ""
        }
        showItemDetails={true}
      />
    </Box>
  );
};

export default EmailManagement;
