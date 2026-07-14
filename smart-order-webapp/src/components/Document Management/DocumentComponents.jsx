//Document Management Sub-components

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { Refresh } from '@cw/rds/icons';
import EmlViewer from './EmlViewer';
import { TEXT_TYPES } from './documentConstants';


//Header component displaying title and description

export const DocumentHeader = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <>
            <Typography
                sx={{
                    fontSize: "20px",
                    letterSpacing: "-0.015em",
                    fontWeight: "700 !important",
                    color: theme.palette.text.primary,
                    margin: "0rem",
                }}
            >
                {t("Document Mangement")}
            </Typography>
            <Typography
                sx={{
                    fontSize: "12px",
                    color: theme.palette.text.secondary,
                    fontWeight: "400",
                    marginTop: "-5px",
                }}
            >
                {t("This view displays the list of documents in folders")}
            </Typography>
        </>
    );
};

//Search icon component
const SearchIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"
            fill="#666"
        />
    </svg>
);

//Breadcrumb navigation component
const Breadcrumbs = ({ breadcrumbPath, onBreadcrumbClick, theme }) => (
    <nav
        style={{
            fontSize: "14px",
            color: theme.palette.text.secondary,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
        }}
    >
        {breadcrumbPath.map((item, index) => (
            <React.Fragment key={index}>
                {index === breadcrumbPath.length - 1 ? (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (index > 0) {
                                onBreadcrumbClick(index - 1);
                            }
                        }}
                        style={{
                            color: "#3730c7",
                            textDecoration: "none",
                            fontWeight: 500,
                        }}
                        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                    >
                        {item}
                    </a>
                ) : (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onBreadcrumbClick(index);
                        }}
                        style={{
                            color: "#3730c7",
                            textDecoration: "none",
                        }}
                        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                    >
                        {item}
                    </a>
                )}
                {index < breadcrumbPath.length - 1 && (
                    <span style={{ color: "#999" }}>/</span>
                )}
            </React.Fragment>
        ))}
    </nav>
);

Breadcrumbs.propTypes = {
    breadcrumbPath: PropTypes.arrayOf(PropTypes.string).isRequired,
    onBreadcrumbClick: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
};

//Search input component
const SearchInput = ({ searchTerm, onSearchChange, theme, t }) => (
    <Box
        sx={{
            position: "relative",
            minWidth: "30px",
            width: { xs: "100%", sm: 240 },
        }}
    >
        <input
            type="text"
            placeholder={t("Search by File Name")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                fontSize: "14px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                height: "2rem",
                backgroundColor: theme.palette.background.default,
                outline: "none",
                boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3730c7")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
        />
        <div
            style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <SearchIcon />
        </div>
    </Box>
);

SearchInput.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
};

//Refresh button component
const RefreshButton = ({ onRefresh, theme }) => (
    <button
        onClick={onRefresh}
        style={{
            backgroundColor: theme.palette.background.default,
            borderRadius: "8px",
            width: "40px",
            height: "45px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
        onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.palette.background.default;
        }}
        onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.palette.background.default;
        }}
    >
        <Refresh />
    </button>
);

RefreshButton.propTypes = {
    onRefresh: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
};

//Toolbar component with breadcrumbs, search, and actions
export const DocumentToolbar = ({
    breadcrumbPath,
    onBreadcrumbClick,
    searchTerm,
    onSearchChange,
    onRefresh
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "16px",
            }}
        >
            <Breadcrumbs
                breadcrumbPath={breadcrumbPath}
                onBreadcrumbClick={onBreadcrumbClick}
                theme={theme}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: "16px",
                    alignItems: { xs: "stretch", sm: "center" },
                    flexWrap: "wrap",
                    height: { xs: "auto", sm: "3rem" },
                    width: { xs: "100%", sm: "auto" },
                }}
            >
                <SearchInput
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                    theme={theme}
                    t={t}
                />
                <RefreshButton onRefresh={onRefresh} theme={theme} />
            </Box>
        </Box>
    );
};

DocumentToolbar.propTypes = {
    breadcrumbPath: PropTypes.arrayOf(PropTypes.string).isRequired,
    onBreadcrumbClick: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
};

//Dialog for viewing documents
export const DocumentViewDialog = ({
    open,
    onClose,
    viewName,
    emlData,
    viewType,
    viewUrl,
    viewText
}) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {viewName}
            <IconButton onClick={onClose} size="small">
                <CloseIcon />
            </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ height: '75vh' }}>
            {emlData ? (
                <EmlViewer base64Data={emlData} documentName={viewName} />
            ) : viewType === 'pdf' && viewUrl ? (
                <iframe
                    title="document-viewer"
                    src={viewUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            ) : TEXT_TYPES.includes(viewType) ? (
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                    {viewText || 'No content'}
                </pre>
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Preview not supported for this file type.</p>
                    <a href={viewUrl} download={viewName} target="_blank" rel="noopener noreferrer">
                        Click here to download the file
                    </a>
                </div>
            )}
        </DialogContent>
    </Dialog>
);

DocumentViewDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    viewName: PropTypes.string,
    emlData: PropTypes.string,
    viewType: PropTypes.string,
    viewUrl: PropTypes.string,
    viewText: PropTypes.string,
};
