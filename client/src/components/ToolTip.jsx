import React, { useState } from "react";

const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}>
      {children}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0 w-32 p-2 bg-gray-700 text-white text-sm rounded-lg shadow-lg z-10">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
