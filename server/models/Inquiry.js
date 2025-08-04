const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  pg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG',
    required: [true, 'PG is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    }
  },
  inquiryType: {
    type: String,
    enum: ['visit', 'availability', 'pricing', 'facilities', 'general'],
    required: [true, 'Inquiry type is required']
  },
  preferredVisitDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Preferred visit date must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'visited', 'closed'],
    default: 'pending'
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  followUp: [{
    message: String,
    from: {
      type: String,
      enum: ['user', 'owner'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for efficient querying
inquirySchema.index({ user: 1 });
inquirySchema.index({ pg: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });

// Method to mark as read
inquirySchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Method to add response
inquirySchema.methods.addResponse = function(message, respondedBy) {
  this.response = {
    message,
    respondedBy,
    respondedAt: new Date()
  };
  this.status = 'responded';
  return this.save();
};

// Method to add follow-up
inquirySchema.methods.addFollowUp = function(message, from) {
  this.followUp.push({
    message,
    from,
    timestamp: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Inquiry', inquirySchema);