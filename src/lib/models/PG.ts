import mongoose, { Document, Schema } from 'mongoose';

interface IRoomType {
  type: 'single' | 'double' | 'triple' | 'dormitory';
  capacity: number;
  rent: number;
  available: number;
  description?: string;
}

interface IImage {
  url: string;
  caption?: string;
  isPrimary: boolean;
}

interface IAdditionalCharge {
  name: string;
  amount: number;
  description?: string;
}

interface IDocument {
  type: string;
  url: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface IPG extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
    nearbyLandmarks?: string[];
  };
  contact: {
    phone: string;
    email?: string;
    whatsapp?: string;
  };
  accommodation: {
    gender: 'male' | 'female' | 'mixed';
    totalRooms: number;
    availableRooms: number;
    roomTypes: IRoomType[];
  };
  pricing: {
    rent: number;
    securityDeposit: number;
    maintenanceCharges: number;
    electricityCharges: 'included' | 'extra' | 'per_unit';
    additionalCharges: IAdditionalCharge[];
  };
  facilities: {
    basic: {
      wifi: boolean;
      electricity: boolean;
      water: boolean;
      furniture: boolean;
      ac: boolean;
      fan: boolean;
      attached_bathroom: boolean;
      common_bathroom: boolean;
    };
    amenities: {
      kitchen: boolean;
      dining_hall: boolean;
      common_room: boolean;
      study_room: boolean;
      garden: boolean;
      terrace: boolean;
      parking: boolean;
      cctv: boolean;
      security_guard: boolean;
      laundry: boolean;
      power_backup: boolean;
    };
    services: {
      housekeeping: boolean;
      meal_service: boolean;
      tiffin_service: boolean;
      transport: boolean;
    };
  };
  images: IImage[];
  rules: {
    smoking: 'allowed' | 'not_allowed' | 'designated_area';
    alcohol: 'allowed' | 'not_allowed';
    visitors: 'allowed' | 'not_allowed' | 'restricted_hours';
    pets: 'allowed' | 'not_allowed';
    curfew?: string;
    additional: string[];
  };
  ratings: {
    average: number;
    count: number;
    breakdown: {
      cleanliness: number;
      security: number;
      location: number;
      facilities: number;
      value_for_money: number;
    };
  };
  reviews: mongoose.Types.ObjectId[];
  inquiries: mongoose.Types.ObjectId[];
  bookings: mongoose.Types.ObjectId[];
  status: 'active' | 'inactive' | 'suspended' | 'under_review';
  verification: {
    isVerified: boolean;
    verificationDate?: Date;
    documents: IDocument[];
  };
  features: {
    isFeatured: boolean;
    isPremium: boolean;
    badges: string[];
  };
  distance?: string;
  primaryImage: string | null;
  getAllFacilities(): string[];
}

const pgSchema = new Schema<IPG>({
  name: {
    type: String,
    required: [true, 'PG name is required'],
    trim: true,
    minlength: [3, 'PG name must be at least 3 characters long'],
    maxlength: [100, 'PG name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    nearbyLandmarks: [String]
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    whatsapp: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit WhatsApp number']
    }
  },
  accommodation: {
    gender: {
      type: String,
      enum: ['male', 'female', 'mixed'],
      required: [true, 'Gender preference is required']
    },
    totalRooms: {
      type: Number,
      required: [true, 'Total rooms is required'],
      min: [1, 'Total rooms must be at least 1']
    },
    availableRooms: {
      type: Number,
      required: [true, 'Available rooms is required'],
      min: [0, 'Available rooms cannot be negative']
    },
    roomTypes: [{
      type: {
        type: String,
        enum: ['single', 'double', 'triple', 'dormitory'],
        required: true
      },
      capacity: {
        type: Number,
        required: true,
        min: 1
      },
      rent: {
        type: Number,
        required: true,
        min: 0
      },
      available: {
        type: Number,
        required: true,
        min: 0
      },
      description: String
    }]
  },
  pricing: {
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
      min: [0, 'Rent cannot be negative']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative']
    },
    maintenanceCharges: {
      type: Number,
      default: 0,
      min: [0, 'Maintenance charges cannot be negative']
    },
    electricityCharges: {
      type: String,
      enum: ['included', 'extra', 'per_unit'],
      default: 'extra'
    },
    additionalCharges: [{
      name: String,
      amount: Number,
      description: String
    }]
  },
  facilities: {
    basic: {
      wifi: { type: Boolean, default: false },
      electricity: { type: Boolean, default: true },
      water: { type: Boolean, default: true },
      furniture: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      fan: { type: Boolean, default: true },
      attached_bathroom: { type: Boolean, default: false },
      common_bathroom: { type: Boolean, default: true }
    },
    amenities: {
      kitchen: { type: Boolean, default: false },
      dining_hall: { type: Boolean, default: false },
      common_room: { type: Boolean, default: false },
      study_room: { type: Boolean, default: false },
      garden: { type: Boolean, default: false },
      terrace: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      cctv: { type: Boolean, default: false },
      security_guard: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      power_backup: { type: Boolean, default: false }
    },
    services: {
      housekeeping: { type: Boolean, default: false },
      meal_service: { type: Boolean, default: false },
      tiffin_service: { type: Boolean, default: false },
      transport: { type: Boolean, default: false }
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  rules: {
    smoking: {
      type: String,
      enum: ['allowed', 'not_allowed', 'designated_area'],
      default: 'not_allowed'
    },
    alcohol: {
      type: String,
      enum: ['allowed', 'not_allowed'],
      default: 'not_allowed'
    },
    visitors: {
      type: String,
      enum: ['allowed', 'not_allowed', 'restricted_hours'],
      default: 'restricted_hours'
    },
    pets: {
      type: String,
      enum: ['allowed', 'not_allowed'],
      default: 'not_allowed'
    },
    curfew: String,
    additional: [String]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      cleanliness: { type: Number, default: 0 },
      security: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      facilities: { type: Number, default: 0 },
      value_for_money: { type: Number, default: 0 }
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  inquiries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inquiry'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'under_review'],
    default: 'active'
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    documents: [{
      type: String,
      url: String,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      }
    }]
  },
  features: {
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    badges: [String]
  },
  distance: String
}, {
  timestamps: true
});

// Index for efficient querying
pgSchema.index({ 'location.city': 1 });
pgSchema.index({ 'accommodation.gender': 1 });
pgSchema.index({ 'pricing.rent': 1 });
pgSchema.index({ status: 1 });
pgSchema.index({ 'features.isFeatured': 1 });
pgSchema.index({ 'ratings.average': -1 });

// Virtual for getting primary image
pgSchema.virtual('primaryImage').get(function(this: IPG) {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Method to get all facilities as array
pgSchema.methods.getAllFacilities = function(this: IPG): string[] {
  const facilities: string[] = [];
  
  // Add basic facilities
  Object.keys(this.facilities.basic).forEach(key => {
    if (this.facilities.basic[key as keyof typeof this.facilities.basic]) {
      facilities.push(key.replace('_', ' '));
    }
  });
  
  // Add amenities
  Object.keys(this.facilities.amenities).forEach(key => {
    if (this.facilities.amenities[key as keyof typeof this.facilities.amenities]) {
      facilities.push(key.replace('_', ' '));
    }
  });
  
  // Add services
  Object.keys(this.facilities.services).forEach(key => {
    if (this.facilities.services[key as keyof typeof this.facilities.services]) {
      facilities.push(key.replace('_', ' '));
    }
  });
  
  return facilities;
};

// Ensure only one primary image
pgSchema.pre('save', function(this: IPG, next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        if (index > 0 && img.isPrimary) {
          img.isPrimary = false;
        }
      });
    } else if (primaryImages.length === 0) {
      // Set first image as primary if none exists
      this.images[0].isPrimary = true;
    }
  }
  next();
});

export default mongoose.models.PG || mongoose.model<IPG>('PG', pgSchema);