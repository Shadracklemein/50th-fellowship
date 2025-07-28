const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'pastor', 'youth', 'choir', 'praise_and_worship'],
    default: 'member',
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema); 