import React, { useState } from 'react';
import './Header.css';

const Header = ({ onSearch, isLandingPage = false, onLogin, onRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch(searchTerm);
  };

  return (
    <header className={`header ${isLandingPage ? 'header-landing' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>PG RENTER</h1>
          </div>
          
          {!isLandingPage && (
            <form className="search-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="SEARCH PGS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary search-btn">
                SEARCH
              </button>
            </form>
          )}
          
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={onLogin}>
              LOGIN
            </button>
            <button className="btn btn-primary" onClick={onRegister}>
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;