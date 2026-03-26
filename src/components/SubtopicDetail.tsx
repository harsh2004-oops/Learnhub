import React, { useState } from 'react';
import { ArrowLeft, Play, ExternalLink, CheckCircle2, Clock, Target } from 'lucide-react';
import type { Topic, Subtopic } from '../types';

interface SubtopicDetailProps {
  subtopic: Subtopic;
  topic: Topic;
  onBack: () => void;
  onComplete: (subtopicId: string) => void;
  isCompleted: boolean;
}

export function SubtopicDetail({ subtopic, topic, onBack, onComplete, isCompleted }: SubtopicDetailProps) {
  const [videoWatched, setVideoWatched] = useState(isCompleted);

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'leetcode': return 'bg-orange-500 hover:bg-orange-600';
      case 'geeksforgeeks': return 'bg-green-500 hover:bg-green-600';
      case 'hackerrank': return 'bg-blue-500 hover:bg-blue-600';
      case 'codechef': return 'bg-purple-500 hover:bg-purple-600';
      case 'codeforces': return 'bg-red-500 hover:bg-red-600';
      case 'freecodecamp': return 'bg-green-600 hover:bg-green-700';
      case 'css battle': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'frontend mentor': return 'bg-blue-600 hover:bg-blue-700';
      case 'javascript30': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'codewars': return 'bg-red-600 hover:bg-red-700';
      case 'kaggle': return 'bg-blue-400 hover:bg-blue-500';
      case 'kaggle learn': return 'bg-blue-400 hover:bg-blue-500';
      case 'google colab': return 'bg-orange-400 hover:bg-orange-500';
      case 'exercism': return 'bg-purple-600 hover:bg-purple-700';
      case 'codepen': return 'bg-gray-800 hover:bg-gray-900';
      case 'react challenges': return 'bg-cyan-500 hover:bg-cyan-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleMarkComplete = () => {
    if (videoWatched && !isCompleted) {
      onComplete(subtopic.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <span>{topic.title}</span>
            <span>•</span>
            <span>Step {subtopic.order} of {topic.subtopics.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{subtopic.title}</h1>
            {isCompleted && (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            )}
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{subtopic.duration}</span>
            </div>
            <span className="text-blue-600 font-medium">{subtopic.practiceLinks.length} practice platforms</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Topic Progress</span>
          <span className="text-sm text-gray-600">{subtopic.order}/{topic.subtopics.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(subtopic.order / topic.subtopics.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="aspect-video">
          <iframe
            src={subtopic.videoUrl}
            title={subtopic.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setVideoWatched(true)}
          ></iframe>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Learn the Concepts</h2>
            <div className="flex items-center space-x-2">
              {videoWatched ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
              )}
              <span className={`text-sm ${videoWatched ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                {videoWatched ? 'Video Watched' : 'Watch to unlock practice'}
              </span>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{subtopic.description}</p>
        </div>
      </div>

      {/* Practice Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Practice Problems</h2>
          </div>
          {!videoWatched && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Watch video first
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subtopic.practiceLinks.map((link, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                videoWatched 
                  ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{link.platform}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(link.difficulty)}`}>
                  {link.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {link.problemCount} problems to solve
              </p>
              
              <a
                href={videoWatched ? link.url : '#'}
                target={videoWatched ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  videoWatched
                    ? `${getPlatformColor(link.platform)} text-white shadow-md hover:shadow-lg`
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                onClick={!videoWatched ? (e) => e.preventDefault() : undefined}
              >
                <span>Practice on {link.platform}</span>
                {videoWatched && <ExternalLink className="h-4 w-4" />}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ready to Move Forward?</h2>
          <p className="text-gray-600 mb-6">
            Once you've watched the video and practiced the problems, mark this topic as complete to unlock the next one.
          </p>
          
          <button
            onClick={handleMarkComplete}
            disabled={!videoWatched || isCompleted}
            className={`py-3 px-8 rounded-lg font-medium transition-all duration-200 ${
              isCompleted
                ? 'bg-green-100 text-green-700 cursor-default'
                : videoWatched
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isCompleted ? (
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Topic Completed</span>
              </div>
            ) : (
              'Mark as Complete'
            )}
          </button>
          
          {!videoWatched && (
            <p className="text-sm text-gray-500 mt-2">
              Watch the video to enable completion
            </p>
          )}
        </div>
      </div>
    </div>
  );
}