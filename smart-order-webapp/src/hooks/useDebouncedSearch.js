import { useState, useEffect, useRef } from "react";

//Custom hook for debounced search functionality.

const useDebouncedSearch = (delay = 300) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
    }, delay);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, delay]);

  return { searchTerm, setSearchTerm, debouncedSearchTerm };
};

export default useDebouncedSearch;
