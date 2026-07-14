//Document Management Constants

// Supported document file types
export const DOCUMENT_TYPES = [
    'pdf',
    'doc',
    'docx',
    'txt',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'json'
];

// API endpoints for document management
export const API_ENDPOINTS = {
    GET_FILE_ENTRIES: '/JavaServices_Oauth/api/dms/getFileEntries',
    GET_DOCUMENT_BASE64: '/JavaServices_Oauth/api/dms/getDocumentAsBase64',
    GET_DOCUMENT_AS_PDF: '/JavaServices_Oauth/api/dms/getDocAspdf',
};

// Document server base URL
export const DOC_BASE_URL = 'https://your-document-server.com';

// Default pagination settings
export const DEFAULT_PAGINATION = {
    page: 0,
    pageSize: 10,
};

// File types that support preview
export const PREVIEWABLE_TYPES = ['pdf', 'json', 'txt', 'plain', 'rfc822', 'eml'];

// File types requiring PDF conversion
export const PDF_CONVERSION_TYPES = ['doc', 'docx'];


//Email file types

export const EMAIL_TYPES = ['rfc822', 'eml'];

// Text-based file types
export const TEXT_TYPES = ['json', 'txt', 'plain'];
