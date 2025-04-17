import React from 'react';
import './styles.css';
import ImageLoader from '../ImageLoader';

const ItemCard = ({ item, onClick }) => {
  const {
    id,
    name,
    brand,
    price,
    imageUrl,
    rank,
    viewCount,
    category,
    selectCount,
    index,
    addToCartCount,
    purchaseCount
  } = item;

  return (
    <div className="card" onClick={onClick}>
      {/* <div className="card-image">
        <img 
          src={imageUrl} 
          alt={name}
          // onError={(e) => {
          //   e.target.onerror = null;
          //   e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
          // }}
        />
      </div> */}
      <ImageLoader imgUrl={imageUrl} alt={name} heightInPercentage='150%' imgContainerClass={'card-image'}/>
      <div className="card-content">
        {name && <h3 className="card-title">{name}</h3>}
        {brand && <p className="card-brand">{brand}</p>}
        {price && <p className="card-price">₹{Number(price).toLocaleString()}</p>}
        
        <div className="card-meta">
          {rank && <p>Rank: {rank}</p>}
          {viewCount && <p>Views: {viewCount}</p>}
        </div>
        
        <div className="card-meta">
          {category && <p>Category: {category}</p>}
          {selectCount && <p className="select-count">Total Clicks: {selectCount}</p>}
          {id && <p className="truncate">ID: {id}</p>}
          {index && <p>Index: {index}</p>}
          {addToCartCount && <p>Add To Cart Count : {addToCartCount}</p>}
          {purchaseCount && <p>Purchase Count : {purchaseCount}</p>}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;