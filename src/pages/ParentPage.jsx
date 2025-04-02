import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import LayoutControl from '../components/LayoutControl';
import { processData } from '../utils/dataProcessor';
import { useLayout } from '../context/LayoutContext';
import jsonData from '../data.json';
import './Pages.css';

const ParentPage = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cardsPerRow } = useLayout();

  useEffect(() => {
    // Process the data
    const processed = processData(jsonData);
    setGroupedData(processed);
    setLoading(false);
  }, []);

  const handleCardClick = (parentRank, parentId) => {
    navigate(`/category/${parentRank}/${parentId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Parent Items</h1>
        <LayoutControl />
      </div>
      
      <div className="card-grid" style={{ gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }}>
        {Object.keys(groupedData).map(parentRank => {
          const { parentInfo } = groupedData[parentRank];
          return (
            <ItemCard 
              key={parentInfo.parent_item_id}
              item={parentInfo}
              isParent={true}
              onClick={() => handleCardClick(parentRank, parentInfo.parent_item_id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ParentPage;