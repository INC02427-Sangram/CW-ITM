//Document Management Utility Functions

import moment from "moment";
import { customDateTimeFormat } from "../../utility/CustomDateTimeFormat";

//Checks if an item is a document file based on its type

export const isDocumentFile = (item) => {
    if (!item?.type) return false;
    const fileType = item.type.toLowerCase();
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx', 'json'];
    return documentTypes.includes(fileType);
};

//Maps file type to MIME type

export const getMimeFromType = (fileType) => {
    const type = (fileType || '').toLowerCase();
    const mimeTypeMap = {
        pdf: 'application/pdf',
        json: 'application/json',
        txt: 'text/plain',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
    };

    return mimeTypeMap[type] || 'application/octet-stream';
};

//Converts base64 string to Blob
export const base64ToBlob = (base64, mime) => {
    try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i += 1) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mime });
    } catch (e) {
        console.error('Failed converting base64 to Blob', e);
        return new Blob([], { type: mime });
    }
};

//Generates searchable date strings for filtering
export const getDateSearchStrings = (dateValue) => {
    if (!dateValue) return [];
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return [String(dateValue).toLowerCase()];

    const long = d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }).toLowerCase();

    const short = d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }).toLowerCase();

    const iso = d.toISOString().slice(0, 10).toLowerCase(); // YYYY-MM-DD

    return [long, short, iso];
};

//Filters documents based on search query
export const filterDocuments = (documents, searchTerm, appSettings) => {
    const query = (searchTerm || "").trim().toLowerCase();
    if (!query) return documents;


    return documents.filter((doc) => {
        const name = (doc.name || "").toLowerCase();
        const type = (doc.type || "").toLowerCase();
        const dateStrs = [customDateTimeFormat(appSettings, doc.creationDate, "ddd MMM DD HH:mm:ss [UTC] YYYY", true)];

        return (
            name.includes(query) ||
            type.includes(query) ||
            dateStrs.some((s) => s.includes(query))
        );
    });
};

//Determines folder type based on name pattern
export const getFolderType = (folderName) => {
    if (folderName.match(/^\d{4}-\d{2}$/)) {
        return "Month Folder";
    }
    if (folderName.startsWith("OR")) {
        return "Order Folder";
    }
    return "Other Folder";
};

//Creates a download link and triggers download
export const triggerFileDownload = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

//Constructs the download filename with proper extension
export const getDownloadFileName = (documentName, fileType) => {
    if (!fileType) return documentName;
    const nameLower = documentName.toLowerCase();
    const typeLower = fileType.toLowerCase();

    return nameLower.endsWith(`.${typeLower}`)
        ? documentName
        : `${documentName}.${fileType}`;
};
