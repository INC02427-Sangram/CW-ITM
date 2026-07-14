//Document Management Column Configurations

import { DOC_BASE_URL } from './documentConstants';


//Handles opening document link in new tab

export const handleOpenLink = (row) => {
    if (row?.url) {
        window.open(row.url, '_blank');
        return;
    }
    if (row?.path) {
        const parts = String(row.path).split('/').filter(Boolean);
        const monthUrl = parts.length >= 2
            ? `${DOC_BASE_URL}/${parts[0]}/${parts[1]}`
            : `${DOC_BASE_URL}${row.path}`;
        window.open(monthUrl, '_blank');
        return;
    }
    if (row?.id) {
        window.open(`${DOC_BASE_URL}/documents/${row.id}`, '_blank');
    }
};


// Returns folder column configuration
export const getFolderColumns = () => [
    {
        fieldName: "type",
        fieldLabel: "Type",
        fieldBinding: "type",
        visible: true,
        type: "folderIcon",
    },
    {
        fieldName: "name",
        fieldLabel: "Folder Name",
        fieldBinding: "name",
        visible: true,
        type: "text",
    },
    {
        fieldName: "creationDate",
        fieldLabel: "Created On",
        fieldBinding: "creationDate",
        visible: true,
        type: "date",
    },
];


//Returns document column configuration with action handlers

export const getDocumentColumns = (onView, onDownload) => [
    {
        fieldName: "type",
        fieldLabel: "Type",
        fieldBinding: "type",
        visible: true,
        type: "documentIcon",
    },
    {
        fieldName: "name",
        fieldLabel: "Document Name",
        fieldBinding: "name",
        visible: true,
        type: "text",
    },
    {
        fieldName: "creationDate",
        fieldLabel: "Created On",
        fieldBinding: "creationDate",
        visible: true,
        type: "date",
    },
    {
        fieldName: "actions",
        fieldLabel: "Actions",
        fieldBinding: "actions",
        visible: true,
        type: "documentActions",
        onOpenLink: handleOpenLink,
        onView,
        onDownload,
    },
];
