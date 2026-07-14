import React from "react";
import { Box, Typography, Chip, Avatar, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { emailGroups } from "./emailManagementConfig";

/**
 * EmailManagementStats Component
 */

const StyledCard = styled("div")(({ theme }) => ({
  marginBottom: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "16px",
  transition: "transform 0.2s ease-in-out",
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

const EmailManagementStats = ({ emailList }) => {
  const theme = useTheme();

  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Overall Stats Section */}
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "theme.palette.primary.main",
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              📊 Quick Overview
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                mb: 1,
                p: 1,
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "action.hover",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
                📧 Total Emails:
              </Typography>
              <Chip
                label={emailList.length}
                color="primary"
                size="small"
                sx={{
                  fontWeight: 400,
                  minWidth: 32,
                  height: 24,
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                mb: 1,
                p: 1,
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "action.hover",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
                ✅ Active:
              </Typography>
              <Chip
                label={emailList.length}
                color="success"
                size="small"
                sx={{
                  fontWeight: 400,
                  minWidth: 32,
                  height: 24,
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                p: 1,
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "action.hover",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
                ❌ Inactive:
              </Typography>
              <Chip
                label={0}
                color="error"
                size="small"
                sx={{
                  fontWeight: 400,
                  minWidth: 32,
                  height: 24,
                }}
              />
            </Box>
          </Box>

          {/* Groups Section */}
          <Box
            sx={{
              p: 2,
              bgcolor: "theme.palette.background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "theme.palette.primary.main",
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              👥 Groups Breakdown
            </Typography>

            {emailGroups.map((group) => {
              const count = emailList.filter((e) => e.recipientType === group.id).length;
              const percentage = emailList.length > 0 ? Math.round((count / emailList.length) * 100) : 0;

              return (
                <Box
                  key={group.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                    p: 1,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: group.color,
                      width: 28,
                      height: 28,
                      boxShadow: 1,
                    }}
                  >
                    {React.createElement(group.iconComponent, {
                      ...group.iconProps,
                      sx: { fontSize: 14 },
                    })}
                  </Avatar>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      flex: 1,
                      minWidth: 0,
                      wordBreak: "break-word",
                    }}
                  >
                    {group.label}:
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={count}
                      size="small"
                      sx={{
                        minWidth: 32,
                        height: 24,
                        backgroundColor: group.color + "20",
                        color: group.color,
                        fontWeight: 400,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        minWidth: "35px",
                      }}
                    >
                      ({percentage}%)
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default EmailManagementStats;
