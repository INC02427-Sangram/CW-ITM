import SearchIcon from "@mui/icons-material/Search";
import { useState, useRef, useEffect,useMemo } from "react";
import { TextField, CircularProgress, InputAdornment } from "@mui/material";
import { Fade } from "@mui/material";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import fnServiceRequest from "../fnServiceRequest";
import { useParams } from "react-router-dom";
import "./Style.css";

const SearchHeader = ({
  searchFields,
  headerLables,
  results,
  setResults,
  allResultsList,
  setAllResults,
  fnRowClickHandler,
  isSapMaterialList,
  odataQuery,
  setOdataQuery,
}) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const manualScreenDetails = useSelector(
    (state) => state.appReducer.salesOrderDetails
  );
  const searchFieldList = useMemo(() => {
    return searchFields.reduce((acc, current) => {
      return acc.concat(current.fieldBinding);
    }, []);
  }, [searchFields]);
  // const [showSearchResults, setShowResults] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true); // for the visibility of search textField
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const latestRequestRef = useRef(0);
  const timerRef = useRef(null);

  const handleClick = (oEvent) => {
    
  };
  const fnSearchHandleChange = (oEvent) => {
    setQuery(oEvent.target.value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const filteredResults = [];

      allResultsList.forEach((row, rowId) => {
        // iterating over  the entire array of objects
        let shouldSkip = false;
        Object.keys(row).forEach((key) => {
          if (shouldSkip) {
            return;
          }
          if (
            searchFieldList.includes(key) &&
            String(row[key])
              ?.toLowerCase()
              .includes(oEvent.target.value.toLowerCase())
          ) {
            filteredResults.push(row);
            shouldSkip = true;
            return;
          }
        });
      });
      setResults(filteredResults);
    }, 1000);
  };
  const fnSearchFieldKeyDown = (oEvent) => {
    // console.log("Is the key down working");
    if (oEvent.keyCode === 13 || oEvent.keyCode === 32) {
      // 13 is keycode for Enter button and 32 is for space button
      // and when enter or space is pressed , search results should be applied on the query
      // setShowResults(true);
    }
  };
  const fnOdataSearchChange = (oEvent) => {
    const value = oEvent.target.value;

    setOdataQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Clear results immediately for empty input
    if (!value.trim()) {
      // Invalidate all previous requests
      latestRequestRef.current++;
      setResults([]);
      setLoading(false);
      return;
    }

    // Prevent API spam
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    // Show loading
    setLoading(true);

    debounceRef.current = setTimeout(() => {
      getOdataSearchResults(value);
    }, 500);
  };

  const fnOdataSearchKeyDown = (oEvent) => { };


  const getOdataSearchResults = (query) => {
    const requestId = ++latestRequestRef.current;

    const queryParameters = {
      searchQuery: query?.toUpperCase()?.trim(),
    };

    const orderId = manualScreenDetails?.orderHeaderId;

    // Mandatory validation
    if (!orderId) {
      console.error("Order ID is mandatory");

      setLoading(false);
      setResults([]);

      return;
    }

    const sUrl = `/JavaServices_Oauth/api/salesOrder/manualMatch?material=${encodeURIComponent(
      queryParameters?.searchQuery
    )}&orderId=${encodeURIComponent(orderId)}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => fnSuccessHandler(response, requestId),
      (error) => fnErrorHandler(error),
    );

    const fnSuccessHandler = (response, requestId) => {
      // Ignore stale responses
      if (requestId !== latestRequestRef.current) {
        return;
      }

      setLoading(false);

      const itemList = response?.data?.itemList || [];

      setResults(
        itemList.map((item, index) => ({
          id: index,
          gid: item?.materialId,
          materialNumber: item?.materialId,
          eanNumber: item?.eanUpc,
          globalDescription: item?.materialDescription,
          natCode: item?.natCode,
          language: item?.languageKey,
          custMaterial: item?.custMaterial,
          materialType: item?.materialType,
          materialGroup: item?.materialGroup,
          salesOrg: item?.salesOrg,
          distChan: item?.distChan,
          netPrice: item?.netPrice,
          division: item?.division,
        }))
      );
    };

    const fnErrorHandler = (error) => {
      console.error("Manual match API failed", error);

      setLoading(false);
      setResults([]);
    };
  };

  const fnErrorHandler = (error) => { };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (timerRef.current) clearTimeout(timerRef.current); 
    };
  }, []);



  return (
    <div className="search-component">
      <div className="search-label">{headerLables}</div>
      <div className="searchBar">
        <Fade in={showSearchBar}>
          {isSapMaterialList ? (
            <TextField
              name="search"
              className="searchTab"
              value={odataQuery}
              placeholder={"Search"}
              onChange={(event) => fnOdataSearchChange(event)}
              onKeyDown={(event) => fnOdataSearchKeyDown(event)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading && <CircularProgress size={18} />}
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <TextField
              name="search"
              className="searchTab"
              value={query}
              placeholder={"Search"}
              onChange={(event) => fnSearchHandleChange(event)}
              onKeyDown={(event) => fnSearchFieldKeyDown(event)}
            />
          )}
        </Fade>
        <button title="Search" className="search-btn">
          <SearchIcon onClick={(event) => handleClick(event)} />
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
