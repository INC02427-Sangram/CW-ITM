import React from "react";
import { Alert, Snackbar } from "@mui/material";

const ALLOWED_SEVERITIES = ["success", "error", "warning", "info"];

const ReusableToast = ({
	open,
	message,
	severity = "info",
	onClose,
	autoHideDuration = 4000,
	anchorOrigin = { vertical: "bottom", horizontal: "center" },
}) => {
	const resolvedSeverity = ALLOWED_SEVERITIES.includes(severity)
		? severity
		: "info";

	const handleClose = (_, reason) => {
		if (reason === "clickaway") return;
		if (onClose) onClose();
	};

	return (
		<Snackbar
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={handleClose}
			anchorOrigin={anchorOrigin}
		>
			<Alert
				onClose={handleClose}
				severity={resolvedSeverity}
				variant="filled"
				sx={{ width: "100%" }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default ReusableToast;
