const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      trim: true,
      maxlength: 30,
    },
    name: { type: String, required: [true, 'Course name is required'], trim: true, maxlength: 150 },
  },
  { timestamps: true }
);

// Course IDs are unique regardless of letter case ("cis 3339" == "CIS 3339").
courseSchema.index({ courseId: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model('Course', courseSchema);
