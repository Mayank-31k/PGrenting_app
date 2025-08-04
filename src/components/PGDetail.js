import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Users, Phone, Mail, Star, Shield, Wifi, Car, Clock, Home } from 'lucide-react';
import './PGDetail.css';

const PGDetail = ({ pg, user, onClose, onInquiry }) => {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    userPhone: '',
    message: `Hi, I am interested in ${pg?.name}. Could you please provide more details about availability and visit scheduling?`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Update default message when PG changes
    setInquiryData(prev => ({
      ...prev,
      message: `Hi, I am interested in ${pg?.name}. Could you please provide more details about availability and visit scheduling?`
    }));
  }, [pg]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit an inquiry');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      console.log('Submitting inquiry with data:', {
        pgName: pg.name,
        pgLocation: pg.location,
        pgPrice: `₹${pg.rent}/month`,
        message: inquiryData.message,
        userPhone: inquiryData.userPhone
      });

      if (!token) {
        alert('Authentication token not found. Please login again.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('http://localhost:5004/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pgName: pg.name,
          pgLocation: pg.location,
          pgPrice: `₹${pg.rent}/month`,
          message: inquiryData.message,
          userPhone: inquiryData.userPhone
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);

      setSubmitSuccess(true);
      setTimeout(() => {
        setShowInquiryForm(false);
        setSubmitSuccess(false);
        onInquiry && onInquiry(data.inquiry);
      }, 2000);

    } catch (error) {
      console.error('Inquiry submission error:', error);
      
      if (error.message.includes('Failed to fetch')) {
        alert('Cannot connect to server. Please make sure the backend server is running on http://localhost:5004');
      } else if (error.message.includes('401')) {
        alert('Authentication failed. Please login again.');
      } else if (error.message.includes('400')) {
        alert('Invalid request data. Please check all required fields.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setInquiryData({
      ...inquiryData,
      [e.target.name]: e.target.value
    });
  };

  if (!pg) return null;

  return createPortal(
    <div className="pg-detail-overlay" onClick={onClose}>
      <div className="pg-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pg-detail-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="pg-detail-content">
          {/* Header */}
          <div className="pg-detail-header">
            <div className="pg-detail-image">
              <img src={pg.image} alt={pg.name} />
              <div className="pg-detail-badge">{pg.gender}</div>
            </div>
            <div className="pg-detail-info">
              <h1 className="pg-detail-title">{pg.name}</h1>
              <div className="pg-detail-location">
                <MapPin size={16} />
                <span>{pg.location}</span>
              </div>
              <div className="pg-detail-distance">
                <span className="distance-badge">{pg.distanceFromCollege} from college</span>
              </div>
              <div className="pg-detail-price">
                <span className="price-amount">₹{pg.rent.toLocaleString()}</span>
                <span className="price-period">/month</span>
              </div>
              {user ? (
                <button 
                  className="inquiry-button"
                  onClick={() => setShowInquiryForm(true)}
                >
                  <Mail size={16} />
                  Send Inquiry
                </button>
              ) : (
                <div className="login-required">
                  <span>Please login to send inquiry</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="pg-detail-body">
            <div className="pg-detail-section">
              <h3>Basic Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <Users size={16} />
                  <span>{pg.sharing}</span>
                </div>
                <div className="detail-item">
                  <Home size={16} />
                  <span>₹{pg.deposit?.toLocaleString()} deposit</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>{pg.food}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{pg.phone}</span>
                </div>
              </div>
            </div>

            <div className="pg-detail-section">
              <h3>Facilities</h3>
              <div className="facilities-grid">
                {pg.facilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    <Shield size={16} />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {pg.testimonials && pg.testimonials.length > 0 && (
              <div className="pg-detail-section">
                <h3>Student Reviews</h3>
                <div className="testimonials-list">
                  {pg.testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial-item">
                      <div className="testimonial-header">
                        <div className="student-info">
                          <strong>{testimonial.name}</strong>
                          <span>{testimonial.course}</span>
                        </div>
                        <div className="rating">
                          {Array.from({ length: testimonial.rating }, (_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="testimonial-comment">{testimonial.comment}</p>
                      <span className="testimonial-date">{testimonial.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pg-detail-section">
              <h3>Owner Details</h3>
              <div className="owner-info">
                <div className="owner-name">{pg.owner}</div>
                <div className="owner-contact">
                  <Phone size={16} />
                  <span>{pg.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form Modal */}
        {showInquiryForm && (
          <div className="inquiry-form-overlay">
            <div className="inquiry-form-modal">
              <div className="inquiry-form-header">
                <h3>Send Inquiry to {pg.name}</h3>
                <button 
                  className="inquiry-form-close"
                  onClick={() => setShowInquiryForm(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {submitSuccess ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h4>Inquiry Sent Successfully!</h4>
                  <p>Your inquiry has been sent to the PG owner. They will contact you soon on your registered email.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="inquiry-form">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      value={user?.name || ''} 
                      disabled 
                      className="form-input disabled"
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Email</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="form-input disabled"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      name="userPhone"
                      value={inquiryData.userPhone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea 
                      name="message"
                      value={inquiryData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message..."
                      rows="4"
                      required
                      className="form-textarea"
                    />
                  </div>

                  <div className="inquiry-summary">
                    <strong>PG Details:</strong>
                    <div>• {pg.name}</div>
                    <div>• {pg.location}</div>
                    <div>• ₹{pg.rent}/month</div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => setShowInquiryForm(false)}
                      className="btn-secondary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PGDetail;