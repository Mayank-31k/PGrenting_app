import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PGList from './components/PGList';
import Filters from './components/Filters';
import Login from './components/Login';
import Register from './components/Register';
import { samplePGData } from './data/sampleData';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'search'
  const [authModal, setAuthModal] = useState(null); // null, 'login', 'register'
  const [user, setUser] = useState(null);
  const [pgs, setPgs] = useState(samplePGData);
  const [filteredPGs, setFilteredPGs] = useState(samplePGData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleGetStarted = () => {
    setCurrentView('search');
  };

  const handleLogin = (userData) => {
    setUser({ ...userData, name: 'Student' });
    setAuthModal(null);
    console.log('Login:', userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setAuthModal(null);
    console.log('Register:', userData);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterPGs(term, null);
  };

  const handleFilter = (filters) => {
    filterPGs(searchTerm, filters);
  };

  const filterPGs = (search, filters) => {
    let filtered = pgs;

    if (search) {
      filtered = filtered.filter(pg => 
        pg.name.toLowerCase().includes(search.toLowerCase()) ||
        pg.location.toLowerCase().includes(search.toLowerCase()) ||
        pg.facilities.some(facility => 
          facility.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (filters) {
      if (filters.maxRent) {
        filtered = filtered.filter(pg => pg.rent <= filters.maxRent);
      }
      if (filters.gender && filters.gender !== 'all') {
        filtered = filtered.filter(pg => pg.gender === filters.gender);
      }
      if (filters.facilities && filters.facilities.length > 0) {
        filtered = filtered.filter(pg =>
          filters.facilities.every(facility =>
            pg.facilities.includes(facility)
          )
        );
      }
    }

    setFilteredPGs(filtered);
  };

  return (
    <div className="App">
      <Header 
        onSearch={handleSearch}
        isLandingPage={currentView === 'landing'}
        onLogin={() => setAuthModal('login')}
        onRegister={() => setAuthModal('register')}
      />
      
      {currentView === 'landing' ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <div className="main-content">
          <Filters onFilter={handleFilter} />
          <PGList pgs={filteredPGs} />
        </div>
      )}

      {authModal === 'login' && (
        <Login
          onClose={() => setAuthModal(null)}
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthModal('register')}
        />
      )}

      {authModal === 'register' && (
        <Register
          onClose={() => setAuthModal(null)}
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthModal('login')}
        />
      )}
    </div>
  );
}

export default App;