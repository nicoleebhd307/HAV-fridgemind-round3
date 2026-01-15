import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import ScanPage from './pages/ScanPage';
import ConfirmPage from './pages/ConfirmPage';
import InventoryPage from './pages/InventoryPage';
import { resetDemo } from '../api/client';

export default function App() {
  const nav = useNavigate();
  return (
    <div className="container">
      <header className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>FridgeMind Demo</h2>
          <span className="pill">local</span>
        </div>
        <div className="row">
          <Link to="/" className="btn secondary">Scan</Link>
          <Link to="/inventory" className="btn secondary">Inventory</Link>
          <button className="btn" onClick={async () => { await resetDemo(); nav('/'); }} title="Reset DB + uploads">
            Reset demo
          </button>
        </div>
      </header>

      <div style={{ height: 12 }} />

      <Routes>
        <Route path="/" element={<ScanPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </div>
  );
}
