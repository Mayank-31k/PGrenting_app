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

      <div className="features-section-professional">
        <div className="features-bg-professional">
          <div className="professional-gradient-1"></div>
          <div className="professional-gradient-2"></div>
          <div className="professional-pattern"></div>
        </div>
        
        <div className="container">
          <div className="section-header-professional">
            <div className="section-badge-professional">
              <span className="badge-icon-professional">⭐</span>
              <span>Why Students Choose Us</span>
            </div>
            <h2 className="section-title-professional">
              Experience The
              <span className="gradient-text-professional"> Future </span>
              Of Student Housing
            </h2>
            <p className="section-subtitle-professional">
              Discover verified accommodations with our advanced platform designed exclusively for students. 
              Professional service meets cutting-edge technology.
            </p>
          </div>
          
          <div className="features-grid-professional">
            <div className="feature-card-professional" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-header-professional">
                <div className="feature-icon-professional verified-icon-professional">
                  <span>🏠</span>
                </div>
                <div className="feature-badge-professional verified-badge-professional">VERIFIED</div>
              </div>
              <h3>100% Verified Accommodations</h3>
              <p>Every accommodation undergoes our comprehensive 47-point verification process. From safety protocols to internet connectivity - everything is professionally audited by our expert team.</p>
              <div className="feature-metrics-professional">
                <div className="metric-professional">
                  <span className="metric-number-professional">500+</span>
                  <span className="metric-label-professional">Verified PGs</span>
                </div>
                <div className="metric-professional">
                  <span className="metric-number-professional">47</span>
                  <span className="metric-label-professional">Check Points</span>
                </div>
              </div>
              <a href="#" className="feature-link-professional">
                <span>Learn More</span>
                <span className="feature-arrow-professional">→</span>
              </a>
            </div>

            <div className="feature-card-professional" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-header-professional">
                <div className="feature-icon-professional location-icon-professional">
                  <span>📍</span>
                </div>
                <div className="feature-badge-professional location-badge-professional">SMART</div>
              </div>
              <h3>AI-Powered Location Intelligence</h3>
              <p>Our advanced algorithm analyzes traffic patterns, commute times, and local amenities to recommend accommodations that perfectly align with your academic and lifestyle needs.</p>
              <div className="feature-metrics-professional">
                <div className="metric-professional">
                  <span className="metric-number-professional">0.5km</span>
                  <span className="metric-label-professional">Avg Distance</span>
                </div>
                <div className="metric-professional">
                  <span className="metric-number-professional">5min</span>
                  <span className="metric-label-professional">Walk Time</span>
                </div>
              </div>
              <a href="#" className="feature-link-professional">
                <span>Explore Technology</span>
                <span className="feature-arrow-professional">→</span>
              </a>
            </div>

            <div className="feature-card-professional" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-header-professional">
                <div className="feature-icon-professional pricing-icon-professional">
                  <span>💰</span>
                </div>
                <div className="feature-badge-professional pricing-badge-professional">TRANSPARENT</div>
              </div>
              <h3>Crystal Clear Pricing</h3>
              <p>Complete transparency with zero hidden fees or surprise charges. Our detailed pricing breakdown includes all utilities, maintenance, and amenities upfront.</p>
              <div className="feature-metrics-professional">
                <div className="metric-professional">
                  <span className="metric-number-professional">0%</span>
                  <span className="metric-label-professional">Hidden Fees</span>
                </div>
                <div className="metric-professional">
                  <span className="metric-number-professional">100%</span>
                  <span className="metric-label-professional">Transparent</span>
                </div>
              </div>
              <a href="#" className="feature-link-professional">
                <span>View Pricing</span>
                <span className="feature-arrow-professional">→</span>
              </a>
            </div>

            <div className="feature-card-professional" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-header-professional">
                <div className="feature-icon-professional booking-icon-professional">
                  <span>⚡</span>
                </div>
                <div className="feature-badge-professional booking-badge-professional">INSTANT</div>
              </div>
              <h3>Seamless Booking Experience</h3>
              <p>Reserve your ideal accommodation in under 60 seconds with our streamlined booking system. Secure payments, instant confirmation, and dedicated 24/7 support.</p>
              <div className="feature-metrics-professional">
                <div className="metric-professional">
                  <span className="metric-number-professional">60s</span>
                  <span className="metric-label-professional">Booking Time</span>
                </div>
                <div className="metric-professional">
                  <span className="metric-number-professional">24/7</span>
                  <span className="metric-label-professional">Support</span>
                </div>
              </div>
              <a href="#" className="feature-link-professional">
                <span>Start Booking</span>
                <span className="feature-arrow-professional">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="testimonials-section-professional">
        <div className="testimonials-bg-professional">
          <div className="testimonials-gradient-professional"></div>
        </div>
        
        <div className="container">
          <div className="section-header-testimonials">
            <div className="testimonials-badge-professional">
              <span className="badge-icon-professional">💬</span>
              <span>Student Success Stories</span>
            </div>
            <h2 className="section-title-testimonials">
              Trusted By
              <span className="gradient-text-testimonials-professional"> Thousands </span>
              Of Students
            </h2>
            <p className="section-subtitle-professional">
              Discover why students across the country choose our platform for their accommodation needs. 
              Real experiences from real students.
            </p>
          </div>
          <div className="testimonials-grid-professional">
            <div className="testimonial-card-professional" data-aos="fade-up" data-aos-delay="100">
              <div className="testimonial-header-professional">
                <div className="testimonial-avatar-professional">
                  <span>P</span>
                </div>
                <div className="testimonial-badge-professional success-badge-professional">VERIFIED REVIEW</div>
              </div>
              <div className="testimonial-rating-professional">
                <div className="stars-professional">
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                </div>
                <span className="rating-text-professional">5.0 Rating</span>
              </div>
              <p className="testimonial-quote-professional">
                "Found my perfect accommodation in just 2 days. The comprehensive verification process gave me complete confidence, and the booking experience was exceptionally smooth and professional."
              </p>
              <div className="testimonial-metrics-professional">
                <div className="metric-professional">
                  <span className="metric-number-professional">2</span>
                  <span className="metric-label-professional">Days</span>
                </div>
                <div className="metric-professional">
                  <span className="metric-number-professional">47</span>
                  <span className="metric-label-professional">Checks</span>
                </div>
              </div>
              <div className="testimonial-author-professional">
                <strong>Priya Sharma</strong>
                <span>B.Tech Computer Science, New Delhi</span>
              </div>
            </div>

            <div className="testimonial-card-professional" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-header-professional">
                <div className="testimonial-avatar-professional">
                  <span>A</span>
                </div>
                <div className="testimonial-badge-professional premium-badge-professional">PREMIUM USER</div>
              </div>
              <div className="testimonial-rating-professional">
                <div className="stars-professional">
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                </div>
                <span className="rating-text-professional">5.0 Rating</span>
              </div>
              <p className="testimonial-quote-professional">
                "Outstanding platform with authentic listings and transparent processes. The detailed student reviews and professional verification system helped me make an informed decision with complete confidence."
              </p>
              <div className="testimonial-metrics-professional">
                <div className="metric-professional">
                  <span className="metric-number-professional">100%</span>
                  <span className="metric-label-professional">Genuine</span>
                </div>
                <div className="metric-professional">
                  <span className="metric-number-professional">24/7</span>
                  <span className="metric-label-professional">Support</span>
                </div>
              </div>
              <div className="testimonial-author-professional">
                <strong>Arjun Verma</strong>
                <span>MBA Finance, Mumbai</span>
              </div>
            </div>

            <div className="testimonial-card-professional" data-aos="fade-up" data-aos-delay="300">
              <div className="testimonial-header-professional">
                <div className="testimonial-avatar-professional">
                  <span>K</span>
                </div>
                <div className="testimonial-badge-professional smart-badge-professional">SMART FINDER</div>
              </div>
              <div className="testimonial-rating-professional">
                <div className="stars-professional">
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                  <span className="star-professional">★</span>
                </div>
                <span className="rating-text-professional">5.0 Rating</span>
              </div>
              <p className="testimonial-quote-professional">
                "The intelligent filtering system and AI-powered location recommendations are game-changing. This platform has revolutionized the accommodation search process for students like me."
              </p>
              <div className="testimonial-metrics-professional">
                <div className="metric-professional">
                  <span className="metric-number-professional">AI</span>
                  <span className="metric-label-professional">Powered</span>
                </div>
                <div className="metric-professional">
                  <span className="metric-number-professional">10x</span>
                  <span className="metric-label-professional">Faster</span>
                </div>
              </div>
              <div className="testimonial-author-professional">
                <strong>Kavya Reddy</strong>
                <span>BCA Software Development, Bangalore</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section-professional">
        <div className="cta-bg-professional">
          <div className="cta-gradient-professional"></div>
          <div className="cta-pattern-professional"></div>
        </div>
        
        <div className="container">
          <div className="cta-content-professional">
            <div className="cta-badge-professional">
              <span className="badge-icon-professional">🚀</span>
              <span>Start Your Journey Today</span>
            </div>
            <h2 className="cta-title-professional">
              Ready To Find Your
              <span className="gradient-text-cta-professional"> Perfect </span>
              Accommodation?
            </h2>
            <p className="cta-subtitle-professional">
              Join thousands of students who have transformed their college experience with our professional accommodation platform. Your ideal PG is just one click away.
            </p>
            
            <div className="cta-stats-professional">
              <div className="cta-stat-professional">
                <span className="stat-number-cta-professional">10,000+</span>
                <span className="stat-label-cta-professional">Satisfied Students</span>
              </div>
              <div className="cta-stat-professional">
                <span className="stat-number-cta-professional">500+</span>
                <span className="stat-label-cta-professional">Verified Properties</span>
              </div>
              <div className="cta-stat-professional">
                <span className="stat-number-cta-professional">60s</span>
                <span className="stat-label-cta-professional">Average Booking</span>
              </div>
            </div>
            
            <button className="cta-button-professional" onClick={onGetStarted}>
              <span>Start Your Search</span>
              <span className="cta-arrow-professional">→</span>
            </button>
            
            <div className="cta-features-professional">
              <div className="cta-feature-professional">
                <span className="cta-feature-icon-professional">✓</span>
                <span>100% Free to Use</span>
              </div>
              <div className="cta-feature-professional">
                <span className="cta-feature-icon-professional">✓</span>
                <span>Instant Verification</span>
              </div>
              <div className="cta-feature-professional">
                <span className="cta-feature-icon-professional">✓</span>
                <span>Secure Payments</span>
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