'use client'

import React, { useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface InquirySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  pgName: string;
}

export default function InquirySuccessModal({ isOpen, onClose, pgName }: InquirySuccessModalProps) {
  // Auto-close after 5 seconds, but allow user to close manually
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full text-center p-8 shadow-2xl animate-pulse-once">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-green-200 animate-ping"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Inquiry Sent!</h2>
        <p className="text-gray-600 mb-4">
          Your inquiry for <strong className="text-green-600">{pgName}</strong> has been sent successfully. 
        </p>
        <p className="text-sm text-gray-500 mb-6">
          The PG owner will contact you shortly. You can view your inquiry in your profile.
        </p>
        
        {/* Auto-close progress bar */}
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-1 mb-2">
            <div className="bg-green-500 h-1 rounded-full animate-progress" style={{
              animation: 'progress 5s linear forwards'
            }}></div>
          </div>
          <p className="text-xs text-gray-400">Auto-closing in 5 seconds</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors transform hover:scale-105"
        >
          Done
        </button>
      </div>
    </div>
  );
}
