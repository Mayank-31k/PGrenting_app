import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    maxRent: '',
    gender: 'all',
    facilities: []
  });
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);

  const facilityOptions = [
    'WiFi', 'AC', 'Laundry', 'Mess', 'Parking', 'Security', 'Gym', 'Study Room'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleFacilityToggle = (facility) => {
    const newFacilities = filters.facilities.includes(facility)
      ? filters.facilities.filter(f => f !== facility)
      : [...filters.facilities, facility];
    
    const newFilters = { ...filters, facilities: newFacilities };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      maxRent: '',
      gender: 'all',
      facilities: []
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button onClick={clearFilters} className="clear-btn">Clear All</button>
      </div>

      <div className="filter-group">
        <label>Max Rent (₹)</label>
        <input
          type="number"
          placeholder="e.g. 10000"
          value={filters.maxRent}
          onChange={(e) => handleFilterChange('maxRent', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Gender</label>
        <select
          value={filters.gender}
          onChange={(e) => handleFilterChange('gender', e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
        </select>
      </div>

      <div className="filter-group">
        <div className="facilities-dropdown">
          <button 
            type="button"
            className="facilities-toggle"
            onClick={() => setFacilitiesOpen(!facilitiesOpen)}
          >
            <span>Facilities ({filters.facilities.length})</span>
            <span className={`dropdown-arrow ${facilitiesOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {facilitiesOpen && (
            <div className="facilities-grid">
              {facilityOptions.map(facility => (
                <label key={facility} className="facility-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.facilities.includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;