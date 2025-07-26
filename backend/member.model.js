const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  baptismStatus: { type: String },
  baptismDate: { type: String },
  previousChurch: { type: String },
  ministryInterests: { type: String },
  emergencyContact: { type: String },
  emergencyPhone: { type: String },
  occupation: { type: String },
  maritalStatus: { type: String },
  spouseName: { type: String },
  children: { type: String },
  howDidYouHear: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to always trim and lowercase email
memberSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema); 