import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { coursesApi, type Course, type Category } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Users, 
  Star,
  Play,
  Code,
  MessageSquare,
  Calculator,
  Brain,
  Loader2
} from 'lucide-react';

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [coursesByCategory, setCoursesByCategory] = useState<Record<string, Course[]>>({});
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState('all');

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData: Category[] = await coursesApi.getCategories();
        setCategories(categoriesData);
        
        const mapping: Record<string, Course[]> = {};
        const allCourses: Course[] = await coursesApi.getAllCourses();
        
        categoriesData.forEach(category => {
          for (const course of allCourses) {
            // console.log(category.coursesId, course._id);
            if (category.coursesId?.includes(String(course._id))) {
              if (!mapping[category.id]) {
                mapping[category.id] = [];
              }
              mapping[category.id].push(course);
            }
          }
        });
        
        setCoursesByCategory(mapping);

        // If user is logged in, fetch their progress
        if (user) {
          const progressData = await coursesApi.getUserProgress();
          setUserProgress(progressData);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'code': return <Code className="w-6 h-6" />;
      case 'calculator': return <Calculator className="w-6 h-6" />;
      case 'message-square': return <MessageSquare className="w-6 h-6" />;
      case 'brain': return <Brain className="w-6 h-6" />;
      default: return <Code className="w-6 h-6" />;
    }
  };

  const handleStartCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to start a course.",
        variant: "default"
      });
      return;
    }

    try {
      await coursesApi.startCourse(courseId);
      toast({
        title: "Success",
        description: "Course started successfully!",
        variant: "default"
      });
      // Refresh progress
      const progressData = await coursesApi.getUserProgress();
      setUserProgress(progressData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start course. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // derive flattened course lists from fetched mapping
  const allCourses: Course[] = Object.values(coursesByCategory).flat();
  const filteredCourses = allCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCoursesByCategory = (categoryId: string) => {
    if (categoryId === 'all') return (searchTerm ? filteredCourses : allCourses);
    const list = coursesByCategory[categoryId] || [];
    return list.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CourseCard = ({ course, onStart }: { course: Course, onStart?: () => void }) => (
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
            <Button className="flex-1" onClick={onStart}>
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
                  <div className={`${category.color || 'bg-gray-400'} p-3 rounded-lg text-white`}>
                    {getIconComponent(category.icon || 'code')}
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
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>{cat.name}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchTerm ? filteredCourses : allCourses).map((course) => {
                const idKey = String(course._id);
                const displayCourse: Course = { ...course, progress: userProgress[idKey] ?? (course.progress ?? 0) } as Course;
                return <CourseCard key={idKey} course={displayCourse} onStart={() => handleStartCourse(idKey)} />;
              })}
            </div>
          </TabsContent>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCoursesByCategory(cat.id).map((course) => {
                  const idKey = String(course._id);
                  const displayCourse: Course = { ...course, progress: userProgress[idKey] ?? (course.progress ?? 0) } as Course;
                  return <CourseCard key={idKey} course={displayCourse} onStart={() => handleStartCourse(idKey)} />;
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;