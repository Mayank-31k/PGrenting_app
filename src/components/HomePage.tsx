'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Shield, Clock, DollarSign, Zap, Facebook, Twitter, Instagram, Linkedin, Play, ArrowRight, CheckCircle, MessageCircle, Phone, User, X } from 'lucide-react';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Navbar from '@/components/Navbar';
import { samplePGData, type PGData } from '@/data/sampleData';
import Link from 'next/link';
import Image from 'next/image';
import { useHydration } from '@/hooks/useHydration';
import { useApp } from '@/contexts/AppContext';
import Modals from './Modals';

export default function HomePage() {
  const isHydrated = useHydration();
  const {
    user,
    setUser,
    userInquiries,
    setUserInquiries,
    showUserProfile,
    setShowUserProfile,
    showEditProfile,
    setShowEditProfile,
    showAllInquiries,
    setShowAllInquiries,
    editFormData,
    setEditFormData,
    isUpdatingProfile,
    setIsUpdatingProfile,
    authModal,
    setAuthModal,
    login,
    register,
    logout,
    fetchUserInquiries
  } = useApp();
  
  const [pgs, setPgs] = useState<PGData[]>(samplePGData);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedPg, setSelectedPg] = useState<PGData | null>(null);

  // Memoized function to fetch PG data from MongoDB
  const fetchPGs = useCallback(async (filters: any = {}) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.minRent) queryParams.append('minRent', filters.minRent.toString());
      if (filters.maxRent) queryParams.append('maxRent', filters.maxRent.toString());
      if (filters.facilities && filters.facilities.length > 0) {
        queryParams.append('facilities', filters.facilities.join(','));
      }
      
      const url = `/api/pgs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn('API fetch failed, using sample data');
        return;
      }
      
      const data = await response.json();
      
      // Transform MongoDB data to match frontend format
      const transformedData: PGData[] = data.map((pg: any) => ({
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
    } catch (error) {
      console.warn('Error fetching PGs, using sample data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load PG data from API on component mount
  useEffect(() => {
    fetchPGs();
  }, [fetchPGs]);


  const handleEditProfile = () => {
    if (user) {
      setEditFormData({ name: user.name, phone: user.phone || '' });
      setShowEditProfile(true);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          name: editFormData.name,
          phone: editFormData.phone
        })
      });

      if (response.ok) {
        const updatedUser = { ...user, name: editFormData.name, phone: editFormData.phone };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowEditProfile(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleInquirySubmitted = async (newInquiry: any) => {
    // The API returns the full response with inquiry object
    const inquiryData = newInquiry.inquiry || newInquiry;
    setUserInquiries([inquiryData, ...userInquiries]);
    // Refetch inquiries to ensure we have the latest data from server
    await fetchUserInquiries();
  };

  // Show loading state until component is fully hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PG Renter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar
        user={user}
        onLogout={logout}
        onLogin={() => setAuthModal('login')}
        onRegister={() => setAuthModal('register')}
        showUserProfile={showUserProfile}
        onShowUserProfile={setShowUserProfile}
        userInquiries={userInquiries}
        onShowAllInquiries={() => setShowAllInquiries(true)}
        onEditProfile={handleEditProfile}
        currentPage="home"
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-lg">🎓</span>
            <span className="text-sm font-medium text-gray-600 tracking-wider uppercase">FOR STUDENTS</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight max-w-5xl mx-auto" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
            Find your perfect PG<br />
            in <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">minutes</span>
          </h1>
          
          <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed px-4 font-semibold">
            Discover verified accommodations near your college with real student reviews, transparent pricing, and instant booking.
          </p>
          
          <div className="mb-16">
            <Link 
              href="/browse"
              className="bg-black text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center gap-3 shadow-xl"
            >
              START SEARCHING <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center gap-12 md:gap-16 text-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">500+</h3>
              <p className="text-sm text-gray-600 mt-1">Verified PGs</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">10K+</h3>
              <p className="text-sm text-gray-600 mt-1">Happy Students</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">50+</h3>
              <p className="text-sm text-gray-600 mt-1">Cities</p>
            </div>
          </div>
        </div>

        {/* Moving PG Grid */}
        <div className="relative overflow-hidden mb-12">
          {/* Blur gradient overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white via-white/50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white via-white/50 to-transparent z-10"></div>
          
          <div className="flex animate-scroll-left gap-3">
            {/* First set of images */}
            {[
              { img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", alt: "PG Room 1" },
              { img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", alt: "PG Room 2" },
              { img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", alt: "PG Room 3" },
              { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "PG Room 4" },
              { img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=400", alt: "PG Room 5" },
              { img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400", alt: "PG Room 6" },
              { img: "https://images.unsplash.com/photo-1560185127-6a535b2c704d?w=400", alt: "PG Room 7" },
              { img: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400", alt: "PG Room 8" }
            ].map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 w-32 md:w-40">
                <Image 
                  src={item.img} 
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 128px, 160px"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {[
              { img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400", alt: "PG Room 1" },
              { img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", alt: "PG Room 2" },
              { img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", alt: "PG Room 3" },
              { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", alt: "PG Room 4" },
              { img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=400", alt: "PG Room 5" },
              { img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400", alt: "PG Room 6" },
              { img: "https://images.unsplash.com/photo-1560185127-6a535b2c704d?w=400", alt: "PG Room 7" },
              { img: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400", alt: "PG Room 8" }
            ].map((item, idx) => (
              <div key={`duplicate-${idx}`} className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 w-32 md:w-40">
                <Image 
                  src={item.img} 
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 128px, 160px"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Bar */}
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

      {/* Featured PG Accommodations */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold">
            Featured<br />PG Accommodations
          </h3>
          <Link 
            href="/browse"
            className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgs.slice(0, 3).map((pg, index) => (
            <Link
              key={pg.id}
              href={`/browse`}
              className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={pg.image} 
                  alt={pg.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-semibold">
                    Verified
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-md text-xs font-semibold">
                    {pg.gender}
                  </div>
                </div>
                {index === 2 && (
                  <div className="absolute top-12 right-4">
                    <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                      Premium
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {/* Title and Location */}
                <h4 className="font-bold text-xl mb-2 group-hover:text-orange-600 transition-colors">{pg.name}</h4>
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{pg.location}</span>
                </div>
                
                {/* Distance and Time */}
                <div className="flex items-center gap-1 text-gray-600 mb-3">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{pg.distanceFromCollege} • 5 min walk</span>
                </div>
                
                {/* Rating and Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex text-green-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {index === 0 ? '5.0' : index === 1 ? '4.8' : '4.9'} 
                      ({index === 0 ? '24' : index === 1 ? '18' : '31'})
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{pg.rent.toLocaleString()}
                  </div>
                </div>
                
                {/* Facilities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pg.facilities.slice(0, 3).map((facility, idx) => (
                    <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {facility}
                    </span>
                  ))}
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    +{pg.facilities.length - 3} more
                  </span>
                </div>
                
                {/* Sharing and Deposit */}
                <div className="text-sm text-gray-600">
                  {pg.sharing} • ₹{pg.deposit.toLocaleString()} deposit
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPg(pg);
                    setIsEnquiryModalOpen(true);
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Inquire Now
                </button>
              </div>
            </Link>
          ))}
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
                  <div className="flex text-green-500 text-sm">
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
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">PREMIUM USER</span>
                  <div className="flex text-green-500 text-sm">
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
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">SMART FINDER</span>
                  <div className="flex text-green-500 text-sm">
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

          <Link 
            href="/browse"
            className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 flex items-center gap-2 mx-auto mb-6 w-fit"
          >
            Start Your Search <ArrowRight className="w-5 h-5" />
          </Link>

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
                <li><Link href="/browse" className="hover:text-white">Search PGs</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/help" className="hover:text-white">Help</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">SUPPORT</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/feedback" className="hover:text-white">Feedback</Link></li>
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


      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Authentication Modals */}
      {authModal === 'login' && (
        <Login
          onClose={() => setAuthModal(null)}
          onLogin={login}
          onSwitchToRegister={() => setAuthModal('register')}
        />
      )}

      {authModal === 'register' && (
        <Register
          onClose={() => setAuthModal(null)}
          onRegister={register}
          onSwitchToLogin={() => setAuthModal('login')}
        />
      )}

      <Modals
        selectedPg={selectedPg}
        isEnquiryModalOpen={isEnquiryModalOpen}
        closeEnquiryModal={() => setIsEnquiryModalOpen(false)}
        handleInquirySubmitted={handleInquirySubmitted}
        showAllInquiries={showAllInquiries}
        closeAllInquiriesModal={() => setShowAllInquiries(false)}
        userInquiries={userInquiries}
      />
    </div>
  );
}