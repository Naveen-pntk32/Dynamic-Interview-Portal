const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;