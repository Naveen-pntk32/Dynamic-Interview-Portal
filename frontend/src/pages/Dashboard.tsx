import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Clock,
  BookOpen,
  Trophy,
  TrendingUp,
  Play,
  History,
  Star,
  Target,
  Users
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [courseStats, setCourseStats] = React.useState({ completed: 0, avgScore: 0, timeSpent: 0, inProgress: [] as any[] });

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  React.useEffect(() => {
    const fetchProgress = async () => {
      if (user?.id) {
        try {
          const api = await import('../lib/api');
          const data = await api.coursesApi.getUserProgress(user.id);

          const inProgress = data.filter((p: any) => p.progress > 0 && p.progress < 100).map((p: any, index: number) => ({
            id: p._id || index,
            title: p.courseId?.title || 'Unknown Course',
            date: p.lastAccessedAt || p.startedAt,
            type: 'Course',
            score: p.progress,
            status: 'In Progress'
          }));

          const completed = data.filter((p: any) => p.progress === 100);
          const totalCompleted = completed.length;
          const totalScore = completed.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
          const avgScore = totalCompleted > 0 ? Math.round(totalScore / totalCompleted) : 0;
          const timeSpent = completed.reduce((acc: number, curr: any) => acc + (curr.timeSpentSeconds || 0), 0);

          setCourseStats({
            completed: totalCompleted,
            avgScore,
            timeSpent,
            inProgress
          });

        } catch (error) {
          console.error("Failed to fetch course progress:", error);
        }
      }
    };
    fetchProgress();
  }, [user]);

  const hasInterviews = courseStats.completed > 0 || courseStats.inProgress.length > 0;

  const upcomingInterviews = [
    {
      id: 1,
      title: 'Technical Interview - Frontend',
      company: 'TechCorp',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Video'
    },
    {
      id: 2,
      title: 'HR Round - Communication',
      company: 'StartupXYZ',
      date: '2024-01-18',
      time: '2:30 PM',
      type: 'Text'
    }
  ];

  // Use in-progress courses for recent activity
  const recentHistory = courseStats.inProgress.length > 0
    ? courseStats.inProgress.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
    : [];

  const recommendedCourses = [
    {
      id: 1,
      title: 'Advanced Data Structures',
      category: 'DSA',
      difficulty: 'Intermediate',
      duration: '4 weeks'
    },
    {
      id: 2,
      title: 'Communication Skills',
      category: 'Soft Skills',
      difficulty: 'Beginner',
      duration: '2 weeks'
    },
    {
      id: 3,
      title: 'System Design Interview',
      category: 'Technical',
      difficulty: 'Advanced',
      duration: '6 weeks'
    }
  ];

  const stats = [
    {
      title: 'Completed Courses',
      value: courseStats.completed.toString(),
      change: hasInterviews ? '+1 this week' : 'Start your first!',
      icon: <Target className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      title: 'Average Score',
      value: `${courseStats.avgScore}%`,
      change: hasInterviews ? '+5% improvement' : 'No data yet',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-green-600'
    },
    {
      title: 'Total Time Spent',
      value: formatTime(courseStats.timeSpent),
      change: 'Keep learning',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-purple-600'
    },
    {
      title: 'Streak Days',
      value: '0',
      change: 'Start today!',
      icon: <Star className="w-4 h-4" />,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {hasInterviews ? `Welcome back, ${user?.username}!` : `Hello, ${user?.username}!`}
          </h1>
          <p className="text-gray-600 mt-2">
            {hasInterviews ? 'Ready to continue your interview preparation journey?' : 'Start your interview'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Jump right into your preparation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/start-interview">
                    <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Play className="w-6 h-6" />
                      <span>Start Interview</span>
                    </Button>
                  </Link>
                  <Link to="/courses">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <BookOpen className="w-6 h-6" />
                      <span>Browse Courses</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Interviews
                </CardTitle>
                <CardDescription>
                  Your scheduled practice sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{interview.title}</h4>
                        <p className="text-sm text-gray-600">{interview.company}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {interview.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {interview.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{interview.type}</Badge>
                        <Button size="sm">Join</Button>
                      </div>
                    </div>
                  ))}
                  {upcomingInterviews.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No upcoming interviews. Schedule one to get started!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Recent Activity
                  </div>
                  <Link to="/history">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentHistory.map((item: any, index: number) => (
                    <div key={item.id || item._id || index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.type}</Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{item.score}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentHistory.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No recent activity. Start your first interview!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Technical Skills</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Communication</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Recommended
                  </div>
                  <Link to="/courses">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendedCourses.map((course) => (
                    <div key={course.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium text-sm text-gray-900">{course.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                        <span className="text-xs text-gray-500">{course.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Your Rank</span>
                    <span className="font-medium">#247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-medium">12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interviews Today</span>
                    <span className="font-medium">1,234</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;