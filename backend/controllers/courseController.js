const Course = require('../models/courseModel');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    }
    catch (error) {
        console.error("Get all courses error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message: "Course not found"});
        }
        res.json(course);
    }
    catch (error) {
        console.error("Get course by ID error:", error);
        res.status(500).json({message: "Server error"});
    }   
}

exports.addCourse = async (req, res) => {
    try {
        const {title, categoryId, description, duration, level, topics} = req.body; 
        if(!title || !categoryId || !description || !duration || !level || !topics){
            return res.status(400).json({message: "All fields are required"});
        }
        const newCourse = new Course({
            title,
            categoryId,
            description,
            duration,
            level,
            topics
        });
        await newCourse.save();
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error("Add course error:", error);
        res.status(500).json({message: "Server error"});
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const {courseId} = req.params; 
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if(!deletedCourse){
            return res.status(404).json({message: "Course not found"});
        }
        res.json({message: "Course deleted successfully"});
    }
    catch (error) {
        console.error("Delete course error:", error);
        res.status(500).json({message: "Server error"});
    }
}