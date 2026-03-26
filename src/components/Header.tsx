import React from 'react';
import { BookOpen, Trophy, User, BarChart3, LogOut, Brain } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  studentName: string;
  studentAvatar: string;
  onLogout: () => void;
}

export function Header({ currentView, onViewChange, studentName, studentAvatar, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">LearnHub</h1>
              <p className="text-sm text-gray-600">Master Skills, Climb Rankings</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'dashboard'
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => onViewChange('leaderboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'leaderboard'
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => onViewChange('profile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'profile'
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => onViewChange('ml-analytics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'ml-analytics'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>ML</span>
            </button>
          </nav>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{studentName}</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
            <img
              src={studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=6366f1&color=fff`}
              alt={studentName}
              className="h-10 w-10 rounded-full border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
            />
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}