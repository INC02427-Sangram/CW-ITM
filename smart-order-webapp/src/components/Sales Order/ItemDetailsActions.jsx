import { Tooltip, Select, MenuItem, Box } from "@mui/material";
import { HeaderControlButton as HeaderButton } from "../../UIComponents/Button";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { ButtonTypes } from "../../UIComponents/UITypes";
import { useTranslation } from "react-i18next";

/**
 * ItemDetailsActions Component
 * Renders action buttons (Check Stock, Add Material) and filter dropdown
 * 
 * @param {Function} onStockSearchClick - Handler for stock search button
 * @param {Function} onAddMaterial - Handler for add material button
 * @param {Function} onDropdownChange - Handler for dropdown filter change
 * @param {string} selectedOption - Currently selected filter option
 * @param {Array} dropDownOptions - Array of dropdown filter options
 * @param {boolean} isAnyRowEditable - Whether any row is currently being edited
 */
const ItemDetailsActions = ({
  onStockSearchClick,
  onAddMaterial,
  onDropdownChange,
  selectedOption,
  dropDownOptions = [],
  isAnyRowEditable = false,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      className="action-buttons"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap:1,
        flexWrap: "wrap",
        width: "fit-content",
      }}
    >
      <HeaderButton
        action={ButtonTypes.CHECK}
        startIcon={<SearchIcon />}
        onClick={onStockSearchClick}
      >
        Check Stock
      </HeaderButton>

      <Tooltip
        title={isAnyRowEditable ? t("Please save the current row first") : ""}
        disableHoverListener={!isAnyRowEditable}
      >
        <span>
          <HeaderButton
            variant="outlined"
            startIcon={
              <AddIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", alignSelf: "center" }}
              />
            }
            onClick={onAddMaterial}
            disabled={isAnyRowEditable}
          >
            {t("addMaterial")}
          </HeaderButton>
        </span>
      </Tooltip>

      <Select
        value={selectedOption}
        onChange={onDropdownChange}
        style={{
          height: "40px",
          minWidth: "170px",
        }}
      >
        {dropDownOptions.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default ItemDetailsActions;
