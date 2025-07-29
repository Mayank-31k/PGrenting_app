import React from 'react';
import { createPortal } from 'react-dom';
import './PGDetailsModal.css';

const PGDetailsModal = ({ pg, onClose }) => {
  if (!pg) {
    console.log('No PG data provided to modal');
    return null;
  }

  console.log('Rendering modal for PG:', pg.name);

  const modalContent = (
    <div className="pg-modal-overlay" onClick={onClose}>
      <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pg-modal-header">
          <h2>{pg.name}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="pg-modal-content">
          <div className="pg-modal-image">
            <img src={pg.image} alt={pg.name} />
            <div className="pg-modal-gender-tag">{pg.gender}</div>
          </div>
          
          <div className="pg-modal-info">
            <div className="pg-modal-section">
              <h3>BASIC INFORMATION</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">RENT:</span>
                  <span className="info-value rent-value">₹{pg.rent.toLocaleString()}/month</span>
                </div>
                <div className="info-item">
                  <span className="info-label">LOCATION:</span>
                  <span className="info-value">{pg.location}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">DISTANCE:</span>
                  <span className="info-value">{pg.distanceFromCollege} from college</span>
                </div>
                <div className="info-item">
                  <span className="info-label">SHARING:</span>
                  <span className="info-value">{pg.sharing}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">DEPOSIT:</span>
                  <span className="info-value">₹{pg.deposit?.toLocaleString() || 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">FOOD:</span>
                  <span className="info-value">{pg.food || 'Available'}</span>
                </div>
              </div>
            </div>

            <div className="pg-modal-section">
              <h3>FACILITIES</h3>
              <div className="facilities-list">
                {pg.facilities.map((facility, index) => (
                  <span key={index} className="facility-badge">{facility}</span>
                ))}
              </div>
            </div>

            <div className="pg-modal-section">
              <h3>CONTACT INFORMATION</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">OWNER:</span>
                  <span className="contact-value">{pg.owner}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">PHONE:</span>
                  <span className="contact-value">{pg.phone}</span>
                </div>
              </div>
            </div>

            {pg.testimonials && pg.testimonials.length > 0 && (
              <div className="pg-modal-section">
                <h3>STUDENT TESTIMONIALS</h3>
                <div className="testimonials-grid">
                  {pg.testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial-card">
                      <div className="testimonial-header">
                        <div className="student-info">
                          <h4>{testimonial.name}</h4>
                          <span className="student-course">{testimonial.course}</span>
                        </div>
                        <div className="rating">
                          {"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}
                        </div>
                      </div>
                      <p className="testimonial-text">"{testimonial.comment}"</p>
                      <span className="testimonial-date">{testimonial.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pg-modal-actions">
              <button className="btn btn-secondary modal-btn">
                CALL OWNER
              </button>
              <button className="btn btn-accent modal-btn">
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Using React Portal to render modal outside normal component tree
  try {
    return createPortal(modalContent, document.body);
  } catch (error) {
    console.error('Portal error:', error);
    // Fallback to normal render if portal fails
    return modalContent;
  }
};

export default PGDetailsModal;