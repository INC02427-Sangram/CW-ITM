import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import "./ExcelViewer.css";

const ExcelViewer = ({ base64Data }) => {
  const [headerData, setHeaderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      await new Promise(requestAnimationFrame); // allow first paint

      try {
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const workbook = read(bytes, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonSheet = utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        // --- Heuristic to find the table start ---
        // We assume a table starts where we find at least 3 consecutive rows
        // that each have at least 3 non-empty cells. This helps differentiate
        // the dense data table from the sparse key-value pairs in the header.
        let tableHeaderIndex = -1;
        const MIN_COLUMNS_FOR_TABLE = 3;
        const CONSECUTIVE_ROWS_FOR_TABLE = 3;

        for (let i = 0; i <= jsonSheet.length - CONSECUTIVE_ROWS_FOR_TABLE; i++) {
          let consecutiveCount = 0;
          for (let j = 0; j < CONSECUTIVE_ROWS_FOR_TABLE; j++) {
            const row = jsonSheet[i + j];
            const nonEmptyCells = row.filter(cell => cell !== "").length;
            if (nonEmptyCells >= MIN_COLUMNS_FOR_TABLE) {
              consecutiveCount++;
            } else {
              break; // The sequence is broken
            }
          }

          if (consecutiveCount === CONSECUTIVE_ROWS_FOR_TABLE) {
            tableHeaderIndex = i; // We found the start of our table
            break;
          }
        }
        // --- End of Heuristic ---

        if (!cancelled) {
          if (tableHeaderIndex !== -1) {
            // Split the data into header and table sections
            setHeaderData(jsonSheet.slice(0, tableHeaderIndex));
            const tableRows = jsonSheet.slice(tableHeaderIndex);
            
            // Pad the table data for consistent column count
            const maxColumns = tableRows.reduce((max, row) => Math.max(max, row.length), 0);
            const paddedTable = tableRows.map((row) =>
              Array.from({ length: maxColumns }, (_, k) => (k < row.length ? row[k] : ""))
            );
            setTableData(paddedTable);

          } else {
            // Fallback: If no clear table is found, treat the whole sheet as a single table
            setTableData(jsonSheet);
            setHeaderData([]);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [base64Data]);

  return (
    <div className="excel-viewer-container">
      <h2>Excel Viewer</h2>
      <div className="responsive-scroll-area" >
        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.6)", zIndex: 1 }}>
            Parsing sheet…
          </div>
        )}

        {/* Section for Header Information */}
        {headerData.length > 0 && (
          <div style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc', borderRadius: 5 }}>
            {headerData.map((row, r) => (
              // Only render rows that contain some data
              row.some(cell => cell !== "") && (
                <div key={r} style={{ display: 'flex', marginBottom: 4 }}>
                  <strong style={{ minWidth: 150, marginRight: 10 }}>{row[0] || ''}</strong>
                  <span>{row[1] || ''}</span>
                </div>
              )
            ))}
          </div>
        )}

        {/* Section for Table Data */}
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {tableData.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} style={{ padding: 8, textAlign: "left", fontWeight: r === 0 ? "bold" : "normal" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelViewer;