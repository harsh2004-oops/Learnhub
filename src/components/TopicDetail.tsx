import React from 'react';
import { ArrowLeft, Play, CheckCircle2, Clock, ExternalLink, BookOpen } from 'lucide-react';
import type { Topic, Subtopic } from '../types';

interface TopicDetailProps {
  topic: Topic;
  onBack: () => void;
  onSubtopicSelect: (subtopic: Subtopic) => void;
  completedSubtopics: string[];
}

export function TopicDetail({ topic, onBack, onSubtopicSelect, completedSubtopics }: TopicDetailProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'leetcode': return 'bg-orange-100 text-orange-800';
      case 'geeksforgeeks': return 'bg-green-100 text-green-800';
      case 'hackerrank': return 'bg-blue-100 text-blue-800';
      case 'codechef': return 'bg-purple-100 text-purple-800';
      case 'codeforces': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = topic.subtopics.filter(subtopic => 
    completedSubtopics.includes(subtopic.id)
  ).length;
  const progressPercentage = Math.round((completedCount / topic.subtopics.length) * 100);

  const nextSubtopic = topic.subtopics.find(subtopic => 
    !completedSubtopics.includes(subtopic.id)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{topic.title}</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(topic.difficulty)}`}>
              {topic.difficulty}
            </span>
            <span className="text-gray-600">{topic.estimatedHours}</span>
            <span className="text-blue-600 font-medium">{topic.totalSubtopics} topics</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Learning Progress</h2>
          <span className="text-lg font-bold text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{completedCount} of {topic.subtopics.length} topics completed</span>
          {nextSubtopic && (
            <span>Next: {nextSubtopic.title}</span>
          )}
        </div>
      </div>

      {/* Topic Description */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Learning Path</h2>
        <p className="text-gray-600 leading-relaxed mb-4">{topic.description}</p>
        
        {topic.prerequisites && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Prerequisites</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              {topic.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Continue Learning */}
      {nextSubtopic && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Continue Your Journey</h3>
              <p className="text-blue-100 mb-1">{nextSubtopic.title}</p>
              <p className="text-sm text-blue-200">{nextSubtopic.duration} • {nextSubtopic.practiceLinks.length} practice platforms</p>
            </div>
            <button
              onClick={() => onSubtopicSelect(nextSubtopic)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Start Learning</span>
            </button>
          </div>
        </div>
      )}

      {/* Subtopics List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Learning Topics</h2>
        <div className="space-y-4">
          {topic.subtopics.map((subtopic, index) => {
            const isCompleted = completedSubtopics.includes(subtopic.id);
            const isNext = nextSubtopic?.id === subtopic.id;
            const isLocked = index > 0 && !completedSubtopics.includes(topic.subtopics[index - 1].id) && !isCompleted;
            
            return (
              <div
                key={subtopic.id}
                className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100' 
                    : isNext
                    ? 'border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100'
                    : isLocked
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 hover:border-gray-300 cursor-pointer hover:bg-gray-50'
                }`}
                onClick={() => !isLocked && onSubtopicSelect(subtopic)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : isNext ? (
                      <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Play className="h-3 w-3 text-white" />
                      </div>
                    ) : isLocked ? (
                      <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">🔒</span>
                      </div>
                    ) : (
                      <div className="h-6 w-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${
                        isCompleted ? 'text-green-800' : 
                        isNext ? 'text-blue-800' : 
                        isLocked ? 'text-gray-500' : 'text-gray-800'
                      }`}>
                        {subtopic.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{subtopic.duration}</span>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      isLocked ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {subtopic.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {subtopic.practiceLinks.length} practice platform{subtopic.practiceLinks.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {subtopic.practiceLinks.slice(0, 3).map((link, linkIndex) => (
                          <span
                            key={linkIndex}
                            className={`px-2 py-1 text-xs rounded-full ${getPlatformColor(link.platform)}`}
                          >
                            {link.platform}
                          </span>
                        ))}
                        {subtopic.practiceLinks.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{subtopic.practiceLinks.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!isLocked && (
                    <div className="flex-shrink-0">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}