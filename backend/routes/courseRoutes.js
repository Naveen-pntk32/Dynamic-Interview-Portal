const express = require('express');
const router = express.Router();
const {getAllCategories, addCategory, deleteCategory} = require('../controllers/courseController');

router.get('/', (req, res) => {
    res.send("Course router");
});

router.get('/categories', getAllCategories);
router.post('/categories', addCategory);
router.delete('/categories/:categoryId', deleteCategory);

module.exports = router;