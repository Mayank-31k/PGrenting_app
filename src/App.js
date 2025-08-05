import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Shield, Clock, DollarSign, Zap, Facebook, Twitter, Instagram, Linkedin, Play, ArrowRight, CheckCircle } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import PGList from './components/PGList';
import PGDetail from './components/PGDetail';
import Filters from './components/Filters';
import { samplePGData } from './data/sampleData';

const App = () => {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'browse', 'profile'
  const [authModal, setAuthModal] = useState(null); // null, 'login', 'register'
  const [user, setUser] = useState(null);
  const [selectedPG, setSelectedPG] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [pgs, setPgs] = useState([]);
  const [filteredPGs, setFilteredPGs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Add Google Fonts link
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Function to fetch PG data from MongoDB
  const fetchPGs = async (filters = {}) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.minRent) queryParams.append('minRent', filters.minRent);
      if (filters.maxRent) queryParams.append('maxRent', filters.maxRent);
      if (filters.facilities && filters.facilities.length > 0) {
        queryParams.append('facilities', filters.facilities.join(','));
      }
      
      const url = `http://localhost:5001/api/pgs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PGs');
      }
      
      const data = await response.json();
      
      // Transform MongoDB data to match frontend format
      const transformedData = data.map(pg => ({
        id: pg._id,
        name: pg.name,
        location: pg.location.address,
        rent: pg.pricing.rent,
        gender: pg.accommodation.gender === 'male' ? 'Boys' : pg.accommodation.gender === 'female' ? 'Girls' : 'Mixed',
        distanceFromCollege: pg.distance || '1-2 km from DTU',
        image: pg.images[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
        facilities: pg.getAllFacilities ? pg.getAllFacilities() : Object.keys({...pg.facilities.basic, ...pg.facilities.amenities, ...pg.facilities.services}).filter(key => pg.facilities.basic[key] || pg.facilities.amenities[key] || pg.facilities.services[key]),
        owner: pg.owner?.name || 'PG Owner',
        phone: pg.contact.phone,
        sharing: pg.accommodation.roomTypes[0]?.description || 'Double/Triple sharing',
        deposit: pg.pricing.securityDeposit,
        food: pg.pricing.maintenanceCharges ? 'Meals available' : 'Self-cooking'
      }));
      
      setPgs(transformedData);
      setFilteredPGs(transformedData);
    } catch (error) {
      console.error('Error fetching PGs:', error);
      // Fallback to sample data if API fails
      setPgs(samplePGData);
      setFilteredPGs(samplePGData);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing user session on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Load PG data when app starts
    fetchPGs();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthModal(null);
    console.log('Login successful:', userData);
    
    // Show success message
    if (userData.provider === 'google') {
      alert(`Welcome ${userData.name}! You've successfully signed in with Google.`);
    } else {
      alert(`Welcome ${userData.name}! You've successfully signed in.`);
    }
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setAuthModal(null);
    console.log('Registration successful:', userData);
    
    // Show success message
    if (userData.provider === 'google') {
      alert(`Welcome ${userData.name}! Your account has been created successfully with Google.`);
    } else {
      alert(`Welcome ${userData.name}! Your account has been created successfully.`);
    }
  };

  const handleLogout = () => {
    // Clear user state and localStorage
    setUser(null);
    setShowProfile(false);
    setCurrentView('landing');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('User logged out');
  };

  const handleShowProfile = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handleShowPGDetail = (pg) => {
    setSelectedPG(pg);
  };

  const handleClosePGDetail = () => {
    setSelectedPG(null);
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('Profile updated:', updatedUser);
  };

  const handleInquiry = (inquiryData) => {
    console.log('Inquiry submitted:', inquiryData);
    alert('Your inquiry has been sent successfully! The PG owner will contact you soon.');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterPGs(term, null);
  };

  const handleFilter = (filters) => {
    // Use API-based filtering for better performance
    fetchPGs(filters);
  };

  const filterPGs = (search, filters) => {
    // Client-side filtering for search terms only
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

    setFilteredPGs(filtered);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 
                className="text-xl font-bold cursor-pointer" 
                onClick={() => setCurrentView('landing')}
              >
                PG RENTER
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setCurrentView('landing')}
                  className={`text-sm hover:text-black ${currentView === 'landing' ? 'text-black font-medium' : 'text-gray-700'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setCurrentView('browse')}
                  className={`text-sm hover:text-black ${currentView === 'browse' ? 'text-black font-medium' : 'text-gray-700'}`}
                >
                  Search PGs
                </button>
                <a href="#" className="text-sm text-gray-700 hover:text-black">About</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input type="text" placeholder="Search by location" className="bg-transparent text-sm outline-none" />
              </div>
              {user ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleShowProfile}
                    className="text-sm text-gray-700 hover:text-black font-medium"
                  >
                    👤 {user.name}
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-gray-700 hover:text-black font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setAuthModal('login')}
                    className="text-sm text-gray-700 hover:text-black font-medium"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setAuthModal('register')}
                    className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {currentView === 'landing' && (
        <>
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-lg">🎓</span>
            <span className="text-sm font-medium text-gray-600">FOR STUDENTS</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            FIND YOUR PERFECT PG<br />IN <span className="text-orange-500">MINUTES</span>
          </h2>
          <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base px-4">
            Discover verified accommodations near your college with real student reviews, transparent pricing, and instant booking.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-12 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold">500+</h3>
              <p className="text-sm text-gray-600">Verified PGs</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">10K+</h3>
              <p className="text-sm text-gray-600">Happy Students</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">50+</h3>
              <p className="text-sm text-gray-600">Cities</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentView('browse')}
              className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              START SEARCHING <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              WATCH DEMO <Play className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PG Grid */}
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3 mb-12">
          {[
            { img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", alt: "PG Room 1" },
            { img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", alt: "PG Room 2" },
            { img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", alt: "PG Room 3" },
            { img: "https://images.unsplash.com/photo-1522444690501-83baa3628202?w=400", alt: "PG Room 4" },
            { img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=400", alt: "PG Room 5" },
            { img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400", alt: "PG Room 6" },
            { img: "https://images.unsplash.com/photo-1560185127-6a535b2c704d?w=400", alt: "PG Room 7" },
            { img: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400", alt: "PG Room 8" }
          ].map((item, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
              <img 
                src={item.img} 
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Free Shipping Bar */}
        <div className="flex items-center justify-center gap-4 md:gap-8 py-8 md:py-10 border-t border-b border-gray-200 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🏠</span>
            </div>
            <h4 className="font-semibold text-xs md:text-sm">100% VERIFIED PROPERTIES</h4>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🔒</span>
            </div>
            <h4 className="font-semibold text-xs md:text-sm">SECURE & SAFE</h4>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">⚡</span>
            </div>
            <h4 className="font-semibold text-xs md:text-sm">INSTANT BOOKING</h4>
          </div>
        </div>
      </section>

      {/* Most Popular PGs */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            Featured<br />PG Accommodations
          </h3>
          <button className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors w-fit">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600" 
                alt="Elite Boys PG"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-medium">
                Boys
              </div>
              <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                Verified
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">Elite Boys PG</h4>
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">Shahbad Daulatpur, Near DTU</p>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">0.5km from college • 5 min walk</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-yellow-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-600 ml-1 font-medium">5.0 (24)</span>
                </div>
                <p className="font-bold text-xl text-green-600">₹8,500</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">WiFi</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">AC</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">Meals</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">+3 more</span>
              </div>
              <p className="text-xs text-gray-500">Double/Triple sharing • ₹15,000 deposit</p>
            </div>
          </div>

          <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600" 
                alt="Green Valley Girls"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 bg-pink-500 bg-opacity-90 text-white px-2 py-1 rounded-md text-xs font-medium">
                Girls
              </div>
              <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                Verified
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">Lakshmi Girls PG</h4>
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">Rohini Sector 17, Delhi</p>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">2km from DTU • 15 min walk</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-yellow-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-600 ml-1 font-medium">4.8 (18)</span>
                </div>
                <p className="font-bold text-xl text-green-600">₹12,000</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">AC</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">WiFi</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">Kitchen</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">+4 more</span>
              </div>
              <p className="text-xs text-gray-500">Double sharing • ₹18,000 deposit</p>
            </div>
          </div>

          <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600" 
                alt="Premium PG"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 bg-purple-500 bg-opacity-90 text-white px-2 py-1 rounded-md text-xs font-medium">
                Premium
              </div>
              <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                Verified
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">Your-Space Rohini</h4>
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">Rohini Sector 16, Delhi</p>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">2.5km from DTU • 20 min walk</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-yellow-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-600 ml-1 font-medium">4.9 (31)</span>
                </div>
                <p className="font-bold text-xl text-green-600">₹20,000</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">Gym</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">Cafe</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">Laundry</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">+5 more</span>
              </div>
              <p className="text-xs text-gray-500">Single/Double sharing • ₹25,000 deposit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Students Choose Us */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              ⭐ Why Students Choose Us
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience The Future Of Student Housing. Discover verified accommodations with our advanced platform designed exclusively for students. Professional service meets cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🏠</div>
              <h4 className="font-bold text-xl mb-2">VERIFIED</h4>
              <h5 className="font-semibold mb-3">100% Verified Accommodations</h5>
              <p className="text-sm text-gray-600 mb-4">
                Every accommodation undergoes our comprehensive 47-point verification process. From safety protocols to internet connectivity - everything is professionally audited by our expert team.
              </p>
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-xs text-gray-600">Verified PGs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-gray-600">Check Points</p>
                </div>
              </div>
              <a href="#" className="text-sm font-medium hover:text-orange-600 flex items-center gap-1">
                Learn More <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">📍</div>
              <h4 className="font-bold text-xl mb-2">SMART</h4>
              <h5 className="font-semibold mb-3">AI-Powered Location Intelligence</h5>
              <p className="text-sm text-gray-600 mb-4">
                Our advanced algorithm analyzes traffic patterns, commute times, and local amenities to recommend accommodations that perfectly align with your academic and lifestyle needs.
              </p>
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-2xl font-bold">0.5km</p>
                  <p className="text-xs text-gray-600">Avg Distance</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">5min</p>
                  <p className="text-xs text-gray-600">Walk Time</p>
                </div>
              </div>
              <a href="#" className="text-sm font-medium hover:text-orange-600 flex items-center gap-1">
                Explore Technology <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">💰</div>
              <h4 className="font-bold text-xl mb-2">TRANSPARENT</h4>
              <h5 className="font-semibold mb-3">Crystal Clear Pricing</h5>
              <p className="text-sm text-gray-600 mb-4">
                Complete transparency with zero hidden fees or surprise charges. Our detailed pricing breakdown includes all utilities, maintenance, and amenities upfront.
              </p>
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-2xl font-bold">0%</p>
                  <p className="text-xs text-gray-600">Hidden Fees</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-xs text-gray-600">Transparent</p>
                </div>
              </div>
              <a href="#" className="text-sm font-medium hover:text-orange-600 flex items-center gap-1">
                View Pricing <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="font-bold text-xl mb-2">INSTANT</h4>
              <h5 className="font-semibold mb-3">Seamless Booking Experience</h5>
              <p className="text-sm text-gray-600 mb-4">
                Reserve your ideal accommodation in under 60 seconds with our streamlined booking system. Secure payments, instant confirmation, and dedicated 24/7 support.
              </p>
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-2xl font-bold">60s</p>
                  <p className="text-xs text-gray-600">Booking Time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-xs text-gray-600">Support</p>
                </div>
              </div>
              <a href="#" className="text-sm font-medium hover:text-orange-600 flex items-center gap-1">
                Start Booking <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4">💬 Student Success Stories</h3>
          <p className="text-gray-600">Trusted By Thousands Of Students</p>
          <p className="text-sm text-gray-600">Discover why students across the country choose our platform for their accommodation needs. Real experiences from real students.</p>
        </div>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                P
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">VERIFIED REVIEW</span>
                  <div className="flex text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-sm font-semibold">5.0 Rating</span>
                </div>
                <p className="text-gray-600 italic mb-3">
                  "Found my perfect accommodation in just 2 days. The comprehensive verification process gave me complete confidence, and the booking experience was exceptionally smooth and professional."
                </p>
                <div className="flex gap-6 mb-2">
                  <span className="text-sm"><strong>2</strong> Days</span>
                  <span className="text-sm"><strong>47</strong> Checks</span>
                </div>
                <p className="text-sm font-semibold">Priya Sharma</p>
                <p className="text-xs text-gray-600">B.Tech Computer Science, New Delhi</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">PREMIUM USER</span>
                  <div className="flex text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-sm font-semibold">5.0 Rating</span>
                </div>
                <p className="text-gray-600 italic mb-3">
                  "Outstanding platform with authentic listings and transparent processes. The detailed student reviews and professional verification system helped me make an informed decision with complete confidence."
                </p>
                <div className="flex gap-6 mb-2">
                  <span className="text-sm"><strong>100%</strong> Genuine</span>
                  <span className="text-sm"><strong>24/7</strong> Support</span>
                </div>
                <p className="text-sm font-semibold">Arjun Verma</p>
                <p className="text-xs text-gray-600">MBA Finance, Mumbai</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                K
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">SMART FINDER</span>
                  <div className="flex text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-sm font-semibold">5.0 Rating</span>
                </div>
                <p className="text-gray-600 italic mb-3">
                  "The intelligent filtering system and AI-powered location recommendations are game-changing. This platform has revolutionized the accommodation search process for students like me."
                </p>
                <div className="flex gap-6 mb-2">
                  <span className="text-sm"><strong>AI</strong> Powered</span>
                  <span className="text-sm"><strong>10x</strong> Faster</span>
                </div>
                <p className="text-sm font-semibold">Kavya Reddy</p>
                <p className="text-xs text-gray-600">BCA Software Development, Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Your Journey CTA */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">🚀 Start Your Journey Today</h3>
          <p className="text-xl mb-2">Ready To Find Your Perfect Accommodation?</p>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their college experience with our professional accommodation platform. Your ideal PG is just one click away.
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold">10,000+</p>
              <p className="text-sm text-gray-300">Satisfied Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-gray-300">Verified Properties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">60s</p>
              <p className="text-sm text-gray-300">Average Booking</p>
            </div>
          </div>

          <button 
            onClick={() => setCurrentView('browse')}
            className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 flex items-center gap-2 mx-auto mb-6"
          >
            Start Your Search <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> 100% Free to Use
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Instant Verification
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Secure Payments
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">PG RENTER</h4>
              <p className="text-sm text-gray-400">
                Find your perfect PG accommodation near college with verified listings and trusted reviews.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">QUICK LINKS</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Search PGs</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Help</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">SUPPORT</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Feedback</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">CONNECT</h5>
              <div className="flex gap-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-sm text-gray-400">
                📧 info@pgrenter.com<br />
                📞 +91 98765 43210
              </p>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              © 2024 PG Renter. All rights reserved.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Made with ❤️ for students
            </p>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* PG Browsing View */}
      {currentView === 'browse' && (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect PG</h1>
              <p className="text-gray-600">Browse through our verified PG accommodations</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-80 lg:flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <Filters onFilter={handleFilter} />
                </div>
              </div>
              
              {/* PG Listings */}
              <div className="flex-1 min-w-0">
                <PGList 
                  pgs={filteredPGs} 
                  user={user}
                  onInquiry={handleInquiry}
                  onShowPGDetail={handleShowPGDetail}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showProfile && user && (
        <UserProfile
          user={user}
          onClose={handleCloseProfile}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* PG Detail Modal */}
      {selectedPG && (
        <PGDetail
          pg={selectedPG}
          user={user}
          onClose={handleClosePGDetail}
          onInquiry={handleInquiry}
        />
      )}

      {/* Authentication Modals */}
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
};

export default App;