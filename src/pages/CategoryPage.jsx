import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import LayoutControl from '../components/LayoutControl';
import { useLayout } from '../context/LayoutContext';
import Slider from 'react-slick';
import './Pages.css';
// Import slick carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { scrollOnHtmlFast } from '../utils';
import { getItemCardData } from '../utils';
import { availableDatasets } from './ParentPage';

const getNextParentRank = (parentRank, groupedData) => {
  const parentRanks = Object.keys(groupedData).map(key => Number(key));
  parentRanks.sort((a,b) => a - b);
  for(const nextRank of parentRanks) {
    if(parentRank < nextRank) {
      return nextRank;
    }
  }
}

const getPreviousParentRank = (parentRank, groupedData) => {
  const parentRanks = Object.keys(groupedData).map(key => Number(key));
  parentRanks.sort((a,b) => b - a);
  for(const previousRank of parentRanks) {
    if(parentRank > previousRank) {
      return previousRank;
    }
  }
}

const CategoryPage = () => {
  const { category, parentRank, parentId } = useParams();
  const [categoryGroups, setCategoryGroups] = useState({});
  const [parentInfo, setParentInfo] = useState(null);
  const [siblingParentInfo, setSiblingParentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cardsPerRow } = useLayout();
  let dataset = availableDatasets.find(dataset => dataset.id === category);
  if(!dataset) {
    dataset = availableDatasets[0];
  }

  useEffect(() => {
    scrollOnHtmlFast(0);
    // Process the data
    const groupedData = dataset.data; // processData(jsonData);
    if (groupedData[parentRank]) {
      setCategoryGroups(groupedData[parentRank]?.categories);
      setParentInfo(groupedData[parentRank]?.parentInfo);

      const nextParentRank = getNextParentRank(parentRank, groupedData);
      const previousParentRank = getPreviousParentRank(parentRank, groupedData);
      const siblingParents = {};
      if (nextParentRank) {
        const { parentInfo } = groupedData[nextParentRank];
        const nextParent = {
          rank: nextParentRank,
          id: parentInfo.parent_item_id,
        };
        siblingParents.nextParent = nextParent;
      }
      if (previousParentRank) {
        const { parentInfo } = groupedData[previousParentRank];
        const previousParent = {
          rank: previousParentRank,
          id: parentInfo.parent_item_id,
        };
        siblingParents.previousParent = previousParent;
      }
      setSiblingParentInfo(siblingParents);
    }

    setLoading(false);
  }, [parentRank, parentId]);

  const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: cardsPerRow + 0.2,
    slidesToScroll: cardsPerRow,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(cardsPerRow, 2) + 0.2,
          slidesToScroll: Math.min(cardsPerRow, 2),
        },
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!parentInfo) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Parent not found</h2>
          <button onClick={() => navigate('/')} className="action-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const previousParent = siblingParentInfo.previousParent;
  const nextParent = siblingParentInfo.nextParent;

  return (
    <div className="container">
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
                  `/${category}/${previousParent.rank}/${previousParent.id}`
                )
              }
              className="previous-button"
            >
              ← Previous: {previousParent.rank} / {previousParent.id}
            </button>
          )}
          {nextParent && (
            <button
              onClick={() =>
                navigate(`/${category}/${nextParent.rank}/${nextParent.id}`)
              }
              className="next-button"
            >
              Next: {nextParent.rank} / {nextParent.id} →
            </button>
          )}
        </div>

        <div className="parent-header" key={parentInfo.parent_item_id}>
          <div className="parent-thumbnail">
            <img
              src={parentInfo.parent_image_url}
              alt={parentInfo.parent_item_name}
            />
          </div>
          <div className="parent-info">
            <Link to={parentInfo.page_location.split('?')[0]} target="_blank">
              <h1>{parentInfo.parent_item_name}</h1>
            </Link>
            <p className="card-brand">{parentInfo.parent_item_brand}</p>
            <p className="card-price">
              ₹{Number(parentInfo.parent_price).toLocaleString()}
            </p>
            <p className="card-meta">
              Rank: {parentInfo.parent_rank} • Views:{' '}
              {parentInfo.parent_view_count}
            </p>
            <p className='card-meta'>Parent Id: {parentInfo.parent_item_id}</p>
          </div>
        </div>

        <div className="layout-controls-container">
          <LayoutControl />
        </div>
      </div>

      {/* {Object.keys(categoryGroups).map(category => ( */}
      {['more from brand', 'similar products'].map(category => (
        <div key={category} style={{ marginBottom: '40px' }}>
          <h2 className="category-title">{category}</h2>
          <Slider {...carouselSettings}>
            {categoryGroups[category].map(item => (
              <div key={item.clicked_item_id} className="carousel-item-wrapper">
                <ItemCard
                  key={item.clicked_item_id}
                  item={getItemCardData(item, 'top-viewed-detail-carousel')}
                  isParent={false}
                />
              </div>
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
