// ViewPoDocument.jsx
import React, { useState, useEffect, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Button, Select, MenuItem, FormControl } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useParams } from "react-router-dom";
import { getEmbedUrl } from "../../utility/utilityFunctions";
import { useSelector } from "react-redux";
import ExcelViewer from "./ExcelViewer";
import EmlViewer from "../Document Management/EmlViewer";

const normalizeType = (rawType, rawName = "") => {
  const t = (rawType || "").toLowerCase();
  const name = (rawName || "").toLowerCase();
  if (t.includes("application/pdf")) return "pdf";
  if (t.includes("image/")) return "image";
  if (t.includes("application/json")) return "json";
  if (t.includes("text/csv")) return "csv";
  if (t.includes("application/vnd.ms-excel")) return "xls";
  if (t.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) return "xlsx";
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".csv") || t === "csv") return "csv";
  if (name.endsWith(".xlsx") || t === "xlsx") return "xlsx";
  if (name.endsWith(".xls") || t === "xls") return "xls";
  if (name.endsWith(".json") || t === "json") return "json";
  if (name.match(/\.(png|jpg|jpeg|gif|webp)$/)) return "image";
  return "other";
};

const toMime = (kind) => {
  switch (kind) {
    case "pdf": return "application/pdf";
    case "csv": return "text/csv";
    case "xls": return "application/vnd.ms-excel";
    case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "json": return "application/json";
    default: return "application/octet-stream";
  }
};

const ViewPoDocument = ({ splitScreenFlag, setSplitScreenFlag, setGridItemWidth }) => {
  const [viewMode, setViewMode] = useState("document");
  const viewDocumentServiceResponse = useSelector(
    (state) => state.appReducer.viewDocumentServiceResponse
  );
  const { orderHeaderId } = useParams();
  // const showWordMessage = !!(currentDocument?.isWord);
  const [embedURL, setEmbedURL] = useState("");
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);

  const docArray = useMemo(() =>
    viewDocumentServiceResponse?.data || [],
  [viewDocumentServiceResponse]);

  // Normalize current doc
  // const currentDocument = Array.isArray(viewDocumentServiceResponse)
  //   ? viewDocumentServiceResponse[0]
  //   : viewDocumentServiceResponse;

  const currentDocument = useMemo(() => {
    // The main document is the one that is NOT an email or JSON file
    return docArray.find(doc => {
        const type = (doc.dmsDocType || "").toLowerCase();
        return type !== 'eml' && type !== 'json';
    });
  }, [docArray]);

  const emailDocument = useMemo(() => {
      return docArray.find(doc => (doc.dmsDocType || "").toLowerCase() === 'eml');
  }, [docArray]);

  const jsonDocument = useMemo(() => {
      return docArray.find(doc => (doc.dmsDocType || "").toLowerCase() === 'json');
  }, [docArray]);

  const hasEmailData = !!emailDocument;
  const hasOcrData = !!jsonDocument;
  
  // const documentData = currentDocument?.document || currentDocument;
  const base64Data = currentDocument?.base64 || '';
  const documentName = currentDocument?.dmsDocName || currentDocument?.fileName || "document";
  const rawType = currentDocument?.dmsDocType || "";
  const isWord = Boolean(
      currentDocument?.isWord ||
      (rawType || "").toLowerCase().includes("word") ||
      (documentName || "").toLowerCase().endsWith(".doc") ||
      (documentName || "").toLowerCase().endsWith(".docx")
  );
  const showWordMessage = isWord;

  // Hook #1: kind
  const kind = useMemo(() => normalizeType(rawType, documentName), [rawType, documentName]);
  // Hook #3: embed url (only for embeddables)
  useEffect(() => {
    if (!base64Data) {
        setEmbedURL("");
        return;
    }
    if (["xlsx", "xls", "csv", "json"].includes(kind)) {
      setEmbedURL("");
      return;
    }
    setIsLoadingEmbed(true);
    try {
      const mime = toMime(kind);
      const url = getEmbedUrl(base64Data, documentName, mime);
      setEmbedURL(url);
    } finally {
      requestAnimationFrame(() => setIsLoadingEmbed(false));
    }
  }, [base64Data, documentName, kind]);

  // // Hook #4: OCR JSON (keep hooks BEFORE any early return)
  const ocrJsonContent = useMemo(() => {
    if  (viewMode !== "json" || !jsonDocument) return null;
    try {
        const ocrData = jsonDocument.base64;
        if (!ocrData) return { error: "JSON content is empty." };
        const decoded = atob(ocrData);
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Error parsing OCR JSON:", e);
        return { error: "Failed to parse JSON" };
    }
}, [viewMode, jsonDocument]);


  // NOTE: no early return before hooks — guard in render instead
  const fnClosePdfWindow = () => {
    setSplitScreenFlag(false);
    setGridItemWidth(2);
  };

  const fnNewWindow = () => {
    if (["xlsx", "xls", "csv", "json"].includes(kind)) {
      if (!base64Data) return;
      const mime = toMime(kind);
      const link = document.createElement("a");
      link.href = `data:${mime};base64,${base64Data}`;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    if (embedURL) window.open(embedURL, "_blank", "noopener,noreferrer");
  };

  const renderDocument = () => {
    if (!base64Data) {
      return (
        <div style={{ position: "absolute", inset: 0,
         display: "flex", alignItems: "center", justifyContent: "center" }}>
          Preparing document…
        </div>
      );
    }
    if (["xlsx", "xls", "csv"].includes(kind)) {
      return (
        <ExcelViewer base64Data={base64Data} />
    );
    }
    if (!embedURL) return null;
    return (
      <iframe
        className="iframe-document"
        src={embedURL}
        style={{ width: "100%", height: "100%", border: "none" }}
        title={documentName}
      />
    );
  };

  const downloadJson = () => {
    if (!ocrJsonContent) return;
    const jsonString = JSON.stringify(ocrJsonContent, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentName || "document"}_ocr_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderJsonView = () => (
    <div style={{
      height: "85%",
      background: "#f8f9fa",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      overflow: "auto"
    }}>
      <div style={{
        padding: "15px 20px",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        flexShrink: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h3 style={{ margin: 0, color: "#333", fontSize: 18, fontWeight: 600 }}>OCR JSON Response</h3>
        <Button
          variant="outlined"
          size="small"
          onClick={downloadJson}
          startIcon={<GetAppIcon />}
          style={{ textTransform: "none", fontSize: 12, padding: "4px 12px" }}
        >
          Download
        </Button>
      </div>
      <div style={{ flex: 1, padding: 15, overflow: "auto", minHeight: 0 }}>
        <div style={{
          minHeight: "100%",
          backgroundColor: "#fff",
          borderRadius: 8,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "relative"
        }}>
          <pre style={{
            margin: 0,
            padding: 20,
            fontSize: 12,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "'Monaco','Menlo','Ubuntu Mono',monospace",
            color: "#2d3748"
          }}>
            {ocrJsonContent ? JSON.stringify(ocrJsonContent, null, 2) : "No OCR data available"}
          </pre>
        </div>
      </div>
    </div>
  );

const renderEmailView = () => (
    <div style={{
      height: "80%",
      background: "#f8f9fa",
      display: "flex",
      flexDirection: "column",
      overflow: "auto"
    }}>
      {hasEmailData ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                <EmlViewer base64Data={emailDocument.base64} />
            </div>
      ) : (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#555",
          padding: "20px",
          textAlign: "center",
          fontFamily: "sans-serif"
        }}>
          File is uploaded manually So Email View is not there.
        </div>
      )}
    </div>
  );

  return (
    <div className="view-po-document" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="button-headers" style={{
        display: "flex",
        alignItems: "center",
        padding: 10,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        flexShrink: 0
      }}>
        <IconButton aria-label="close-Window" title="Close the Document" onClick={fnClosePdfWindow}>
          <CloseIcon />
        </IconButton>

        <IconButton
          aria-label={["xlsx","xls","csv","json"].includes(kind) ? "download-Document" : "open-Document"}
          title={["xlsx","xls","csv","json"].includes(kind) ? "Download Document" : "Open Document in new Window"}
          onClick={fnNewWindow}
        >
          {["xlsx","xls","csv","json"].includes(kind) ? <GetAppIcon /> : <OpenInNewIcon />}
        </IconButton>

        {(hasOcrData || docArray.length > 1) && ( 
          <FormControl style={{ marginLeft: "auto", minWidth: 150 }}>
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              variant="outlined"
              size="small"
              style={{ backgroundColor: "#fff", fontSize: 14 }}
            >
              <MenuItem value="document">Document View</MenuItem>
              {hasOcrData && <MenuItem value="json">JSON View</MenuItem>}
              <MenuItem value="email">Email View</MenuItem>
            </Select>
          </FormControl>
        )}
      </div>

      
{showWordMessage && (
  <div
    style={{
      // keep it visually subtle and single-line
      padding: "6px 6px",
      fontSize: 13,
      fontWeight: 600,
      color: "#B50031",
      backgroundColor: "#fff7f7",
      // borderBottom: "1px solid #f0eaea",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      flexShrink: 0
    }}
    title="Word document converted to PDF for viewing"
  >
    (Word document converted to PDF for viewing)
  </div>
)}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {isLoadingEmbed && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.6)", zIndex: 1
          }}>
            Loading…
          </div>
        )}

      
        {viewMode === "document" ? renderDocument() : viewMode === 'json' ? renderJsonView() : renderEmailView()}
      </div>
    </div>
  );
};

export default ViewPoDocument;
