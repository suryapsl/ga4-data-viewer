import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ParentPage from './pages/ParentPage';
import CategoryPage from './pages/CategoryPage';
import { LayoutProvider } from './context/LayoutContext';
import './index.css';

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
              <Route path="/" element={<ParentPage />} />
              <Route path="/category/:parentRank/:parentId" element={<CategoryPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <footer className="footer">
            <div className="container">
              <p>© {new Date().getFullYear()} JSON Card Viewer</p>
            </div>
          </footer>
        </div>
      </LayoutProvider>
    </BrowserRouter>
  );
}

export default App;