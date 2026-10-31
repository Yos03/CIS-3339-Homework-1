const express = require('express');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const { HttpError, escapeRegex } = require('../utils');

const router = express.Router();

// GET /api/students?search=term  -> list students, optionally filtered by name or student ID
router.get('/', async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { studentId: rx }];
  }
  const students = await Student.find(filter).sort({ name: 1, studentId: 1 });
  res.json(students);
});

// GET /api/students/:studentId
router.get('/:studentId', async (req, res) => {
  const student = await Student.findOne({ studentId: req.params.studentId });
  if (!student) throw new HttpError(404, 'Student not found');
  res.json(student);
});

// POST /api/students
router.post('/', async (req, res) => {
  const { name, studentId, phone, zip } = req.body || {};
  const student = await Student.create({ name, studentId, phone, zip });
  res.status(201).json({ message: 'Student added successfully', student });
});

// DELETE /api/students/:studentId  (also removes the student's enrollments)
router.delete('/:studentId', async (req, res) => {
  const student = await Student.findOne({ studentId: req.params.studentId });
  if (!student) throw new HttpError(404, 'Student not found');
  // Remove enrollments first so a failure never leaves orphaned enrollments behind.
  const { deletedCount } = await Enrollment.deleteMany({ student: student._id });
  await student.deleteOne();
  res.json({ message: 'Student deleted successfully', student, removedEnrollments: deletedCount });
});

module.exports = router;
