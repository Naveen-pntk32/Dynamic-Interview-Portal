import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Play,
  Mic,
  Video as VideoIcon,
  FileText,
  CheckCircle,
  Clock,
  Settings,
  Volume2,
  Camera,
  ArrowRight,
  ArrowLeft,
  MicOff,
  VideoOff
} from 'lucide-react';
import { coursesApi, type Course } from '@/lib/api';
import { toast } from 'sonner';

// Polyfill for SpeechRecognition
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const StartInterview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [course, setCourse] = useState<Course | null>(null);

  const [currentStep, setCurrentStep] = useState<'select' | 'ready' | 'interview' | 'completed'>('select');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  // Stats for ready page
  const [questionCount, setQuestionCount] = useState(0);
  const [estDuration, setEstDuration] = useState('');

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
      icon: <VideoIcon className="w-8 h-8" />,
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
        duration: "2-3 minutes",
        keywords: ["encapsulation", "inheritance", "polymorphism", "abstraction"]
      },
      {
        question: "Walk me through your approach to debugging a complex issue in production.",
        duration: "3-4 minutes",
        keywords: ["logs", "reproduce", "isolate", "fix"]
      }
    ],
    video: [
      {
        question: "Introduce yourself and explain why you're interested in this role.",
        duration: "2-3 minutes",
        keywords: ["experience", "passion", "goals"]
      },
      {
        question: "Describe your greatest professional achievement and what you learned from it.",
        duration: "3-4 minutes",
        keywords: ["achievement", "learned", "growth"]
      }
    ]
  };

  useEffect(() => {
    const initFromState = async () => {
      if (location.state?.courseId && location.state?.interviewType) {
        const typeId = location.state.interviewType;
        if (interviewTypes.find(t => t.id === typeId)) {
          setSelectedType(typeId);
          await loadCourse(location.state.courseId);
        }
      }
    };
    initFromState();
  }, [location.state]);

  const loadCourse = async (id: string) => {
    try {
      const courseData = await coursesApi.getCourseById(id);
      setCourse(courseData);
      setCurrentStep('ready');
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast.error("Failed to load course details");
    }
  };

  useEffect(() => {
    if (selectedType) {
      const qs = mockQuestions[selectedType as keyof typeof mockQuestions] || [];
      setQuestionCount(qs.length);
      const type = interviewTypes.find(t => t.id === selectedType);
      setEstDuration(type?.duration || 'Unknown');
    }
  }, [selectedType]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 'interview') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  // Setup Media for Video/Voice
  useEffect(() => {
    if (currentStep === 'interview' && (selectedType === 'video' || selectedType === 'voice')) {
      const startMedia = async () => {
        try {
          const constraints = {
            video: selectedType === 'video',
            audio: true
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setMediaStream(stream);
          if (videoRef.current && selectedType === 'video') {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing media devices:", err);
          toast.error("Failed to access camera/microphone");
        }
      };
      startMedia();
    }
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentStep, selectedType]);

  // Speech Recognition Setup
  useEffect(() => {
    if (SpeechRecognition && (selectedType === 'voice' || selectedType === 'video')) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTextAnswer(prev => prev + ' ' + transcript);
      };

      recognitionRef.current = recognition;
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedType]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleStartInterview = async () => {
    if (course?._id) {
      try {
        await coursesApi.startCourse(course._id);
      } catch (err) {
        console.error("Failed to mark start:", err);
      }
    }
    setCurrentStep('interview');
    setCurrentQuestion(0);
    setTimer(0);
    setAnswers([]);
  };

  const handleNextQuestion = async () => {
    // Save current answer
    const currentQ = mockQuestions[selectedType as keyof typeof mockQuestions][currentQuestion];
    let score = 0;

    // Default scoring logic
    if (selectedType === 'mcq') {
      if (parseInt(selectedAnswer) === (currentQ as any).correct) score = 100;
      setAnswers([...answers, { question: currentQ.question, answer: selectedAnswer, score }]);
      setSelectedAnswer('');
    } else if (selectedType === 'text') {
      // Simple length check for now
      if (textAnswer.length > 50) score = 80; // Mock score
      setAnswers([...answers, { question: currentQ.question, answer: textAnswer, score }]);
      setTextAnswer('');
    } else {
      // Voice/Video - Keyword match
      const keywords = (currentQ as any).keywords || [];
      const matched = keywords.filter((k: string) => textAnswer.toLowerCase().includes(k.toLowerCase()));
      score = Math.round((matched.length / Math.max(keywords.length, 1)) * 100);
      setAnswers([...answers, { question: currentQ.question, answer: textAnswer, score }]);
      setTextAnswer('');
      if (isRecording) toggleRecording(); // Stop recording
    }

    if (currentQuestion < questionCount - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    setCurrentStep('completed');
    // Calculate final score
    const validAnswers = answers; // answers state might not be updated yet due to closure, use functional update or ref if needed. 
    // Actually, let's use the local 'answers' array + the one just pushed.
    // Re-calculating correctly:
    const finalAnswers = [...answers]; // This doesn't include the last one pushed above because state updates are async.
    // Better to push to a local variable first or use a ref. 
    // For simplicity, let's assume the last push is handled in handleNextQuestion before calling finish.
    // Wait, handleNextQuestion calls setCurrentQuestion OR finishInterview.
    // So distinct path.
    // Let's pass the payload directly.

    // Fix: We need to include the LAST answer in the payload.
    const currentQ = mockQuestions[selectedType as keyof typeof mockQuestions][currentQuestion];
    let lastScore = 0;
    let lastAnswerVal = '';

    if (selectedType === 'mcq') {
      if (parseInt(selectedAnswer) === (currentQ as any).correct) lastScore = 100;
      lastAnswerVal = selectedAnswer;
    } else {
      // Text/Voice/Video
      const keywords = (currentQ as any).keywords || [];
      if (keywords.length > 0) {
        const matched = keywords.filter((k: string) => textAnswer.toLowerCase().includes(k.toLowerCase()));
        lastScore = Math.round((matched.length / Math.max(keywords.length, 1)) * 100);
      } else {
        lastScore = textAnswer.length > 20 ? 80 : 40; // Mock
      }
      lastAnswerVal = textAnswer;
    }

    const allAnswers = [...answers, { question: currentQ.question, answer: lastAnswerVal, score: lastScore }];
    const totalScore = Math.round(allAnswers.reduce((acc, curr) => acc + curr.score, 0) / allAnswers.length);

    if (course?._id) {
      try {
        await coursesApi.updateProgress(course._id, {
          progress: 100,
          score: totalScore,
          timeSpentSeconds: timer,
          answers: allAnswers
        });
        toast.success("Interview completed and saved!");
        navigate('/history');
      } catch (err) {
        console.error("Failed to save progress:", err);
        toast.error("Failed to save results");
      }
    } else {
      toast.success("Practice complete!");
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // RENDERERS

  const renderReadyPage = () => (
    <div className="max-w-2xl mx-auto space-y-8 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Ready to Start?</h1>
        <p className="text-gray-600">Please review the details below before beginning your interview.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Questions</p>
              <p className="text-2xl font-bold">{questionCount}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="font-medium">Estimated Time</p>
              <p className="text-2xl font-bold">{estDuration}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">System Check</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-gray-500" />
                <span>Camera</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" /> Ready
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-gray-500" />
                <span>Microphone</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" /> Ready
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => setCurrentStep('select')}>Cancel</Button>
        <Button size="lg" onClick={handleStartInterview} className="px-8">
          <Play className="w-4 h-4 mr-2" />
          Acknowledge & Start
        </Button>
      </div>
    </div>
  );

  const renderInterview = () => {
    const questions = mockQuestions[selectedType as keyof typeof mockQuestions];
    const question = questions[currentQuestion] as any;

    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 h-[calc(100vh-100px)]">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {selectedType === 'video' && (
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video shadow-lg flex-1">
              {mediaStream ? (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <VideoOff className="w-12 h-12 opacity-50" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
                <Button
                  variant={isRecording ? "destructive" : "secondary"}
                  onClick={toggleRecording}
                  className="rounded-full w-12 h-12 p-0"
                >
                  {isRecording ? <MicOff /> : <Mic />}
                </Button>
              </div>
            </div>
          )}

          {/* Question Card - For Video, it's below video. For others, it's main. */}
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <p className="text-xl font-medium text-gray-800">{question.question}</p>

              {selectedType === 'mcq' && (
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="space-y-3">
                    {question.options?.map((opt: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                        <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                        <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">{opt}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {(selectedType === 'text' || selectedType === 'voice') && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <Textarea
                    placeholder={question.placeholder || "Type your answer here..."}
                    value={textAnswer}
                    onChange={e => setTextAnswer(e.target.value)}
                    className="flex-1 min-h-[200px] resize-none"
                  />
                  {selectedType === 'voice' && (
                    <Button
                      variant={isRecording ? "destructive" : "default"}
                      onClick={toggleRecording}
                      className="w-full"
                    >
                      {isRecording ? <><MicOff className="mr-2 h-4 w-4" /> Stop Recording</> : <><Mic className="mr-2 h-4 w-4" /> Start Recording</>}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Controls */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-sm text-gray-500">Time Elapsed</p>
              <div className="text-4xl font-mono font-bold text-blue-600">
                {formatTime(timer)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Controls</h3>
              <div className="flex flex-col gap-3">
                <Button variant="outline" onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                <Button onClick={handleNextQuestion}>
                  {currentQuestion === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Video Preview for non-video types if desired, or just info */}
          {selectedType !== 'video' && (
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
                <p className="text-sm text-blue-800">
                  {selectedType === 'voice' ? 'Speak clearly and at a moderate pace. The system is transcribing your answer.' : 'Read the question carefully before answering.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  // Original selection screen
  const renderSelection = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Practice</h1>
        <p className="text-xl text-gray-600">Select a format to begin your session</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {interviewTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            onClick={() => setSelectedType(type.id)}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white border-2 ${type.color}`}>
                {type.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{type.name}</h3>
                <p className="text-sm text-gray-500 mt-2">{type.description}</p>
              </div>
              <Badge variant="secondary">{type.difficulty}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedType && (
        <div className="mt-12 text-center">
          {course ? (
            <Button size="lg" onClick={() => setCurrentStep('ready')}>Continue with {course.title}</Button>
          ) : (
            // If checking mock flow directly
            <Button size="lg" onClick={() => setCurrentStep('ready')}>Continue</Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      {currentStep === 'select' && renderSelection()}
      {currentStep === 'ready' && renderReadyPage()}
      {currentStep === 'interview' && renderInterview()}
    </div>
  );
};

export default StartInterview;