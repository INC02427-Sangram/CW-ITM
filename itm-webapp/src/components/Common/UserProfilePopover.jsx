import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Popover,
  Box,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { userActions } from "../../redux";
import ReusableTypography from "./ReusableTypography";
export default function UserProfilePopover({ anchorEl, open, onClose }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(userActions.logoutUser());
    onClose();
    // Add navigation to login page if needed
  };

  const displayName = userInfo
    ? `${userInfo.firstName} ${userInfo.lastName}`
    : "Guest";

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        mt: 1,
      }}
    >
      <Box
        sx={{
          p: 2,
          minWidth: 250,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* User Info Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            src={userInfo?.avatar}
            alt={displayName}
            sx={{
              width: 48,
              height: 48,
              fontSize: 18,
              fontWeight: 600,
              bgcolor: "#123db8",
            }}
          >
            {displayName.split(" ").map((n) => n[0]).join("")}
          </Avatar>
          <Box>
            <ReusableTypography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: "15px",
                color: "#2f3136",
                lineHeight: 1.3,
              }}
            >
              {displayName}
            </ReusableTypography>
            <ReusableTypography
              variant="body2"
              sx={{
                fontSize: "13px",
                color: "#7b818f",
                lineHeight: 1.3,
              }}
            >
              {userInfo?.email}
            </ReusableTypography>
          </Box>
        </Box>

        <Divider />

        {/* Role Section */}
        <Box>
          <ReusableTypography
            variant="caption"
            sx={{
              color: "#7b818f",
              fontWeight: 600,
              fontSize: "11px",
              textTransform: "uppercase",
            }}
          >
            Role
          </ReusableTypography>
          <ReusableTypography
            variant="body2"
            sx={{
              color: "#2f3136",
              fontSize: "14px",
              mt: 0.5,
            }}
          >
            {userInfo?.role}
          </ReusableTypography>
        </Box>

        <Divider />

        {/* Logout Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            color: "#d32f2f",
            borderColor: "#d32f2f",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#fdecea",
              borderColor: "#d32f2f",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Popover>
  );
}
