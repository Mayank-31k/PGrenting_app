'use client'

import React from 'react';
import { X, MapPin, MessageCircle } from 'lucide-react';

interface AllInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: any[];
}

export default function AllInquiriesModal({ isOpen, onClose, inquiries }: AllInquiriesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">All Inquiries</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {inquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold">No Inquiries Yet</h3>
              <p className="text-sm">You haven't made any inquiries yet. Start exploring PGs and make your first inquiry!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{inquiry.pgName}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {inquiry.location}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      inquiry.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      inquiry.status === 'responded' ? 'bg-blue-100 text-blue-700' :
                      inquiry.status === 'visited' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">"{inquiry.message}"</p>
                  <p className="text-xs text-gray-500">
                    {new Date(inquiry.inquiryDate).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
