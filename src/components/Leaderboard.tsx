import React from 'react';
import { Trophy, Medal, Crown, TrendingUp, BookOpen } from 'lucide-react';
import type { Student } from '../types';

interface LeaderboardProps {
  students: Student[];
  currentStudentId: string;
}

export function Leaderboard({ students, currentStudentId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-600';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
  };

  const getProgressColor = (completedCount: number) => {
    if (completedCount >= 20) return 'bg-green-500';
    if (completedCount >= 10) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
        </div>
        <p className="text-gray-600">See how you rank against other learners</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {students.slice(0, 3).map((student, index) => {
          const rank = index + 1;
          const isCurrentStudent = student.id === currentStudentId;
          
          return (
            <div
              key={student.id}
              className={`relative ${
                rank === 1 ? 'md:order-2 transform md:scale-105' :
                rank === 2 ? 'md:order-1' :
                'md:order-3'
              }`}
            >
              <div className={`bg-white rounded-xl shadow-lg p-6 text-center ${
                isCurrentStudent ? 'ring-2 ring-blue-500' : ''
              }`}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getRankColor(rank)}`}>
                    #{rank}
                  </div>
                </div>
                
                <div className="mt-4 mb-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-16 h-16 rounded-full mx-auto border-4 border-gray-100"
                  />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{student.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">{student.totalProgress}</p>
                <p className="text-sm text-gray-600">subtopics completed</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Rankings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <h2 className="text-xl font-semibold">Complete Rankings</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {students.map((student, index) => {
            const rank = index + 1;
            const isCurrentStudent = student.id === currentStudentId;
            const completedCount = student.totalProgress;
            
            return (
              <div
                key={student.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  isCurrentStudent ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {getRankIcon(rank)}
                  </div>
                  
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-lg font-medium truncate ${
                        isCurrentStudent ? 'text-blue-700' : 'text-gray-800'
                      }`}>
                        {student.name}
                        {isCurrentStudent && (
                          <span className="ml-2 text-sm font-normal text-blue-600">(You)</span>
                        )}
                      </h3>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">{student.totalProgress}</p>
                        <p className="text-sm text-gray-600">completed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{completedCount} subtopics</span>
                      </div>
                      
                      {student.currentTopic && (
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Learning: {student.currentTopic.replace('-', ' ')}</span>
                        </div>
                      )}
                      
                      <div className="flex-1 max-w-40">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(completedCount)}`}
                              style={{ width: `${Math.min((completedCount / 30) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{Math.min(Math.round((completedCount / 30) * 100), 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {students.findIndex(s => s.id === currentStudentId) + 1}
          </div>
          <p className="text-gray-600">Your Rank</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {students.find(s => s.id === currentStudentId)?.totalProgress || 0}
          </div>
          <p className="text-gray-600">Subtopics Completed</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {Math.max(0, students[0].totalProgress - (students.find(s => s.id === currentStudentId)?.totalProgress || 0))}
          </div>
          <p className="text-gray-600">Behind Leader</p>
        </div>
      </div>
    </div>
  );
}