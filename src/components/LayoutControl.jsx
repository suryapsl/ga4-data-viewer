import React, { useState } from 'react';
import { useLayout } from '../context/LayoutContext';
import './LayoutControl.css';

const LayoutControl = () => {
  const { cardsPerRow, updateCardsPerRow } = useLayout();
  const [count, setCount] = useState(cardsPerRow);

  const handleChange = e => {
    const value = e.target.value;
    setCount(value);
    if (value >= 1 && value <= 20) {
      updateCardsPerRow(value);
    }
  };

  return (
    <div className="layout-control">
      <label htmlFor="cards-per-row">Cards per row:</label>
      <input
        id="cards-per-row"
        type="number"
        min="1"
        max="20"
        value={count}
        onChange={handleChange}
      />
    </div>
  );
};

export default LayoutControl;