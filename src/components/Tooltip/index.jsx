import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import './styles.css'; // We'll create this file next

const Tooltip = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="tooltip-container flex content-center">
      <div 
        className="tooltip-icon"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FaInfoCircle />
      </div>
      {showTooltip && (
        <div className="tooltip-content">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;