'use client'

import React, { useState } from 'react';
import { X, MapPin, Star, Phone, Mail, Wifi, Car, Utensils, Shield, Zap, Home, Users, Calendar, CreditCard, Camera } from 'lucide-react';
import Image from 'next/image';
import type { PGData } from '@/data/sampleData';

interface PGDetailModalProps {
  pg: PGData;
  isOpen: boolean;
  onClose: () => void;
  onInquire: (pg: PGData) => void;
}

export default function PGDetailModal({ pg, isOpen, onClose, onInquire }: PGDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'reviews' | 'location'>('overview');

  if (!isOpen) return null;

  // Mock additional images for gallery
  const images = [
    pg.image,
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
  ];

  // Mock testimonials if not available
  const testimonials = pg.testimonials || [
    {
      name: "Student Review",
      course: "BTech",
      rating: 5,
      comment: "Great accommodation with excellent facilities!",
      date: "1 month ago"
    }
  ];

  const facilityIcons: { [key: string]: React.ElementType } = {
    'WiFi': Wifi,
    'AC': Zap,
    'Power Backup': Zap,
    '24/7 Water Supply': Home,
    'CCTV Security': Shield,
    'Meals': Utensils,
    'Parking': Car,
    'Geyser': Home,
    'Quality Food': Utensils,
    'RO Water': Home,
    'Laundry Service': Home,
    'Attached Washrooms': Home,
    'Kitchenette': Utensils,
    'Washing Machine': Home,
    'Fridge': Home,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{pg.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{pg.location}</span>
              <span className="text-orange-600 font-medium ml-2">{pg.distanceFromCollege}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left Side - Image Gallery */}
          <div className="w-1/2 bg-gray-50">
            <div className="h-full flex flex-col">
              {/* Main Image */}
              <div className="flex-1 relative">
                <Image
                  src={images[activeImageIndex]}
                  alt={pg.name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Verified
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {pg.gender}
                </div>
                <button className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  {images.length} Photos
                </button>
              </div>

              {/* Image Thumbnails */}
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                        activeImageIndex === index ? 'ring-2 ring-orange-500' : ''
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="w-1/2 flex flex-col">
            {/* Pricing */}
            <div className="p-6 border-b bg-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">₹{pg.rent.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
                <div className="flex items-center text-green-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">5.0 ({testimonials.length})</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Security Deposit:</span>
                  <div className="font-semibold">₹{pg.deposit.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Room Type:</span>
                  <div className="font-semibold">{pg.sharing}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b flex-shrink-0">
              <div className="flex">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'facilities', label: 'Facilities' },
                  { key: 'reviews', label: 'Reviews' },
                  { key: 'location', label: 'Location' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 ${
                      activeTab === tab.key
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">About this PG</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {pg.name} is a well-maintained accommodation perfect for students. Located in {pg.location}, 
                      it offers comfortable living with all essential amenities. The property is {pg.distanceFromCollege} 
                      making it convenient for daily commute.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{pg.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{pg.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Food & Dining</h3>
                    <p className="text-sm text-gray-600">{pg.food}</p>
                  </div>
                </div>
              )}

              {activeTab === 'facilities' && (
                <div>
                  <h3 className="font-semibold mb-4">Available Facilities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {pg.facilities.map((facility, index) => {
                      const IconComponent = facilityIcons[facility] || Home;
                      return (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <IconComponent className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Student Reviews</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-green-500 fill-current" />
                      <span className="text-sm font-medium">5.0</span>
                      <span className="text-sm text-gray-600">({testimonials.length} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{testimonial.name}</span>
                              <span className="text-xs text-gray-500">• {testimonial.course}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-green-500 fill-current" />
                              ))}
                              <span className="text-xs text-gray-600 ml-1">{testimonial.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 italic">"{testimonial.comment}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Location Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{pg.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{pg.distanceFromCollege}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Interactive map coming soon</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Nearby Amenities</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• College/University within walking distance</p>
                      <p>• Public transport easily accessible</p>
                      <p>• Markets and shopping centers nearby</p>
                      <p>• Hospitals and medical facilities available</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-t p-6 flex-shrink-0">
              <button
                onClick={() => onInquire(pg)}
                className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}