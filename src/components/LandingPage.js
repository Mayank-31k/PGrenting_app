import React from 'react';
import './LandingPage.css';
import Footer from './Footer';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                PG accommodation to
                <br />
                make you <span className="highlight">feel at home</span>
              </h1>
              <p className="hero-subtitle">
                Explore over 500+ verified PGs for the comfortable living lifestyle. Discover Your Cozy Haven Amidst 
                the College Years. Find Verified PGs with Student Reviews, Transparent Pricing.
              </p>
              <button className="hero-cta" onClick={onGetStarted}>
                Explore Properties
              </button>
            </div>
            <div className="hero-visual">
              <div className="pg-gallery">
                <div className="gallery-item large">
                  <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=300&h=200&fit=crop" alt="Modern PG Room" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop" alt="PG Common Area" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=150&h=150&fit=crop" alt="PG Kitchen" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=150&h=100&fit=crop" alt="PG Study Room" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1616137466211-f939fc8f2406?w=150&h=100&fit=crop" alt="PG Bathroom" />
                </div>
                <div className="gallery-item portrait">
                  <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=100&h=200&fit=crop" alt="Student in PG" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=150&h=100&fit=crop" alt="PG Exterior" />
                </div>
                <div className="gallery-item">
                  <img src="https://images.unsplash.com/photo-1615529328331-f8917597711f?w=150&h=150&fit=crop" alt="PG Dining" />
                </div>
                <div className="gallery-item small">
                  <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=100&h=100&fit=crop" alt="PG Amenities" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="services-section">
        <div className="container">
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">🏠</div>
              <h3>VERIFIED PG ACCOMMODATIONS</h3>
            </div>
            <div className="service-item">
              <div className="service-icon">💰</div>
              <h3>TRANSPARENT PRICING POLICY</h3>
            </div>
            <div className="service-item">
              <div className="service-icon">⚡</div>
              <h3>INSTANT BOOKING CONFIRMATION</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="popular-section">
        <div className="popular-header">
          <div className="popular-badge">
            ⭐ <span>Most Popular</span>
          </div>
          <h2 className="popular-title">
            Most <span className="highlight">Popular</span><br />
            Properties
          </h2>
          <button className="explore-all" onClick={onGetStarted}>
            Explore All
          </button>
        </div>
        
        <div className="properties-grid">
          <div className="property-card">
            <div className="property-image">
              <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=240&fit=crop" alt="Modern PG Room" />
            </div>
            <div className="property-info">
              <h3 className="property-name">Sunshine Boys PG</h3>
              <p className="property-location">Near IIT Delhi, Green Park</p>
              <p className="property-price">₹12,500/month</p>
            </div>
          </div>
          
          <div className="property-card">
            <div className="property-image">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=240&fit=crop" alt="Cozy PG Common Area" />
            </div>
            <div className="property-info">
              <h3 className="property-name">Flora Modern Suites</h3>
              <p className="property-location">DU North Campus, Kamla Nagar</p>
              <p className="property-price">₹9,800/month</p>
            </div>
          </div>
          
          <div className="property-card">
            <div className="property-image">
              <img src="https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400&h=240&fit=crop" alt="Premium PG Kitchen" />
            </div>
            <div className="property-info">
              <h3 className="property-name">Urban Living Chair</h3>
              <p className="property-location">Near Jamia Millia, Okhla</p>
              <p className="property-price">₹8,900/month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="testimonial-section">
        <div className="testimonial-content">
          <div className="testimonial-badge">
            💬 <span>The Customer is Hero</span>
          </div>
          <h2 className="testimonial-title">
            of Our <span className="highlight">Business</span>
          </h2>
          <p className="testimonial-quote">
            I can't describe how great we feel using PG Renter. It completely changed our workflow 
            and the face we waste on trying to connect each other. Top Notch!!
          </p>
          <div className="testimonial-author">
            <div className="author-avatar">E</div>
            <div className="author-info">
              <p className="author-name">Esther Jackson</p>
              <p className="author-rating">★★★★★</p>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-section">
        <div className="container">
          <div className="blog-header">
            <h2>Check out our newest blog updates.</h2>
          </div>
          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop" alt="PG Living Tips" />
              </div>
              <div className="blog-content">
                <p className="blog-quote">"This is the best idea experience I have had in years"</p>
                <p className="blog-author">- Diana Russell</p>
              </div>
            </div>
            
            <div className="blog-card">
              <div className="blog-image">
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop" alt="Student Life" />
              </div>
              <div className="blog-content">
                <p className="blog-quote">"I can't say how nice it is to just some enjoy living there."</p>
                <p className="blog-author">- Jane Wilson</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="final-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Follow us for inspiration</h2>
            <p>Being a student shouldn't mean compromising on comfort. See how we're helping students across the country find their perfect home away from home.</p>
            <button className="cta-button" onClick={onGetStarted}>
              Follow us
            </button>
          </div>
          <div className="cta-image">
            <img src="https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&h=400&fit=crop" alt="Student Community" />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LandingPage;