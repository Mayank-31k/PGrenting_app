'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, LogIn } from 'lucide-react';
import { samplePGData, type PGData } from '@/data/sampleData';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import PGCard from '@/components/PGCard';
import PGCardSkeleton from '@/components/PGCardSkeleton';
import PGDetailModal from '@/components/PGDetailModal';
import InquiryModal from '@/components/InquiryModal';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Navbar from '@/components/Navbar';
import AllInquiriesModal from '@/components/AllInquiriesModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useApp } from '@/contexts/AppContext';

export default function BrowsePage() {
  const {
    user,
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
    userInquiries,
    fetchUserInquiries
  } = useApp();

  const [pgs, setPgs] = useState<PGData[]>([]);
  const [filteredPGs, setFilteredPGs] = useState<PGData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: 'any',
    minRent: '',
    maxRent: '',
    facilities: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Debounce search and filters to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedFilters = useDebounce(filters, 500);
  
  // Modal states
  const [selectedPG, setSelectedPG] = useState<PGData | null>(null);
  const [showPGDetail, setShowPGDetail] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Memoized function to fetch PG data from MongoDB
  const fetchPGs = useCallback(async (filterParams: any = {}) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filterParams.search && filterParams.search.trim()) queryParams.append('search', filterParams.search);
      if (filterParams.city) queryParams.append('city', filterParams.city);
      if (filterParams.gender && filterParams.gender !== 'any') queryParams.append('gender', filterParams.gender);
      if (filterParams.minRent) queryParams.append('minRent', filterParams.minRent.toString());
      if (filterParams.maxRent) queryParams.append('maxRent', filterParams.maxRent.toString());
      if (filterParams.facilities && filterParams.facilities.length > 0) {
        queryParams.append('facilities', filterParams.facilities.join(','));
      }
      
      const url = `/api/pgs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Fetching PGs with URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch PGs');
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
      setFilteredPGs(transformedData);
    } catch (error) {
      console.error('Error fetching PGs:', error);
      // Fallback to sample data if API fails
      setPgs(samplePGData);
      setFilteredPGs(samplePGData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize component
  useEffect(() => {
    setMounted(true);
    // Load PG data when app starts
    fetchPGs();
  }, [fetchPGs]);

  // Effect to handle debounced filters and search - combine both to avoid conflicts
  useEffect(() => {
    if (mounted) {
      // Combine filters with search for API call
      const combinedFilters = {
        ...debouncedFilters,
        search: debouncedSearchTerm
      };
      fetchPGs(combinedFilters);
    }
  }, [debouncedFilters, debouncedSearchTerm, fetchPGs, mounted]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilter = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const facilityOptions = [
    'WiFi', 'AC', 'Power Backup', 'Meals', 'Laundry', 'Gym', 'Parking', 'CCTV', 
    'RO Water', 'Geyser', 'Fridge', 'Kitchen', 'TV', 'Cleaning Service'
  ];

  // PG Modal Handlers
  const handleViewPGDetails = (pg: PGData) => {
    setSelectedPG(pg);
    setShowPGDetail(true);
  };

  const handleInquire = (pg: PGData) => {
    if (!user) {
      setSelectedPG(pg);
      setShowAuthPrompt(true);
      return;
    }
    setSelectedPG(pg);
    setShowInquiry(true);
  };

  const handleInquireFromDetail = (pg: PGData) => {
    if (!user) {
      setShowPGDetail(false);
      setShowAuthPrompt(true);
      return;
    }
    setShowPGDetail(false);
    setShowInquiry(true);
  };

  // Authentication Handlers
  const handleLogin = (userData: any) => {
    login(userData);
    
    // Close auth prompt and open inquiry if PG was selected
    setShowAuthPrompt(false);
    if (selectedPG) {
      setShowInquiry(true);
    }
  };

  const handleRegister = (userData: any) => {
    register(userData);
    
    // Close auth prompt and open inquiry if PG was selected
    setShowAuthPrompt(false);
    if (selectedPG) {
      setShowInquiry(true);
    }
  };

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
        // Update user in context
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

  return (
    <div className="min-h-screen bg-gray-50">
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
        currentPage="browse"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect PG</h1>
          <p className="text-gray-600">Browse through our verified PG accommodations</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search by name or location"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={filters.gender}
                    onChange={(e) => handleFilter({...filters, gender: e.target.value})}
                  >
                    <option value="any">Any</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minRent}
                      onChange={(e) => handleFilter({...filters, minRent: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxRent}
                      onChange={(e) => handleFilter({...filters, maxRent: e.target.value})}
                    />
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Facilities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {facilityOptions.map((facility) => (
                      <label key={facility} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={filters.facilities.includes(facility)}
                          onChange={(e) => {
                            const newFacilities = e.target.checked 
                              ? [...filters.facilities, facility]
                              : filters.facilities.filter(f => f !== facility);
                            handleFilter({...filters, facilities: newFacilities});
                          }}
                        />
                        <span className="text-sm">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setFilters({gender: 'any', minRent: '', maxRent: '', facilities: []});
                    setSearchTerm('');
                    // Clear filters will trigger useEffect to fetch all PGs
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* PG Listings */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-6">
                <div className="mb-4">
                  <div className="bg-gray-200 h-5 w-32 rounded animate-pulse"></div>
                </div>
                {/* Skeleton cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <PGCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">{filteredPGs.length} PGs found</p>
                </div>
                <div className="space-y-6">
                  {/* First row - 2 cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {filteredPGs.slice(0, 2).map((pg) => (
                      <PGCard
                        key={pg.id}
                        pg={pg}
                        onViewDetails={handleViewPGDetails}
                        onInquire={handleInquire}
                      />
                    ))}
                  </div>

                  {/* Remaining cards - 2 per row */}
                  {filteredPGs.length > 2 && (
                    <div className="space-y-6">
                      {Array.from({ length: Math.ceil((filteredPGs.length - 2) / 2) }, (_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          {filteredPGs.slice(2 + rowIndex * 2, 4 + rowIndex * 2).map((pg) => (
                            <PGCard
                              key={pg.id}
                              pg={pg}
                              onViewDetails={handleViewPGDetails}
                              onInquire={handleInquire}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {filteredPGs.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No PGs found matching your criteria.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your filters or search term.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* PG Detail Modal */}
      {selectedPG && (
        <PGDetailModal
          pg={selectedPG}
          isOpen={showPGDetail}
          onClose={() => setShowPGDetail(false)}
          onInquire={handleInquireFromDetail}
        />
      )}

      {/* Inquiry Modal */}
      {selectedPG && (
        <InquiryModal
          pg={selectedPG}
          isOpen={showInquiry}
          onClose={() => setShowInquiry(false)}
          onInquirySubmitted={async (newInquiry) => {
            // Refetch user inquiries to update the list
            await fetchUserInquiries();
            // Don't close the modal here - let the success modal handle it
          }}
        />
      )}

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-6">
              Please sign in to inquire about {selectedPG?.name}. It only takes a minute!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  setAuthModal('login');
                }}
                className="flex-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  setAuthModal('register');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </button>
            </div>
            <button
              onClick={() => {
                setShowAuthPrompt(false);
                setSelectedPG(null);
              }}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

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
                ✕
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

      {/* All Inquiries Modal */}
      <AllInquiriesModal
        isOpen={showAllInquiries}
        onClose={() => setShowAllInquiries(false)}
        inquiries={userInquiries}
      />

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
}