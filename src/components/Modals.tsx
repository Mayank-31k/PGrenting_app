'use client'

import React from 'react';
import InquiryModal from './InquiryModal';
import AllInquiriesModal from './AllInquiriesModal';
import { PGData } from '@/data/sampleData';

interface ModalsProps {
  selectedPg: PGData | null;
  isEnquiryModalOpen: boolean;
  closeEnquiryModal: () => void;
  handleInquirySubmitted: (newInquiry: any) => void;
  showAllInquiries: boolean;
  closeAllInquiriesModal: () => void;
  userInquiries: any[];
}

export default function Modals({ selectedPg, isEnquiryModalOpen, closeEnquiryModal, handleInquirySubmitted, showAllInquiries, closeAllInquiriesModal, userInquiries }: ModalsProps) {
  return (
    <>
      {selectedPg && (
        <InquiryModal
          pg={selectedPg}
          isOpen={isEnquiryModalOpen}
          onClose={closeEnquiryModal}
          onInquirySubmitted={handleInquirySubmitted}
        />
      )}

      <AllInquiriesModal
        isOpen={showAllInquiries}
        onClose={closeAllInquiriesModal}
        inquiries={userInquiries}
      />
    </>
  );
}
