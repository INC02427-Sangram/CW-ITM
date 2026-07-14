// Template Designer Constants

export const FONT_OPTIONS = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Roboto",
];

export const DEFAULT_TEMPLATE_CONFIG = {
  primaryColor: "#3026B9",
  secondaryColor: "#DB0034",
  companyName: "Your Company",
  headerText: "Notification Alert",
  footerText: "Best regards, Your Team",
  includeCompanyInfo: true,
  fontFamily: "Arial",
};

export const DEFAULT_TEMPLATE_FORM = {
  subjectName: "",
  body: "",
  richTextContent: "",
  country: "",
  countryCode: "",
  salesOrg: "",
  notificationType: "",
  notificationTypeObj: null,
  templateStatus: "true",
};

export const QUILL_STYLES = `
  .ql-container {
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }
  .ql-toolbar {
    border-top: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-bottom: none;
    background-color: #f8f9fa;
    border-radius: 8px 8px 0 0;
  }
  .ql-container {
    border-bottom: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-top: none;
    border-radius: 0 0 8px 8px;
    min-height: 150px;
  }
  .ql-editor {
    padding: 16px;
    min-height: 150px;
    overflow-x: hidden;
    word-break: break-word;
  }
  .ql-editor.ql-blank::before {
    color: #999;
    font-style: italic;
  }
    .ql-editor img {
    max-width: 100% !important;
    height: auto !important;
    display: block;
    margin: 8px auto;
    border-radius: 8px;
    object-fit: contain;
  }
`;

export const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};

export const QUILL_FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
];
