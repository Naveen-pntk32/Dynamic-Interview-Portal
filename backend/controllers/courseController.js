const Category = require('../models/categoryModel.js');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    }
    catch (error) {
        console.error("Get all categories error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.addCategory = async (req, res) => {
    try {
        const {id, name, icon, color, description} = req.body;
        if(!id || !name || !icon || !color || !description){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingCategory = await Category.findOne({id});
        if(existingCategory){
            return res.status(409).json({message: "Category with this ID already exists"});
        }
        const newCategory = new Category({
            id,
            name,
            icon,
            color,
            description
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    }
    catch (error) {
        console.error("Add category error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const {categoryId} = req.params;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if(!deletedCategory){
            return res.status(404).json({message: "Category not found"});
        }
        res.json({message: "Category deleted successfully"});
    }
    catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({message: "Server error"});
    }
}