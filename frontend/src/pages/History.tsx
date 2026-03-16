import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Eye,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Target
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const History: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  React.useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id) {
        try {
          const api = await import('../lib/api');
          const progressData = await api.coursesApi.getUserProgress(user.id);

          // Filter for completed courses and flatten history
          const formattedHistory = progressData
            .filter((p: any) => {
              if (location.state?.courseId) {
                const pCourseId = p.courseId?._id || p.courseId;
                return String(pCourseId) === String(location.state.courseId);
              }
              // Include if it has progress=100 OR if it has history entries
              return p.progress === 100 || (p.history && p.history.length > 0);
            })
            .flatMap((p: any) => {
              const baseInfo = {
                title: p.courseId?.title || 'Unknown Course',
                type: 'Course',
                category: p.courseId?.level || 'General',
              };

              // If history array exists, use it for individual attempt rows
              if (p.history && p.history.length > 0) {
                return p.history.map((h: any, idx: number) => ({
                  id: `${p._id}-${idx}`,
                  ...baseInfo,
                  date: h.date ? new Date(h.date).toLocaleDateString() : new Date().toLocaleDateString(),
                  duration: formatTime(h.timeSpent || 0),
                  rawDuration: h.timeSpent || 0,
                  score: h.score || 0,
                  totalQuestions: h.answers?.length || 0,
                  correctAnswers: h.answers?.filter((a: any) => a.score >= 50).length || 0,
                  status: 'completed',
                  feedback: 'Interview completed.'
                }));
              }

              // Legacy fallback for records without history array
              if (p.progress === 100) {
                return [{
                  id: p._id,
                  ...baseInfo,
                  date: p.completedAt ? new Date(p.completedAt).toLocaleDateString() : new Date().toLocaleDateString(),
                  duration: formatTime(p.timeSpentSeconds || 0),
                  rawDuration: p.timeSpentSeconds || 0,
                  score: p.score || 0,
                  totalQuestions: p.metadata?.answers?.length || 0,
                  correctAnswers: p.metadata?.answers?.filter((a: any) => a.score >= 50).length || 0,
                  status: 'completed',
                  feedback: 'Course completed successfully.'
                }];
              }

              return [];
            });

          setHistoryData(formattedHistory);
        } catch (error) {
          console.error("Failed to fetch history:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, location.state]);

  const interviewHistory = historyData;

  const totalTimeSeconds = interviewHistory.reduce((acc, h) => acc + (h.rawDuration || 0), 0);

  const stats = [
    {
      title: 'Completed Courses',
      value: interviewHistory.length,
      icon: <Target className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      title: 'Average Score',
      value: interviewHistory.length > 0 ? Math.round(
        interviewHistory.reduce((acc, h) => acc + (h.score || 0), 0) / interviewHistory.length
      ) + '%' : '0%',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-green-600'
    },
    {
      title: 'Total Time Spent',
      value: formatTime(totalTimeSeconds),
      icon: <Clock className="w-4 h-4" />,
      color: 'text-purple-600'
    },
    {
      title: 'Best Score',
      value: interviewHistory.length > 0 ? Math.max(...interviewHistory.map(h => h.score || 0)) + '%' : '0%',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-yellow-600'
    }
  ];

  const filteredHistory = interviewHistory.filter(interview => {
    const matchesSearch = interview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || interview.type.toLowerCase() === filterType.toLowerCase();
    const matchesCategory = filterCategory === 'all' || interview.category.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesType && matchesCategory;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Incomplete</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Interview History
          </h1>
          <p className="text-gray-600">
            Track your progress and review past interview performances
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Interview Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="aptitude">Aptitude</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Interview History
              </div>
              <Badge variant="secondary">
                {filteredHistory.length} results
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Interview</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{interview.title}</div>
                          <div className="text-sm text-gray-500">
                            {interview.status === 'completed' ?
                              `${interview.correctAnswers}/${interview.totalQuestions} correct` :
                              'Not completed'
                            }
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{interview.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{interview.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {interview.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {interview.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        {interview.status === 'completed' ? (
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(interview.score)}`}>
                            {interview.score}%
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(interview.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {interview.status === 'incomplete' && (
                            <Button variant="ghost" size="sm">
                              Resume
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredHistory.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No interviews found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;