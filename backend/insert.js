const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const dbConnect = require('./config/db.js');
const dotenvResult = dotenv.config();

if (dotenvResult.error) {
    console.error('Error loading .env file', dotenvResult.error);
    process.exit(1);
}

dbConnect();
const categories = [
    {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        icon: '<Code className="w-6 h-6" />',
        color: 'bg-blue-500',
        description: 'Master coding interviews with comprehensive DSA preparation'
    },
    {
        id: 'aptitude',
        name: 'Aptitude & Reasoning',
        icon: '<Calculator className="w-6 h-6" />',
        color: 'bg-green-500',
        description: 'Quantitative aptitude and logical reasoning skills'
    },
    {
        id: 'communication',
        name: 'Communication Skills',
        icon: '<MessageSquare className="w-6 h-6" />',
        color: 'bg-purple-500',
        description: 'Improve verbal and written communication for interviews'
    },
    {
        id: 'hr',
        name: 'HR & Behavioral',
        icon: '<Brain className="w-6 h-6" />',
        color: 'bg-orange-500',
        description: 'Common HR questions and behavioral interview techniques'
    }
];

const courses = {
    dsa: [
        {
        id: 1,
        title: 'Arrays and Strings Mastery',
        description: 'Complete guide to array and string manipulation problems',
        duration: '3 weeks',
        level: 'Beginner',
        students: 1234,
        rating: 4.8,
        topics: ['Array Basics', 'Two Pointers', 'Sliding Window', 'String Algorithms'],
        progress: 0
        },
        {
        id: 2,
        title: 'Advanced Tree Algorithms',
        description: 'Binary trees, BST, AVL trees, and advanced tree problems',
        duration: '4 weeks',
        level: 'Intermediate',
        students: 856,
        rating: 4.9,
        topics: ['Binary Trees', 'BST Operations', 'Tree Traversals', 'Balanced Trees'],
        progress: 25
        },
        {
        id: 3,
        title: 'Dynamic Programming Deep Dive',
        description: 'Master DP patterns and solve complex optimization problems',
        duration: '5 weeks',
        level: 'Advanced',
        students: 567,
        rating: 4.7,
        topics: ['DP Fundamentals', 'Memoization', 'Tabulation', 'Advanced Patterns'],
        progress: 0
        }
    ],
    aptitude: [
        {
        id: 4,
        title: 'Quantitative Aptitude Fundamentals',
        description: 'Basic math concepts for competitive exams and interviews',
        duration: '2 weeks',
        level: 'Beginner',
        students: 2341,
        rating: 4.6,
        topics: ['Arithmetic', 'Algebra', 'Geometry', 'Statistics'],
        progress: 60
        },
        {
        id: 5,
        title: 'Logical Reasoning Mastery',
        description: 'Develop logical thinking and problem-solving skills',
        duration: '3 weeks',
        level: 'Intermediate',
        students: 1876,
        rating: 4.5,
        topics: ['Pattern Recognition', 'Syllogisms', 'Analogies', 'Critical Reasoning'],
        progress: 0
        }
    ],
    communication: [
        {
        id: 6,
        title: 'Effective Interview Communication',
        description: 'Master the art of clear and confident communication',
        duration: '2 weeks',
        level: 'Beginner',
        students: 3456,
        rating: 4.8,
        topics: ['Body Language', 'Voice Modulation', 'Active Listening', 'Presentation Skills'],
        progress: 80
        },
        {
        id: 7,
        title: 'Technical Communication Skills',
        description: 'Explain complex technical concepts clearly and concisely',
        duration: '3 weeks',
        level: 'Intermediate',
        students: 1234,
        rating: 4.7,
        topics: ['Technical Explanations', 'Code Walkthroughs', 'System Design Communication', 'Documentation'],
        progress: 0
        }
    ],
    hr: [
        {
        id: 8,
        title: 'Common HR Interview Questions',
        description: 'Prepare for the most frequently asked HR questions',
        duration: '1 week',
        level: 'Beginner',
        students: 4567,
        rating: 4.9,
        topics: ['Tell Me About Yourself', 'Strengths & Weaknesses', 'Career Goals', 'Situational Questions'],
        progress: 100
        },
        {
        id: 9,
        title: 'Behavioral Interview Mastery',
        description: 'STAR method and behavioral question strategies',
        duration: '2 weeks',
        level: 'Intermediate',
        students: 2345,
        rating: 4.6,
        topics: ['STAR Method', 'Leadership Examples', 'Conflict Resolution', 'Team Collaboration'],
        progress: 40
        }
    ]
};

courses