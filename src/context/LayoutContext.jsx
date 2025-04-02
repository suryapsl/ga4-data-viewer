import React, { createContext, useState, useContext } from 'react';

const LayoutContext = createContext();

export function useLayout() {
  return useContext(LayoutContext);
}

export function LayoutProvider({ children }) {
  const [cardsPerRow, setCardsPerRow] = useState(4);

  const updateCardsPerRow = (count) => {
    setCardsPerRow(parseInt(count) || 4); // Default to 4 if parsing fails
  };

  return (
    <LayoutContext.Provider value={{ cardsPerRow, updateCardsPerRow }}>
      {children}
    </LayoutContext.Provider>
  );
}