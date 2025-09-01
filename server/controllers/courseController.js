import { Course } from "../models/Course.js";
import { validationResult } from "express-validator";

export const getAllCourses = async (req, res) => {
  try {
    const { category, limit = 50, offset = 0 } = req.query;
    
    let courses;
    if (category) {
      courses = await Course.findByCategory(category);
    } else {
      courses = await Course.findAll();
    }

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = courses.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        courses: paginatedCourses,
        pagination: {
          total: courses.length,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: endIndex < courses.length,
        },
      },
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(parseInt(id));

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Parse JSON fields if they exist
    if (course.syllabus && typeof course.syllabus === 'string') {
      try {
        course.syllabus = JSON.parse(course.syllabus);
      } catch (e) {
        // Keep as string if not valid JSON
      }
    }

    if (course.prerequisites && typeof course.prerequisites === 'string') {
      try {
        course.prerequisites = JSON.parse(course.prerequisites);
      } catch (e) {
        // Keep as string if not valid JSON
      }
    }

    res.json({
      success: true,
      data: {
        course,
      },
    });
  } catch (error) {
    console.error("Get course by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      title,
      description,
      duration,
      difficulty,
      category,
      imageUrl,
      syllabus,
      prerequisites,
    } = req.body;

    const course = await Course.create({
      title,
      description,
      duration,
      difficulty,
      category,
      imageUrl,
      syllabus: Array.isArray(syllabus) ? syllabus : [syllabus],
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [prerequisites],
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: {
        course,
      },
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const {
      title,
      description,
      duration,
      difficulty,
      category,
      imageUrl,
      syllabus,
      prerequisites,
    } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const updatedCourse = await Course.update(parseInt(id), {
      title,
      description,
      duration,
      difficulty,
      category,
      imageUrl,
      syllabus: Array.isArray(syllabus) ? syllabus : [syllabus],
      prerequisites: Array.isArray(prerequisites) ? prerequisites : [prerequisites],
    });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const deletedCourse = await Course.delete(parseInt(id));

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
      data: {
        course: deletedCourse,
      },
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourseCategories = async (req, res) => {
  try {
    // This could be dynamic from database or static list
    const categories = [
      "Web Development",
      "Mobile Development",
      "Data Science",
      "Machine Learning",
      "DevOps",
      "Cloud Computing",
      "Cybersecurity",
      "UI/UX Design",
      "Database",
      "Programming Languages",
    ];

    res.json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Get course categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
