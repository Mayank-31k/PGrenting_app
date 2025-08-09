'use client'

import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, User, Calendar, MessageSquare } from 'lucide-react';
import type { PGData } from '@/data/sampleData';
import InquirySuccessModal from './InquirySuccessModal';

interface InquiryModalProps {
  pg: PGData;
  isOpen: boolean;
  onClose: () => void;
  onInquirySubmitted: (newInquiry: any) => void;
}

export default function InquiryModal({ pg, isOpen, onClose, onInquirySubmitted }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: '',
    interestedInSharing: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setShowSuccessModal(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Name and phone number are required.');
      return;
    }

    if (formData.phone.trim().length < 10) {
      setError('Phone number must be at least 10 digits.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to submit an inquiry.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pgId: pg.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          inquiryType: 'general',
          preferredVisitDate: formData.moveInDate
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Inquiry submitted successfully:', responseData);
        
        // Only show success modal if we have proper response data
        if (responseData && responseData.message && responseData.inquiry) {
          setShowSuccessModal(true);
          onInquirySubmitted(responseData);
          
          // Clear form only after confirmed success
          setFormData({
            name: '',
            email: '',
            phone: '',
            moveInDate: '',
            message: '',
            interestedInSharing: '',
          });
        } else {
          setError('Inquiry may not have been submitted properly. Please try again.');
        }
      } else {
        console.error('Inquiry submission failed:', response.status, responseData);
        setError(responseData.error || `Failed to submit inquiry (${response.status})`);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inquire About {pg.name}</h2>
            <p className="text-gray-600 mt-1">Fill out the form below and we'll get back to you soon</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PG Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-16 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${pg.image})` }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{pg.name}</h3>
              <p className="text-sm text-gray-600">{pg.location}</p>
              <p className="text-sm font-medium text-green-600">₹{pg.rent.toLocaleString()}/month</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email (optional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Preferred Move-in Date
              </label>
              <input
                type="date"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Sharing Preference
            </label>
            <select
              name="interestedInSharing"
              value={formData.interestedInSharing}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select your preference</option>
              <option value="single">Single Occupancy</option>
              <option value="double">Double Sharing</option>
              <option value="triple">Triple Sharing</option>
              <option value="any">Any Available</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Additional Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Any specific questions or requirements?"
            />
          </div>

          {/* Contact Info */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">PG Owner Contact</h4>
            <div className="space-y-1 text-sm text-green-800">
              <p>📞 {pg.phone}</p>
              <p>👤 {pg.owner}</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="pt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="text-red-400 mr-2">⚠️</div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Inquiry...
                </div>
              ) : (
                'Submit Inquiry'
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By submitting this form, you agree to be contacted by the PG owner regarding your inquiry.
          </p>
        </form>
      </div>

      {/* Success Modal - only show when success modal is active */}
      {showSuccessModal && (
        <InquirySuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            onClose(); // Close the main inquiry modal after success modal closes
          }}
          pgName={pg.name}
        />
      )}
    </div>
  );
}