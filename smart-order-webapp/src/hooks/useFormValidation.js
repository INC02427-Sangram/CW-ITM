import { useState, useCallback, useMemo, useRef } from "react";
import validateUniqueCombination from "../utility/validateUniqueCombination";

const useFormValidation = (
  errorKeys = ["validationError", "combinationError"]
) => {
  const initialErrors = useMemo(
    () => Object.fromEntries(errorKeys.map((k) => [k, ""])),
    [errorKeys]
  );

  const [formErrors, setFormErrors] = useState(initialErrors);

  // Store validators centrally
  const validatorsRef = useRef([]);

  const setError = useCallback((key, message) => {
    setFormErrors((prev) => ({
      ...prev,
      [key]: message,
    }));
  }, []);

  const clearError = useCallback((key) => {
    setFormErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setFormErrors({ ...initialErrors });
  }, [initialErrors]);

  /**
   * Register duplicate validator
   */
  const checkDuplicate = useCallback(
    (
      data,
      fieldMap,
      errorMessage,
      excludeIndex = null,
      errorKey = "combinationError"
    ) => {
      const validator = () => {
        const isDuplicate = validateUniqueCombination(
          data,
          fieldMap,
          excludeIndex
        );

        setFormErrors((prev) => {
          const nextError = isDuplicate ? errorMessage : "";

          if (prev[errorKey] === nextError) {
            return prev;
          }

          return {
            ...prev,
            [errorKey]: nextError,
          };
        });

        return isDuplicate;
      };

      // Store latest validator
      validatorsRef.current = [
        ...validatorsRef.current.filter((v) => v.key !== errorKey),
        { key: errorKey, validate: validator },
      ];

      return validator();
    },
    []
  );

  /**
   * Required validation
   */
  const validateRequired = useCallback(
    (
      requiredFields,
      errorMessage,
      errorKey = "validationError"
    ) => {
      const allFilled = Object.values(requiredFields).every(
        (v) => v !== undefined && v !== null && v !== ""
      );

      setFormErrors((prev) => {
        const nextError = allFilled ? "" : errorMessage;

        if (prev[errorKey] === nextError) {
          return prev;
        }

        return {
          ...prev,
          [errorKey]: nextError,
        };
      });

      return allFilled;
    },
    []
  );

  /**
   * Re-run all validators
   */
  const revalidate = useCallback(() => {
    validatorsRef.current.forEach((validatorObj) => {
      validatorObj.validate();
    });
  }, []);

  const hasErrors = useMemo(
    () => Object.values(formErrors).some(Boolean),
    [formErrors]
  );

  return {
    formErrors,
    setError,
    clearError,
    clearAllErrors,
    checkDuplicate,
    validateRequired,
    revalidate,
    hasErrors,
  };
};

export default useFormValidation;