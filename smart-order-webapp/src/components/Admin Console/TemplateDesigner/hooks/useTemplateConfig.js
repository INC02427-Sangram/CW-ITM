import { useState, useCallback } from "react";
import { DEFAULT_TEMPLATE_CONFIG } from "../constants/templateConstants";

/**
 * Hook for managing template visual configuration
 */
export const useTemplateConfig = () => {
  const [templateConfig, setTemplateConfig] = useState(DEFAULT_TEMPLATE_CONFIG);

  // Handle template config changes
  const handleTemplateChange = useCallback((field, value) => {
    setTemplateConfig((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    templateConfig,
    handleTemplateChange,
  };
};
