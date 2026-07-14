import { useRef, useEffect, useCallback } from "react";

/**
 * Check if the input element supports text selection
 * setSelectionRange doesn't work on input types like: number, date, email, etc.
 * @param {HTMLInputElement} input - The input element
 * @returns {boolean} - Whether the input supports selection
 */
const supportsSelection = (input) => {
  if (!input || input.type === 'number' || input.type === 'date' || input.type === 'time') {
    return false;
  }
  try {
    return typeof input.selectionStart === 'number';
  } catch {
    return false;
  }
};

/**
 * Safely set cursor position with error handling
 * @param {HTMLInputElement} input - The input element
 * @param {number} position - The cursor position
 */
const safelySetCursorPosition = (input, position) => {
  if (!input || position === null || position === undefined) {
    return;
  }

  if (!supportsSelection(input)) {
    return;
  }

  try {
    // Ensure position is within bounds
    const maxLength = input.value?.length || 0;
    const safePosition = Math.min(Math.max(0, position), maxLength);
    
    input.setSelectionRange(safePosition, safePosition);
  } catch (error) {
    // Silently fail - some browsers/input types don't support setSelectionRange
    console.log("Failed to set cursor position:", error);
  }
};

/**
 * Custom hook to preserve cursor position in controlled input fields
 * 
 * This hook solves the common React issue where typing in the middle of text
 * causes the cursor to jump to the end due to state updates triggering re-renders.
 * 
 * @param {any} value - The current value of the input field
 * @returns {Object} - Object containing inputRef and handleChange function
 * 
 * @example
 * const { inputRef, handleChange } = useCursorPosition(value);
 * 
 * <TextField
 *   inputRef={inputRef}
 *   value={value}
 *   onChange={handleChange(setValue)}
 * />
 */
export const useCursorPosition = (value) => {
  const inputRef = useRef(null);
  const cursorPosRef = useRef(null);

  // Restore cursor position after value changes
  useEffect(() => {
    if (inputRef.current && cursorPosRef.current !== null) {
      safelySetCursorPosition(inputRef.current, cursorPosRef.current);
    }
  }, [value]);

  /**
   * Creates a change handler that preserves cursor position
   * @param {Function} onChange - The original onChange handler
   * @returns {Function} - Enhanced onChange handler
   */
  const handleChange = useCallback((onChange) => (e) => {
    const input = e.target;
    
    if (supportsSelection(input)) {
      cursorPosRef.current = input.selectionStart;
    }
    
    onChange(e.target.value);
  }, []);

  return { inputRef, cursorPosRef, handleChange };
};

/**
 * Custom hook for managing multiple input cursor positions
 * Useful when you have multiple input fields in a single component
 * 
 * @returns {Object} - Object containing methods for cursor management
 * 
 * @example
 * const { createCursorHandler, getInputRef, restoreCursorPositions } = useMultipleCursorPositions();
 * const { values, updateValue } = useFormState();
 * 
 * // In component
 * useEffect(() => {
 *   restoreCursorPositions(values);
 * }, [values, restoreCursorPositions]);
 * 
 * <TextField
 *   inputRef={getInputRef('fieldName')}
 *   value={values.fieldName}
 *   onChange={createCursorHandler('fieldName', updateValue)}
 * />
 */
export const useMultipleCursorPositions = () => {
  const inputRefs = useRef({});
  const cursorPositions = useRef({});

  /**
   * Get or create a ref for a specific field
   * @param {string} fieldName - The name of the field
   * @returns {Object} - React ref for the input
   */
  const getInputRef = useCallback((fieldName) => {
    if (!inputRefs.current[fieldName]) {
      inputRefs.current[fieldName] = { current: null };
    }
    return inputRefs.current[fieldName];
  }, []);

  /**
   * Create a change handler for a specific field
   * @param {string} fieldName - The name of the field
   * @param {Function} onChange - The onChange handler
   * @returns {Function} - Enhanced onChange handler
   */
  const createCursorHandler = useCallback((fieldName, onChange) => (e) => {
    const input = e.target;
    
    if (supportsSelection(input)) {
      cursorPositions.current[fieldName] = input.selectionStart;
    }
    
    onChange(fieldName, e.target.value);
  }, []);

  /**
   * Restore cursor positions for all tracked fields
   * Call this in a useEffect when values change
   * Should be memoized with useCallback when used in dependencies
   */
  const restoreCursorPositions = useCallback(() => {
    Object.keys(cursorPositions.current).forEach((fieldName) => {
      const position = cursorPositions.current[fieldName];
      const inputRef = inputRefs.current[fieldName];
      
      if (inputRef?.current && position !== null) {
        safelySetCursorPosition(inputRef.current, position);
      }
    });
  }, []);

  /**
   * Clear cursor position tracking for a specific field
   * Useful for cleanup when fields are unmounted
   * @param {string} fieldName - The name of the field to clear
   */
  const clearFieldTracking = useCallback((fieldName) => {
    delete cursorPositions.current[fieldName];
    delete inputRefs.current[fieldName];
  }, []);

  /**
   * Clear all cursor position tracking
   * Useful for form reset or component unmount
   */
  const clearAllTracking = useCallback(() => {
    cursorPositions.current = {};
    inputRefs.current = {};
  }, []);

  return { 
    getInputRef, 
    createCursorHandler, 
    restoreCursorPositions,
    clearFieldTracking,
    clearAllTracking,
    cursorPositions 
  };
};
