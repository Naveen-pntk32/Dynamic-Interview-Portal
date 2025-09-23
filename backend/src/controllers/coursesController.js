const Course = require('../models/Course');

// POST /courses (admin)
async function createCourse(req, res) {
  try {
    const course = await Course.create(req.body);
    return res.status(201).json({ success: true, message: 'Course created', data: course });
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Create failed', data: { error: e.message } });
  }
}

// GET /courses
async function listCourses(req, res) {
  const courses = await Course.find();
  return res.json({ success: true, message: 'Courses fetched', data: courses });
}

// GET /courses/:id
async function getCourse(req, res) {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Not found' });
  return res.json({ success: true, message: 'Course fetched', data: course });
}

// PUT /courses/:id (admin)
async function updateCourse(req, res) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, message: 'Course updated', data: course });
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Update failed', data: { error: e.message } });
  }
}

// DELETE /courses/:id (admin)
async function deleteCourse(req, res) {
  try {
    await Course.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Course deleted' });
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Delete failed', data: { error: e.message } });
  }
}

module.exports = { createCourse, listCourses, getCourse, updateCourse, deleteCourse };


