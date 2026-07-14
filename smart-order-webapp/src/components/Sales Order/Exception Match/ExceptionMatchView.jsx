import Header from "./Header";
import InvalidMaterialList from "./InvalidMaterialList";
import MatchedItemsList from "./MatchedItemsList";
import SAPMaterialMaster from "./SAPMaterialMaster";
import { useEffect, useState } from "react";
import fnServiceRequest from "../../../utility/fnServiceRequest";
import useSelection from "antd/es/table/hooks/useSelection";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { Card, CardContent, Box, Typography, Divider, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  setExceptionScreenFlag,
  setMessagePopoverVisibility,
  setMessagePopoverStatus,
  setLineItemList,
  setSalesItemdata,
  setShouldRefetchLineItems,
} from "../../../redux/reducers/appReducer";
import "./Style.css";
import CustomMessagePopover from "../../../utility/Custom Components/CustomMessagePopover";
import { useTranslation } from "react-i18next";
import MatchListFooter from "../../../utility/Custom Components/MatchListFooter";
import { HeaderControlButton as MatchButton } from "../../../UIComponents/Button";
import { ButtonTypes } from "../../../UIComponents/UITypes";
import { dropTagFromCsv } from "../utils/customerUtils";
const ExceptionMatchView = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const theme = useTheme();
  // This is my parent component for the material matching screen
  const dispatch = useDispatch();
  const messagePopoverVisibility = useSelector(
    (state) => state.appReducer.messagePopoverVisibility
  );
  const messagePopoverStatus = useSelector(
    (state) => state.appReducer.messagePopoverStatus
  );
  const userDetails = useSelector((state) => state.appReducer.userDetails);
  const { orderHeaderId } = useParams();

  const lineItemList = useSelector((state) => state.appReducer.lineItemList);

  const [InvalidLineItemList, setInvalidLineItemList] = useState([]);
  const [allInvalidList, setAllInvalidList] = useState([]);
  const [eccMaterialMasterList, setEccMaterialMasterList] = useState([]); // initially it will be empty and will be filled
  // by the response we get from ECC

  const [matchedList, setMatchedList] = useState([]);
  const [allMatchedList, setAllMatchedList] = useState([]);

  const [loaderFlag, setLoaderFlag] = useState(false);
  const [odataQuery, setOdataQuery] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const manualScreenDetails = useSelector(
    (state) => state.appReducer.manualScreenDetails
  );
  const headerInfo = useSelector((state) => state.appReducer.headerInfo);

  // Initialize data when lineItemList changes
  useEffect(() => {
    if (lineItemList && lineItemList.length > 0) {
      const invalidItems = lineItemList.filter(
        (item) => item.exceptionType && item.exceptionType !== "Resolved"
      );
      setInvalidLineItemList(invalidItems);
      setAllInvalidList(invalidItems);
      setIsInitialLoading(false);
    }
  }, [lineItemList]);

  const fnInvalidRowClickHandler = (event, columns, rows, index) => {
    // on click of row on invalid item table, we have to make the state of invalidMaterial row as clickable true
    const InvalidLineItemListClone = [...InvalidLineItemList];
    InvalidLineItemListClone.forEach((row, indexs) => {
      const objClone = { ...row };
      if (index !== indexs) {
        objClone.isclicked = false;
      }

      InvalidLineItemListClone[indexs] = objClone;
    });
    const objCloneOfClickedRow = { ...InvalidLineItemListClone[index] };
    objCloneOfClickedRow.isclicked = !objCloneOfClickedRow.isclicked;
    InvalidLineItemListClone[index] = objCloneOfClickedRow;
    setInvalidLineItemList(InvalidLineItemListClone);
    setAllInvalidList(InvalidLineItemListClone);

    const materialNumber = rows[index].poMaterialNumber;
    const division = manualScreenDetails?.division;
    const salesOrg = headerInfo?.salesOrg;
    const distributionChannel = manualScreenDetails?.distributionChannel;

  };

  function stringToSubstrings(inputString) {
    // Split the input string by spaces and "X"
    const substrings = inputString?.split(/ |\/|\\/g);
    return substrings;
  }
  const getActiveMaterialList = (
    materialNumber,
    division,
    salesOrg,
    distributionChannel
  ) => {
    const queryParameters = {
      searchQuery: materialNumber,
      division: division,
      salesOrg: salesOrg,
      distributionChannel: distributionChannel,
    };
    const sUrl = `/JavaServices_Oauth/api/odata/getMaterialFromManualMatch?materialDesc=${queryParameters?.searchQuery
      }&salesOrg=${queryParameters?.salesOrg}&distCode=${queryParameters?.distributionChannel
      }&division=${queryParameters?.division}&materialNumber=${queryParameters?.searchQuery
      }&top=${50}&skip=${0}`;

    fnServiceRequest(
      sUrl,
      "GET",
      (response) => fnSuccessHandler(response),
      (error) => fnErrorHandler(error)
    );
  };

  const fnSuccessHandler = (response) => {
    // on success of this, SAP ECC Material Master will be appended with data

   setEccMaterialMasterList(
      response?.map((item, index) => {
        return {
          id: index,
          gid: item?.MaterialNumber,
          globalDescription: item?.MaterialDescription,
          netPrice: item?.NetPrice
        };
      })
    );
    setLoaderFlag(false);
  };
  const fnErrorHandler = () => {
    setLoaderFlag(false);
    dispatch(setMessagePopoverVisibility(true));
    dispatch(
      setMessagePopoverStatus({
        status: t("materialUnavailable"),
        orderId: null,
      })
    );
  };

  const fnSapMaterialMasterClickHandler = (event, columns, rows, index) => {
    const sapMaterialListClone = [...eccMaterialMasterList];
    sapMaterialListClone.forEach((row, indexs) => {
      const objClone = { ...row };
      if (index !== indexs) {
        objClone.isclicked = false;
      }

      sapMaterialListClone[indexs] = objClone;
    });
    const objCloneOfClickedRow = { ...sapMaterialListClone[index] };
    objCloneOfClickedRow.isclicked = !objCloneOfClickedRow.isclicked;
    sapMaterialListClone[index] = objCloneOfClickedRow;
    setEccMaterialMasterList(sapMaterialListClone);
  };

  const findClickedIndexs = (selectedList) => {
    //debugger
    let indexes = -1;
    selectedList.forEach((item, index) => {
      if (item.isclicked == true) {
        indexes = index;
      }
    });

    return indexes;
  };

  const [targetIndexForLineItem, setTargetIndexForLineItem] = useState(-1);
  const [newAddedMatchList, setNewAddedMatchList] = useState({});
  const fnSaveAudit = (payload) => {
    fnServiceRequest(
      `/JavaServices_Oauth/api/audit/saveAudit`,
      "POST",
      (response) => { },
      (error) => { },
      payload
    );
  };
  const matchButtonClickHandler = (oEvent) => {
    setOdataQuery("");
    const invalidIndex = findClickedIndexs(InvalidLineItemList);
    const eccIndex = findClickedIndexs(eccMaterialMasterList);

    if (invalidIndex !== -1 && eccIndex !== -1) {
      const updatedInvalidLineItemList = InvalidLineItemList?.filter(
        (item, ind) => item.isclicked !== true
      );

      setInvalidLineItemList(updatedInvalidLineItemList);
      setAllInvalidList(updatedInvalidLineItemList);
      const currentlyAddedList = {
        material: eccMaterialMasterList[eccIndex]?.gid,
        poMaterialId: InvalidLineItemList[invalidIndex]?.poMaterialNumber,
        materialDescription: eccMaterialMasterList[eccIndex]?.globalDescription,
        quantity: InvalidLineItemList[invalidIndex]?.poTotalQauntity,
        checkbox: false,
        sapUnitPrice: Number(eccMaterialMasterList[eccIndex]?.netPrice) || 0,
        prevInvalidMaterialList: InvalidLineItemList[invalidIndex],
        exceptionType: InvalidLineItemList[invalidIndex].exceptionType,
        serialNumber: InvalidLineItemList[invalidIndex]?.serialNumber
      };
      setNewAddedMatchList(currentlyAddedList);
      setMatchedList([...matchedList, currentlyAddedList]);
      setAllMatchedList([...matchedList, currentlyAddedList]);
      setEccMaterialMasterList([]);

      const lineItemListCopy = JSON.parse(JSON.stringify(lineItemList));

      // now I wanted the index the particular line item row for which I have to set resolved
      lineItemListCopy?.forEach((row, id) => {
        if (
          row.poMaterialNumber ===
          InvalidLineItemList[invalidIndex].poMaterialNumber &&
          InvalidLineItemList[invalidIndex].poMatDescription ==
          row?.poMatDescription &&
          row.exceptionType !== null &&
          row.poTotalQauntity ===
          InvalidLineItemList[invalidIndex]?.poTotalQauntity
        ) {
          setTargetIndexForLineItem(id);
        }
      });

    }
  };

  const unmatchButtonHandler = () => {
    const updatedMatchedList = matchedList?.filter(
      (item, index) => item.checkbox === false
    );
    const removedInvalidMaterialLists = matchedList?.filter(
      (itemRow, index) => itemRow.checkbox === true
    );

    removedInvalidMaterialLists.forEach((item, index) => {
      removedInvalidMaterialLists[index].poMaterialId =
        removedInvalidMaterialLists[
          index
        ]?.prevInvalidMaterialList?.poMaterialNumber;
      removedInvalidMaterialLists[index].materialDescription =
        removedInvalidMaterialLists[
          index
        ]?.prevInvalidMaterialList?.poMatDescription;
      removedInvalidMaterialLists[index].quantity =
        removedInvalidMaterialLists[index]?.prevInvalidMaterialList?.quantity;
    });

    const InvalidLineItemListCopy = [...InvalidLineItemList];
    removedInvalidMaterialLists.forEach((item, index) => {
      InvalidLineItemListCopy.push(item?.prevInvalidMaterialList);
    });
    setInvalidLineItemList(InvalidLineItemListCopy);
    setAllInvalidList(InvalidLineItemListCopy);
    setMatchedList(updatedMatchedList);
    setAllMatchedList(updatedMatchedList);

    const lineItemListCopy = JSON.parse(JSON.stringify(lineItemList));

    // now I wanted the index the particular line item row for which I have to set resolved

    removedInvalidMaterialLists.forEach((item, index) => {
      lineItemListCopy.forEach((row, id) => {
        if (
          row.poMaterialNumber === item.poMaterialId &&
          item.materialDescription == row.poMatDescription &&
          row.quantity === item.quantity
        ) {
          lineItemListCopy[id].sapMaterialDescription =
            item.prevInvalidMaterialList.sapMaterialDescription;

          lineItemListCopy[id].exceptionType =
            item.prevInvalidMaterialList?.exceptionType;
          lineItemListCopy[id].sapMaterialId =
            item.prevInvalidMaterialList?.sapMaterialDescription;
          lineItemListCopy[id].quantity =
            item.prevInvalidMaterialList?.quantity;
        }
      });
    });

    dispatch(setLineItemList(lineItemListCopy));
  };
  const fnMatchedMaterialClickHandler = () => {
  };

  const handlePreview = () => {
    const lineItemListCopy = JSON.parse(JSON.stringify(lineItemList));

    matchedList.forEach((matchedItem) => {
      lineItemListCopy.forEach((item) => {
        if (
          item.poMaterialNumber === matchedItem.poMaterialId &&
          item.poTotalQauntity === matchedItem.quantity &&
          item.exceptionType !== "Resolved" &&
          item.serialNumber === matchedItem.serialNumber
        ) {
          item.sapMaterialNumber = matchedItem.material;
          item.sapMatDescription = matchedItem.materialDescription;
          item.exceptionType = dropTagFromCsv(item.exceptionType, "Invalid Material");
          item.poTotalQauntity = matchedItem.quantity;
        }
      });
    });

    // ✅ API call now happens here
    const sUploadUrl = `/JavaServices_Oauth/api/salesOrder/learnValidMaterial`;
    const learningItemList = matchedList.map((matchedItem) => ({
      poMaterialNumber: matchedItem.poMaterialId,
      poMaterialDesc: matchedItem.prevInvalidMaterialList?.poMatDescription,
      sapMaterialNumber: matchedItem.material,
      sapMaterialDesc: matchedItem.materialDescription,
      itemId: matchedItem.prevInvalidMaterialList?.orderItemId,
      sapUnitPrice: matchedItem.sapUnitPrice,
    }));
 
    const payload = {
      learningItemList,
      orderId: orderHeaderId,
    };

    fnServiceRequest(
      sUploadUrl,
      "POST",
      (response) => {
        console.log("Learn valid material bulk API call success", response);

        matchedList.forEach((matchedItem) => {
          fnSaveAudit({
            salesOrderHeader: {
                orderHeaderId: orderHeaderId,
            },
            entityName: "",
            action: "Updated",
            lastModifiedBy: userDetails?.email,
            lastModifiedDate: new Date().toISOString(),
            createdBy: `${userDetails?.firstName} ${userDetails?.lastName}`,
            createdDate: new Date().toISOString(),
            oldValue: "Invalid Material",
            newValue: "Resolved",
            remarks: `Exception Type resolved for itemId ${matchedItem?.prevInvalidMaterialList?.orderItemId}`,
          });
        });

        fnServiceRequest(
          `/JavaServices_Oauth/api/salesOrder/getAllItems?headerId=${orderHeaderId}&isDeleted=false`,
          "GET",
          (itemsResponse) => {
            const maybeData = itemsResponse?.data;
            const payload = maybeData?.data ?? maybeData ?? {};
            const list = Array.isArray(payload?.itemList) ? payload.itemList : [];
            dispatch(setSalesItemdata(payload));
            dispatch(setLineItemList(list));
            dispatch(setShouldRefetchLineItems(false));
            window.history.back();
          },
          () => {
            dispatch(setShouldRefetchLineItems(false));
            window.history.back();
          }
        );
      },
      (error) => {
        console.error("Learn valid material API call failed", error);
        dispatch(setMessagePopoverVisibility(true));
        dispatch(
          setMessagePopoverStatus({
            status: t("materialUnavailable"),
            orderId: null,
          })
        );
      },
      payload
    );
  };


  useEffect(() => {
    dispatch(setExceptionScreenFlag(true));
    return () => {
      dispatch(setMessagePopoverVisibility(false));
      dispatch(
        setMessagePopoverStatus({
          status: null,
          orderId: null,
        })
      );
    };
  }, []);

  // Show loading state while initializing
  if (isInitialLoading) {
    return (
      <div className="unmatched-screen-container">
        <Header orderHeaderId={orderHeaderId} />
        <div className="unmatched-screen-flex">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress size={60} />
          </Box>
        </div>
      </div>
    );
  }

  return (
    <>
      {messagePopoverVisibility && (
        <CustomMessagePopover popOverMessageObj={messagePopoverStatus} />
      )}
      <div
        className="exception-match-page"
        style={{
          padding: 10
        }}
      >
        <Header orderHeaderId={orderHeaderId} />
        <div className="unmatched-screen-flex">
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            sx={{
              width: "100%",
              m: 0,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  },
                  height: { xs: 360, sm: 360, md: "clamp(280px, 40dvh, 360px)" },
                  minHeight: { xs: 360, md: 280 },
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                <CardContent sx={{ p: 1, height: "100%", display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                  <InvalidMaterialList
                    InvalidLineItemList={InvalidLineItemList}
                    setEccMaterialMasterList={setEccMaterialMasterList}
                    fnRowClickHandler={fnInvalidRowClickHandler}
                    setInvalidLineItemList={setInvalidLineItemList}
                    allInvalidList={allInvalidList}
                    setAllInvalidList={setAllInvalidList}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  },
                  height: { xs: 320, sm: 340, md: "clamp(280px, 40dvh, 360px)" },
                  minHeight: { xs: 320, md: 280 },
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                <CardContent sx={{ p: 1, height: "100%", display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                  <SAPMaterialMaster
                    eccMaterialMasterList={eccMaterialMasterList}
                    setEccMaterialMasterList={setEccMaterialMasterList}
                    fnRowClickHandler={fnSapMaterialMasterClickHandler}
                    loaderFlag={loaderFlag}
                    setLoaderFlag={setLoaderFlag}
                    unmatchButtonHandler={unmatchButtonHandler}
                    isSapMaterialList={true}
                    odataQuery={odataQuery}
                    setOdataQuery={setOdataQuery}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' }, mt: { xs: 0, md: -1 }, mb: { xs: 0, md: -1 } }}>
              <div className="exception-match-btn-wrapper">
                <MatchButton
                  action={ButtonTypes.APPLY}
                  onClick={matchButtonClickHandler}
                >
                  Match
                </MatchButton>
              </div>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  },
                  display: "flex",
                  flexDirection: "column",
                  height: { xs: 320, sm: 340, md: "auto" },
                  minHeight: { xs: 320, md: 200 },
                  minWidth: 0,
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 3 }, height: "100%", display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                  <MatchedItemsList
                    matchedList={matchedList}
                    setMatchedList={setMatchedList}
                    isMatchedListTable={true}
                    fnRowClickHandler={fnMatchedMaterialClickHandler}
                    unmatchButtonHandler={unmatchButtonHandler}
                    setAllMatchedList={setAllMatchedList}
                    allMatchedList={allMatchedList}
                    handlePreview={handlePreview}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' }, mt: { xs: 0, md: -1 }, mb: { xs: 0, md: -1 } }}>
              <div className="exception-match-btn-wrapper">
                <Box sx={{
                  mt: 'auto',
                  pt: 2,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end'
                }}>
                  <MatchListFooter
                    unmatchButtonHandler={unmatchButtonHandler}
                    isMatchedListTable={true}
                    handlePreview={handlePreview}
                  />
                </Box>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default ExceptionMatchView;
