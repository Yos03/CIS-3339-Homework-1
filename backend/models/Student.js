const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      trim: true,
      maxlength: 30,
      match: [/^[A-Za-z0-9-]+$/, 'Student ID may contain only letters, numbers, and hyphens'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\d\s()+.-]{7,20}$/, 'Phone number must be 7-20 characters (digits, spaces, + - . ( ))'],
    },
    zip: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true,
      match: [/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits (or ZIP+4)'],
    },
  },
  { timestamps: true }
);

studentSchema.index({ name: 1 });

module.exports = mongoose.model('Student', studentSchema);
