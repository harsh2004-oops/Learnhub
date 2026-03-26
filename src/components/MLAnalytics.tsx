import { useEffect, useState } from 'react';
import { 
  TrendingUp, Brain, Target, Zap, BarChart3, 
  ArrowRight, Sparkles, Trophy, BookOpen,
  ArrowUpRight, Flame
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalTopics: number;
    completedCount: number;
    overallPercentage: number;
    performanceScore: number;
    currentStreak: number;
    estimatedDaysToComplete: number | null;
    learningVelocity: number;
  };
  categoryBreakdown: Array<{
    category: string;
    label: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  strengths: string[];
  weaknesses: string[];
  unexplored: string[];
  insights: Array<{
    type: string;
    icon: string;
    text: string;
  }>;
  progressTimeline: Array<{
    date: string;
    label: string;
    completedTotal: number;
    dailyNew: number;
  }>;
}

interface MLPrediction {
  subtopicId: string;
  score: number;
  difficulty: number;
  category: string;
  reason: string;
}

interface Props {
  studentId: string;
  onBack: () => void;
  onSubtopicSelect?: (subtopicId: string) => void;
}

export function MLAnalytics({ studentId, onBack, onSubtopicSelect }: Props) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'insights'>('overview');

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, predictionsRes] = await Promise.all([
        fetch('http://localhost:3001/api/ml/analytics', {
          headers: { 'student_id': studentId }
        }),
        fetch('http://localhost:3001/api/ml/predict-next', {
          headers: { 'student_id': studentId }
        })
      ]);
      
      const analyticsData = await analyticsRes.json();
      const predictionsData = await predictionsRes.json();
      
      setAnalytics(analyticsData);
      setPredictions(predictionsData.predictions || []);
    } catch (err) {
      console.error('Failed to load ML data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <Brain className="absolute inset-0 m-auto text-indigo-600" size={28} />
          </div>
          <p className="text-gray-600 font-medium">Analyzing your learning patterns...</p>
          <p className="text-gray-400 text-sm mt-1">TensorFlow.js model running</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const { overview, categoryBreakdown, difficultyDistribution, insights, progressTimeline } = analytics;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'dsa': return { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'web': return { bg: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'ml': return { bg: 'from-purple-500 to-pink-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      default: return { bg: 'from-gray-500 to-gray-600', light: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const getDifficultyLabel = (score: number) => {
    if (score < 0.35) return { label: 'Easy', color: 'text-green-600 bg-green-50' };
    if (score < 0.65) return { label: 'Medium', color: 'text-amber-600 bg-amber-50' };
    return { label: 'Hard', color: 'text-red-600 bg-red-50' };
  };

  const maxTimeline = Math.max(...progressTimeline.map(t => t.completedTotal), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
        >
          <span>←</span> Back to Dashboard
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-medium">
          <Brain size={16} />
          ML-Powered Analytics
        </div>
      </div>

      {/* Performance Score Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Performance Score */}
          <div className="text-center md:text-left">
            <p className="text-indigo-300 text-sm font-medium mb-2">Performance Score</p>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {overview.performanceScore}
            </div>
            <p className="text-indigo-300 text-xs mt-1">out of 100</p>
          </div>

          {/* Streak */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <Flame className="text-orange-400" size={24} />
              <div>
                <p className="text-2xl font-bold">{overview.currentStreak}</p>
                <p className="text-xs text-indigo-300">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Velocity */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <Zap className="text-yellow-400" size={24} />
              <div>
                <p className="text-2xl font-bold">{overview.learningVelocity}</p>
                <p className="text-xs text-indigo-300">Topics/Week</p>
              </div>
            </div>
          </div>

          {/* ETA */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <Target className="text-emerald-400" size={24} />
              <div>
                <p className="text-2xl font-bold">
                  {overview.estimatedDaysToComplete ? `${overview.estimatedDaysToComplete}d` : '—'}
                </p>
                <p className="text-xs text-indigo-300">To Complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {(['overview', 'predictions', 'insights'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'overview' && <BarChart3 className="inline mr-2" size={16} />}
            {tab === 'predictions' && <Brain className="inline mr-2" size={16} />}
            {tab === 'insights' && <Sparkles className="inline mr-2" size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Progress Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={20} />
              Progress Timeline
            </h3>
            <div className="flex items-end gap-3 h-40">
              {progressTimeline.map((day, i) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative" style={{ height: '120px' }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-500"
                      style={{ 
                        height: `${Math.max(8, (day.completedTotal / maxTimeline) * 100)}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-indigo-700">
                        {day.completedTotal}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryBreakdown.map(cat => {
              const colors = getCategoryColor(cat.category);
              return (
                <div key={cat.category} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colors.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{cat.label}</h4>
                    <span className={`text-2xl font-bold ${colors.text}`}>{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${colors.bg} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {cat.completed} of {cat.total} topics
                  </p>
                </div>
              );
            })}
          </div>

          {/* Difficulty Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="text-amber-500" size={20} />
              Difficulty Distribution
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Easy', count: difficultyDistribution.easy, color: 'from-green-400 to-emerald-500', bg: 'bg-green-50', emoji: '🟢' },
                { label: 'Medium', count: difficultyDistribution.medium, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', emoji: '🟡' },
                { label: 'Hard', count: difficultyDistribution.hard, color: 'from-red-400 to-rose-500', bg: 'bg-red-50', emoji: '🔴' }
              ].map(d => (
                <div key={d.label} className={`${d.bg} rounded-xl p-4 text-center`}>
                  <span className="text-2xl">{d.emoji}</span>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{d.count}</p>
                  <p className="text-sm text-gray-600">{d.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="text-indigo-600" size={24} />
              <h3 className="text-lg font-bold text-gray-900">ML-Powered Recommendations</h3>
            </div>
            <p className="text-sm text-gray-600">
              TensorFlow.js neural network analyzes your learning patterns to suggest the optimal next topics.
            </p>
          </div>

          {predictions.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <Trophy className="mx-auto text-green-600 mb-3" size={40} />
              <p className="text-green-900 font-semibold text-lg">All Topics Completed!</p>
              <p className="text-green-700 text-sm mt-1">Incredible achievement!</p>
            </div>
          ) : (
            predictions.map((pred, idx) => {
              const diffInfo = getDifficultyLabel(pred.difficulty);
              const catColors = getCategoryColor(pred.category);
              const formattedId = pred.subtopicId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              
              return (
                <div
                  key={pred.subtopicId}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                >
                  <div className="flex">
                    {/* Rank indicator */}
                    <div className={`w-2 bg-gradient-to-b ${catColors.bg}`}></div>
                    
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{formattedId}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffInfo.color}`}>
                                {diffInfo.label}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColors.light} ${catColors.text}`}>
                                {pred.category.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* ML Confidence Score */}
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Sparkles className="text-amber-500" size={14} />
                            <span className="text-lg font-bold text-indigo-600">
                              {Math.round(pred.score * 100)}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">ML confidence</p>
                        </div>
                      </div>

                      {/* Confidence bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pred.score * 100}%` }}
                        />
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{pred.reason}</p>

                      <button
                        onClick={() => onSubtopicSelect?.(pred.subtopicId)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        Start Learning
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-5 flex items-start gap-4 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{insight.text}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {insight.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <ArrowUpRight className="text-green-600" size={18} />
                Strengths
              </h4>
              {analytics.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {analytics.strengths.map(s => (
                    <li key={s} className="flex items-center gap-2 text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-600 text-sm">Complete more topics to identify strengths!</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <Target className="text-amber-600" size={18} />
                Areas to Improve
              </h4>
              {analytics.weaknesses.length > 0 ? (
                <ul className="space-y-2">
                  {analytics.weaknesses.map(w => (
                    <li key={w} className="flex items-center gap-2 text-amber-700">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      {w}
                    </li>
                  ))}
                </ul>
              ) : analytics.unexplored.length > 0 ? (
                <div>
                  <p className="text-amber-600 text-sm mb-2">Explore these new areas:</p>
                  <ul className="space-y-1">
                    {analytics.unexplored.map(u => (
                      <li key={u} className="text-amber-700 text-sm flex items-center gap-2">
                        <BookOpen size={14} />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-amber-600 text-sm">Great job! No major weaknesses detected.</p>
              )}
            </div>
          </div>

          {/* Model Info */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Brain className="text-gray-600" size={16} />
              About the ML Model
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Framework</p>
                <p className="font-medium text-gray-800">TensorFlow.js</p>
              </div>
              <div>
                <p className="text-gray-500">Architecture</p>
                <p className="font-medium text-gray-800">Dense Neural Net</p>
              </div>
              <div>
                <p className="text-gray-500">Features</p>
                <p className="font-medium text-gray-800">8-dimensional</p>
              </div>
              <div>
                <p className="text-gray-500">Model Version</p>
                <p className="font-medium text-gray-800">v1.0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
