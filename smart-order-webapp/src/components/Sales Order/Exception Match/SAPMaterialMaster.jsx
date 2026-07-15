import SearchHeader from "../../../utility/Custom Components/SearchHeader";
import CustomTable from "../../../utility/Custom Components/CustomTable";
import applicationConfig from "../../../dataStore/applicationConfig";
import BusyIndicator from "../../../utility/BusyIndicator";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { useState } from "react";

const SAPMaterialMaster = ({
  eccMaterialMasterList,
  setEccMaterialMasterList,
  fnRowClickHandler,
  loaderFlag,
  setLoaderFlag,
  unmatchButtonHandler,
  isSapMaterialList,
  odataQuery,
  setOdataQuery,
}) => {
 
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SearchHeader
        searchFields={
          applicationConfig(t)?.exceptionTypeFields[0]?.materialMaster
        }
        headerLables={
          applicationConfig(t)?.exceptionTypeTableHeaders.materialMaster
        }
        results={eccMaterialMasterList}
        setResults={setEccMaterialMasterList}
        isMatchedListTable={false}
        fnRowClickHandler={fnRowClickHandler}
        unmatchButtonHandler={unmatchButtonHandler}
        isSapMaterialList={isSapMaterialList}
        odataQuery={odataQuery}
        setOdataQuery={setOdataQuery}
      />

      <Box sx={{ flex: 1, overflow: 'hidden', mt: 1.5, minHeight: 0, position: 'relative' }}>
        {loaderFlag ? (
          <BusyIndicator />
        ) : !eccMaterialMasterList || eccMaterialMasterList.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            backgroundColor: '#f8f9fa',
            borderRadius: 1
          }}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              No Data Present In The Table
            </div>
          </Box>
        ) : (
          <CustomTable
            rows={eccMaterialMasterList}
            Headercolumns={
              applicationConfig(t)?.exceptionTypeFields[0]?.materialMaster
            }
            fnRowClickHandler={fnRowClickHandler}
            maxHeight="100%"
            isSapMaterialList={isSapMaterialList}
            compactMaterialColumns
            disableSelection={false}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={eccMaterialMasterList.length}
            paginationMode="client"
          />
        )}
      </Box>
    </Box>
  );
};

export default SAPMaterialMaster;
