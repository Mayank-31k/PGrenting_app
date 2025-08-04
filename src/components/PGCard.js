import React from 'react';
import './PGCard.css';

const PGCard = ({ pg, user, onInquiry, onShowPGDetail }) => {

  return (
    <div className="pg-card">
      <div className="pg-image">
        <img src={pg.image} alt={pg.name} />
        <div className="pg-gender-tag">{pg.gender}</div>
      </div>
      
      <div className="pg-content">
        <div className="pg-header">
          <h3 className="pg-name">{pg.name}</h3>
          <div className="pg-rent">₹{pg.rent.toLocaleString()}/month</div>
        </div>
        
        <div className="pg-location">
          <span className="location-icon">📍</span>
          {pg.location}
        </div>
        
        <div className="pg-distance">
          <span className="distance-icon">🚶</span>
          {pg.distanceFromCollege} from college
        </div>
        
        <div className="pg-facilities">
          {pg.facilities.slice(0, 4).map((facility, index) => (
            <span key={index} className="facility-tag">{facility}</span>
          ))}
          {pg.facilities.length > 4 && (
            <span className="facility-tag more">+{pg.facilities.length - 4} more</span>
          )}
        </div>
        
        <div className="pg-actions">
          <button 
            className="details-btn"
            onClick={() => onShowPGDetail(pg)}
          >
            VIEW DETAILS
          </button>
          {user ? (
            <button 
              className="contact-btn"
              onClick={() => onShowPGDetail(pg)}
            >
              SEND INQUIRY
            </button>
          ) : (
            <button className="contact-btn disabled">
              LOGIN TO INQUIRE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PGCard;