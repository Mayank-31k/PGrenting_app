const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
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
  distance: String // This will be calculated dynamically based on user location
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
pgSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Method to get all facilities as array
pgSchema.methods.getAllFacilities = function() {
  const facilities = [];
  
  // Add basic facilities
  Object.keys(this.facilities.basic).forEach(key => {
    if (this.facilities.basic[key]) {
      facilities.push(key.replace('_', ' '));
    }
  });
  
  // Add amenities
  Object.keys(this.facilities.amenities).forEach(key => {
    if (this.facilities.amenities[key]) {
      facilities.push(key.replace('_', ' '));
    }
  });
  
  // Add services
  Object.keys(this.facilities.services).forEach(key => {
    if (this.facilities.services[key]) {
      facilities.push(key.replace('_', ' '));
    }
  });
  
  return facilities;
};

// Ensure only one primary image
pgSchema.pre('save', function(next) {
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

module.exports = mongoose.model('PG', pgSchema);