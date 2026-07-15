import React from "react";
import styled from "styled-components";

const Button = ({ type, onClick, icon, children }) => {
  return (
    <StyledWrapper>
      <button className="cta" type={type} onClick={onClick}>
        {icon && <span className="icon">{icon}</span>}
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .cta {
    position: relative;
    margin: auto;
    padding: 0 18px 0 0;
    transition: all 0.2s ease;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cta:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border-radius: 50px;
    background: #b1dae7;
    width: 45px;
    height: 45px;
    transition: all 0.3s ease;
  }

  .cta .icon {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    flex-shrink: 0;
  }

  .cta span:not(.icon) {
    position: relative;
    z-index: 1;
    font-family: "Ubuntu", sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #234567;
  }

  .cta svg {
    position: relative;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #234567;
    stroke-width: 2;
  }

  .cta:hover:before {
    width: 100%;
    background: #b1dae7;
  }

  .cta:active {
    transform: scale(0.95);
  }
`;

export default function ReusableButtons({ type, onClick, icon, children }) {
  return (
    <div>
      <Button icon={icon} onClick={onClick}>
        {children}
      </Button>
    </div>
  );
}
