import React from 'react';
import { User, Award, BookOpen, TrendingUp, Calendar, Target, CheckCircle2 } from 'lucide-react';
import type { Student, Topic } from '../types';

interface ProfileProps {
  student: Student;
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}

export function Profile({ student, topics, onTopicSelect }: ProfileProps) {
  const getTopicProgress = (topic: Topic) => {
    const completedCount = topic.subtopics.filter(subtopic => 
      student.completedSubtopics.includes(subtopic.id)
    ).length;
    return {
      completed: completedCount,
      total: topic.subtopics.length,
      percentage: Math.round((completedCount / topic.subtopics.length) * 100)
    };
  };

  const totalSubtopics = topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
  const overallProgress = Math.round((student.completedSubtopics.length / totalSubtopics) * 100);

  const achievements = [
    {
      id: 'first-step',
      title: 'First Steps',
      description: 'Completed your first subtopic',
      icon: '🎯',
      earned: student.completedSubtopics.length >= 1
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Completed 5 subtopics',
      icon: '⚡',
      earned: student.completedSubtopics.length >= 5
    },
    {
      id: 'dedicated-learner',
      title: 'Dedicated Learner',
      description: 'Completed 10 subtopics',
      icon: '📚',
      earned: student.completedSubtopics.length >= 10
    },
    {
      id: 'knowledge-seeker',
      title: 'Knowledge Seeker',
      description: 'Completed 20 subtopics',
      icon: '🔍',
      earned: student.completedSubtopics.length >= 20
    },
    {
      id: 'master-learner',
      title: 'Master Learner',
      description: 'Completed 30 subtopics',
      icon: '🏆',
      earned: student.completedSubtopics.length >= 30
    }
  ];

  const currentTopicData = topics.find(t => t.id === student.currentTopic);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8">
        <div className="flex items-center space-x-6">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
            <p className="text-blue-100 mb-4">{student.email}</p>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{student.totalProgress}</p>
                <p className="text-blue-100 text-sm">Subtopics Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{overallProgress}%</p>
                <p className="text-blue-100 text-sm">Overall Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{achievements.filter(a => a.earned).length}</p>
                <p className="text-blue-100 text-sm">Achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Current Learning */}
          {currentTopicData && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Currently Learning</h2>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">{currentTopicData.title}</h3>
                {student.currentSubtopic && (
                  <p className="text-sm text-blue-600 mb-3">
                    Next: {currentTopicData.subtopics.find(s => s.id === student.currentSubtopic)?.title}
                  </p>
                )}
                <button
                  onClick={() => onTopicSelect(currentTopicData)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-800">Achievements</h2>
            </div>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 ${
                    achievement.earned
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h3 className={`font-medium ${
                        achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-800">Learning Progress</h2>
            </div>
            <div className="space-y-6">
              {topics.map((topic) => {
                const progress = getTopicProgress(topic);
                const isCurrentTopic = topic.id === student.currentTopic;
                
                return (
                  <div
                    key={topic.id}
                    className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isCurrentTopic ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => onTopicSelect(topic)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-800">{topic.title}</h3>
                        {isCurrentTopic && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCurrentTopic 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{progress.percentage}% complete</span>
                      <span className="flex items-center space-x-1">
                        <span>{topic.difficulty}</span>
                        <span>•</span>
                        <span>{topic.estimatedHours}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Completions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Completions</h2>
            </div>
            {student.completedSubtopics.length > 0 ? (
              <div className="space-y-3">
                {student.completedSubtopics.slice(-5).reverse().map((subtopicId) => {
                  const topic = topics.find(t => t.subtopics.some(s => s.id === subtopicId));
                  const subtopic = topic?.subtopics.find(s => s.id === subtopicId);
                  
                  if (!topic || !subtopic) return null;
                  
                  return (
                    <div key={subtopicId} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800">{subtopic.title}</p>
                        <p className="text-sm text-green-600">{topic.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No completions yet. Start learning to see your progress!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}