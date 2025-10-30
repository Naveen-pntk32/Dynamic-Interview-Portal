import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Mic, 
  Video, 
  FileText, 
  CheckCircle, 
  Clock,
  Settings,
  Volume2,
  Camera,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const StartInterview: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'select' | 'setup' | 'interview'>('select');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');

  const interviewTypes = [
    {
      id: 'mcq',
      name: 'Multiple Choice Questions',
      description: 'Quick assessment with option-based questions',
      icon: <CheckCircle className="w-8 h-8" />,
      duration: '15-30 mins',
      difficulty: 'Easy to Medium',
      color: 'border-green-200 hover:border-green-400'
    },
    {
      id: 'text',
      name: 'Text-based Interview',
      description: 'Written responses to interview questions',
      icon: <FileText className="w-8 h-8" />,
      duration: '30-45 mins',
      difficulty: 'Medium',
      color: 'border-blue-200 hover:border-blue-400'
    },
    {
      id: 'voice',
      name: 'Voice Interview',
      description: 'Speak your answers aloud for practice',
      icon: <Mic className="w-8 h-8" />,
      duration: '20-40 mins',
      difficulty: 'Medium to Hard',
      color: 'border-purple-200 hover:border-purple-400'
    },
    {
      id: 'video',
      name: 'Video Interview',
      description: 'Full video interview simulation',
      icon: <Video className="w-8 h-8" />,
      duration: '30-60 mins',
      difficulty: 'Hard',
      color: 'border-red-200 hover:border-red-400'
    }
  ];

  const categories = [
    { id: 'technical', name: 'Technical Interview', topics: ['DSA', 'System Design', 'Coding'] },
    { id: 'behavioral', name: 'Behavioral Interview', topics: ['Leadership', 'Teamwork', 'Problem Solving'] },
    { id: 'hr', name: 'HR Interview', topics: ['Background', 'Motivation', 'Culture Fit'] },
    { id: 'aptitude', name: 'Aptitude Test', topics: ['Logical Reasoning', 'Quantitative', 'Verbal'] }
  ];

  // Mock questions for different types
  const mockQuestions = {
    mcq: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1
      },
      {
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Array", "Tree"],
        correct: 1
      }
    ],
    text: [
      {
        question: "Tell me about yourself and your background in software development.",
        placeholder: "Describe your experience, skills, and what motivates you..."
      },
      {
        question: "Describe a challenging project you worked on and how you overcame the difficulties.",
        placeholder: "Explain the project, challenges faced, and your solution approach..."
      }
    ],
    voice: [
      {
        question: "Explain the concept of object-oriented programming and its key principles.",
        duration: "2-3 minutes"
      },
      {
        question: "Walk me through your approach to debugging a complex issue in production.",
        duration: "3-4 minutes"
      }
    ],
    video: [
      {
        question: "Introduce yourself and explain why you're interested in this role.",
        duration: "2-3 minutes"
      },
      {
        question: "Describe your greatest professional achievement and what you learned from it.",
        duration: "3-4 minutes"
      }
    ]
  };

  const handleStartInterview = () => {
    if (selectedType && selectedCategory) {
      setCurrentStep('setup');
    }
  };

  const handleBeginInterview = () => {
    setCurrentStep('interview');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleNextQuestion = () => {
    if (selectedType === 'mcq') {
      setAnswers([...answers, selectedAnswer]);
      setSelectedAnswer('');
    } else if (selectedType === 'text') {
      setAnswers([...answers, textAnswer]);
      setTextAnswer('');
    }
    
    if (currentQuestion < mockQuestions[selectedType as keyof typeof mockQuestions].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Interview completed
      alert('Interview completed! Results will be processed.');
    }
  };

  const renderInterviewSetup = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Setup</h2>
        <p className="text-gray-600">Configure your interview settings before starting</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* System Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              System Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="w-4 h-4 mr-2 text-gray-600" />
                <span>Camera</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ready
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mic className="w-4 h-4 mr-2 text-gray-600" />
                <span>Microphone</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ready
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Volume2 className="w-4 h-4 mr-2 text-gray-600" />
                <span>Audio</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ready
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Interview Details */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Type</Label>
              <p className="text-sm text-gray-600">
                {interviewTypes.find(t => t.id === selectedType)?.name}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Category</Label>
              <p className="text-sm text-gray-600">
                {categories.find(c => c.id === selectedCategory)?.name}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Duration</Label>
              <p className="text-sm text-gray-600">
                {interviewTypes.find(t => t.id === selectedType)?.duration}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Questions</Label>
              <p className="text-sm text-gray-600">
                {mockQuestions[selectedType as keyof typeof mockQuestions]?.length} questions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => setCurrentStep('select')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleBeginInterview} size="lg">
          <Play className="w-4 h-4 mr-2" />
          Begin Interview
        </Button>
      </div>
    </div>
  );

  const renderInterviewQuestion = () => {
    const questions = mockQuestions[selectedType as keyof typeof mockQuestions];
    const question = questions[currentQuestion];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p className="text-gray-600">
              {categories.find(c => c.id === selectedCategory)?.name}
            </p>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>15:30</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedType === 'mcq' && (
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                <div className="space-y-3">
                  {question.options?.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {selectedType === 'text' && (
              <div className="space-y-4">
                <Textarea
                  placeholder={question.placeholder}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-sm text-gray-500">
                  Take your time to provide a detailed response.
                </p>
              </div>
            )}

            {(selectedType === 'voice' || selectedType === 'video') && (
              <div className="text-center space-y-6">
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  {selectedType === 'video' ? (
                    <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Video className="w-12 h-12 mx-auto mb-2" />
                        <p>Video preview will appear here</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12">
                      <Mic className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Click start recording to begin</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Recommended duration: {question.duration}
                  </p>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button 
            onClick={handleNextQuestion}
            disabled={
              (selectedType === 'mcq' && !selectedAnswer) ||
              (selectedType === 'text' && !textAnswer.trim())
            }
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  if (currentStep === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderInterviewSetup()}
        </div>
      </div>
    );
  }

  if (currentStep === 'interview') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderInterviewQuestion()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your Interview Practice
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your interview format and category to begin practicing. 
            Each format offers unique benefits to help you prepare effectively.
          </p>
        </div>

        {/* Interview Type Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Interview Type</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {interviewTypes.map((type) => (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all ${type.color} ${
                  selectedType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3 text-blue-600">
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {type.duration}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {type.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        {selectedType && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Interview Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className={`cursor-pointer transition-all border-gray-200 hover:border-blue-400 ${
                    selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {category.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        {selectedType && selectedCategory && (
          <div className="text-center">
            <Button onClick={handleStartInterview} size="lg">
              <Play className="w-4 h-4 mr-2" />
              Start Interview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartInterview;