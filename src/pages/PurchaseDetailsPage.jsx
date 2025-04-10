import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import { availableDatasets } from './ParentPage';
import './PurchaseDetailsPage.css';

// Detail Item Component
const DetailItem = ({
  label,
  value,
  tooltipKey,
  tooltipText,
  isHighlight,
  onMouseEnter,
  onMouseLeave,
  activeTooltip,
  link,
}) => {
  const detailRow = (
    <div className="purchase-details-detail-item">
      <span className="purchase-details-detail-label">
        {label}
        <span
          className="purchase-details-info-icon"
          onMouseEnter={() => onMouseEnter(tooltipKey)}
          onMouseLeave={onMouseLeave}
        >
          <FaInfoCircle />
          {activeTooltip === tooltipKey && (
            <div className="purchase-details-tooltip">{tooltipText}</div>
          )}
        </span>
      </span>
      <span
        className={`purchase-details-detail-value ${
          isHighlight ? 'purchase-details-detail-value-highlight' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
  if (link) {
    return (
      <Link to={link} target="_blank">
        {detailRow}
      </Link>
    );
  }
  return detailRow;
};

// Product Card Component
const ProductCard = ({
  title,
  imageUrl,
  imageAlt,
  details,
  tooltips,
  activeTooltip,
  handleMouseEnter,
  handleMouseLeave,
  formatKey,
}) => {
  return (
    <div className="purchase-details-card">
      <h2 className="purchase-details-subheading">{title}</h2>
      <div className="purchase-details-card-content">
        <div className="purchase-details-image-container">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="purchase-details-product-image"
          />
        </div>
        <div className="purchase-details-details-container">
          {details.map(item => (
            <DetailItem
              key={item.key}
              label={formatKey(item.key)}
              value={item.value}
              tooltipKey={item.key}
              tooltipText={tooltips[item.key]}
              isHighlight={item.isHighlight}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              activeTooltip={activeTooltip}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const getSoldItemDetails = (purchaseData, formatPrice) => {
  return [
    {
      key: 'sold_item_name',
      value: purchaseData.sold_item_name,
      isHighlight: true,
      link: `https://www.perniaspopupshop.com/${purchaseData.sold_item_page_location}`,
    },
    {
      key: 'sold_item_id',
      value: purchaseData.sold_item_id,
      isHighlight: false,
    },
    {
      key: 'sold_item_brand',
      value: purchaseData.sold_item_brand,
      isHighlight: false,
    },
    {
      key: 'sold_item_price',
      value: formatPrice(purchaseData.sold_item_price),
      isHighlight: false,
    },
    {
      key: 'sold_item_category2',
      value: purchaseData.sold_item_category2,
      isHighlight: false,
    },
    { key: 'item_rank', value: purchaseData.item_rank, isHighlight: false },
    {
      key: 'purchase_count',
      value: purchaseData.purchase_count,
      isHighlight: false,
    },
    {
      key: 'clicked_item_index',
      value: purchaseData.clicked_item_index,
      isHighlight: false,
    },
    {
      key: 'select_item_count',
      value: purchaseData.select_item_count,
      isHighlight: false,
    },
    {
      key: 'add_to_cart_count',
      value: purchaseData.add_to_cart_count,
      isHighlight: false,
    },
  ];
};

const getParentItemDetails = purchaseData => {
  return [
    {
      key: 'parent_item_name',
      value: purchaseData.parent_item_name,
      isHighlight: true,
      link: purchaseData.parent_page_location.split('?')[0],
    },
    {
      key: 'parent_item_id',
      value: purchaseData.parent_item_id,
      isHighlight: false,
    },
    {
      key: 'parent_view_count',
      value: purchaseData.parent_view_count,
      isHighlight: false,
    },
    {
      key: 'parent_view_count_rank',
      value: purchaseData.parent_view_count_rank,
      isHighlight: false,
    },
    {
      key: 'parent_page_location',
      value: purchaseData.parent_page_location.split('?')[0],
      isHighlight: false,
      link: purchaseData.parent_page_location.split('?')[0],
    },
  ];
};

// Tooltip content for each field
const tooltips = {
  // Sold item tooltips
  item_rank: 'Ranking position of the item in sales',
  sold_item_id: 'Unique identifier for the sold item',
  sold_item_name: 'Name of the sold product',
  sold_item_brand: 'Brand of the sold product',
  sold_item_price: 'Price of the sold item in rupees',
  sold_item_category: 'Category path of the sold item',
  sold_item_category2:
    'Carousel name from where the sold product was clicked for the first time',
  purchase_count: 'Number of times this item was purchased',
  sold_item_page_location: "URL path for the sold item's page",
  sold_image_url: "URL for the sold item's image",
  clicked_item_index: 'Position index in the carousel when item was clicked',
  select_item_count: 'Number of times the item was clicked',
  add_to_cart_count: 'Number of times the item was added to cart',

  // Parent item tooltips
  parent_page_location: "URL path for the parent item's page",
  parent_view_count: 'Number of times the parent details page was viewed',
  parent_view_count_rank:
    'Ranking of the parent based on number of time products were viewed',
  parent_item_id: 'Unique identifier for the parent item',
  parent_image_url: "URL for the parent item's image",
};

const PurchaseDetailsPage = ({ pageType }) => {
  const { parentId, parentRank } = useParams();
  const navigate = useNavigate();
  const currentDataset = availableDatasets.find(
    dataset => dataset.id === pageType
  ).data;
  const purchaseData = currentDataset.find(
    detail => detail.sold_item_id == parentId
  );
  const [activeTooltip, setActiveTooltip] = useState(null);

  const formatKey = key => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPrice = price => {
    return parseFloat(price).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    });
  };

  const handleMouseEnter = key => {
    setActiveTooltip(key);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  const getNextParent = () => {
    const dataset = [...currentDataset];
    dataset.sort((a, b) => Number(a.item_rank) - Number(b.item_rank));
    for (const data of dataset) {
      if (Number(parentRank) < data.item_rank) {
        return data;
      }
    }
  };

  const getPreviousParent = () => {
    const dataset = [...currentDataset];
    dataset.sort((a, b) => Number(b.item_rank) - Number(a.item_rank));
    for (const data of dataset) {
      if (Number(parentRank) > data.item_rank) {
        return data;
      }
    }
  };

  // Prepare data for sold item card
  const soldItemDetails = getSoldItemDetails(purchaseData, formatPrice);
  // Prepare data for parent item card
  const parentItemDetails = getParentItemDetails(purchaseData);
  const previousParent = getPreviousParent();
  const nextParent = getNextParent();

  return (
    <div className="purchase-details-container">
      <div>
        <div className="navigation-buttons">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Parents
          </button>
        </div>
        <div className="navigation-buttons">
          {previousParent && (
            <button
              onClick={() =>
                navigate(
                  `/${pageType}/${previousParent.item_rank}/${previousParent.sold_item_id}`
                )
              }
              className="previous-button"
            >
              ← Previous: {previousParent.item_rank} /{' '}
              {previousParent.sold_item_id}
            </button>
          )}
          {nextParent && (
            <button
              onClick={() =>
                navigate(
                  `/${pageType}/${nextParent.item_rank}/${nextParent.sold_item_id}`
                )
              }
              className="next-button"
            >
              Next: {nextParent.item_rank} / {nextParent.sold_item_id} →
            </button>
          )}
        </div>
      </div>
      <h1 className="purchase-details-heading">Purchase Details</h1>
      <div className="purchase-details-cards-container">
        {/* Sold Item Card */}
        <ProductCard
          key={`${purchaseData.sold_item_id}_sold_item`}
          title="Sold Item Details"
          imageUrl={purchaseData.sold_image_url}
          imageAlt={purchaseData.sold_item_name}
          details={soldItemDetails}
          tooltips={tooltips}
          activeTooltip={activeTooltip}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          formatKey={formatKey}
        />

        {/* Parent Item Card */}
        <ProductCard
          key={`${purchaseData.parent_item_id}_parent_item`}
          title="Parent Item Details"
          imageUrl={purchaseData.parent_image_url}
          imageAlt="Parent Item"
          details={parentItemDetails}
          tooltips={tooltips}
          activeTooltip={activeTooltip}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          formatKey={formatKey}
        />
      </div>
    </div>
  );
};

export default PurchaseDetailsPage;
