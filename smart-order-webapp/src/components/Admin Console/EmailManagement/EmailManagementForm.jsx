import React from "react";
import {
  Typography,
  Grid,
  Box,
  FormControl,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Avatar,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { CustomTextField } from "../../../UIComponents/CustomTextField";
import CustomSelect from "../../../UIComponents/CustomSelect";
import { AdminControlButton as AdminButton } from "../../../UIComponents/Button";
import { ButtonTypes } from "../../../UIComponents/UITypes";
import { Mail } from "@cw/rds/icons";
import { styled } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { useTheme } from "@mui/material/styles";
import { Plus } from "@cw/rds/icons";
import { Step, StepLabel, StepContent, Stepper, Chip } from "@cw/rds";
import { steps, emailGroups } from "./emailManagementConfig";

/**
 * EmailManagementForm Component
 * Handles the multi-step form for adding email notifications
 */

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "16px",
  transition: "transform 0.2s ease-in-out",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    borderRadius: "12px",
  },
}));

const EmailManagementForm = ({
  emailId,
  isEmailValid,
  emailError,
  handleEmailInputChange,
  activeStep,
  setActiveStep,
  selectedCountry,
  setSelectedCountry,
  selectedSalesOrg,
  setSelectedSalesOrg,
  countries,
  salesOrganizations,
  selectedGroup,
  setSelectedGroup,
  selectedNotifications,
  handleNotificationTypeChange,
  isSubmitting,
  handleSubmit,
  notificationTypes,
}) => {
  const theme = useTheme();

  // Filter notification types based on selected group
  const getFilteredNotificationTypes = () => {
    const types = Array.isArray(notificationTypes) ? notificationTypes : [];
    return types.filter((type) => Array.isArray(type.allowedGroups) && type.allowedGroups.includes(selectedGroup));
  };

  return (
    <StyledCard>
      <CardContent sx={{ pl: { xs: 2, sm: 4 }, pr: { xs: 2, sm: 3 }, pt: 2 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            wordBreak: "break-word",
          }}
        >
          <Plus />
          Add New Email Notification
        </Typography>

        <Box
          sx={{
            pb: 1,
            width: "100%",
            minWidth: 0,
            overflowX: "visible",
            "& .MuiStepper-root": {
              width: "100%",
              p: 0,
              m: 0,
            },
            "& .MuiStep-root": {
              width: "100%",
              minWidth: 0,
            },
            "& .MuiStepLabel-root": {
              alignItems: "flex-start",
            },
            "& .MuiStepLabel-label": {
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
            "& .MuiStepContent-root": {
              ml: { xs: "12px", sm: "12px" },
              pl: { xs: 2, sm: 2 },
              pr: 0,
              maxWidth: "100%",
              overflow: "visible",
            },
            "& .MuiCollapse-root, & .MuiCollapse-wrapper, & .MuiCollapse-wrapperInner": {
              width: "100%",
              minWidth: 0,
            },
          }}
        >
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: "100%", p: 0, m: 0 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {/* Step 0: Enter Email */}
                {index === 0 && (
                  <Box sx={{ mt: 2, width: "100%", minWidth: 0 }}>
                    <CustomTextField
                      fullWidth
                      label="Email Address"
                      placeholder="user@company.com"
                      value={emailId}
                      onChange={handleEmailInputChange}
                      error={!isEmailValid && emailId !== ""}
                      helperText={emailError}
                      InputProps={{
                        startAdornment: (
                          <Mail style={{ mr: 1, color: "action.active" }} />
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <AdminButton
                      action={ButtonTypes.SAVE}
                      onClick={() => isEmailValid && emailId && setActiveStep(1)}
                      disabled={!isEmailValid || !emailId}
                    >
                      Next
                    </AdminButton>
                  </Box>
                )}

                {/* Step 1: Organization Details */}
                {index === 1 && (
                  <Box sx={{ mt: 2, width: "100%", minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, display: "flex", alignItems: "center" }}
                    >
                      <BusinessIcon sx={{ mr: 1 }} />
                      Organization Details
                    </Typography>
                    <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <CustomSelect
                            value={selectedCountry?.countryId || ""}
                            onChange={(e) => {
                              const country = countries.find(c => c.countryId === e.target.value);
                              setSelectedCountry(country || {});
                            }}
                            placeholder="Select Country"
                            options={countries.map((country) => ({
                              key: country.countryId,
                              value: country.countryName
                            }))}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <CustomSelect
                            value={selectedSalesOrg}
                            onChange={(e) => setSelectedSalesOrg(e.target.value)}
                            placeholder={!selectedCountry?.countryId ? "Select Country first" : "Select Sales Organization"}
                            disabled={!selectedCountry?.countryId}
                            options={salesOrganizations.map((org) => ({
                              key: org,
                              value: org
                            }))}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        mt: 2,
                        ml: 2,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: 1,
                      }}
                    >
                      <AdminButton
                        action={ButtonTypes.CANCEL}
                        onClick={() => setActiveStep(0)}
                      >
                        Back
                      </AdminButton>
                      <AdminButton
                        action={ButtonTypes.SAVE}
                        onClick={() => setActiveStep(2)}
                        disabled={
                          !selectedCountry ||
                          !selectedSalesOrg
                        }
                      >
                        Next
                      </AdminButton>
                    </Box>
                  </Box>
                )}

                {/* Step 2: Select Group */}
                {index === 2 && (
                  <Box sx={{ mt: 2, width: "100%", minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Select User Group
                    </Typography>
                    <RadioGroup
                      value={selectedGroup}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                      }}
                      sx={{
                        width: "100%",
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column !important",
                        alignItems: "stretch",
                        gap: 1,
                        "&.MuiFormGroup-root": {
                          flexDirection: "column !important",
                        },
                      }}
                    >
                      {emailGroups.map((group) => (
                        <FormControlLabel
                          key={group.id}
                          value={group.id}
                          control={<Radio />}
                          sx={{
                            width: "100%",
                            m: 0,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            "& .MuiFormControlLabel-label": {
                              minWidth: 0,
                              flex: 1,
                            },
                          }}
                          label={
                            <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, gap: 1 }}>
                              <Avatar
                                sx={{
                                  bgcolor: group.color,
                                  width: 28,
                                  height: 28,
                                  flexShrink: 0,
                                }}
                              >
                                {React.createElement(group.iconComponent, {
                                  ...group.iconProps,
                                  sx: { fontSize: 12 },
                                })}
                              </Avatar>
                              <Typography sx={{ fontSize: 14, wordBreak: "normal", whiteSpace: "normal" }}>
                                {group.label}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: 1,
                      }}
                    >
                      <AdminButton
                        action={ButtonTypes.CANCEL}
                        onClick={() => setActiveStep(1)}
                      >
                        Back
                      </AdminButton>
                      <AdminButton
                        action={ButtonTypes.SAVE}
                        onClick={() => setActiveStep(3)}
                      >
                        Next
                      </AdminButton>
                    </Box>
                  </Box>
                )}

                {/* Step 3: Choose Notifications */}
                {index === 3 && (
                  <Box sx={{ mt: 2, width: "100%", minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Choose Notification Types
                    </Typography>
                    {getFilteredNotificationTypes().length > 0 ? (
                      <Box>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 2 }}
                        >
                          Available notification types for{" "}
                          {
                            emailGroups.find((g) => g.id === selectedGroup)
                              ?.label
                          }
                          :
                        </Typography>
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            width: "100%",
                            margin: 0,
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: { xs: "nowrap", sm: "wrap" },
                          }}
                        >
                          {getFilteredNotificationTypes().map((type) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              key={type.id}
                              sx={{
                                width: { xs: "100%", sm: "auto" },
                                maxWidth: { xs: "100%", sm: "50%" },
                                flexBasis: { xs: "100%", sm: "50%" },
                              }}
                            >
                              <Card
                                sx={{
                                  p: 2,
                                  minWidth: 0,
                                  cursor: "pointer",
                                  border: selectedNotifications.includes(
                                    type.id,
                                  )
                                    ? "2px solid #3026B9"
                                    : "1px solid #e0e0e0",
                                  "&:hover": { boxShadow: 3 },
                                }}
                                onClick={() =>
                                  handleNotificationTypeChange(type.id)
                                }
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    mb: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <Checkbox
                                    checked={selectedNotifications.includes(
                                      type.id,
                                    )}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleNotificationTypeChange(type.id);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{ flexShrink: 0 }}
                                  />
                                  <Typography variant="subtitle2" sx={{ wordBreak: "break-word", minWidth: 0 }}>
                                    {type.label}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  sx={{ display: "block", wordBreak: "break-word" }}
                                >
                                  {type.description}
                                </Typography>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ) : (
                      <Box>
                        {" "}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 2 }}
                        >
                          Sorry! No notification types available for{" "}
                          {
                            emailGroups.find((g) => g.id === selectedGroup)
                              ?.label
                          }
                          .
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: 1,
                      }}
                    >
                      <AdminButton
                        action={ButtonTypes.CANCEL}
                        onClick={() => setActiveStep(2)}
                      >
                        Back
                      </AdminButton>
                      <AdminButton
                        action={ButtonTypes.SAVE}
                        onClick={() => setActiveStep(4)}
                        disabled={selectedNotifications.length === 0}
                      >
                        Next
                      </AdminButton>
                    </Box>
                  </Box>
                )}

                {/* Step 4: Review & Add */}
                {index === 4 && (
                  <Box sx={{ mt: 2, fontSize: 14, width: "100%", minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Review Configuration
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "#f5f5f5", mb: 2 }}>
                      <Typography sx={{ fontSize: 14 }}>
                        <strong>Email:</strong> {emailId}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        <strong>Group:</strong>{" "}
                        {emailGroups.find((g) => g.id === selectedGroup)?.label}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        <strong>Country:</strong> {selectedCountry?.countryCode}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        <strong>Sales Organization:</strong> {selectedSalesOrg}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        <strong>Notifications:</strong>{" "}
                        {selectedNotifications.map((typeId) => {
                          const types = Array.isArray(notificationTypes) ? notificationTypes : [];
                          const type = types.find((t) => t.id === typeId);
                          return (
                            <Chip
                              key={typeId}
                              label={type?.label || typeId}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          );
                        })}
                      </Typography>
                    </Paper>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: 1,
                      }}
                    >
                      <AdminButton
                        action={ButtonTypes.CANCEL}
                        onClick={() => setActiveStep(3)}
                      >
                        Back
                      </AdminButton>
                      <AdminButton
                        action={ButtonTypes.SAVE}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? null : <SaveIcon />}
                      >
                        {isSubmitting ? "Adding..." : "Add Email"}
                      </AdminButton>
                    </Box>
                  </Box>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default EmailManagementForm;
