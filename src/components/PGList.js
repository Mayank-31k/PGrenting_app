import React from 'react';
import PGCard from './PGCard';
import './PGList.css';

const PGList = ({ pgs }) => {
  if (pgs.length === 0) {
    return (
      <div className="pg-list">
        <div className="no-results">
          <h3>No PGs found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-list">
      <div className="results-header">
        <h2>Available PGs ({pgs.length})</h2>
      </div>
      <div className="pg-grid">
        {pgs.map(pg => (
          <PGCard key={pg.id} pg={pg} />
        ))}
      </div>
    </div>
  );
};

export default PGList;