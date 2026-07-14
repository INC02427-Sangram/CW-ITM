/**
 * Email Preview Component
 * Displays email template preview with styling
 */
const EmailPreview = ({ template, templateConfig }) => {
  if (!template) return null;

  return (
    <div
      style={{
        fontFamily: templateConfig.fontFamily,
        border: `2px solid ${templateConfig.primaryColor}`,
        borderRadius: "12px",
        padding: "24px",
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        wordBreak: "break-word",
        maxWidth: "500px",
        boxSizing: "border-box",
        margin: "0 auto",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <div
        style={{
          textAlign: "center",
          borderBottom: `2px solid ${templateConfig.primaryColor}`,
          paddingBottom: "15px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{
          color: templateConfig.primaryColor,
          margin: "0 0 8px 0",
          fontSize: "20px",
          fontWeight: "600"
        }}>
          {template.subjectName}
        </h2>
      </div>

      <div
        style={{
          marginBottom: "20px",
          lineHeight: "1.6",
          fontSize: "14px",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
        className="email-preview-content"
        dangerouslySetInnerHTML={{ __html: template.body }}
      />

      <div
        style={{
          borderTop: "1px solid #e0e0e0",
          paddingTop: "16px",
          fontSize: "12px",
          color: "#666",
          textAlign: "center"
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>{templateConfig.footerText}</p>
        {templateConfig.includeCompanyInfo && (
          <p style={{ margin: "0 0 8px 0" }}>{templateConfig.companyName} | System Notifications</p>
        )}
      </div>
    </div>
  );
};

export default EmailPreview;
