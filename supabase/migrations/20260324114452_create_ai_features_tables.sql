/*
  # Create AI Features Tables

  1. New Tables
    - `learning_history` - Tracks student interactions with topics and subtopics
    - `study_sessions` - Records study sessions for pattern analysis
    - `chat_messages` - Stores AI chatbot conversation history
    - `recommendations` - Stores personalized learning path recommendations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data

  3. Purpose
    - Support AI Study Buddy chatbot functionality
    - Enable smart learning path recommendations based on history
*/

CREATE TABLE IF NOT EXISTS learning_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  topic_id text NOT NULL,
  subtopic_id text NOT NULL,
  time_spent_minutes integer DEFAULT 0,
  completed_at timestamptz,
  difficulty_rating integer,
  understanding_level integer,
  attempts integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  topic_id text NOT NULL,
  duration_minutes integer,
  topic_completed boolean DEFAULT false,
  performance_score integer,
  notes text,
  session_date date DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  topic_id text NOT NULL,
  user_message text NOT NULL,
  ai_response text NOT NULL,
  message_type text DEFAULT 'general',
  helpful boolean,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  recommended_topic_id text NOT NULL,
  recommended_subtopic_id text,
  reason text,
  confidence_score numeric,
  priority integer DEFAULT 0,
  dismissed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own learning history"
  ON learning_history FOR SELECT
  TO authenticated
  USING (student_id = auth.uid()::text OR student_id = current_setting('app.current_student_id', true));

CREATE POLICY "Students can insert own learning history"
  ON learning_history FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid()::text OR student_id = current_setting('app.current_student_id', true));

CREATE POLICY "Students can read own study sessions"
  ON study_sessions FOR SELECT
  TO authenticated
  USING (student_id = auth.uid()::text OR student_id = current_setting('app.current_student_id', true));

CREATE POLICY "Students can insert own study sessions"
  ON study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid()::text OR student_id = current_setting('app.current_student_id', true));

CREATE POLICY "Students can read own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (student_id = auth.uid()::text OR student_id = current_setting('app.current_student_id', true));

CREATE POLICY "Students can insert own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid()::text OR student_id = current_setting('app.current_student_id', true));

CREATE POLICY "Students can read own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid()::text OR student_id = current_setting('app.current_student_id', true));

CREATE POLICY "Students can update own recommendations"
  ON recommendations FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid()::text OR student_id = current_setting('app.current_student_id', true));
