import SearchHeader from "../../../utility/Custom Components/SearchHeader";
import CustomTable from "../../../utility/Custom Components/CustomTable";
import MatchListFooter from "../../../utility/Custom Components/MatchListFooter";
import applicationConfig from "../../../dataStore/applicationConfig";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

const MatchedItemsList = ({
  matchedList,
  setMatchedList,
  fnRowClickHandler,
  isMatchedListTable,
  unmatchButtonHandler,
  setAllMatchedList,
  allMatchedList,
  handlePreview
}) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  // console.log("you:",matchedList)
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SearchHeader
        searchFields={
          applicationConfig(t)?.exceptionTypeFields[0]?.matchedItems
        }
        headerLables={
          applicationConfig(t)?.exceptionTypeTableHeaders.matchedItems
        }
        results={matchedList}
        setResults={setMatchedList}
        allResultsList={allMatchedList}
        setAllResults={setAllMatchedList}
        fnRowClickHandler={fnRowClickHandler}
      />

      <Box sx={{ flex: 1, overflow: 'hidden', mt: 3 }}>
        {!matchedList || matchedList.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            backgroundColor: '#f8f9fa',
            borderRadius: 1
          }}>
            <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
              No matched items yet. Use the Match button to create matches.
            </Typography>
          </Box>
        ) : (
          <CustomTable
            rows={matchedList}
            Headercolumns={
              applicationConfig(t)?.exceptionTypeFields[0]?.matchedItems
            }
            fnRowClickHandler={fnRowClickHandler}
            maxHeight="100%"
            setRows={setMatchedList}
          />
        )}
      </Box>
    
    </Box>
  );
};

export default MatchedItemsList;
