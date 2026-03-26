import type { Topic, Subtopic } from '../types';

interface ChatContext {
  topicId: string;
  subtopicId?: string;
  studentProgress: number;
  studentId?: string;
}

const topicKnowledge: Record<string, string> = {
  'dsa-intro': 'Data Structures and Algorithms fundamentals cover essential programming concepts including time complexity, space complexity, and Big-O notation analysis.',
  'arrays': 'Arrays are contiguous memory structures for storing multiple elements of same type. Key operations: traversal O(n), access O(1), insertion/deletion O(n).',
  'math': 'Mathematical concepts in programming include number theory, modular arithmetic, GCD/LCM, prime numbers, and combinatorics — essential for algorithm optimization.',
  'recursion': 'Recursion is a technique where a function calls itself. Key concepts: base case, recursive case, call stack, tail recursion, and memoization.',
  'hashing': 'Hashing maps keys to values using hash functions. Hash tables provide O(1) average lookup. Collision handling: chaining and open addressing.',
  'strings': 'Strings are sequences of characters. Key algorithms: KMP pattern matching, Rabin-Karp, Z-algorithm, and string manipulation techniques.',
  'linked-lists': 'Linked Lists are non-contiguous data structures with nodes connected by pointers. Types: singly, doubly, and circular linked lists.',
  'greedy': 'Greedy algorithms make locally optimal choices at each step. Used for optimization problems like scheduling, Huffman coding, and minimum spanning trees.',
  'binary-search': 'Binary search efficiently finds elements in sorted arrays in O(log n). Variations: lower/upper bound, search in rotated arrays.',
  'heaps': 'Heaps are complete binary trees used for priority queues. Types: min-heap, max-heap. Operations: insert O(log n), extract O(log n).',
  'stacks-queues': 'Stacks follow LIFO (Last In First Out) and Queues follow FIFO (First In First Out). Used in expression evaluation, BFS, and DFS.',
  'sliding-window': 'Sliding window optimizes array/string problems by maintaining a window of elements. Two-pointer technique solves pair/triplet problems efficiently.',
  'html-basics': 'HTML provides the structure for web pages using semantic markup. Key: tags, attributes, forms, tables, and HTML5 semantic elements.',
  'css-styling': 'CSS controls visual presentation. Key concepts: selectors, box model, flexbox, grid, animations, responsive design, and media queries.',
  'javascript-fundamentals': 'JavaScript enables interactivity. Key: variables, functions, closures, promises, async/await, DOM manipulation, and event handling.',
  'react-basics': 'React is a component-based UI library. Key: JSX, props, state, hooks (useState, useEffect, useContext), and virtual DOM.',
  'nodejs-backend': 'Node.js runs JavaScript server-side. Express.js for routing, middleware, REST APIs, authentication, and database integration.',
  'ml-intro': 'Machine Learning enables computers to learn from data. Types: supervised, unsupervised, reinforcement learning. Key: features, labels, training.',
  'supervised-learning': 'Supervised learning uses labeled data. Algorithms: linear regression, logistic regression, decision trees, random forests, SVM, neural networks.'
};

// Enhanced AI response generation with context awareness
const generateContextAwareResponse = (userMessage: string, context: ChatContext): string => {
  const userQuery = userMessage.toLowerCase().trim();
  const topicId = context.topicId;
  const topicInfo = topicKnowledge[topicId];

  // Direct topic questions
  if (userQuery.includes('what is') || userQuery.includes('explain') || userQuery.includes('tell me about')) {
    // Check if asking about the current topic
    if (topicInfo) {
      return `📚 **${topicId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}**\n\n${topicInfo}\n\n💡 **Tip**: Try solving 2-3 practice problems to reinforce your understanding. Hands-on coding > passive learning!`;
    }
    
    // Search across all topics
    for (const [key, info] of Object.entries(topicKnowledge)) {
      if (userQuery.includes(key.replace(/-/g, ' ')) || userQuery.includes(key)) {
        return `📚 **${key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}**\n\n${info}\n\n🎯 Would you like practice problems or a deeper dive?`;
      }
    }
  }

  // Time complexity questions  
  if (userQuery.includes('time complexity') || userQuery.includes('big o') || userQuery.includes('complexity')) {
    return `⏱️ **Time Complexity Cheat Sheet**\n\n• O(1) — Constant: Array access, hash lookup\n• O(log n) — Logarithmic: Binary search\n• O(n) — Linear: Simple loop, linear search\n• O(n log n) — Linearithmic: Merge sort, heap sort\n• O(n²) — Quadratic: Nested loops, bubble sort\n• O(2ⁿ) — Exponential: Recursive fibonacci\n\n💡 Always analyze worst-case and average-case for interviews!`;
  }

  // Study strategy questions
  if (userQuery.includes('how to study') || userQuery.includes('study plan') || userQuery.includes('how to prepare')) {
    const progress = context.studentProgress;
    if (progress < 5) {
      return `📋 **Study Plan for Beginners**\n\n1. Start with fundamentals — don't skip!\n2. Practice 2-3 easy problems daily\n3. Understand the concept before coding\n4. Use pen & paper to trace algorithms\n5. Review and revise weekly\n\n🎯 Focus on understanding over speed. You're building a foundation!`;
    }
    return `📋 **Accelerated Study Plan**\n\n1. You've completed ${progress} topics — great progress! 🔥\n2. Mix up difficulty: 1 easy + 2 medium + 1 hard daily\n3. Time yourself on practice problems\n4. Review your weak areas identified in ML Analytics\n5. Teach concepts to solidify understanding\n\n💪 You're on the right track!`;
  }

  // Help/struggle
  if (userQuery.includes('help') || userQuery.includes('struggling') || userQuery.includes('stuck') || userQuery.includes('confused')) {
    return `🤝 **I'm here to help!** Let me know:\n\n1. 📌 Which specific concept is confusing?\n2. 🔍 What have you tried so far?\n3. ❓ What error or confusion are you facing?\n\n**Quick debugging checklist:**\n• Re-read the problem statement carefully\n• Break the problem into smaller parts\n• Try solving a simpler version first\n• Draw it out on paper\n\nThe more specific you are, the better I can guide you!`;
  }

  // Hints
  if (userQuery.includes('hint') || userQuery.includes('clue') || userQuery.includes('tip')) {
    if (topicInfo) {
      return `💡 **Hints for ${topicId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}**\n\n• Think about the data structure properties\n• Consider edge cases (empty, single element, sorted)\n• Ask: Can I solve this with ${topicId.includes('array') ? 'two pointers' : topicId.includes('tree') ? 'recursion/DFS' : 'a simpler approach first'}?\n• Review the time complexity requirements\n\n🧪 Try implementing your approach and test with the practice problems!`;
    }
    return `💡 **General Problem-Solving Hints**\n\n• Break the problem into smaller parts\n• Try brute force first, then optimize\n• Look at similar problems you've solved\n• Check edge cases: empty input, single element\n• Discuss the approach before coding`;
  }

  // Motivation
  if (userQuery.includes('motivat') || userQuery.includes('discouraged') || userQuery.includes('give up') || userQuery.includes('hard')) {
    return `🌟 **You've got this!**\n\n✅ Every expert was once a beginner\n✅ Struggling means you're learning\n✅ ${context.studentProgress > 0 ? `You've already completed ${context.studentProgress} topics!` : 'The first step is always the hardest'}\n✅ Consistent daily practice beats marathon sessions\n\n💪 "The master has failed more times than the beginner has tried."\n\nTake a 5-minute break, then come back stronger! 🚀`;
  }

  // Next steps
  if (userQuery.includes('next') || userQuery.includes('what should i') || userQuery.includes('recommend')) {
    return `🎯 **What to do next**\n\nCheck your **ML Analytics Dashboard** for personalized recommendations! The TensorFlow.js model analyzes your learning patterns to suggest the optimal next topic.\n\n📊 Click the "ML" button in the navigation bar to see:\n• AI-powered next-topic predictions\n• Your learning strengths & weaknesses\n• Performance score and progress trends\n\nThe model gets smarter as you learn more!`;
  }

  // Interview specific
  if (userQuery.includes('interview') || userQuery.includes('placement')) {
    return `🎤 **Interview Prep Guide**\n\n**Must-know topics (in order):**\n1. Arrays & Strings — most common\n2. Linked Lists & Stacks/Queues\n3. Trees & Graphs\n4. Dynamic Programming\n5. System Design basics\n\n**During the interview:**\n• Clarify the problem first\n• Think aloud — explain your approach\n• Start with brute force, then optimize\n• Test with edge cases\n• Practice mock interviews\n\n📌 Focus on Striver's SDE Sheet — it covers the top 190 problems!`;
  }

  // Practice
  if (userQuery.includes('practice') || userQuery.includes('problem') || userQuery.includes('exercise')) {
    return `🏋️ **Practice Resources**\n\n**Curated Platforms:**\n• Striver SDE Sheet — 190 handpicked problems\n• LeetCode — Organized by topic & difficulty\n• Codeforces — Competitive programming\n• HackerRank — Language-specific tracks\n\n**Daily Practice Schedule:**\n• Morning: 1 new concept (30 min)\n• Afternoon: 2-3 practice problems (60 min)\n• Evening: Review solutions (20 min)\n\n🎯 Quality over quantity — understand each solution deeply!`;
  }

  // Default — context-aware
  if (topicInfo) {
    return `I'm your AI study buddy for **${topicId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}**! 🤖\n\nI can help you with:\n• 📚 Concept explanations\n• 💡 Problem-solving hints\n• 🎯 What to study next\n• 📋 Study strategy advice\n• 🎤 Interview preparation\n\nAsk me anything specific about this topic!`;
  }

  return `Hey there! 👋 I'm your AI Study Buddy.\n\nI can help you with:\n• 📚 Explain any DSA/Web/ML concept\n• 💡 Give hints for practice problems\n• 📋 Create a study plan\n• 🎯 Suggest what to learn next\n• 🎤 Interview prep guidance\n\nWhat would you like help with?`;
};

export const aiService = {
  generateChatResponse: (userMessage: string, context: ChatContext): string => {
    return generateContextAwareResponse(userMessage, context);
  },

  generateRecommendations: (
    completedSubtopics: string[],
    allTopics: Topic[],
    studentProgress: number
  ): Array<{ topicId: string; subtopicId: string; reason: string; confidence: number }> => {
    const recommendations: Array<{ topicId: string; subtopicId: string; reason: string; confidence: number }> = [];

    // Find topics with completed prerequisites
    allTopics.forEach(topic => {
      const topicSubtopics = topic.subtopics || [];

      topicSubtopics.forEach(subtopic => {
        if (!completedSubtopics.includes(subtopic.id)) {
          // Check if prerequisites are met
          const prerequisitesMet = !topic.prerequisites ||
            topic.prerequisites.length === 0 ||
            topic.prerequisites.every(prereq =>
              completedSubtopics.some(completed => completed.includes(prereq.split('-')[0]))
            );

          if (prerequisitesMet) {
            // Calculate confidence based on completion rate of topic
            const completedInTopic = topicSubtopics.filter(s =>
              completedSubtopics.includes(s.id)
            ).length;
            const topicCompletion = (completedInTopic / topicSubtopics.length) * 100;

            let reason = '';
            let confidence = 0;

            if (topicCompletion === 0) {
              reason = 'New topic — Great for expanding your knowledge';
              confidence = 0.6;
            } else if (topicCompletion < 50) {
              reason = 'Continue with this topic — You\'re making progress';
              confidence = 0.85;
            } else {
              reason = 'Almost there! Complete this topic for mastery';
              confidence = 0.95;
            }

            recommendations.push({
              topicId: topic.id,
              subtopicId: subtopic.id,
              reason,
              confidence
            });
          }
        }
      });
    });

    // Sort by confidence and topic progression
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  },

  analyzeStudentPerformance: (completedCount: number, totalCount: number): string => {
    const percentage = (completedCount / totalCount) * 100;

    if (percentage === 0) {
      return 'Just starting! Keep going — every expert was once a beginner. 🌱';
    }
    if (percentage < 25) {
      return 'Good start! You\'re building a solid foundation. 📈';
    }
    if (percentage < 50) {
      return 'Great progress! You\'re halfway there! 🔥';
    }
    if (percentage < 75) {
      return 'Impressive! You\'re dominating the course! 💪';
    }
    if (percentage < 100) {
      return 'Almost there! Final push to complete mastery! 🏆';
    }
    return 'Congratulations! You\'ve mastered everything! 🎓';
  },

  // New: Fetch ML-powered time estimation
  fetchStudyTimeEstimation: async (studentId: string, subtopicId: string): Promise<{
    estimatedMinutes: number;
    baseMinutes: number;
    adjustmentFactor: number;
    confidence: number;
  } | null> => {
    try {
      const res = await fetch('http://localhost:3001/api/ml/estimate-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'student_id': studentId
        },
        body: JSON.stringify({ subtopic_id: subtopicId })
      });
      return await res.json();
    } catch {
      return null;
    }
  }
};
