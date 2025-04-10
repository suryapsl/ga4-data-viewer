import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ParentPage from './pages/ParentPage';
import CategoryPage from './pages/CategoryPage';
import { LayoutProvider } from './context/LayoutContext';
import './index.css';
import PurchaseDetailsPage from './pages/PurchaseDetailsPage';

function App() {

  return (
    <BrowserRouter>
      <LayoutProvider>
        <div>
          <header className="header">
            <div className="container">
              <h1 className="header-title">Product Catalog</h1>
            </div>
          </header>
          
          <main style={{padding: '32px 0'}}>
            <Routes>
              <Route path="/" element={<ParentPage />}  />
              <Route path="/top-viewed/:parentRank/:parentId" element={<CategoryPage />} />
              <Route path="/more-from-brand/:parentRank/:parentId" element={<PurchaseDetailsPage pageType='more-from-brand'/>} />
              <Route path="/similar-products/:parentRank/:parentId" element={<PurchaseDetailsPage pageType='similar-products' />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <footer className="footer">
            <div className="container">
              <p>© {new Date().getFullYear()} PSL GA4 Analysis</p>
            </div>
          </footer>
        </div>
      </LayoutProvider>
    </BrowserRouter>
  );
}

export default App;