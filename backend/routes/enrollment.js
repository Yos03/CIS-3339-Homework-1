const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { HttpError } = require('../utils');

const router = express.Router();
const collation = { locale: 'en', strength: 2 };

// GET /api/enrollments  -> all enrollments with student and course details
router.get('/', async (req, res) => {
  const enrollments = await Enrollment.find().populate('student').populate('course').sort({ createdAt: -1 });
  res.json(enrollments.filter((e) => e.student && e.course));
});

// POST /api/enrollments  { studentId, courseId }  (business IDs, not ObjectIds)
router.post('/', async (req, res) => {
  const { studentId, courseId } = req.body || {};
  if (typeof studentId !== 'string' || !studentId.trim() || typeof courseId !== 'string' || !courseId.trim()) {
    throw new HttpError(400, 'Both a student and a course must be selected', {
      ...(!studentId && { studentId: 'Select a student' }),
      ...(!courseId && { courseId: 'Select a course' }),
    });
  }
  const [student, course] = await Promise.all([
    Student.findOne({ studentId: studentId.trim() }),
    Course.findOne({ courseId: courseId.trim() }).collation(collation),
  ]);
  if (!student) throw new HttpError(404, 'Student not found');
  if (!course) throw new HttpError(404, 'Course not found');

  try {
    const enrollment = await Enrollment.create({ student: student._id, course: course._id });
    res.status(201).json({
      message: `${student.name} enrolled in ${course.courseId}`,
      enrollment: { _id: enrollment._id, student, course, createdAt: enrollment.createdAt },
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new HttpError(409, `${student.name} is already enrolled in ${course.courseId}`);
    }
    throw err;
  }
});

// DELETE /api/enrollments/:id
router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(404, 'Enrollment not found');
  const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
  if (!enrollment) throw new HttpError(404, 'Enrollment not found');
  res.json({ message: 'Enrollment removed successfully' });
});

module.exports = router;
