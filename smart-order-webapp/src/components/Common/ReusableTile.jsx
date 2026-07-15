import React from "react";
import styled from "styled-components";

const Card = ({ title, subtitle, description, onClick }) => {
  return (
    <StyledWrapper>
      <div className="card" onClick={onClick}>
        <div className="card-content">
          <p className="card-title">{title}</p>
          <p className="card-para">{subtitle}</p>
          <p className="card-para">{description}</p>
        </div>
      </div>
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
      #ffffff 0%,
      #ffe4e4 46%,
      #fff4dc 100%
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
    transform: rotateY(10deg) rotateX(10deg) scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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

  .card:hover:before {
    transform: translateX(-100%);
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

  .card:hover:after {
    transform: translateX(100%);
  }
`;

export default Card;
