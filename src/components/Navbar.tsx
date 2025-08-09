'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, MessageCircle, Phone, User, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider?: string;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onLogin: () => void;
  onRegister: () => void;
  showUserProfile?: boolean;
  onShowUserProfile?: (show: boolean) => void;
  userInquiries?: any[];
  onShowAllInquiries?: () => void;
  onEditProfile?: () => void;
  currentPage?: string;
}

export default function Navbar({ 
  user, 
  onLogout, 
  onLogin, 
  onRegister, 
  showUserProfile = false,
  onShowUserProfile,
  userInquiries = [],
  onShowAllInquiries,
  onEditProfile,
  currentPage = 'home'
}: NavbarProps) {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold">
                PG RENTER
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/" 
                  className={`text-sm hover:text-black transition-colors ${
                    currentPage === 'home' ? 'text-black font-medium' : 'text-gray-700'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/browse" 
                  className={`text-sm hover:text-black transition-colors ${
                    currentPage === 'browse' ? 'text-black font-medium' : 'text-gray-700'
                  }`}
                >
                  Search PGs
                </Link>
                <Link 
                  href="/about" 
                  className={`text-sm hover:text-black transition-colors ${
                    currentPage === 'about' ? 'text-black font-medium' : 'text-gray-700'
                  }`}
                >
                  About
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onShowUserProfile?.(!showUserProfile)}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 rounded-full px-4 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-blue-900 hidden sm:block">
                      {user.name}
                    </span>
                  </button>
                  <button 
                    onClick={onLogout}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={onLogin}
                    className="text-sm text-gray-700 hover:text-black font-medium"
                  >
                    Login
                  </button>
                  <button 
                    onClick={onRegister}
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

      {/* User Profile Modal */}
      {showUserProfile && user && onShowUserProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  {user.phone && (
                    <p className="text-gray-600 text-sm">📞 {user.phone}</p>
                  )}
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mt-1">
                    Student
                  </span>
                </div>
              </div>
              <button
                onClick={() => onShowUserProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
              {/* Profile Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{userInquiries.length}</div>
                  <div className="text-sm text-blue-700">Total Inquiries</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{userInquiries.length}</div>
                  <div className="text-sm text-orange-700">Pending</div>
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Inquiries</h3>
                
                {userInquiries.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No inquiries yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userInquiries.slice(0, 3).map((inquiry) => (
                      <div key={inquiry.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{inquiry.pgName}</h4>
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {inquiry.location}
                            </p>
                          </div>
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                            Pending
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mb-1">"{inquiry.message}"</p>
                        <p className="text-xs text-gray-500">
                          {new Date(inquiry.inquiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-4 space-y-3">
                <button
                  onClick={onEditProfile}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </button>
                <Link 
                  href="/browse"
                  onClick={() => onShowUserProfile(false)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Browse More PGs
                </Link>
                
                {userInquiries.length > 0 && (
                  <button
                    onClick={onShowAllInquiries}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Show All Inquiries
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}