const router = require('express').Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createCourse, listCourses, getCourse, updateCourse, deleteCourse } = require('../controllers/coursesController');

router.get('/', auth, listCourses);
router.get('/:id', auth, getCourse);

router.post('/', auth, roleCheck('admin'), createCourse);
router.put('/:id', auth, roleCheck('admin'), updateCourse);
router.delete('/:id', auth, roleCheck('admin'), deleteCourse);

module.exports = router;


