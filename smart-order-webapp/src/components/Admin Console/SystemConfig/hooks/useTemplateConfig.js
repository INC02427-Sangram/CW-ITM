import { useCallback, useEffect, useState } from "react";
import {
  getLanguageTemplate,
  uploadLanguageTemplate,
} from "../services/systemConfig.service";
import {
  downloadBase64File,
  fileToBase64,
  openBase64File,
} from "../utils/file.utils";

export const useTemplateConfig = (showNotification) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [templateBase64, setTemplateBase64] = useState(null);

  const fetchLanguageTemplates = useCallback(() => {
    setIsLoading(true);

    getLanguageTemplate(
      (response) => {
        console.log("getExcel response:", response);

        const base64Data = response?.data;

        if (!base64Data || typeof base64Data !== "string") {
          console.error("Invalid response: missing or invalid base64 data");
          showNotification(
            "error",
            "Failed to fetch template: Invalid data format"
          );
          setIsLoading(false);
          return;
        }

        setTemplateBase64(base64Data);
        showNotification("success", "Fetched template successfully");
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching template:", error);
        showNotification("error", "Failed to fetch template");
        setIsLoading(false);
      }
    );
  }, [showNotification]);

  const handleFileChange = useCallback((event) => {
    setSelectedFile(event.target.files[0]);
  }, []);

  const handleUploadTemplate = useCallback(async () => {
    if (!selectedFile) {
      showNotification("error", "No file selected");
      return;
    }

    setIsLoading(true);

    try {
      const base64String = await fileToBase64(selectedFile);
      await uploadLanguageTemplate(base64String);

      setSelectedFile(null);
      fetchLanguageTemplates();
      showNotification("success", "Template uploaded successfully");
    } catch (error) {
      console.error("Error uploading template:", error);
      showNotification(
        "error",
        error instanceof ProgressEvent
          ? "Failed to read file"
          : "Failed to upload template"
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchLanguageTemplates, selectedFile, showNotification]);

  const handleDownloadTemplate = useCallback(() => {
    if (!templateBase64) {
      showNotification("error", "No template loaded");
      return;
    }

    downloadBase64File(templateBase64, "language_template.xlsx");
  }, [showNotification, templateBase64]);

  const handlePreviewTemplate = useCallback(() => {
    if (!templateBase64) {
      showNotification("error", "Template data not found");
      return;
    }

    openBase64File(templateBase64);
  }, [showNotification, templateBase64]);

  const closePreview = useCallback(() => {
    setPreviewTemplate(null);
  }, []);

  useEffect(() => {
    fetchLanguageTemplates();
  }, [fetchLanguageTemplates]);

  return {
    selectedFile,
    isLoading,
    previewTemplate,
    templateBase64,
    fetchLanguageTemplates,
    handleFileChange,
    handleUploadTemplate,
    handleDownloadTemplate,
    handlePreviewTemplate,
    closePreview,
  };
};
