require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db.js');
const { predictor, AnalyticsEngine } = require('./mlService.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'student_id']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Enhanced auth middleware - validate student_id exists
const authenticateStudent = async (req, res, next) => {
  const { student_id } = req.headers;
  if (!student_id) return res.status(401).json({ error: 'student_id required' });
  try {
    const [rows] = await db.pool.execute('SELECT id FROM users WHERE id = ?', [student_id]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid student_id' });
    req.student_id = student_id;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth error' });
  }
};

// Test endpoint
app.get('/health', (req, res) => res.json({ status: 'OK', db: 'MySQL connected' }));

// Users
app.post('/api/login', async (req, res) => {
  try {
    const { name, roll_number } = req.body;
    if (!name || !roll_number) return res.status(400).json({ error: 'name and roll_number required' });
    
    // Check if user exists by roll_number
    let [rows] = await db.pool.execute(
      'SELECT * FROM users WHERE roll_number = ?',
      [roll_number.toUpperCase()]
    );
    
    let user;
    if (rows.length === 0) {
      // Create new user
      const newId = `STU${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      [rows] = await db.pool.execute(
        'INSERT INTO users (id, name, roll_number, email, avatar) VALUES (?, ?, ?, ?, ?)',
        [newId, name, roll_number.toUpperCase(), `${roll_number}@student.com`, '']
      );
      user = { id: newId, name, roll_number: roll_number.toUpperCase(), email: `${roll_number}@student.com`, total_progress: 0 };
    } else {
      user = rows[0];
      // Compute total_progress as sum of progress percentages / num topics or something
      const [progressRows] = await db.pool.execute(
        'SELECT AVG(progress_percentage) as avg_progress FROM user_progress WHERE user_id = ?',
        [user.id]
      );
      user.total_progress = Math.round(progressRows[0].avg_progress || 0);
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const [result] = await db.pool.execute(
      'INSERT INTO users (id, name, roll_number, email, avatar) VALUES (?, ?, ?, ?, ?)',
      [req.body.id, req.body.name, req.body.roll_number, req.body.email, req.body.avatar]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Topics (static for now)
app.get('/api/topics', async (req, res) => {
  try {
    const [rows] = await db.pool.execute('SELECT * FROM topics');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Progress
app.post('/api/progress', authenticateStudent, async (req, res) => {
  try {
    const [result] = await db.pool.execute(
      `INSERT INTO user_progress (user_id, topic_id, completed_subtopics, current_subtopic, progress_percentage) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
         completed_subtopics = VALUES(completed_subtopics),
         current_subtopic = VALUES(current_subtopic),
         progress_percentage = VALUES(progress_percentage),
         updated_at = CURRENT_TIMESTAMP`,
      [req.student_id, req.body.topic_id, JSON.stringify(req.body.completed_subtopics || []), req.body.current_subtopic || '', req.body.progress_percentage || 0]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all progress for a user (used on login to restore completed subtopics)
app.get('/api/progress/all', authenticateStudent, async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      'SELECT topic_id, completed_subtopics, progress_percentage FROM user_progress WHERE user_id = ?',
      [req.student_id]
    );
    // Flatten all completed subtopics into one array
    let allCompleted = [];
    for (const row of rows) {
      try {
        const subtopics = typeof row.completed_subtopics === 'string' 
          ? JSON.parse(row.completed_subtopics) 
          : row.completed_subtopics || [];
        allCompleted = allCompleted.concat(subtopics);
      } catch (e) {}
    }
    res.json({ completedSubtopics: [...new Set(allCompleted)], progressByTopic: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/progress/:topic_id', authenticateStudent, async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM user_progress WHERE user_id = ? AND topic_id = ?',
      [req.student_id, req.params.topic_id]
    );
    res.json(rows[0] || { completed_subtopics: [], progress_percentage: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat Messages
app.post('/api/chat_messages', authenticateStudent, async (req, res) => {
  try {
    const { topic_id, user_message } = req.body;
    // Generate AI response (simple, move to service later)
    const ai_response = `AI Response to: ${user_message}`; // Integrate aiService later
    const [result] = await db.pool.execute(
      'INSERT INTO chat_messages (student_id, topic_id, user_message, ai_response) VALUES (?, ?, ?, ?)',
      [req.student_id, topic_id, user_message, ai_response]
    );
    res.json({ id: result.insertId, ai_response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chat_messages/:topic_id', authenticateStudent, async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM chat_messages WHERE student_id = ? AND topic_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.student_id, req.params.topic_id]
    );
    res.json(rows.reverse()); // Chronological
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recommendations
app.post('/api/recommendations', authenticateStudent, async (req, res) => {
  try {
    const [result] = await db.pool.execute(
      'INSERT INTO recommendations (student_id, recommended_topic_id, recommended_subtopic_id, reason, confidence_score) VALUES (?, ?, ?, ?, ?)',
      [req.student_id, req.body.recommended_topic_id, req.body.recommended_subtopic_id, req.body.reason, req.body.confidence_score]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/recommendations', authenticateStudent, async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM recommendations WHERE student_id = ? AND dismissed = FALSE ORDER BY priority DESC, created_at DESC LIMIT 10',
      [req.student_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
  try {
    const [users] = await db.pool.execute(
      `SELECT u.id, u.name, u.email, u.roll_number, u.avatar
        FROM users u
        ORDER BY u.name
        LIMIT 50`
    );
    // For each user, count their total completed subtopics
    const enrichedUsers = [];
    for (const u of users) {
      const [progressRows] = await db.pool.execute(
        'SELECT completed_subtopics FROM user_progress WHERE user_id = ?',
        [u.id]
      );
      let totalCompleted = 0;
      for (const row of progressRows) {
        try {
          const subtopics = typeof row.completed_subtopics === 'string'
            ? JSON.parse(row.completed_subtopics)
            : row.completed_subtopics || [];
          totalCompleted += subtopics.length;
        } catch (e) {}
      }
      enrichedUsers.push({
        ...u,
        totalProgress: totalCompleted,
        rollNumber: u.roll_number
      });
    }
    // Sort by totalProgress descending
    enrichedUsers.sort((a, b) => b.totalProgress - a.totalProgress);
    res.json(enrichedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Learning History & Study Sessions (similar CRUD)
app.post('/api/learning_history', authenticateStudent, async (req, res) => {
  try {
    const [result] = await db.pool.execute(
      'INSERT INTO learning_history SET ?',
      { ...req.body, student_id: req.student_id }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/learning_history', authenticateStudent, async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM learning_history WHERE student_id = ? ORDER BY created_at DESC LIMIT 100',
      [req.student_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/study_sessions', authenticateStudent, async (req, res) => {
  try {
    const [result] = await db.pool.execute(
      'INSERT INTO study_sessions SET ?',
      { ...req.body, student_id: req.student_id }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ML ENDPOINTS ==========

// Initialize ML model at startup
predictor.initialize().catch(err => console.error('ML init error:', err.message));

// ML: Predict next best topics
app.get('/api/ml/predict-next', authenticateStudent, async (req, res) => {
  try {
    // Get student's completed subtopics
    const [rows] = await db.pool.execute(
      'SELECT completed_subtopics FROM user_progress WHERE user_id = ?',
      [req.student_id]
    );
    let allCompleted = [];
    for (const row of rows) {
      try {
        const subtopics = typeof row.completed_subtopics === 'string'
          ? JSON.parse(row.completed_subtopics)
          : row.completed_subtopics || [];
        allCompleted = allCompleted.concat(subtopics);
      } catch (e) {}
    }
    allCompleted = [...new Set(allCompleted)];

    const predictions = await predictor.predictNextTopics(allCompleted, 5);

    // Save predictions to DB
    for (const pred of predictions) {
      try {
        await db.pool.execute(
          `INSERT INTO ml_predictions (student_id, prediction_type, predicted_subtopic_id, predicted_value, confidence_score, features_used)
           VALUES (?, 'next_topic', ?, ?, ?, ?)`,
          [req.student_id, pred.subtopicId, pred.score, pred.score, JSON.stringify({ completedCount: allCompleted.length })]
        );
      } catch (e) { /* ignore duplicate errors */ }
    }

    res.json({ predictions, completedCount: allCompleted.length, totalTopics: 19 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ML: Performance analytics
app.get('/api/ml/analytics', authenticateStudent, async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      'SELECT completed_subtopics, topic_id, progress_percentage FROM user_progress WHERE user_id = ?',
      [req.student_id]
    );
    let allCompleted = [];
    for (const row of rows) {
      try {
        const subtopics = typeof row.completed_subtopics === 'string'
          ? JSON.parse(row.completed_subtopics)
          : row.completed_subtopics || [];
        allCompleted = allCompleted.concat(subtopics);
      } catch (e) {}
    }
    allCompleted = [...new Set(allCompleted)];

    const analytics = AnalyticsEngine.generateAnalytics(allCompleted, rows);

    // Save daily analytics snapshot
    const today = new Date().toISOString().split('T')[0];
    try {
      await db.pool.execute(
        `INSERT INTO learning_analytics (student_id, metric_type, metric_date, metric_value, metadata)
         VALUES (?, 'daily_progress', ?, ?, ?)
         ON DUPLICATE KEY UPDATE metric_value = VALUES(metric_value), metadata = VALUES(metadata)`,
        [req.student_id, today, allCompleted.length, JSON.stringify(analytics.overview)]
      );
    } catch (e) {}

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ML: Study time estimation
app.post('/api/ml/estimate-time', authenticateStudent, async (req, res) => {
  try {
    const { subtopic_id } = req.body;
    if (!subtopic_id) return res.status(400).json({ error: 'subtopic_id required' });

    const [rows] = await db.pool.execute(
      'SELECT completed_subtopics FROM user_progress WHERE user_id = ?',
      [req.student_id]
    );
    let allCompleted = [];
    for (const row of rows) {
      try {
        const subtopics = typeof row.completed_subtopics === 'string'
          ? JSON.parse(row.completed_subtopics)
          : row.completed_subtopics || [];
        allCompleted = allCompleted.concat(subtopics);
      } catch (e) {}
    }
    allCompleted = [...new Set(allCompleted)];

    const estimation = await predictor.estimateStudyTime(subtopic_id, allCompleted);
    res.json(estimation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ML: Personalized insights
app.get('/api/ml/insights', authenticateStudent, async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      'SELECT completed_subtopics FROM user_progress WHERE user_id = ?',
      [req.student_id]
    );
    let allCompleted = [];
    for (const row of rows) {
      try {
        const subtopics = typeof row.completed_subtopics === 'string'
          ? JSON.parse(row.completed_subtopics)
          : row.completed_subtopics || [];
        allCompleted = allCompleted.concat(subtopics);
      } catch (e) {}
    }
    allCompleted = [...new Set(allCompleted)];

    // Get predictions + analytics
    const predictions = await predictor.predictNextTopics(allCompleted, 3);
    const analytics = AnalyticsEngine.generateAnalytics(allCompleted, rows);

    res.json({
      nextRecommendations: predictions,
      insights: analytics.insights,
      performanceScore: analytics.overview.performanceScore,
      strengths: analytics.strengths,
      weaknesses: analytics.weaknesses,
      unexplored: analytics.unexplored,
      streak: analytics.overview.currentStreak
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`MySQL Backend running on http://localhost:${PORT}`);
});
