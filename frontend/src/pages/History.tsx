import React, { useState } from 'react';
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

const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const interviewHistory = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      type: 'MCQ',
      category: 'Technical',
      date: '2024-01-15',
      duration: '25 mins',
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      status: 'completed',
      feedback: 'Good understanding of JS concepts. Focus on async/await patterns.'
    },
    {
      id: 2,
      title: 'System Design Basics',
      type: 'Text',
      category: 'Technical',
      date: '2024-01-12',
      duration: '45 mins',
      score: 78,
      totalQuestions: 5,
      correctAnswers: 4,
      status: 'completed',
      feedback: 'Strong architectural thinking. Improve scalability considerations.'
    },
    {
      id: 3,
      title: 'Behavioral Questions',
      type: 'Voice',
      category: 'HR',
      date: '2024-01-10',
      duration: '30 mins',
      score: 92,
      totalQuestions: 8,
      correctAnswers: 8,
      status: 'completed',
      feedback: 'Excellent communication skills and clear examples using STAR method.'
    },
    {
      id: 4,
      title: 'Data Structures Deep Dive',
      type: 'MCQ',
      category: 'Technical',
      date: '2024-01-08',
      duration: '35 mins',
      score: 72,
      totalQuestions: 25,
      correctAnswers: 18,
      status: 'completed',
      feedback: 'Good grasp of basic structures. Practice more complex tree algorithms.'
    },
    {
      id: 5,
      title: 'Communication Skills Assessment',
      type: 'Video',
      category: 'Communication',
      date: '2024-01-05',
      duration: '40 mins',
      score: 88,
      totalQuestions: 6,
      correctAnswers: 5,
      status: 'completed',
      feedback: 'Great presentation skills. Work on maintaining eye contact.'
    },
    {
      id: 6,
      title: 'Aptitude Test - Logical Reasoning',
      type: 'MCQ',
      category: 'Aptitude',
      date: '2024-01-03',
      duration: '20 mins',
      score: 95,
      totalQuestions: 15,
      correctAnswers: 14,
      status: 'completed',
      feedback: 'Outstanding logical reasoning abilities. Keep up the excellent work!'
    },
    {
      id: 7,
      title: 'React Advanced Concepts',
      type: 'Text',
      category: 'Technical',
      date: '2024-01-01',
      duration: '50 mins',
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      status: 'incomplete',
      feedback: 'Interview was not completed.'
    }
  ];

  const stats = [
    {
      title: 'Total Interviews',
      value: interviewHistory.filter(h => h.status === 'completed').length,
      icon: <Target className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      title: 'Average Score',
      value: Math.round(
        interviewHistory
          .filter(h => h.status === 'completed')
          .reduce((acc, h) => acc + h.score, 0) / 
        interviewHistory.filter(h => h.status === 'completed').length
      ) + '%',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-green-600'
    },
    {
      title: 'Total Time Spent',
      value: '4h 25m',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-purple-600'
    },
    {
      title: 'Best Score',
      value: Math.max(...interviewHistory.filter(h => h.status === 'completed').map(h => h.score)) + '%',
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