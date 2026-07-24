import { Box, Typography, Card, CardContent, Grid, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const { t } = useTranslation();
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        height: "100%",
        borderRadius: "10px 0px 0px 0px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "16px",
      }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {t("Dashboard")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome to the Dashboard, {isAuthenticated ? `${userInfo.firstName}!` : "Guest!"}
      </Typography>

      {/* User Details Card */}
      {isAuthenticated && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ border: "1px solid #e3e7ee" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "#2f3136" }}>
                  User Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#7b818f", fontWeight: 600 }}>
                      Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2f3136" }}>
                      {userInfo.firstName} {userInfo.lastName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#7b818f", fontWeight: 600 }}>
                      Username
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2f3136" }}>
                      {userInfo.username}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#7b818f", fontWeight: 600 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2f3136" }}>
                      {userInfo.email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#7b818f", fontWeight: 600 }}>
                      Role
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2f3136" }}>
                      {userInfo.role}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#7b818f", fontWeight: 600 }}>
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#2f3136" }}>
                      {userInfo.id}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ border: "1px solid #e3e7ee" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "#2f3136" }}>
                  Permissions
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  {userInfo.permissions?.map((permission, index) => (
                    <Chip
                      key={index}
                      label={permission.replace(/_/g, " ")}
                      size="small"
                      sx={{
                        backgroundColor: "#e8f0fe",
                        color: "#1967d2",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
