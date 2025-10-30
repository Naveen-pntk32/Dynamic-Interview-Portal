import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Users, 
  Star,
  Play,
  CheckCircle,
  Code,
  MessageSquare,
  Calculator,
  Brain
} from 'lucide-react';

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      icon: <Code className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Master coding interviews with comprehensive DSA preparation'
    },
    {
      id: 'aptitude',
      name: 'Aptitude & Reasoning',
      icon: <Calculator className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Quantitative aptitude and logical reasoning skills'
    },
    {
      id: 'communication',
      name: 'Communication Skills',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'Improve verbal and written communication for interviews'
    },
    {
      id: 'hr',
      name: 'HR & Behavioral',
      icon: <Brain className="w-6 h-6" />,
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

  const allCourses = Object.values(courses).flat();
  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CourseCard = ({ course }: { course: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardDescription className="mt-2">{course.description}</CardDescription>
          </div>
          {course.progress > 0 && (
            <Badge variant="secondary" className="ml-2">
              {course.progress}% Complete
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {course.duration}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.students.toLocaleString()}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {course.rating}
              </div>
            </div>
            <Badge className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Topics Covered:</p>
            <div className="flex flex-wrap gap-1">
              {course.topics.map((topic: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          {course.progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button className="flex-1">
              {course.progress > 0 ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Continue
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Course
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              Preview
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Course Library
          </h1>
          <p className="text-gray-600 mb-6">
            Comprehensive preparation materials to help you excel in interviews
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`${category.color} p-3 rounded-lg text-white`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="dsa">DSA</TabsTrigger>
            <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="hr">HR & Behavioral</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchTerm ? filteredCourses : allCourses).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dsa" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.dsa.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="aptitude" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.aptitude.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.communication.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hr" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.hr.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;