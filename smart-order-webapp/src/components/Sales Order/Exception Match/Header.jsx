import { useNavigate } from "react-router-dom";
import ArrowBackIosTwoToneIcon from "@mui/icons-material/ArrowBackIosTwoTone";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import StatusIcon from "../../../utility/StatusIcon";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
 
const Header = ({ orderHeaderId }) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const navigate = useNavigate();
  const status = useSelector((state) => state.appReducer.status);
  const backButtonHandler = () => {
    navigate(`/salesOrder/${orderHeaderId}`);
  };
  const theme = useTheme();
 
  return (
    <>
      <header className="listHeader flex-header">
        <div className="flex">
          <button className="icon-btn bg-none-border-none">
            <ArrowCircleLeftOutlinedIcon
              fontSize="small"
              className="icon"
              sx={{ cursor: "pointer" }}
              onClick={() => backButtonHandler()}
            />
          </button>
          <h4 
          style={{
                fontSize: "17.6px",
                fontFamily: "'Roboto', sans-serif",
                margin: 0,
              }}
          >
          {`${orderHeaderId}-  ${t("manuallyMatch")}`}
          </h4>
          <Chip
            label="To Be Reviewed"
            sx={{
              p: 0,
              minHeight: "12px",
              borderRadius: 3,
              backgroundColor: theme.palette.statusChips.toBeReviewed.bg,
              border: "1px solid #e9ecef",
              color: theme.palette.statusChips.toBeReviewed.text,
              display: "flex",
              alignItems: "center",
              marginLeft: '20px',
              '& .MuiChip-label': {
                padding: '0 6px',
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              "&:hover": {
                backgroundColor: theme.palette.statusChips.toBeReviewed.bg,
                opacity: 0.8,
              },
              "&.Mui-focused": {
                backgroundColor: theme.palette.statusChips.toBeReviewed.bg,
              },
            }}
          />
        </div>
      </header>
    </>
  );
};
 
export default Header;