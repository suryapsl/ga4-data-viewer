import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import LayoutControl from '../components/LayoutControl';
import { processData } from '../utils/dataProcessor';
import { useLayout } from '../context/LayoutContext';
import jsonData from '../data.json';
import './Pages.css';

const CategoryPage = () => {
  const { parentRank, parentId } = useParams();
  const [categoryGroups, setCategoryGroups] = useState({});
  const [parentInfo, setParentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cardsPerRow } = useLayout();

  useEffect(() => {
    // Process the data
    const processed = processData(jsonData);
    
    if (processed[parentRank]) {
      setCategoryGroups(processed[parentRank].categories);
      setParentInfo(processed[parentRank].parentInfo);
    }
    
    setLoading(false);
  }, [parentRank, parentId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!parentInfo) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Parent not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="action-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div>
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          ← Back to Parents
        </button>
        
        <div className="parent-header">
          <div className="parent-thumbnail">
            <img 
              src={parentInfo.parent_image_url} 
              alt={parentInfo.parent_item_name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/100?text=Image+Not+Available';
              }}
            />
          </div>
          <div className="parent-info">
            <h1>{parentInfo.parent_item_name}</h1>
            <p className="card-brand">{parentInfo.parent_item_brand}</p>
            <p className="card-price">₹{Number(parentInfo.parent_price).toLocaleString()}</p>
            <p className="card-meta">Rank: {parentInfo.parent_rank} • Views: {parentInfo.parent_view_count}</p>
          </div>
        </div>
        <div className="layout-controls-container">
          <LayoutControl />
        </div>
      </div>

      
      {Object.keys(categoryGroups).map(category => (
        <div key={category} style={{marginBottom: '40px'}}>
          <h2 className="category-title">{category}</h2>
          <div className="card-grid"  style={{ gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }}>
            {categoryGroups[category].map(item => (
              <ItemCard 
                key={item.clicked_item_id}
                item={item}
                isParent={false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;