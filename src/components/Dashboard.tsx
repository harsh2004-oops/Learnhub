import React, { useState } from 'react';
import { Play, CheckCircle2, Clock, BookOpen, TrendingUp, ArrowRight, Target, Brain } from 'lucide-react';
import { SmartRecommendations } from './SmartRecommendations';
import type { Topic, Student, Subtopic } from '../types';

interface DashboardProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
  onSubtopicSelect?: (subtopic: Subtopic) => void;
  completedSubtopics: string[];
  currentStudent: Student;
  onMLAnalytics?: () => void;
}

export function Dashboard({ topics, onTopicSelect, onSubtopicSelect, completedSubtopics, currentStudent, onMLAnalytics }: DashboardProps) {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Computer Science': return '💻';
      case 'Web Development': return '🌐';
      case 'Artificial Intelligence': return '🤖';
      case 'Mobile Development': return '📱';
      default: return '📚';
    }
  };

  const getTopicProgress = (topic: Topic) => {
    const completedCount = topic.subtopics.filter(subtopic => 
      completedSubtopics.includes(subtopic.id)
    ).length;
    return Math.round((completedCount / topic.subtopics.length) * 100);
  };

  const totalSubtopics = topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
  const overallProgress = Math.round((completedSubtopics.length / totalSubtopics) * 100);

  const getCurrentTopicData = () => {
    if (!currentStudent.currentTopic) return null;
    const topic = topics.find(t => t.id === currentStudent.currentTopic);
    if (!topic) return null;
    
    const currentSubtopic = topic.subtopics.find(s => s.id === currentStudent.currentSubtopic);
    return { topic, currentSubtopic };
  };

  const currentTopicData = getCurrentTopicData();

  const handleSubtopicSelect = (subtopic: Subtopic, topic: Topic) => {
    if (onSubtopicSelect) {
      onSubtopicSelect(subtopic);
    }
    onTopicSelect(topic);
  };

  return (
    <div className="space-y-8">
      {showRecommendations ? (
        <>
          <button
            onClick={() => setShowRecommendations(false)}
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mb-4"
          >
            <span>←</span> Back
          </button>
          <SmartRecommendations
            topics={topics}
            completedSubtopics={completedSubtopics}
            studentProgress={currentStudent.totalProgress}
            onSubtopicSelect={handleSubtopicSelect}
          />
        </>
      ) : (
        <>
          {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {currentStudent.name}! 👋</h1>
            <p className="text-blue-100 mb-4">Continue your learning journey and master new skills</p>
            {currentTopicData && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md">
                <p className="text-sm text-blue-100 mb-1">Currently Learning</p>
                <p className="font-semibold">{currentTopicData.topic.title}</p>
                <p className="text-sm text-blue-200">Next: {currentTopicData.currentSubtopic?.title}</p>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-2xl font-bold">{currentStudent.totalProgress}</p>
              <p className="text-blue-100 text-sm">Subtopics Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ML-Powered Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Smart Recommendations Button */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all" onClick={() => setShowRecommendations(true)}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">🎯 AI Recommendations</h2>
              <p className="text-emerald-50 text-sm">Your personalized learning path</p>
            </div>
            <ArrowRight className="h-6 w-6" />
          </div>
        </div>

        {/* ML Analytics Button */}
        <div
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden"
          onClick={onMLAnalytics}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center justify-between relative">
            <div>
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Brain size={20} />
                ML Analytics Dashboard
              </h2>
              <p className="text-indigo-100 text-sm">TensorFlow.js powered insights & predictions</p>
            </div>
            <ArrowRight className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Overall Progress</p>
              <p className="text-3xl font-bold text-blue-600">{overallProgress}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedSubtopics.length}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">of {totalSubtopics} subtopics</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Topics Available</p>
              <p className="text-3xl font-bold text-purple-600">{topics.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">learning paths</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Remaining</p>
              <p className="text-3xl font-bold text-orange-600">{totalSubtopics - completedSubtopics.length}</p>
            </div>
            <Target className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">to complete</p>
        </div>
      </div>

      {/* Continue Learning */}
      {currentTopicData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Continue Learning</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getCategoryIcon(currentTopicData.topic.category)}</span>
                  <h3 className="text-lg font-semibold text-gray-800">{currentTopicData.topic.title}</h3>
                </div>
                <p className="text-gray-600 mb-3">{currentTopicData.currentSubtopic?.title}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {currentTopicData.currentSubtopic?.duration}
                  </span>
                  <span className="text-sm text-blue-600 font-medium">
                    {currentTopicData.currentSubtopic?.practiceLinks.length} practice platforms
                  </span>
                </div>
              </div>
              <button
                onClick={() => onTopicSelect(currentTopicData.topic)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Learning Paths */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Paths</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {topics.map((topic) => {
            const progress = getTopicProgress(topic);
            const completedSubtopics = topic.subtopics.filter(subtopic => 
              currentStudent.completedSubtopics.includes(subtopic.id)
            ).length;
            
            return (
              <div
                key={topic.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => onTopicSelect(topic)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{getCategoryIcon(topic.category)}</span>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{topic.title}</h3>
                        <p className="text-sm text-gray-600">{topic.category}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{topic.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-800">{completedSubtopics}/{topic.subtopics.length} completed</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{topic.estimatedHours}</span>
                        </span>
                        <span>{topic.totalSubtopics} topics</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                        <Play className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {progress > 0 ? 'Continue' : 'Start Learning'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {topic.prerequisites && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xs text-yellow-800 font-medium mb-1">Prerequisites:</p>
                      <p className="text-xs text-yellow-700">{topic.prerequisites.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </div>
  );
}