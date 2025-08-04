import React, { useState } from 'react';
import './Header.css';

const Header = ({ onSearch, isLandingPage = false, onLogin, onRegister, user, onLogout, onProfile }) => {
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
            <h1>PG Renter</h1>
          </div>
          
          <nav className="header-nav">
            <a href="#" className="header-nav-item">Home</a>
            <a href="#" className="header-nav-item">Properties</a>
            <a href="#" className="header-nav-item">Living Areas</a>
            <a href="#" className="header-nav-item">About</a>
          </nav>
          
          {!isLandingPage && (
            <form className="search-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search PGs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>
          )}
          
          <div className="header-actions">
            {user ? (
              <>
                <button className="user-profile-btn" onClick={onProfile}>
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <button className="btn btn-secondary" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={onLogin}>
                  Login
                </button>
                <button className="btn btn-primary" onClick={onRegister}>
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;