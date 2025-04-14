import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import LayoutControl from '../components/LayoutControl';
import { processData } from '../utils/dataProcessor';
import { useLayout } from '../context/LayoutContext';
import jsonData from '../data.json';
import jsonData2 from '../top100ViewAll-8To130425.json';
import purchasesFromCarousel from '../purchasesFromCarousel.json';
import { getItemCardData } from '../utils';
import './Pages.css';

const getTopViewedItems = (jsonData) => {
  const groupedData = processData(jsonData);
  return Object.keys(groupedData).map(parentRank => {
    return groupedData[parentRank].parentInfo;
  })
}

export const availableDatasets = [
  {
    id: 'top-viewed',
    name: 'Top 100 Viewed Products',
    data: getTopViewedItems(jsonData),
  },
  {
    id: 'top-viewed-8-13-april',
    name: 'Top 100 Viewed Products, 8-13 April 2025',
    data: getTopViewedItems(jsonData2),
  },
  {
    id: 'more-from-brand',
    name: 'Top Purchases from More-From-Brand',
    data: purchasesFromCarousel.filter(
      event => event.sold_item_category2 == 'more from brand'
    ),
  },
  {
    id: 'similar-products',
    name: 'Top Purchases from Similar-Products',
    data: purchasesFromCarousel.filter(
      event => event.sold_item_category2 == 'similar products'
    ),
  },
];

const DatasetSelector = ({currentDataset, setCurrentDataset }) => {
  
  return (
    <div className="dataset-selector">
      <select
        value={currentDataset.id}
        onChange={e => {
          setCurrentDataset(availableDatasets.find(dataSet => dataSet.id === e.target.value));
        }}
      >
        {availableDatasets.map(dataset => (
          <option key={dataset.id} value={dataset.id}>
            {dataset.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const ParentPage = () => {
  const [loading, setLoading] = useState(true);
  const [currentDataset, setCurrentDataset] = useState(() => {
    const datasetId= sessionStorage.getItem('dataset-id');
    return availableDatasets.find(dataset => dataset.id === datasetId ) || availableDatasets[0];
  });
  const navigate = useNavigate();
  const { cardsPerRow } = useLayout();
  const routeParam1 = currentDataset.id;

  const handleCardClick = (parentRank, parentId) => {
    navigate(`/${routeParam1}/${parentRank}/${parentId}`);
  };

  const onDatasetChange = (dataset) => {
    setCurrentDataset(dataset);
    sessionStorage.setItem('dataset-id', dataset.id)
  }

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
        <DatasetSelector setCurrentDataset={onDatasetChange} currentDataset={currentDataset} />
      </div>
      <LayoutControl />

      <div
        className="card-grid"
        style={{ gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }}
      >
        {currentDataset.data.map(data => {
          const item = getItemCardData(data, currentDataset.id);
          return (
            <ItemCard
              key={item.id}
              item={item}
              isParent={true}
              onClick={() =>
                handleCardClick(item.rank, item.id)
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default ParentPage;
