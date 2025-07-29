import React from 'react';
import './LandingPage.css';
import Footer from './Footer';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span>🎓 FOR STUDENTS</span>
              </div>
              <h1 className="hero-title">
                FIND YOUR
                <br />
                <span className="highlight">PERFECT PG</span>
                <br />
                <span className="hero-subtitle-inline">IN MINUTES</span>
              </h1>
              <p className="hero-subtitle">
                Discover verified accommodations near your college with real student reviews, 
                transparent pricing, and instant booking.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Verified PGs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Happy Students</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Cities</span>
                </div>
              </div>
              <div className="hero-buttons">
                <button className="btn btn-primary hero-cta" onClick={onGetStarted}>
                  <span>START SEARCHING</span>
                  <span className="btn-arrow">→</span>
                </button>
                <button className="btn btn-secondary hero-secondary">
                  <span>WATCH DEMO</span>
                  <span className="play-icon">▶</span>
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-cards">
                <div className="floating-card card-1">
                  <div className="card-header">
                    <div className="card-image"></div>
                    <div className="card-info">
                      <h4>Elite Boys PG</h4>
                      <p>0.5km from college</p>
                    </div>
                  </div>
                  <div className="card-price">₹8,500/mo</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-header">
                    <div className="card-image"></div>
                    <div className="card-info">
                      <h4>Green Valley Girls</h4>
                      <p>0.8km from college</p>
                    </div>
                  </div>
                  <div className="card-price">₹7,500/mo</div>
                </div>
                <div className="floating-card card-3">
                  <div className="review-card">
                    <div className="stars">★★★★★</div>
                    <p>"Amazing PG with great facilities!"</p>
                    <span>- Arjun S.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">WHY STUDENTS CHOOSE US</h2>
            <p className="section-subtitle">Everything you need to find your perfect accommodation</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-modern">
                <div className="icon-bg">🏠</div>
              </div>
              <h3>VERIFIED ACCOMMODATIONS</h3>
              <p>Every PG is personally verified by our team for quality, safety, and authenticity. No fake listings.</p>
              <div className="feature-stats">
                <span>500+ Verified</span>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-modern">
                <div className="icon-bg">🎯</div>
              </div>
              <h3>SMART LOCATION FINDER</h3>
              <p>Find accommodations within walking distance of your college with accurate distance mapping.</p>
              <div className="feature-stats">
                <span>0.5-2km Range</span>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-modern">
                <div className="icon-bg">💡</div>
              </div>
              <h3>TRANSPARENT PRICING</h3>
              <p>No hidden costs. Compare real prices with detailed breakdowns and student reviews.</p>
              <div className="feature-stats">
                <span>100% Transparent</span>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-modern">
                <div className="icon-bg">⚡</div>
              </div>
              <h3>INSTANT BOOKING</h3>
              <p>Book your preferred PG instantly with our quick booking system and secure payments.</p>
              <div className="feature-stats">
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">WHAT STUDENTS SAY</h2>
            <p className="section-subtitle">Real reviews from students who found their perfect PG</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card-landing">
              <div className="testimonial-rating">★★★★★</div>
              <p>"Found my perfect PG in just 2 days! The verification process gave me confidence and the booking was super smooth."</p>
              <div className="testimonial-author">
                <strong>Priya Sharma</strong>
                <span>BTech CSE, Delhi</span>
              </div>
            </div>
            <div className="testimonial-card-landing">
              <div className="testimonial-rating">★★★★★</div>
              <p>"Great platform with genuine listings. The student reviews helped me make the right choice. Highly recommended!"</p>
              <div className="testimonial-author">
                <strong>Arjun Verma</strong>
                <span>MBA, Mumbai</span>
              </div>
            </div>
            <div className="testimonial-card-landing">
              <div className="testimonial-rating">★★★★☆</div>
              <p>"Love the smart filters and location finder. Made my PG hunting so much easier compared to other platforms."</p>
              <div className="testimonial-author">
                <strong>Kavya Reddy</strong>
                <span>BCA, Bangalore</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-background">
          <div className="cta-shapes">
            <div className="cta-shape cta-shape-1"></div>
            <div className="cta-shape cta-shape-2"></div>
          </div>
        </div>
        <div className="container">
          <div className="cta-content">
            <div className="cta-badge">
              <span>🚀 START YOUR JOURNEY</span>
            </div>
            <h2>READY TO FIND YOUR PERFECT PG?</h2>
            <p>Join thousands of students who found their ideal accommodation with us. 
               Start your search today and move in tomorrow!</p>
            <div className="cta-buttons">
              <button className="btn btn-primary cta-primary" onClick={onGetStarted}>
                <span>START SEARCHING NOW</span>
                <span className="btn-arrow">→</span>
              </button>
              <div className="cta-info">
                <span>✅ Free to use</span>
                <span>✅ No hidden charges</span>
                <span>✅ Instant booking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LandingPage;