const Course = require('../models/courseModel');
const CourseProgress = require('../models/courseProgressModel');
const { addCategoryCourses, deleteCategoryCourses } = require('./categoryController');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.aggregate([
            {
                $lookup: {
                    from: 'courseprogresses',
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'enrollments'
                }
            },
            {
                $addFields: {
                    completedEnrollments: {
                        $filter: {
                            input: "$enrollments",
                            as: "enr",
                            cond: { $eq: ["$$enr.progress", 100] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    students: { $size: '$completedEnrollments' },
                    calculatedRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$completedEnrollments" }, 0] },
                            then: { $divide: [{ $avg: "$completedEnrollments.score" }, 20] },
                            else: 0
                        }
                    }
                }
            },
            {
                $addFields: {
                    rating: { $cond: { if: { $gt: ["$calculatedRating", 0] }, then: { $round: ["$calculatedRating", 1] }, else: "$rating" } }
                }
            },
            {
                $project: {
                    enrollments: 0,
                    completedEnrollments: 0,
                    calculatedRating: 0
                }
            }
        ]);

        // Populate createdAt from _id if missing (since schema didn't have timestamps: true initially)
        const coursesWithDate = courses.map(course => ({
            ...course,
            createdAt: course.createdAt || course._id.getTimestamp()
        }));

        res.json(coursesWithDate);
    }
    catch (error) {
        console.error("Get all courses error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    }
    catch (error) {
        console.error("Get course by ID error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.addCourse = async (req, res) => {
    try {
        const { title, categoryId, description, duration, level, topics } = req.body;
        if (!title || !categoryId || !description || !duration || !level || !topics) {
            return res.status(400).json({ message: "All fields are required" });
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

        await addCategoryCourses(categoryId, newCourse._id);
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error("Add course error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        await deleteCategoryCourses(deletedCourse.categoryId, deletedCourse._id);
        res.json({ message: "Course deleted successfully" });
    }
    catch (error) {
        console.error("Delete course error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required" });
        }

        const progress = await CourseProgress.find({ userId }).populate('courseId');
        res.json(progress);
    } catch (error) {
        console.error("Get user course progress error:", error);
        res.status(500).json({ message: "Server error" });
    }
}