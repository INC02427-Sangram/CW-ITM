import SearchHeader from "../../../utility/Custom Components/SearchHeader";
import CustomTable from "../../../utility/Custom Components/CustomTable";
import applicationConfig from "../../../dataStore/applicationConfig";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

const InvalidMaterialList = ({
  InvalidLineItemList,
  setEccMaterialMasterList,
  fnRowClickHandler,
  setInvalidLineItemList,
  allInvalidList,
  setAllInvalidList

}) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Show message when no invalid items
  if (!InvalidLineItemList || InvalidLineItemList.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 1,
        border: '1px dashed #dee2e6'
      }}>
        <Typography variant="body2" color="text.secondary">
          No invalid materials found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <SearchHeader
        searchFields={applicationConfig(t)?.exceptionTypeFields[0]?.invalidMaterial}
        headerLables={applicationConfig(t)?.exceptionTypeTableHeaders.invalidMaterial}
        results={InvalidLineItemList}
        setResults={setInvalidLineItemList}
        allResultsList={allInvalidList}
        setAllResults={setAllInvalidList}
      />

      <Box sx={{ flex: 1, overflow: 'hidden', mt: 1.5, minHeight: 0 }}>
        <CustomTable
          rows={InvalidLineItemList}
          Headercolumns={applicationConfig(t)?.exceptionTypeFields[0]?.invalidMaterial}
          fnRowClickHandler={fnRowClickHandler}
          maxHeight="100%"
          compactMaterialColumns
          disableSelection={false}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={InvalidLineItemList.length}
          paginationMode="client"
        />
      </Box>
      {/* Columns will be taken from applicationConfig and rows from parent Component */}
    </Box>
  );
};

export default InvalidMaterialList;
