import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import StockPage from './StockPage';
import Ecom from './Ecom';
import BedsheetStockPage from './BedsheetStockPage';
import Forecast from './Forecast';

const App = () => {
  // Initialize Bootstrap collapse on component mount
  useEffect(() => {
    const navToggler = document.querySelector('.navbar-toggler');
    const navbar = document.querySelector('.navbar-collapse');
    navToggler.addEventListener('click', () => {
      navbar.classList.toggle('show');
    });
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">SO FabricStock</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/stock">Stock</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ecom">Sales</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/bedsheet-stock">Bedsheet Stock</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/forecast">Forecast</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/stock" element={<StockPage />} />
          <Route path="/ecom" element={<Ecom />} />
          <Route path="/bedsheet-stock" element={<BedsheetStockPage />} />
          <Route path="/forecast" element={<Forecast />} />
        </Routes>
      </div>
 <>
 
 {/* <h1>Welcom</h1> */}
 </>
    </Router>
    
  );
};

export default App;
