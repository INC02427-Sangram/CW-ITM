 
// Universal wrapper that prevents DataGrid interference with ANY MUI input component
 
import React from 'react';
import { styled } from '@mui/material/styles';
 
const EditableCellWrapper = styled('div')({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    '& > *': {
        width: '100%',
    },
    '& .MuiInputBase-root': {
        width: '100%',
    },
});
 
export const EditableCell = ({ children, onBlur }) => {
    const handleKeyDown = (e) => {
        // List of ALL keys that should work inside inputs, not trigger DataGrid navigation
        const isInputElement = e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.isContentEditable;
 
        const preventKeys = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'Space', ' ', 'Tab', 'Enter', 'Escape',
            'Home', 'End', 'PageUp', 'PageDown',
            'Backspace', 'Delete'
        ];
 
        // Stop ALL these keys from propagating to DataGrid
        if (isInputElement && (preventKeys.includes(e.key) || e.key === ' ')) {
            e.stopPropagation();
        }
 
        // Handle Enter to blur (optional callback)
        if (e.key === 'Enter' && onBlur) {
            const target = e.target;
            // Don't blur if it's an Autocomplete with dropdown open
            const isAutocomplete = target.closest('.MuiAutocomplete-root');
            const dropdownOpen = document.querySelector('.MuiAutocomplete-popper');
 
            if (!isAutocomplete || !dropdownOpen) {
                onBlur(e);
            }
        }
 
        // Handle Escape to blur
        if (e.key === 'Escape') {
            e.preventDefault();
            e.target.blur();
        }
    };
 
    const handleMouseDown = (e) => {
        // Prevent cell selection when clicking inside input
        e.stopPropagation();
    };
 
    const handleClick = (e) => {
        // Prevent row click when clicking input
        e.stopPropagation();
    };
 
    const handleFocus = (e) => {
        // Prevent cell focus
        e.stopPropagation();
    };
 
    return (
        <EditableCellWrapper
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            onFocus={handleFocus}
        >
            {children}
        </EditableCellWrapper>
    );
};
 
export default EditableCell;