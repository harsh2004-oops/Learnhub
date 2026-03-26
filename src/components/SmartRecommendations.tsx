import React, { useEffect, useState } from 'react';
import { Lightbulb, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';
import { aiService } from '../services/aiService';
import type { Topic, Subtopic } from '../types';

interface Recommendation {
  topicId: string;
  subtopicId: string;
  reason: string;
  confidence: number;
  topic?: Topic;
  subtopic?: Subtopic;
}

interface Props {
  topics: Topic[];
  completedSubtopics: string[];
  studentProgress: number;
  onSubtopicSelect: (subtopic: Subtopic, topic: Topic) => void;
}

export function SmartRecommendations({
  topics,
  completedSubtopics,
  studentProgress,
  onSubtopicSelect
}: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [performanceMsg, setPerformanceMsg] = useState('');

  useEffect(() => {
    // Generate recommendations
    const recs = aiService.generateRecommendations(completedSubtopics, topics, studentProgress);

    // Enrich recommendations with topic/subtopic data
    const enrichedRecs = recs.map(rec => {
      const topic = topics.find(t => t.id === rec.topicId);
      const subtopic = topic?.subtopics.find(s => s.id === rec.subtopicId);
      return {
        ...rec,
        topic,
        subtopic
      };
    });

    setRecommendations(enrichedRecs);

    // Get performance message
    const totalSubtopics = topics.reduce((sum, t) => sum + (t.subtopics?.length || 0), 0);
    const msg = aiService.analyzeStudentPerformance(completedSubtopics.length, totalSubtopics);
    setPerformanceMsg(msg);
  }, [completedSubtopics, topics, studentProgress]);

  const totalSubtopics = topics.reduce((sum, t) => sum + (t.subtopics?.length || 0), 0);
  const progressPercentage = (completedSubtopics.length / totalSubtopics) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Your Learning Progress</h2>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
            <p className="text-sm text-gray-600">{completedSubtopics.length} / {totalSubtopics}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="text-gray-700 font-medium">{performanceMsg}</p>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-amber-500" size={24} />
          <h3 className="text-xl font-bold text-gray-900">Recommended Next Steps</h3>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="mx-auto text-green-600 mb-3" size={32} />
            <p className="text-green-900 font-medium">Congratulations!</p>
            <p className="text-green-700 text-sm mt-1">You've completed all available topics</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recommendations.map((rec, idx) => (
              <div
                key={`${rec.topicId}-${rec.subtopicId}`}
                className="bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="font-semibold text-gray-900">{rec.topic?.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">{rec.subtopic?.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-600">
                      {Math.round(rec.confidence * 100)}%
                    </div>
                    <p className="text-xs text-gray-500">confidence</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 ml-8">{rec.reason}</p>

                {/* Confidence Meter */}
                <div className="mb-4 ml-8">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${rec.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <div className="ml-8">
                  <button
                    onClick={() => rec.subtopic && rec.topic && onSubtopicSelect(rec.subtopic, rec.topic)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Start Learning
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Insights */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm">💡</span>
          AI Insights
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="text-purple-600 font-bold">•</span>
            <span>You're making consistent progress - keep up the momentum!</span>
          </li>
          <li className="flex gap-3">
            <span className="text-purple-600 font-bold">•</span>
            <span>Practice problems strengthen your understanding 3x faster</span>
          </li>
          <li className="flex gap-3">
            <span className="text-purple-600 font-bold">•</span>
            <span>Review completed topics weekly for better retention</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
