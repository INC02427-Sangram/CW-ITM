import React from "react";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
const Card = ({ title, subtitle, description, onClick }) => {
  return (
    <StyledWrapper>
      <Box className="card" onClick={onClick}>
        <Box
          sx={{
            padding: "0.5rem 1rem 0.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "relative",
            height: "100%",
          }}
        >
          <Typography sx={{ color: "#636e72", fontWeight: 600, fontSize: 14 }}>
            {title}
          </Typography>
          <Typography sx={{ color: "#1F2A44", fontWeight: 800, fontSize: 24 }}>
            {subtitle}
          </Typography>
          <Typography
            sx={{
              color: "#636e72",
              fontWeight: 400,
              fontSize: 12,
              marginTop: "auto",
            }}
          >
            {description}
          </Typography>

        </Box>
      </Box>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  height: 65%;

  .card {
    width: 100%;
    height: 100%;
    min-height: 100px;
    background-color: #ffffff;
    background-image: linear-gradient(
      43deg,
      #fbfbfb 0%,
      #d4f6ff 46%,
      #c6e7ff 100%
    );
    border-radius: 15px;
    color: white;
    overflow: hidden;
    position: relative;
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
  }

  .card-content {
    padding: 10px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #000;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
  }

  .card-content .card-title {
    font-size: 14px;
    color: inherit;
    text-transform: uppercase;
  }

  .card-content .card-para {
    color: inherit;
    opacity: 0.8;
    font-size: 12px;
  }

  .card:hover {
    transform: rotateY(10deg) rotateX(10deg) scale(1.01);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .card:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
  }
  .card:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
  }
`;

export default Card;
