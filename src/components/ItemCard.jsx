import React from 'react';
import './ItemCard.css';

const ItemCard = ({ item, isParent, onClick }) => {
  const cardData = isParent 
    ? {
        id: item.parent_item_id,
        name: item.parent_item_name,
        brand: item.parent_item_brand,
        price: item.parent_price,
        imageUrl: item.parent_image_url,
        rank: item.parent_rank,
        viewCount: item.parent_view_count
      }
    : {
        id: item.clicked_item_id,
        name: item.clicked_item_name,
        brand: item.clicked_item_brand,
        price: item.clicked_item_price,
        imageUrl: item.clicked_image_url,
        category: item.item_category2,
        selectCount: item.select_item_count,
        index: item.clicked_item_index
      };

  return (
    <div className="card" onClick={onClick}>
      <div className="card-image">
        <img 
          src={cardData.imageUrl} 
          alt={cardData.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
          }}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{cardData.name}</h3>
        <p className="card-brand">{cardData.brand}</p>
        <p className="card-price">₹{Number(cardData.price).toLocaleString()}</p>
        
        {isParent && (
          <div className="card-meta">
            <p>Rank: {cardData.rank}</p>
            <p>Views: {cardData.viewCount}</p>
            <p className="truncate">ID: {cardData.id}</p>
          </div>
        )}
        
        {!isParent && (
          <div className="card-meta">
            <p>Category: {cardData.category}</p>
            <p className="select-count">Total Clicks: {cardData.selectCount}</p>
            <p className="truncate">ID: {cardData.id}</p>
            <p>Index: {cardData.index}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;