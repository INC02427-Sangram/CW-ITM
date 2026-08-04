import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Slide,
} from "@mui/material";

const Button = ({ type, onClick, icon, children, options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);
  const hasOptions = Array.isArray(options) && options.length > 0;
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (hasOptions) {
      setAnchorEl(event.currentTarget);
      setIsHovered(true);
    } else if (onClick) {
      onClick(event);
    }
  };

  const handleClose = () => setAnchorEl(null);

  // MUI's Menu backdrop covers the page while open, so the button stops
  // being the topmost element under the cursor and fires a spurious
  // mouseleave. Track hover by real cursor position instead while open.
  useEffect(() => {
    if (!open) return undefined;

    const handleMouseMove = (event) => {
      const rect = buttonRef.current?.getBoundingClientRect();
      const inside =
        !!rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      setIsHovered(inside);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [open]);

  const handleOptionClick = (option) => {
    handleClose();
    option.onClick && option.onClick();
  };

  return (
    <StyledWrapper>
      <button
        ref={buttonRef}
        className={hasOptions && isHovered ? "cta active" : "cta"}
        type={type}
        onClick={handleClick}
        onMouseEnter={() => hasOptions && !open && setIsHovered(true)}
        onMouseLeave={() => hasOptions && !open && setIsHovered(false)}
      >
        {icon && <span className="icon">{icon}</span>}
        <span>{children}</span>
      </button>
      {hasOptions && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          TransitionComponent={Slide}
          TransitionProps={{ direction: "down", container: buttonRef.current }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              mt: 0.5,
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option?.key ?? index}
              onClick={() => handleOptionClick(option)}
              disabled={option?.disabled}
            >
              {option?.icon && <ListItemIcon>{option?.icon}</ListItemIcon>}
              <ListItemText>{option?.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
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

  .cta:hover:before,
  .cta.active:before {
    width: 100%;
    background: #b1dae7;
  }

  .cta:active {
    transform: scale(0.95);
  }
`;

export default function ReusableButtons({
  type,
  onClick,
  icon,
  children,
  options,
}) {
  return (
    <div>
      <Button type={type} icon={icon} onClick={onClick} options={options}>
        {children}
      </Button>
    </div>
  );
}
