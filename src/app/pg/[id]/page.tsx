'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Star, Clock, Phone, Mail, Wifi, Car, Utensils, Shield, Home, ArrowLeft } from 'lucide-react';
import { samplePGData, type PGData } from '@/data/sampleData';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function PGDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [pg, setPg] = useState<PGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    setMounted(true);
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setInquiryData(prev => ({
          ...prev,
          name: parsedUser.name || '',
          email: parsedUser.email || ''
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Find PG by ID (convert to number for sample data)
    const pgId = parseInt(id);
    const foundPg = samplePGData.find(p => p.id === pgId);
    
    if (foundPg) {
      setPg(foundPg);
    }
    
    setLoading(false);
  }, [id]);

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInquiryData({
      ...inquiryData,
      [e.target.name]: e.target.value
    });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pgId: id,
          ...inquiryData,
          inquiryType: 'general'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Your inquiry has been sent successfully! The PG owner will contact you soon.');
        setInquiryData({
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          message: ''
        });
      } else {
        alert(data.error || 'Failed to send inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Inquiry error:', error);
      alert('Network error. Please try again.');
    }
  };

  const getFacilityIcon = (facility: string) => {
    const lowerFacility = facility.toLowerCase();
    if (lowerFacility.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lowerFacility.includes('parking')) return <Car className="w-4 h-4" />;
    if (lowerFacility.includes('meal') || lowerFacility.includes('food')) return <Utensils className="w-4 h-4" />;
    if (lowerFacility.includes('security') || lowerFacility.includes('cctv')) return <Shield className="w-4 h-4" />;
    return <Home className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">PG Not Found</h1>
          <p className="text-gray-600 mb-6">The PG you're looking for doesn't exist.</p>
          <Link href="/browse" className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors">
            Browse All PGs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold">
              PG RENTER
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-700 hover:text-black">
                Home
              </Link>
              <Link href="/browse" className="text-sm text-gray-700 hover:text-black">
                Search PGs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/browse"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative h-80 lg:h-96">
                <Image
                  src={pg.image}
                  alt={pg.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Verified
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {pg.gender}
                </div>
              </div>
            </div>

            {/* PG Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{pg.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span>{pg.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Clock className="w-5 h-5" />
                    <span>{pg.distanceFromCollege}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">5.0 (24 reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">₹{pg.rent.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Sharing</p>
                  <p className="font-semibold">{pg.sharing}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deposit</p>
                  <p className="font-semibold">₹{pg.deposit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Food</p>
                  <p className="font-semibold">{pg.food}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="font-semibold">{pg.owner}</p>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Facilities & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pg.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {getFacilityIcon(facility)}
                    <span className="text-sm font-medium">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            {pg.testimonials && pg.testimonials.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h2>
                <div className="space-y-4">
                  {pg.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.course}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">{testimonial.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{testimonial.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Contact Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Owner</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{pg.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>Contact via inquiry form</span>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>

              {/* Inquiry Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Send Inquiry</h3>
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={inquiryData.name}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={inquiryData.email}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone"
                      value={inquiryData.phone}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      value={inquiryData.message}
                      onChange={handleInquiryChange}
                      rows={4}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                    Send Inquiry
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  By sending inquiry, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}