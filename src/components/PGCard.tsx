'use client'

import React from 'react';
import { MapPin, Star, Phone, Users, Wifi, Car, Utensils, Shield, Info, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import type { PGData } from '@/data/sampleData';

interface PGCardProps {
  pg: PGData;
  onViewDetails: (pg: PGData) => void;
  onInquire: (pg: PGData) => void;
}

export default function PGCard({ pg, onViewDetails, onInquire }: PGCardProps) {
  const facilityIcons: { [key: string]: React.ElementType } = {
    'WiFi': Wifi,
    'AC': Shield,
    'Power Backup': Shield,
    '24/7 Water Supply': Shield,
    'CCTV Security': Shield,
    'Meals': Utensils,
    'Parking': Car,
    'Geyser': Shield,
    'Quality Food': Utensils,
    'RO Water': Shield,
    'Laundry Service': Shield,
    'Attached Washrooms': Shield,
    'Kitchenette': Utensils,
    'Washing Machine': Shield,
    'Fridge': Shield,
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 aspect-square flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image 
          src={pg.image}
          alt={pg.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyzsrytN9Xp1CmtI5BMVlTvvg/k1UiKgKgZ8BQfOwD69DQ/m"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            ✓ Verified
          </div>
          {pg.gender && (
            <div className="bg-white bg-opacity-90 backdrop-blur text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
              {pg.gender}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3 h-3 text-green-500 fill-current" />
          <span className="text-xs font-medium">5.0</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-orange-600 transition-colors">
            {pg.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-600 mb-1">
            <MapPin className="w-3 h-3" />
            <span className="text-sm truncate">{pg.location}</span>
          </div>
          <div className="text-sm text-orange-600 font-medium">
            📍 {pg.distanceFromCollege}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-3 text-center">
          <div className="text-xl font-bold text-green-600">₹{pg.rent.toLocaleString()}</div>
          <div className="text-xs text-gray-600">per month</div>
        </div>

        {/* Facilities */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {pg.facilities.slice(0, 3).map((facility, idx) => {
              const IconComponent = facilityIcons[facility] || Shield;
              return (
                <div key={idx} className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                  <IconComponent className="w-3 h-3" />
                  <span>{facility}</span>
                </div>
              );
            })}
            {pg.facilities.length > 3 && (
              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{pg.facilities.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onViewDetails(pg)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            Info
          </button>
          <button
            onClick={() => onInquire(pg)}
            className="flex-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white py-2 px-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
}