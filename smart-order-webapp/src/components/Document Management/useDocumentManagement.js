//Custom Hooks for Document Management

import { useState, useCallback } from 'react';
import fnServiceRequest from '../../utility/fnServiceRequest';
import { API_ENDPOINTS } from './documentConstants';
import { 
  base64ToBlob, 
  getMimeFromType, 
  getDownloadFileName, 
  triggerFileDownload 
} from './documentUtils';

//Hook for fetching documents and handling API calls
export const useDocumentFetch = () => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchDocuments = useCallback(async (id, pageSize = 10, pageNo = 1, onViewChange) => {
    const url = `${API_ENDPOINTS.GET_FILE_ENTRIES}?id=${id}&pageSize=${pageSize}&pageNo=${pageNo}`;
    setLoading(true);

    fnServiceRequest(
      url,
      "GET",
      (response) => {
        setLoading(false);
        if (response?.data && Array.isArray(response.data)) {
          setDocuments(response.data);
          setTotalRecords(response.totalRecords || response.data.length);
          
          // Notify parent about view change if callback provided
          if (onViewChange) {
            onViewChange(response.data);
          }
        } else {
          setDocuments([]);
          setTotalRecords(0);
        }
      },
      (errorMessage) => {
        setLoading(false);
        console.error("Error fetching documents:", errorMessage);
        setDocuments([]);
        setTotalRecords(0);
      }
    );
  }, []);

  const fetchDocumentAsBase64 = useCallback((documentId, onSuccess, onError) => {
    const url = `${API_ENDPOINTS.GET_DOCUMENT_BASE64}?documentId=${encodeURIComponent(documentId)}`;
    setLoading(true);
    
    fnServiceRequest(
      url,
      'GET',
      (resp) => {
        setLoading(false);
        onSuccess?.(resp);
      },
      (err) => {
        setLoading(false);
        console.error('Error fetching document base64:', err);
        onError?.(err);
      }
    );
  }, []);

  const fetchDocAsPdf = useCallback((documentId, onSuccess, onError) => {
    const url = `${API_ENDPOINTS.GET_DOCUMENT_AS_PDF}?documentId=${encodeURIComponent(documentId)}`;
    setLoading(true);
    
    fnServiceRequest(
      url,
      'GET',
      (resp) => {
        setLoading(false);
        onSuccess?.(resp);
      },
      (err) => {
        setLoading(false);
        console.error('Error fetching document as PDF:', err);
        onError?.(err);
      }
    );
  }, []);

  return {
    loading,
    documents,
    totalRecords,
    fetchDocuments,
    fetchDocumentAsBase64,
    fetchDocAsPdf,
  };
};

//Hook for managing folder navigation and breadcrumbs
export const useDocumentNavigation = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState(["Home"]);
  const [folderHierarchy, setFolderHierarchy] = useState([{ id: "root", name: "Home" }]);

  const navigateToFolder = useCallback((folder, displayName) => {
    setSelectedFolder(folder);
    setSelectedRowId(folder.id);
    setBreadcrumbPath(prev => [...prev, displayName]);
    setFolderHierarchy(prev => [...prev, { id: folder.id, name: displayName }]);
  }, []);

  const navigateToBreadcrumb = useCallback((index) => {
    const targetFolder = folderHierarchy[index];

    if (index === 0) {
      setSelectedFolder(null);
      setSelectedRowId(null);
    } else {
      setSelectedFolder(targetFolder);
      setSelectedRowId(targetFolder.id);
    }

    setBreadcrumbPath(breadcrumbPath.slice(0, index + 1));
    setFolderHierarchy(folderHierarchy.slice(0, index + 1));

    return targetFolder;
  }, [folderHierarchy, breadcrumbPath]);

  const resetNavigation = useCallback(() => {
    setSelectedFolder(null);
    setSelectedRowId(null);
    setBreadcrumbPath(["Home"]);
    setFolderHierarchy([{ id: "root", name: "Home" }]);
  }, []);

  return {
    selectedFolder,
    selectedRowId,
    breadcrumbPath,
    folderHierarchy,
    navigateToFolder,
    navigateToBreadcrumb,
    resetNavigation,
    setSelectedRowId,
  };
};

//Hook for document viewing and downloading operations
export const useDocumentViewer = (fetchDocumentAsBase64, fetchDocAsPdf) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [viewUrl, setViewUrl] = useState("");
  const [viewType, setViewType] = useState("");
  const [viewName, setViewName] = useState("");
  const [viewText, setViewText] = useState("");
  const [emlData, setEmlData] = useState(null);

  const handleViewDocument = useCallback((row) => {
    if (!row?.id) return;

    fetchDocumentAsBase64(row.id, async (resp) => {
      const fileType = (resp?.fileType || '').toLowerCase();
      const base64Content = resp?.fileBase64 || '';
      const documentName = resp?.documentName || row?.name || 'Document';

      setViewName(documentName);

      // Handle Word documents - convert to PDF
      if (fileType === 'doc' || fileType === 'docx') {
        fetchDocAsPdf(row.id, (pdfResp) => {
          const pdfBase64 = pdfResp?.fileBase64 || '';
          const blob = base64ToBlob(pdfBase64, 'application/pdf');
          const url = URL.createObjectURL(blob);

          setViewUrl(url);
          setViewType('pdf');
          setViewText('');
          setEmlData(null);
          setViewOpen(true);
        });
        return;
      }

      // Handle email files
      if (fileType === 'rfc822' || fileType === 'eml') {
        setEmlData(base64Content);
        setViewText("");
        setViewUrl("");
        setViewOpen(true);
        return;
      }

      // Handle other file types
      const blob = base64ToBlob(base64Content, getMimeFromType(fileType));
      setViewType(fileType);

      if (fileType === 'pdf') {
        const url = URL.createObjectURL(blob);
        setViewUrl(url);
        setViewText('');
      } else {
        const text = await blob.text();
        setViewText(text);
        setViewUrl('');
      }

      setEmlData(null);
      setViewOpen(true);
    });
  }, [fetchDocumentAsBase64, fetchDocAsPdf]);

  const handleDownloadDocument = useCallback((row) => {
    if (!row?.id) return;
    
    fetchDocumentAsBase64(row.id, (resp) => {
      const fileType = resp?.fileType;
      const mime = getMimeFromType(fileType);
      const blob = base64ToBlob(resp?.fileBase64 || '', mime);
      const nameFromApi = resp?.documentName || row?.name || 'document';
      const fileName = getDownloadFileName(nameFromApi, fileType);
      
      triggerFileDownload(blob, fileName);
    });
  }, [fetchDocumentAsBase64]);

  const handleCloseView = useCallback(() => {
    setViewOpen(false);
    if (viewUrl) {
      URL.revokeObjectURL(viewUrl);
      setViewUrl("");
    }
    setViewText("");
    setEmlData(null);
  }, [viewUrl]);

  return {
    viewOpen,
    viewUrl,
    viewType,
    viewName,
    viewText,
    emlData,
    handleViewDocument,
    handleDownloadDocument,
    handleCloseView,
  };
};
