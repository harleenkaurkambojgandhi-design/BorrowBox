import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema for BorrowBox system
 * Stores user information including profile details and ratings
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    enum: [
      'Turing',
      'Turing Extension',
      'Edison',
      'Architecture',
      'Rockefeller',
      'Rockefeller Extension',
      'Martin Luther',
      'Darwin',
      'Newton',
      'Tesla',
      'Galileo',
      'Fleming'
    ]
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalRatingSum: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update rating method
userSchema.methods.updateRating = function(newRating) {
  this.totalRatings += 1;
  this.totalRatingSum += newRating;
  this.rating = this.totalRatingSum / this.totalRatings;
};

export default mongoose.model('User', userSchema);