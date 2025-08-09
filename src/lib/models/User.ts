import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'owner' | 'admin';
  profile: {
    avatar?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    occupation?: string;
    emergencyContact?: {
      name?: string;
      phone?: string;
      relationship?: string;
    };
  };
  preferences: {
    budget?: {
      min?: number;
      max?: number;
    };
    location?: string;
    gender?: 'male' | 'female' | 'any';
    facilities?: string[];
  };
  inquiries: mongoose.Types.ObjectId[];
  bookings: mongoose.Types.ObjectId[];
  isActive: boolean;
  lastLogin?: Date;
  emailVerified: boolean;
  emailVerificationToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user'
  },
  profile: {
    avatar: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    occupation: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  preferences: {
    budget: {
      min: Number,
      max: Number
    },
    location: String,
    gender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any'
    },
    facilities: [String]
  },
  inquiries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inquiry'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  return user;
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);