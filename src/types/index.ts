export interface Subtopic {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  practiceLinks: PracticeLink[];
  isCompleted: boolean;
  order: number;
}

export interface PracticeLink {
  platform: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problemCount: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  totalSubtopics: number;
  estimatedHours: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  subtopics: Subtopic[];
  prerequisites?: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber?: string;
  completedSubtopics: string[];
  currentTopic?: string;
  currentSubtopic?: string;
  totalProgress: number;
  avatar: string;
}

export interface LearningProgress {
  topicId: string;
  completedSubtopics: string[];
  currentSubtopic: string;
  progressPercentage: number;
}