import { useCallback, useEffect, useMemo, useState } from "react";
import useDebouncedSearch from "../../../hooks/useDebouncedSearch";
import validateUniqueCombination from "../../../utility/validateUniqueCombination";
import {
  addOrderBlock,
  deleteOrderBlock,
  getOrderBlocks,
  updateOrderBlock,
} from "./orderBlockService";
import useOrgHierarchy from "../../../hooks/useOrgHierarchy";

const EMPTY_FORM = {
  orderBlock: "",
  priority: "",
  orderBlockDesc: "",
};

const EMPTY_DELETE_DIALOG = {
  open: false,
  orderBlock: null,
  index: null,
  description: null,
  priority: null,
};

const normalizeNumberField = (value) => value.replace(/[^0-9]/g, "").slice(0, 2);

const validateOrderBlock = (value, existingBlocks = [], editingIndex = null) => {
  if (!value) return "Please enter an order block number";

  if (!/^\d+$/.test(value)) {
    return "Order block must contain only numbers";
  }

  const numericValue = parseInt(value, 10);

  if (numericValue < 1 || numericValue > 99) {
    return "Order block is allowed only between 1-99";
  }

  if (
    validateUniqueCombination(
      existingBlocks,
      { orderBlock: value },
      editingIndex
    )
  ) {
    return "This order block already exists";
  }

  return "";
};

const validatePriority = (value, existingBlocks = [], editingIndex = null) => {
  if (!value) return "Please set a priority level";

  if (!/^\d+$/.test(value)) {
    return "Priority must contain only numbers";
  }

  const numericValue = parseInt(value, 10);

  if (numericValue < 1 || numericValue > 99) {
    return "Priority is allowed only between 1-99";
  }

  if (
    validateUniqueCombination(
      existingBlocks,
      { priority: value },
      editingIndex
    )
  ) {
    return "Another block already uses this priority";
  }

  return "";
};

const validateDescription = (value) => {
  if (!value || value.trim().length === 0) {
    return "Please provide a description";
  }

  if (value.trim().length < 3) {
    return "Description must be at least 3 characters";
  }

  if (value.length > 255) {
    return "Description can have maximum 255 characters";
  }

  return "";
};

const buildPayload = (data, country) => ({
  deliveryBlockCode: data.orderBlock,
  deliveryBlockPriority: parseInt(data.priority, 10),
  deliveryBlockDesc: data.orderBlockDesc.trim(),
  ...(country ? { countryCode: country?.countryCode } : {countryCode: data.countryCode}),
});

export const useOrderBlockManager = () => {
  const org = useOrgHierarchy({ depth: 1, countrySelectBy: "id" });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [orderBlocks, setOrderBlocks] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [editingErrors, setEditingErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState(EMPTY_DELETE_DIALOG);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [errorMessages, setErrorMessages] = useState();

  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  } = useDebouncedSearch(300);

  const closeToast = useCallback(() => {
    setToastMessage((prev) => ({ ...prev, open: false }));
  }, []);

  const showToast = useCallback((message, type = "info") => {
    setToastMessage({ open: true, message, type });
  }, []);

  const fetchOrderBlocks = useCallback(() => {
    setIsLoading(true);

    const handleSuccess = (blocks) => {
      setOrderBlocks(blocks);
      setIsLoading(false);
    };

    const handleError = (error) => {
      console.error("Error fetching order blocks:", error);
      setOrderBlocks([]);
      showToast("An error occurred while fetching order blocks", "error");
      setIsLoading(false);
    };

    getOrderBlocks(handleSuccess, handleError);
  }, [showToast]);

  useEffect(() => {
    fetchOrderBlocks();
  }, [fetchOrderBlocks]);

  const validateForm = useCallback(
    (data, isEditing = false, editingIndex = null) => {
      const newErrors = {};
      const orderBlockError = validateOrderBlock(
        data.orderBlock,
        orderBlocks,
        isEditing ? editingIndex : null
      );
      const priorityError = validatePriority(
        data.priority,
        orderBlocks,
        isEditing ? editingIndex : null
      );
      const descriptionError = validateDescription(data.orderBlockDesc);

      if (orderBlockError) newErrors.orderBlock = orderBlockError;
      if (priorityError) newErrors.priority = priorityError;
      if (descriptionError) newErrors.orderBlockDesc = descriptionError;

      if (isEditing) {
        setEditingErrors(newErrors);
      } else {
        setErrors(newErrors);
      }
      setErrorMessages(Object.values(newErrors)); 
      return Object.keys(newErrors).length === 0;
    },
    [orderBlocks]
  );

  const validateField = useCallback(
    (field, value, editingIndex = null) => {
      if (field === "orderBlock") return validateOrderBlock(value, orderBlocks, editingIndex);
      if (field === "priority") return validatePriority(value, orderBlocks, editingIndex);
      if (field === "orderBlockDesc") return validateDescription(value);
      return "";
    },
    [orderBlocks]
  );

 const handleFormChange = useCallback(
  (field, rawValue) => {
    const value =
      field === "orderBlock" || field === "priority"
        ? normalizeNumberField(rawValue)
        : rawValue;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const nextErrors = { ...prev };

      // Remove error if field becomes empty while typing
      if (!value || value.trim?.() === "") {
        delete nextErrors[field];
        return nextErrors;
      }

      const error = validateField(field, value);

      if (error) {
        nextErrors[field] = error;
      } else {
        delete nextErrors[field];
      }

      return nextErrors;
    });
  },
  [validateField]
);

  const clearForm = useCallback(() => {
    setFormData(EMPTY_FORM);
    org.resetAll();
    setErrors({});
  }, []);

  const handleSubmit = useCallback(() => {
    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    const selectedCountryObj = org.getSelectedCountryObj();
    console.log("Selected Country Object:", selectedCountryObj); // Debug log
    const payload = buildPayload(formData, selectedCountryObj);

    const handleSuccess = (response) => {
      if (response?.status === "SUCCESS") {
        showToast(
          `Order Block with Block Number:${payload.deliveryBlockCode} created successfully.`,
          "success"
        );
        clearForm();
        fetchOrderBlocks();
        setIsSubmitting(false);
        return;
      }

      showToast(response?.message || "Failed to add order block", "error");
      setIsSubmitting(false);
    };

    const handleError = (error) => {
      showToast(error?.message || error || "Service error", "error");
      setIsSubmitting(false);
    };

    addOrderBlock(payload, handleSuccess, handleError);
  }, [clearForm, fetchOrderBlocks, formData, showToast, validateForm]);

  const handleEdit = useCallback(
    (index) => {
      const rowData = orderBlocks[index];
      if (!rowData) return;

      setEditingRowId(index);
      setEditingData({ ...rowData });
      setEditingErrors({});
    },
    [orderBlocks]
  );

  const handleEditChange = useCallback(
    (field, rawValue) => {
      const value =
        field === "orderBlock" || field === "priority"
          ? normalizeNumberField(rawValue)
          : rawValue;

      setEditingData((prev) => ({ ...prev, [field]: value }));
      setEditingErrors((prev) => {
        const nextErrors = { ...prev };
        const error = validateField(field, value, editingRowId);
        if (error) nextErrors[field] = error;
        else delete nextErrors[field];
        return nextErrors;
      });
    },
    [editingRowId, validateField]
  );

  const resetEditing = useCallback(() => {
    setEditingRowId(null);
    setEditingData({});
    setEditingErrors({});
  }, []);

  const handleSave = useCallback(
    (index) => {
      const currentRow = orderBlocks[index];
      if (!currentRow) return;

      const mergedData = {
        orderBlock: editingData.orderBlock ?? currentRow.orderBlock,
        priority: editingData.priority ?? currentRow.priority,
        orderBlockDesc: editingData.orderBlockDesc ?? currentRow.orderBlockDesc,
        countryCode: currentRow.countryCode,
      };

      if (!validateForm(mergedData, true, index)) {
        showToast(errorMessages?.join(", "), "error");
        return;
      }

      const hasNoChanges =
        mergedData.orderBlock.trim() === currentRow.orderBlock &&
        mergedData.priority.trim() === currentRow.priority &&
        mergedData.orderBlockDesc.trim() === currentRow.orderBlockDesc;

      if (hasNoChanges) {
        showToast("No changes made", "info");
        resetEditing();
        return;
      }

      const payload = buildPayload(mergedData);

      const handleSuccess = (response) => {
        if (response?.status === "SUCCESS") {
          showToast(
            `Order Block with Block Number:${payload.deliveryBlockCode} updated successfully.`,
            "success"
          );
          resetEditing();
          fetchOrderBlocks();
          return;
        }

        showToast(response?.message || "Failed to update order block", "error");
      };

      const handleError = (error) => {
        showToast(error?.message || error || "Service error", "error");
      };

      updateOrderBlock(payload, handleSuccess, handleError);
    },
    [editingData, fetchOrderBlocks, orderBlocks, resetEditing, showToast, validateForm]
  );

  const handleDeleteClick = useCallback(
    (index) => {
      const block = orderBlocks[index];
      if (!block) return;

      setDeleteDialog({
        open: true,
        orderBlock: block.orderBlock,
        index,
        description: block.orderBlockDesc,
        priority: block.priority,
      });
    },
    [orderBlocks]
  );

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialog(EMPTY_DELETE_DIALOG);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    const index = deleteDialog.index;
    const block = orderBlocks[index];
    if (!block) {
      closeDeleteDialog();
      return;
    }

    closeDeleteDialog();
    setIsDeleting(true);

    const handleSuccess = () => {
      setOrderBlocks((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
      showToast(
        `Order Block with Block Number:${block.orderBlock} deleted successfully.`,
        "success"
      );
      setIsDeleting(false);
    };

    const handleError = (error) => {
      console.error("Error deleting order block:", error);
      showToast("An error occurred while deleting the order block", "error");
      setIsDeleting(false);
    };

    deleteOrderBlock(block.orderBlock, handleSuccess, handleError, block?.countryCode);
  }, [closeDeleteDialog, deleteDialog.index, orderBlocks, showToast, org]);

  const filteredOrderBlocks = useMemo(() => {
    const dataWithOriginalIndex = orderBlocks.map((block, index) => ({
      ...block,
      originalIndex: index,
    }));

    if (!debouncedSearchTerm) return dataWithOriginalIndex;

    return dataWithOriginalIndex.filter((block) =>
      [block.orderBlock, block.priority, block.orderBlockDesc].some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm)
      )
    );
  }, [debouncedSearchTerm, orderBlocks]);

  const rows = useMemo(
    () =>
      filteredOrderBlocks.map((row) => ({
        id: row.id || row.originalIndex,
        country: row.country,
        countryCode: row.countryCode,
        originalIndex: row.originalIndex,
        orderBlock: row.orderBlock,
        priority: row.priority,
        orderBlockDesc: row.orderBlockDesc,
      })),
    [filteredOrderBlocks]
  );

  const isFormValid = useMemo(
    () =>
      Boolean(
        formData.orderBlock &&
          formData.priority &&
          formData.orderBlockDesc.trim() &&
          Object.keys(errors).length === 0
      ),
    [errors, formData]
  );

  const hasFormValues = useMemo(
    () => Boolean(formData.orderBlock || formData.priority || formData.orderBlockDesc || org.getSelectedCountryName()),
    [formData, org]
  );

  return {
    formData,
    errors,
    rows,
    filteredOrderBlocks,
    editingRowId,
    editingData,
    editingErrors,
    deleteDialog,
    paginationModel,
    isLoading,
    isSubmitting,
    isDeleting,
    isFormValid,
    hasFormValues,
    searchTerm,
    toastMessage,
    setPaginationModel,
    setSearchTerm,
    closeToast,
    handleFormChange,
    clearForm,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSave,
    handleCancelEdit: resetEditing,
    handleDeleteClick,
    closeDeleteDialog,
    handleDeleteConfirm,
    org,
  };
};
