//Document Management Component

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import CustomTable from "../../utility/Custom Components/CustomTable";
import BusyIndicator from "../../utility/BusyIndicator";
import { useSelector } from "react-redux";
// Custom hooks for business logic
import {
  useDocumentFetch,
  useDocumentNavigation,
  useDocumentViewer
} from './useDocumentManagement';

// Sub-components
import { DocumentHeader, DocumentToolbar, DocumentViewDialog } from './DocumentComponents';

// Utilities and configurations
import { isDocumentFile, filterDocuments, getFolderType } from './documentUtils';
import { getFolderColumns, getDocumentColumns } from './documentColumns';
import { DEFAULT_PAGINATION } from './documentConstants';

const DocumentManagement = () => {
  const theme = useTheme();

  const appSettings = useSelector((state) => state.appReducer.appSettings);

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("folders");
  const [paginationModel, setPaginationModel] = useState(DEFAULT_PAGINATION);

  // Custom hooks for business logic
  const {
    loading,
    documents,
    totalRecords,
    fetchDocuments,
    fetchDocumentAsBase64,
    fetchDocAsPdf,
  } = useDocumentFetch();

  const {
    selectedFolder,
    selectedRowId,
    breadcrumbPath,
    navigateToFolder,
    navigateToBreadcrumb,
    setSelectedRowId,
  } = useDocumentNavigation();

  const {
    viewOpen,
    viewUrl,
    viewType,
    viewName,
    viewText,
    emlData,
    handleViewDocument,
    handleDownloadDocument,
    handleCloseView,
  } = useDocumentViewer(fetchDocumentAsBase64, fetchDocAsPdf);
  // Determine current view based on content
  useEffect(() => {
    const hasDocuments = documents.some(item => isDocumentFile(item));
    setCurrentView(hasDocuments ? "documents" : "folders");
  }, [documents]);

  // Initial data load
  useEffect(() => {
    setSelectedRowId(null);
    fetchDocuments("root", paginationModel.pageSize, 1, (data) => {
      const hasDocuments = data.some(item => isDocumentFile(item));
      setCurrentView(hasDocuments ? "documents" : "folders");
    });
  }, [fetchDocuments, paginationModel.pageSize]);

  // Column configurations
  const folderColumns = useMemo(() => getFolderColumns(), []);

  const documentColumns = useMemo(() =>
    getDocumentColumns(handleViewDocument, handleDownloadDocument),
    [handleViewDocument, handleDownloadDocument]
  );

  const currentColumns = useMemo(() => {
    return currentView === "folders" ? folderColumns : documentColumns;
  }, [currentView, folderColumns, documentColumns]);

  // Filtered documents based on search term
  const filteredDocuments = useMemo(() => {

    return filterDocuments(documents, searchTerm, appSettings);
  }, [documents, searchTerm, appSettings]);


  // Event handlers
  const handlePaginationChange = (newModel) => {
    setPaginationModel(newModel);
    const currentFolderId = selectedFolder ? selectedFolder.id : "root";
    fetchDocuments(currentFolderId, newModel.pageSize, newModel.page + 1);
  };

  const handleRowClick = (event, columns, rows, rowIndex) => {
    const selectedRow = rows[rowIndex];

    // Don't navigate if it's a document file
    if (isDocumentFile(selectedRow)) {
      return;
    }

    const folderType = getFolderType(selectedRow.name);
    console.log(`Navigating into ${folderType}:`, selectedRow.name);

    setSelectedRowId(selectedRow.id);
    navigateToFolder(selectedRow, selectedRow.name);
    fetchDocuments(selectedRow.id, paginationModel.pageSize, 1);
    setPaginationModel(prev => ({ page: 0, pageSize: prev.pageSize }));
  };

  const handleBreadcrumbClick = (index) => {
    const targetFolder = navigateToBreadcrumb(index);
    const folderId = index === 0 ? "root" : targetFolder.id;
    fetchDocuments(folderId, paginationModel.pageSize, 1);
    setPaginationModel(prev => ({ page: 0, pageSize: prev.pageSize }));
  };

  const handleRefresh = () => {
    console.log("Refreshing document list...");
    const currentFolderId = selectedFolder ? selectedFolder.id : "root";
    fetchDocuments(currentFolderId, paginationModel.pageSize, paginationModel.page + 1);
  };

  // Render
  return (
    <>
      {loading && <BusyIndicator />}

      <Box
        sx={{
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          overflow: { xs: "auto", md: "hidden" },
          minWidth: 0,
          paddingBottom: { xs: "16px", sm: "24px" },
          paddingTop: { xs: "16px", sm: "20px" },
          marginLeft: { xs: "12px", sm: "20px" },
          marginRight: { xs: "12px", sm: "20px" },
          backgroundColor: theme.palette.background.default,
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <DocumentHeader />

        <DocumentToolbar
          breadcrumbPath={breadcrumbPath}
          onBreadcrumbClick={handleBreadcrumbClick}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={handleRefresh}
        />

        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            overflow: "auto",
            minHeight: 0,
            width: "100%",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "8px",
            },
            "& .MuiTablePagination-toolbar": {
              flexWrap: "nowrap",
              overflowX: "auto",
              overflowY: "hidden",
            },
            "& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel": {
              whiteSpace: "nowrap",
            },
          }}
        >
          <Box
            sx={{
              minWidth: {
                xs: currentView === "folders" ? 460 : 620,
                sm: "100%",
              },
            }}
          >
            <CustomTable
              rows={filteredDocuments}
              Headercolumns={currentColumns}
              fnRowClickHandler={handleRowClick}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationChange}
              paginationMode="server"
              rowCount={totalRecords}
              maxHeight="calc(100vh - 300px)"
              className="document-management-table"
              visible={true}
              selectedRowId={selectedRowId}
              fixedRowHeight={40}
            />
          </Box>
        </Box>

        <DocumentViewDialog
          open={viewOpen}
          onClose={handleCloseView}
          viewName={viewName}
          emlData={emlData}
          viewType={viewType}
          viewUrl={viewUrl}
          viewText={viewText}
        />
      </Box>
    </>
  );
};

export default DocumentManagement;
