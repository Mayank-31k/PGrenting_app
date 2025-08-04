import React from 'react';
import PGCard from './PGCard';
import './PGList.css';

const PGList = ({ pgs, user, onInquiry, onShowPGDetail, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="pg-list">
        <div className="no-results">
          <h3>Loading PGs...</h3>
          <p>Please wait while we fetch the latest accommodations.</p>
        </div>
      </div>
    );
  }

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
          <PGCard 
            key={pg.id} 
            pg={pg} 
            user={user}
            onInquiry={onInquiry}
            onShowPGDetail={onShowPGDetail}
          />
        ))}
      </div>
    </div>
  );
};

export default PGList;