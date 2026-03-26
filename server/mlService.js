/**
 * ML Service — TensorFlow.js-based Learning Analytics Engine
 * 
 * Provides:
 * 1. Next-topic prediction based on learning patterns
 * 2. Study time estimation
 * 3. Performance analytics & trend detection
 * 4. Personalized learning insights
 */

const tf = require('@tensorflow/tfjs');

// ========== TOPIC METADATA (mirrors frontend topics.ts) ==========
const TOPIC_ORDER = [
  'dsa-intro', 'arrays', 'math', 'recursion', 'hashing', 'strings',
  'linked-lists', 'greedy', 'binary-search', 'heaps', 'stacks-queues', 'sliding-window',
  'html-basics', 'css-styling', 'javascript-fundamentals', 'react-basics', 'nodejs-backend',
  'ml-intro', 'supervised-learning'
];

const TOPIC_DIFFICULTY = {
  'dsa-intro': 0.2, 'arrays': 0.4, 'math': 0.3, 'recursion': 0.6,
  'hashing': 0.5, 'strings': 0.5, 'linked-lists': 0.6, 'greedy': 0.7,
  'binary-search': 0.6, 'heaps': 0.7, 'stacks-queues': 0.6, 'sliding-window': 0.7,
  'html-basics': 0.1, 'css-styling': 0.2, 'javascript-fundamentals': 0.4,
  'react-basics': 0.5, 'nodejs-backend': 0.6,
  'ml-intro': 0.3, 'supervised-learning': 0.6
};

const TOPIC_CATEGORY = {
  'dsa-intro': 'dsa', 'arrays': 'dsa', 'math': 'dsa', 'recursion': 'dsa',
  'hashing': 'dsa', 'strings': 'dsa', 'linked-lists': 'dsa', 'greedy': 'dsa',
  'binary-search': 'dsa', 'heaps': 'dsa', 'stacks-queues': 'dsa', 'sliding-window': 'dsa',
  'html-basics': 'web', 'css-styling': 'web', 'javascript-fundamentals': 'web',
  'react-basics': 'web', 'nodejs-backend': 'web',
  'ml-intro': 'ml', 'supervised-learning': 'ml'
};

const ESTIMATED_MINUTES = {
  'dsa-intro': 60, 'arrays': 90, 'math': 45, 'recursion': 80,
  'hashing': 65, 'strings': 75, 'linked-lists': 95, 'greedy': 70,
  'binary-search': 85, 'heaps': 75, 'stacks-queues': 80, 'sliding-window': 90,
  'html-basics': 60, 'css-styling': 90, 'javascript-fundamentals': 120,
  'react-basics': 150, 'nodejs-backend': 100,
  'ml-intro': 45, 'supervised-learning': 80
};

// ====== FEATURE ENGINEERING ======

function encodeTopicFeatures(subtopicId, completedSubtopics) {
  const topicIndex = TOPIC_ORDER.indexOf(subtopicId);
  const difficulty = TOPIC_DIFFICULTY[subtopicId] || 0.5;
  const category = TOPIC_CATEGORY[subtopicId] || 'dsa';

  // Category one-hot
  const catDsa = category === 'dsa' ? 1 : 0;
  const catWeb = category === 'web' ? 1 : 0;
  const catMl = category === 'ml' ? 1 : 0;

  // Completion context
  const totalCompleted = completedSubtopics.length;
  const completionRatio = totalCompleted / TOPIC_ORDER.length;

  // Same-category completion ratio
  const sameCatTopics = TOPIC_ORDER.filter(t => TOPIC_CATEGORY[t] === category);
  const sameCatCompleted = sameCatTopics.filter(t => completedSubtopics.includes(t)).length;
  const sameCatRatio = sameCatCompleted / sameCatTopics.length;

  // Sequential readiness (how many prerequisites completed in order)
  const orderIndex = topicIndex / TOPIC_ORDER.length;

  return [
    orderIndex,          // position in curriculum
    difficulty,          // topic difficulty
    catDsa, catWeb, catMl, // category one-hot
    completionRatio,     // overall progress
    sameCatRatio,        // category-specific progress
    totalCompleted / 19  // normalized completed count
  ];
}

// ====== ML MODELS ======

class LearningPredictor {
  constructor() {
    this.nextTopicModel = null;
    this.timeEstimatorModel = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Build next-topic recommendation model
      this.nextTopicModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [8], units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });
      this.nextTopicModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      // Build study time estimator model
      this.timeEstimatorModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [8], units: 24, activation: 'relu' }),
          tf.layers.dense({ units: 12, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'linear' })
        ]
      });
      this.timeEstimatorModel.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'meanSquaredError'
      });

      // Train with synthetic data for cold-start
      await this._warmupModels();
      this.initialized = true;
      console.log('✅ ML Models initialized successfully');
    } catch (err) {
      console.error('❌ ML Model initialization error:', err.message);
      this.initialized = false;
    }
  }

  async _warmupModels() {
    // Generate synthetic training data based on domain knowledge
    const trainingData = [];
    const labels = [];
    const timeData = [];
    const timeLabels = [];

    // Simulate different student profiles
    for (let studentLevel = 0; studentLevel <= 1; studentLevel += 0.1) {
      for (let topicIdx = 0; topicIdx < TOPIC_ORDER.length; topicIdx++) {
        const subtopicId = TOPIC_ORDER[topicIdx];
        const numCompleted = Math.floor(studentLevel * TOPIC_ORDER.length);
        const completedSubtopics = TOPIC_ORDER.slice(0, numCompleted);

        const features = encodeTopicFeatures(subtopicId, completedSubtopics);
        trainingData.push(features);

        // Label: higher score if topic is the natural next step
        const isNextLogical = topicIdx === numCompleted;
        const isNearNext = Math.abs(topicIdx - numCompleted) <= 2;
        const difficultyMatch = Math.abs(TOPIC_DIFFICULTY[subtopicId] - studentLevel) < 0.3;
        
        let score = 0;
        if (isNextLogical && difficultyMatch) score = 0.95;
        else if (isNearNext && difficultyMatch) score = 0.7;
        else if (isNearNext) score = 0.4;
        else score = 0.1;
        labels.push([score]);

        // Time estimation training
        timeData.push(features);
        const baseTime = ESTIMATED_MINUTES[subtopicId] || 60;
        const difficultyFactor = 1 + (TOPIC_DIFFICULTY[subtopicId] - studentLevel) * 0.5;
        const estimatedTime = baseTime * Math.max(0.5, Math.min(2, difficultyFactor));
        timeLabels.push([estimatedTime / 200]); // normalize
      }
    }

    const xs = tf.tensor2d(trainingData);
    const ys = tf.tensor2d(labels);
    const txs = tf.tensor2d(timeData);
    const tys = tf.tensor2d(timeLabels);

    await this.nextTopicModel.fit(xs, ys, { epochs: 30, verbose: 0, batchSize: 32 });
    await this.timeEstimatorModel.fit(txs, tys, { epochs: 20, verbose: 0, batchSize: 32 });

    xs.dispose(); ys.dispose(); txs.dispose(); tys.dispose();
  }

  /**
   * Predict the best next subtopics for a student
   */
  async predictNextTopics(completedSubtopics, topN = 5) {
    if (!this.initialized) await this.initialize();

    const uncompleted = TOPIC_ORDER.filter(t => !completedSubtopics.includes(t));
    if (uncompleted.length === 0) return [];

    const predictions = [];

    for (const subtopicId of uncompleted) {
      const features = encodeTopicFeatures(subtopicId, completedSubtopics);
      const inputTensor = tf.tensor2d([features]);
      const score = this.nextTopicModel.predict(inputTensor).dataSync()[0];
      inputTensor.dispose();

      predictions.push({
        subtopicId,
        score: Math.round(score * 1000) / 1000,
        difficulty: TOPIC_DIFFICULTY[subtopicId],
        category: TOPIC_CATEGORY[subtopicId],
        reason: this._generateReason(subtopicId, completedSubtopics, score)
      });
    }

    return predictions
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }

  /**
   * Estimate study time for a subtopic given student's history
   */
  async estimateStudyTime(subtopicId, completedSubtopics) {
    if (!this.initialized) await this.initialize();

    const features = encodeTopicFeatures(subtopicId, completedSubtopics);
    const inputTensor = tf.tensor2d([features]);
    const normalizedTime = this.timeEstimatorModel.predict(inputTensor).dataSync()[0];
    inputTensor.dispose();

    const estimatedMinutes = Math.round(normalizedTime * 200);
    const baseTime = ESTIMATED_MINUTES[subtopicId] || 60;

    return {
      estimatedMinutes: Math.max(15, Math.min(300, estimatedMinutes)),
      baseMinutes: baseTime,
      adjustmentFactor: Math.round((estimatedMinutes / baseTime) * 100) / 100,
      confidence: this._calculateTimeConfidence(completedSubtopics)
    };
  }

  _generateReason(subtopicId, completedSubtopics, score) {
    const topicIdx = TOPIC_ORDER.indexOf(subtopicId);
    const difficulty = TOPIC_DIFFICULTY[subtopicId];
    const category = TOPIC_CATEGORY[subtopicId];
    const sameCatCompleted = TOPIC_ORDER
      .filter(t => TOPIC_CATEGORY[t] === category && completedSubtopics.includes(t)).length;

    if (score > 0.8) return 'Highly recommended — perfect next step in your learning path';
    if (score > 0.6) return 'Great match for your current skill level';
    if (sameCatCompleted === 0) return 'Start exploring a new domain area';
    if (difficulty < 0.4) return 'Accessible topic to build confidence';
    return 'Challenging topic to push your boundaries';
  }

  _calculateTimeConfidence(completedSubtopics) {
    // More data = more confidence
    const dataPoints = completedSubtopics.length;
    return Math.min(0.95, 0.5 + dataPoints * 0.03);
  }
}

// ====== ANALYTICS ENGINE ======

class AnalyticsEngine {
  /**
   * Generate comprehensive performance analytics for a student
   */
  static generateAnalytics(completedSubtopics, progressByTopic = []) {
    const totalTopics = TOPIC_ORDER.length;
    const completedCount = completedSubtopics.length;

    // Category breakdown
    const categories = {};
    for (const [topic, cat] of Object.entries(TOPIC_CATEGORY)) {
      if (!categories[cat]) categories[cat] = { total: 0, completed: 0 };
      categories[cat].total++;
      if (completedSubtopics.includes(topic)) categories[cat].completed++;
    }

    const categoryBreakdown = Object.entries(categories).map(([name, data]) => ({
      category: name,
      label: name === 'dsa' ? 'Data Structures' : name === 'web' ? 'Web Dev' : 'Machine Learning',
      completed: data.completed,
      total: data.total,
      percentage: Math.round((data.completed / data.total) * 100)
    }));

    // Difficulty distribution
    const difficultyBuckets = { easy: 0, medium: 0, hard: 0 };
    completedSubtopics.forEach(id => {
      const diff = TOPIC_DIFFICULTY[id] || 0.5;
      if (diff < 0.35) difficultyBuckets.easy++;
      else if (diff < 0.65) difficultyBuckets.medium++;
      else difficultyBuckets.hard++;
    });

    // Strengths & weaknesses
    const strengths = categoryBreakdown
      .filter(c => c.percentage >= 50)
      .map(c => c.label);
    const weaknesses = categoryBreakdown
      .filter(c => c.percentage < 30 && c.completed > 0)
      .map(c => c.label);
    const unexplored = categoryBreakdown
      .filter(c => c.completed === 0)
      .map(c => c.label);

    // Learning velocity (subtopics/day estimated)
    const velocity = completedCount > 0 ? Math.max(0.5, completedCount / 7) : 0;

    // Estimated completion
    const remaining = totalTopics - completedCount;
    const estimatedDaysToComplete = velocity > 0 ? Math.ceil(remaining / velocity) : null;

    // Generate learning streak (simulated for current state)
    const streak = this._calculateStreak(completedSubtopics);

    // Performance score (0-100)
    const performanceScore = this._calculatePerformanceScore(
      completedCount, totalTopics, categoryBreakdown, difficultyBuckets
    );

    return {
      overview: {
        totalTopics,
        completedCount,
        overallPercentage: Math.round((completedCount / totalTopics) * 100),
        performanceScore,
        currentStreak: streak,
        estimatedDaysToComplete,
        learningVelocity: Math.round(velocity * 10) / 10
      },
      categoryBreakdown,
      difficultyDistribution: difficultyBuckets,
      strengths,
      weaknesses,
      unexplored,
      insights: this._generateInsights(completedCount, totalTopics, categoryBreakdown, difficultyBuckets, streak),
      progressTimeline: this._generateTimeline(completedSubtopics)
    };
  }

  static _calculatePerformanceScore(completedCount, totalTopics, categories, difficulty) {
    const completionScore = (completedCount / totalTopics) * 40;
    const diversityScore = categories.filter(c => c.percentage > 0).length / categories.length * 30;
    const challengeScore = (difficulty.hard + difficulty.medium * 0.5) / Math.max(1, completedCount) * 30;
    return Math.min(100, Math.round(completionScore + diversityScore + challengeScore));
  }

  static _calculateStreak(completedSubtopics) {
    // Simulated streak based on completed count
    if (completedSubtopics.length === 0) return 0;
    return Math.min(completedSubtopics.length, 7);
  }

  static _generateInsights(completedCount, totalTopics, categories, difficulty, streak) {
    const insights = [];

    if (completedCount === 0) {
      insights.push({ type: 'motivational', icon: '🚀', text: 'Start your learning journey! Begin with fundamentals.' });
    } else if (completedCount < 5) {
      insights.push({ type: 'progress', icon: '📈', text: `Great start! You've completed ${completedCount} topics. Keep the momentum going!` });
    } else {
      insights.push({ type: 'progress', icon: '🔥', text: `Impressive! ${completedCount}/${totalTopics} topics done. You're on fire!` });
    }

    // Category insights
    const strongest = categories.reduce((a, b) => a.percentage > b.percentage ? a : b);
    if (strongest.percentage > 0) {
      insights.push({ type: 'strength', icon: '💪', text: `Your strongest area is ${strongest.label} at ${strongest.percentage}% completion.` });
    }

    // Difficulty insights
    if (difficulty.hard > 2) {
      insights.push({ type: 'achievement', icon: '🏆', text: `You've tackled ${difficulty.hard} hard topics! Great problem-solver.` });
    }
    if (difficulty.easy > 0 && difficulty.medium === 0 && difficulty.hard === 0) {
      insights.push({ type: 'suggestion', icon: '🎯', text: 'Try some medium-difficulty topics to level up!' });
    }

    // Streak insight
    if (streak >= 3) {
      insights.push({ type: 'streak', icon: '⚡', text: `${streak}-day streak! Consistency is key to mastery.` });
    }

    // Adaptive suggestion
    const unfinished = categories.filter(c => c.percentage > 0 && c.percentage < 100);
    if (unfinished.length > 0) {
      const nearComplete = unfinished.sort((a, b) => b.percentage - a.percentage)[0];
      insights.push({ type: 'suggestion', icon: '🎯', text: `Almost there with ${nearComplete.label}! Just ${nearComplete.total - nearComplete.completed} more to go.` });
    }

    return insights;
  }

  static _generateTimeline(completedSubtopics) {
    // Generate a simulated progress timeline (last 7 days)
    const timeline = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Distribute completed subtopics across recent days
      const dayProgress = Math.floor(completedSubtopics.length * ((7 - i) / 7));
      timeline.push({
        date: dateStr,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completedTotal: dayProgress,
        dailyNew: i === 0 ? completedSubtopics.length - Math.floor(completedSubtopics.length * (6 / 7)) : Math.floor(completedSubtopics.length / 7)
      });
    }
    return timeline;
  }
}

// ====== SINGLETON ======
const predictor = new LearningPredictor();

module.exports = {
  predictor,
  AnalyticsEngine,
  TOPIC_ORDER,
  TOPIC_DIFFICULTY,
  TOPIC_CATEGORY,
  ESTIMATED_MINUTES
};
