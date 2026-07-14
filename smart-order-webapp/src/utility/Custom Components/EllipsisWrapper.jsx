import Tooltip from "@mui/material/Tooltip";
import React, { useRef, useState } from "react";

/**
 * EllipsisWrapper: Wraps cell content with ellipsis and tooltip
 * Tooltip is shown only when the content is truncated (overflowing).
 * @param {React.ReactNode} children - Content to display
 * @param {string|number} value - Value to show in tooltip
 */
export const EllipsisWrapper = ({ children, value }) => {
  const ref = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const handleMouseEnter = () => {
    if (ref.current) {
      setIsOverflowing(ref.current.scrollWidth > ref.current.clientWidth);
    }
  };

  return (
    <Tooltip title={isOverflowing ? (value ?? "") : ""}>
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          alignItems: "center",
          width: "100%",
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
};
