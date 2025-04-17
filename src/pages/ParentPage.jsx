import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import LayoutControl from '../components/LayoutControl';
import { useLayout } from '../context/LayoutContext';
import topViewedDesktop from '../topViewAll1000Desktop.json';
import topViewedMobile from '../topViewAll1000Mobile.json';
import topViewedAll from '../topViewAll.json';
import topViewed8To13April25 from '../top100ViewAll-8To13April25.json';
import purchasesFromCarousel from '../purchasesFromCarousel.json';
import { getItemCardData } from '../utils';
import './Pages.css';
import Tooltip from '../components/Tooltip';

const getTopViewedParentItems = jsonData => {
  return Object.keys(jsonData).map(parentRank => {
    return jsonData[parentRank].parentInfo;
  });
};

export const availableDatasets = [
  {
    id: 'top-viewed',
    name: 'Top 1000 Viewed Products',
    parentData: getTopViewedParentItems(topViewedAll),
    data: topViewedAll,
    from: '18-03-25',
    to: '16-04-25',
  },
  {
    id: 'top-viewed-desktop',
    name: 'Top 1000 Viewed Desktop Products',
    parentData: getTopViewedParentItems(topViewedDesktop),
    data: topViewedDesktop,
    from: '18-03-25',
    to: '14-04-25',
  },
  {
    id: 'top-viewed-mobile',
    name: 'Top 1000 Viewed Mobile Products',
    parentData: getTopViewedParentItems(topViewedMobile),
    data: topViewedMobile,
    from: '18-03-25',
    to: '14-04-25',
  },
  {
    id: 'top-viewed-8-13-april',
    name: 'Top 100 Viewed Products, 8-13 April 2025',
    parentData: getTopViewedParentItems(topViewed8To13April25),
    data: topViewed8To13April25,
    from: '8-04-25',
    to: '13-04-25',
  },
  {
    id: 'more-from-brand',
    name: 'Top Purchases from More-From-Brand',
    parentData: purchasesFromCarousel.filter(
      event => event.sold_item_category2 == 'more from brand'
    ),
  },
  {
    id: 'similar-products',
    name: 'Top Purchases from Similar-Products',
    parentData: purchasesFromCarousel.filter(
      event => event.sold_item_category2 == 'similar products'
    ),
  },
];

const DatasetSelector = ({ currentDataset, setCurrentDataset }) => {
  return (
    <div className="dataset-selector">
      <div className="flex justify-center">
        {currentDataset.from && <Tooltip
          text={`From: ${currentDataset.from} — To: ${currentDataset.to}`}
        />}
        <select
          value={currentDataset.id}
          onChange={e => {
            setCurrentDataset(
              availableDatasets.find(dataSet => dataSet.id === e.target.value)
            );
          }}
          className='block w-full ml-1 border border-gray-300 rounded-md shadow-sm focus:border-gray-300 focus:ring-0'
        >
          {availableDatasets.map(dataset => (
            <option key={dataset.id} value={dataset.id}>
              {dataset.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const ParentPage = () => {
  const [loading, setLoading] = useState(true);
  const [currentDataset, setCurrentDataset] = useState(() => {
    const datasetId = sessionStorage.getItem('dataset-id');
    return (
      availableDatasets.find(dataset => dataset.id === datasetId) ||
      availableDatasets[0]
    );
  });
  const navigate = useNavigate();
  const { cardsPerRow } = useLayout();
  const routeParam1 = currentDataset.id;

  const handleCardClick = (parentRank, parentId) => {
    navigate(`/${routeParam1}/${parentRank}/${parentId}`);
  };

  const onDatasetChange = dataset => {
    setCurrentDataset(dataset);
    sessionStorage.setItem('dataset-id', dataset.id);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Items</h1>
        <DatasetSelector
          setCurrentDataset={onDatasetChange}
          currentDataset={currentDataset}
        />
      </div>
      <LayoutControl />

      <div
        className="card-grid"
        style={{ gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }}
      >
        {currentDataset.parentData.map((data, index) => {
          const item = getItemCardData(data, currentDataset.id);
          return (
            <ItemCard
              key={`${item.id}_${index}`}
              item={item}
              isParent={true}
              onClick={() => handleCardClick(item.rank, item.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ParentPage;
