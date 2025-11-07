const express = require('express');
const router = express.Router();
const {getAllCategories, getCategoryById, addCategory, deleteCategory} = require('../controllers/categoryController');
const {getAllCourses, getCourseById, addCourse, deleteCourse} = require('../controllers/courseController');
const { route } = require('./userRoutes');

router.get('/categories', getAllCategories);
router.get('/categories/:categoryId', getCategoryById);
router.post('/categories', addCategory);
router.delete('/categories/:categoryId', deleteCategory);

router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);
router.post('/', addCourse);
router.delete('/:courseId', deleteCourse);

module.exports = router;