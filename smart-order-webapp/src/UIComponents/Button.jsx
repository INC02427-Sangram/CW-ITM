import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

// Its for SalesOrder Header Screen
const headerBaseStyles = (theme) => ({
    minWidth: "50px",
    width: "fit-content !important",
    flex: "0 0 auto",
    padding: "6px 16px",
    fontWeight: 600,
    borderRadius: 5,
    fontFamily: "'Roboto', sans-serif",
    textTransform: "none !important",
});

// its for salesOrder Screen Footer
const footerBaseStyles = (theme) => ({
    padding: "7px 15px",
    fontWeight: 500,
    minWidth: "50px",
    borderRadius: 5,
    flex: "0 0 auto",
    fontFamily: "'Roboto', sans-serif",
    textTransform: "none !important",
    cursor: "pointer",
    margin: "0 5px",
    textWrap: "nowrap",
});

const adminBaseStyles = (theme) => ({
    padding: "7px 15px",
    boxSizing: "border-box",
    fontWeight: 500,
    borderRadius: 5,
    fontFamily: "'Roboto', sans-serif",
    textTransform: "none !important",
    cursor: "pointer",
    margin: "0 5px",
    height: "40px",
    minWidth: "80px",
    width: "fit-content !important"
});

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "action",
})(({ theme, action }) => {
    const styles =
        theme.palette.buttonStyles?.[action] ||
        theme.palette.buttonStyles?.default ||
        {};

    return {
        ...headerBaseStyles(theme),
        backgroundColor: styles.bg,
        color: styles.text,

        "&:hover": {
            backgroundColor: styles.hover || theme.palette.primary.dark,
        },

        "&.Mui-disabled": {
            backgroundColor: styles.disabledBg,
            color: styles.disabledText,
            border: `1px solid ${styles.disabledBg} !important`,
        },
    };
});

const StyledFooterButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "action",
})(({ theme, action }) => {
    const styles =
        theme.palette.buttonStyles?.[action] ||
        theme.palette.buttonStyles?.default ||
        {};

    return {
        ...footerBaseStyles(theme),
        backgroundColor: styles.bg,
        color: styles.text,
        border: action === "clear" ? `1px solid ${styles.text} !important` : "none !important",

        "&:hover": {
            backgroundColor: styles.hover || theme.palette.primary.dark,
        },

        "&.Mui-disabled": {
            backgroundColor: styles.disabledBg,
            color: `${styles.disabledText} !important`,
            cursor: "not-allowed",
            border: `1px solid ${styles.disabledBg} !important`,
        },
    };
});

const StyledAdminButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "action",
})(({ theme, action }) => {
    const styles =
        theme.palette.buttonStyles?.[action] ||
        theme.palette.buttonStyles?.default ||
        {};

    return {
        ...adminBaseStyles(theme),
        backgroundColor: styles.bg,
        color: styles.text,
        border: action === "clear" ? `1px solid ${styles.text} !important` : "none !important",

        "&:hover": {
            backgroundColor: styles.hover || theme.palette.primary.dark,
        },

        "&.Mui-disabled": {
            backgroundColor: styles.disabledBg,
            color: `${styles.disabledText} !important`,
            border: `1px solid ${styles.disabledBg} !important`,
            cursor: "not-allowed",
        },
    };
});

export const HeaderControlButton = React.forwardRef(function HeaderControlButton(
    { children, action = "clear", variant, ...props },
    ref
) {
    console.log("Props of action", action);

    return (
        <StyledButton
            ref={ref}
            variant={variant || (action === "save" ? "contained" : "outlined")}
            disableElevation={action === "save"}
            action={action}
            {...props}
        >
            {children}
        </StyledButton>
    );
});

export const FooterControlButton = React.forwardRef(function FooterControlButton(
    { children, action = "save", ...props },
    ref
) {
    return (
        <StyledFooterButton
            ref={ref}
            variant="outlined"
            disableElevation={action === "save"}
            action={action}
            {...props}
        >
            {children}
        </StyledFooterButton>
    );
});

export const AdminControlButton = React.forwardRef(function AdminControlButton(
    { children, action = "save", variant, ...props },
    ref
) {
    return (
        <StyledAdminButton
            ref={ref}
            variant={variant || (action === "save" ? "contained" : "outlined")}
            disableElevation={action === "save"}
            action={action}
            {...props}
        >
            {children}
        </StyledAdminButton>
    );
});