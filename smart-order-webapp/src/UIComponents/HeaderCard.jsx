import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";

const StyledHeaderCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(2),
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
}));

const HeaderCard = ({ children, ...props }) => {
    return (
        <StyledHeaderCard {...props}>
            {children}
        </StyledHeaderCard>
    );
};

export {
    HeaderCard
}