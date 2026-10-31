const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { HttpError } = require('../utils');

const router = express.Router();
const collation = { locale: 'en', strength: 2 };

const findCourse = (courseId) => Course.findOne({ courseId }).collation(collation);

// GET /api/courses
router.get('/', async (req, res) => {
  const courses = await Course.find().sort({ courseId: 1 }).collation(collation).lean();
  const counts = await Enrollment.aggregate([{ $group: { _id: '$course', count: { $sum: 1 } } }]);
  const byCourse = new Map(counts.map((c) => [String(c._id), c.count]));
  res.json(courses.map((c) => ({ ...c, enrollmentCount: byCourse.get(String(c._id)) || 0 })));
});

// POST /api/courses
router.post('/', async (req, res) => {
  const { courseId, name } = req.body || {};
  const course = await Course.create({ courseId, name });
  res.status(201).json({ message: 'Course added successfully', course });
});

// GET /api/courses/:courseId/students  -> roster of enrolled students
router.get('/:courseId/students', async (req, res) => {
  const course = await findCourse(req.params.courseId);
  if (!course) throw new HttpError(404, 'Course not found');
  const enrollments = await Enrollment.find({ course: course._id })
    .populate('student')
    .sort({ createdAt: 1 });
  const students = enrollments
    .filter((e) => e.student)
    .map((e) => ({ enrollmentId: e._id, enrolledAt: e.createdAt, ...e.student.toObject() }));
  res.json({ course, students });
});

// DELETE /api/courses/:courseId  (also removes the course's enrollments)
router.delete('/:courseId', async (req, res) => {
  const course = await findCourse(req.params.courseId);
  if (!course) throw new HttpError(404, 'Course not found');
  const { deletedCount } = await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();
  res.json({ message: 'Course deleted successfully', course, removedEnrollments: deletedCount });
});

module.exports = router;
