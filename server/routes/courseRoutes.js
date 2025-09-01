import express from 'express';
import { 
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCategories
} from '../controllers/courseController.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/categories', getCourseCategories);
router.get('/:id', getCourseById);
router.post('/', validate('createCourse'), createCourse);
router.put('/:id', validate('createCourse'), updateCourse);
router.delete('/:id', deleteCourse);

export default router;
