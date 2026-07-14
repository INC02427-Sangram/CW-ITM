import { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  Tooltip,
  CircularProgress,
  Fade,
  Container,
  Backdrop,
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import TranslateIcon from "@mui/icons-material/Translate";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import StorageIcon from "@mui/icons-material/Storage";
import { useTranslation } from "react-i18next";
// import ExcelViewer from "../../Sales Order/ExcelViewer";
import { useTheme } from "@mui/material/styles";
import { Refresh } from "@cw/rds/icons";
import BusyIndicator from "../../../utility/BusyIndicator";
import { useErpConfig } from "./hooks/useErpConfig";
import { useTemplateConfig } from "./hooks/useTemplateConfig";
import { resetCache } from "./services/systemConfig.service";

const cardSx = {
  height: "100%",
  width: "100%",
  borderRadius: 3,
  background: (theme) => theme.palette.background.paper,
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
};

const contentSx = {
  p: 4,
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

const cardItemSx = { pl: 0, display: "flex" };

const SystemConfig = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [busyIndicatorFlag, setBusyIndicatorFlag] = useState(false);

  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification((currentNotification) => ({
        ...currentNotification,
        show: false,
      }));
    }, 3000);
  }, []);

  const {
    erpSystems,
    activeErpSystem,
    isLoadingErp: isErpLoading,
    showErpRefreshLoader,
    fetchErpSystems,
    handleErpChange,
  } = useErpConfig(showNotification);

  const {
    selectedFile,
    isLoading,
    previewTemplate,
    templateBase64,
    fetchLanguageTemplates,
    handleFileChange,
    handleUploadTemplate,
    handleDownloadTemplate,
    closePreview,
  } = useTemplateConfig(showNotification);

  const isLoadingErp = isErpLoading;

  const handleGlobalRefresh = () => {
    setBusyIndicatorFlag(true);

    resetCache(
      () => {
        showNotification("success", "Cache reset Successfully");
        fetchErpSystems();
        fetchLanguageTemplates();
        setBusyIndicatorFlag(false);
      },
      (error) => {
        console.error("Cache reset failed:", error);
        showNotification("error", "Failed to reset Cache");
        setBusyIndicatorFlag(false);
      }
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        p: 0,
        m: 0,
        minHeight: "100vh",
        pb: 4,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ p: 0, m: 0, maxWidth: "100% !important" }}
      >
        {busyIndicatorFlag && <BusyIndicator />}

        <Backdrop
          sx={{ color: "#fff", zIndex: 9999, flexDirection: "column", gap: 2 }}
          open={!!showErpRefreshLoader}
        >
          <CircularProgress color="inherit" size={48} />
          <Typography variant="h6" fontWeight={600} color="inherit">
            Fetching configuration…
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
            Please wait while the system reloads settings.
          </Typography>
        </Backdrop>

        <Fade in={notification.show}>
          <Alert
            severity={notification.type}
            onClose={() => setNotification({ ...notification, show: false })}
            sx={{
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 9999,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
            }}
          >
            {notification.message}
          </Alert>
        </Fade>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: 1,
            py: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleGlobalRefresh}
            startIcon={<Refresh />}
            sx={{
              borderRadius: 2,
              textTransform: "none !important",
              whiteSpace: "nowrap",
            }}
            disabled={busyIndicatorFlag}
          >
            {busyIndicatorFlag ? t("Refreshing…") : t("Cache Refresh")}
          </Button>
        </Box>

        <Grid
          container
          spacing={4}
          sx={{ m: 0, width: "100%", alignItems: "stretch", pb: 4 }}
        >
          <Grid item xs={12} lg={6} sx={cardItemSx}>
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={contentSx}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
                      mr: 2,
                    }}
                  >
                    <CloudUploadIcon
                      sx={{ color: theme.palette.text.secondary, fontSize: 24 }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {t("Upload Template")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {t("Upload Excel templates for language configuration")}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    border: 2,
                    borderStyle: "dashed",
                    borderColor: selectedFile ? "success.main" : "grey.300",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    background: selectedFile
                      ? "rgba(76, 175, 80, 0.05)"
                      : "rgba(0,0,0,0.02)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="language-template-upload"
                  />
                  <label htmlFor="language-template-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<FileUploadOutlinedIcon />}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        textTransform: "none !important",
                      }}
                    >
                      {t("Upload File")}
                    </Button>
                  </label>

                  {selectedFile ? (
                    <>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="success.main"
                        sx={{ mb: 1 }}
                      >
                        {selectedFile.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </Typography>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleUploadTemplate}
                        disabled={isLoading}
                        sx={{ borderRadius: 2 }}
                      >
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          t("Upload Template")
                        )}
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        "Drag & drop your Excel file here or click to browse"
                      )}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6} sx={cardItemSx}>
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={contentSx}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      mr: 2,
                    }}
                  >
                    <StorageIcon sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {t("ERP System")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        "Configure your enterprise resource planning system"
                      )}
                    </Typography>
                  </Box>
                  <Tooltip title={t("Select your ERP system type")} arrow>
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "rgba(103, 126, 234, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(103, 126, 234, 0.2)",
                        },
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {isLoadingErp ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Select
                        value={activeErpSystem?.erpSystemId || ""}
                        onChange={handleErpChange}
                        fullWidth
                        displayEmpty
                        disabled={erpSystems.length === 0}
                        sx={{
                          borderRadius: 2,
                          ".MuiSelect-select": { py: 2 },
                        }}
                      >
                        {erpSystems.length === 0 && (
                          <MenuItem value="" disabled>
                            {t("No ERP systems available")}
                          </MenuItem>
                        )}
                        {erpSystems.map((system) => (
                          <MenuItem
                            key={system.erpSystemId}
                            value={system.erpSystemId}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <StorageIcon sx={{ mr: 2, color: "primary.main" }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1">
                                  {system.name}
                                </Typography>
                                {system.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {system.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

                    {activeErpSystem && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background:
                            "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <CheckCircleOutlineIcon
                          sx={{ color: "success.main", mr: 2 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600} color="success.main">
                            {t("Active System: ")}
                            {activeErpSystem.name}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {!activeErpSystem && erpSystems.length > 0 && (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: "rgba(255, 193, 7, 0.1)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <InfoOutlinedIcon
                          sx={{ color: "warning.main", mr: 2 }}
                        />
                        <Typography fontWeight={600} color="warning.main">
                          {t("No active ERP system found. Please select one.")}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6} sx={cardItemSx}>
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={contentSx}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 3,
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                        flexShrink: 0,
                      }}
                    >
                      <TranslateIcon sx={{ color: "white", fontSize: 24 }} />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ wordBreak: "break-word" }}>
                        {t("Template Library1")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                        {t("Download the latest language template")}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={fetchLanguageTemplates}
                    startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
                    sx={{
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      alignSelf: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    {t("Refresh")}
                  </Button>
                </Box>

                {templateBase64 ? (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #e3ffe7 0%, #d9e7ff 100%)",
                      textAlign: "center",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircleOutlineIcon
                      sx={{
                        color: "success.main",
                        fontSize: 48,
                        mb: 2,
                        alignSelf: "center",
                      }}
                    />
                    <Typography
                      variant="h6"
                      color="success.main"
                      fontWeight={600}
                      sx={{ mb: 2 }}
                    >
                      {t("Template Ready")}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<FileDownloadOutlinedIcon />}
                      onClick={handleDownloadTemplate}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none !important",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      {t("Download Template")}
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      background: "rgba(0,0,0,0.02)",
                      borderRadius: 2,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <TranslateIcon
                      sx={{
                        fontSize: 60,
                        color: "text.disabled",
                        mb: 2,
                        alignSelf: "center",
                      }}
                    />
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                      {t("No Template Available")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t(
                        "Upload a template to get started with language configuration"
                      )}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Backdrop
          sx={{ color: "#fff", zIndex: 9999 }}
          open={!!previewTemplate}
          onClick={closePreview}
        >
          <Card
            sx={{
              maxWidth: 800,
              maxHeight: "85vh",
              width: "90%",
              overflow: "auto",
              m: 2,
              borderRadius: 3,
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="h6" fontWeight={600}>
                  {t("Template Preview")}
                </Typography>
              </Box>
              {/* {previewTemplate && <ExcelViewer base64Data={previewTemplate} />} */}
              <Box
                sx={{
                  p: 3,
                  borderTop: 1,
                  borderColor: "divider",
                  textAlign: "right",
                }}
              >
                <Button variant="contained" onClick={closePreview} sx={{ borderRadius: 2 }}>
                  {t("Close Preview")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Backdrop>
      </Container>
    </Box>
  );
};

export default SystemConfig;