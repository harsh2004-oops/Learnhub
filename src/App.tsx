import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TopicDetail } from './components/TopicDetail';
import { SubtopicDetail } from './components/SubtopicDetail';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { MLAnalytics } from './components/MLAnalytics';
import { AIChatbot } from './components/AIChatbot';
import { topics } from './data/topics';
import type { Student, Topic, Subtopic } from './types';
import { fetchLeaderboard } from './services/auth';

function App() {
  const { currentStudent, isAuthenticated, loading, logout, updateStudent } = useAuth();
  type ViewType = 'dashboard' | 'topic' | 'leaderboard' | 'profile' | 'subtopic' | 'ml-analytics';
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeaderboard().then(setStudents).catch(console.error);
    }
  }, [isAuthenticated]);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView('topic');
  };

  const handleSubtopicSelect = (subtopic: Subtopic) => {
    setSelectedSubtopic(subtopic);
    setCurrentView('subtopic');
  };

  // Handle ML prediction subtopic navigation
  const handleMLSubtopicSelect = (subtopicId: string) => {
    // Find the subtopic across all topics
    for (const topic of topics) {
      const subtopic = topic.subtopics.find(s => s.id === subtopicId);
      if (subtopic) {
        setSelectedTopic(topic);
        setSelectedSubtopic(subtopic);
        setCurrentView('subtopic');
        return;
      }
    }
  };

  const handleSubtopicComplete = async (subtopicId: string) => {
    if (!currentStudent) return;
    const newCompleted = [...new Set([...(currentStudent.completedSubtopics || []), subtopicId])];
    const updatedStudent = {
      ...currentStudent,
      completedSubtopics: newCompleted,
      totalProgress: newCompleted.length
    };
    // Update UI immediately
    updateStudent(updatedStudent);

    // Find which topic this subtopic belongs to, and save progress to backend
    for (const topic of topics) {
      const topicSubtopicIds = topic.subtopics.map(s => s.id);
      const completedInTopic = newCompleted.filter(id => topicSubtopicIds.includes(id));
      if (topicSubtopicIds.includes(subtopicId)) {
        const progressPct = Math.round((completedInTopic.length / topic.subtopics.length) * 100);
        try {
          await fetch('http://localhost:3001/api/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'student_id': currentStudent.id,
            },
            body: JSON.stringify({
              topic_id: topic.id,
              completed_subtopics: completedInTopic,
              current_subtopic: subtopicId,
              progress_percentage: progressPct,
            }),
          });
        } catch (err) {
          console.error('Failed to save progress:', err);
        }
      }
    }

    // Refresh leaderboard so rank updates
    fetchLeaderboard().then(setStudents).catch(console.error);
  };

  const sortedStudents = students.sort((a, b) => b.totalProgress - a.totalProgress);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !currentStudent) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header 
        currentView={currentView}
        onViewChange={(view: string) => setCurrentView(view as ViewType)}
        studentName={currentStudent.name}
        studentAvatar={currentStudent.avatar}
        onLogout={logout}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            topics={topics}
            onTopicSelect={handleTopicSelect}
            completedSubtopics={currentStudent.completedSubtopics || []}
            currentStudent={currentStudent}
            onMLAnalytics={() => setCurrentView('ml-analytics')}
          />
        )}
        
        {currentView === 'topic' && selectedTopic && (
          <TopicDetail
            topic={selectedTopic}
            onBack={() => setCurrentView('dashboard')}
            onSubtopicSelect={handleSubtopicSelect}
            completedSubtopics={currentStudent.completedSubtopics || []}
          />
        )}
        
        {currentView === 'subtopic' && selectedSubtopic && selectedTopic && (
          <SubtopicDetail
            subtopic={selectedSubtopic}
            topic={selectedTopic}
            onBack={() => setCurrentView('topic')}
            onComplete={handleSubtopicComplete}
            isCompleted={(currentStudent.completedSubtopics || []).includes(selectedSubtopic.id)}
          />
        )}
        
        {currentView === 'leaderboard' && (
          <Leaderboard students={sortedStudents} currentStudentId={currentStudent.id} />
        )}
        
        {currentView === 'profile' && (
          <Profile
            student={currentStudent}
            topics={topics}
            onTopicSelect={handleTopicSelect}
          />
        )}

        {currentView === 'ml-analytics' && (
          <MLAnalytics
            studentId={currentStudent.id}
            onBack={() => setCurrentView('dashboard')}
            onSubtopicSelect={handleMLSubtopicSelect}
          />
        )}
      </main>

      {/* AI Chatbot — always accessible */}
      <AIChatbot
        studentId={currentStudent.id}
        topicId={selectedTopic?.id}
        subtopicId={selectedSubtopic?.id}
      />
    </div>
  );
}

export default App;
