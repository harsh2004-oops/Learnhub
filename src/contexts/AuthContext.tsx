import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Student } from '../types';

interface AuthContextType {
  currentStudent: Student | null;
  students: Student[];
  isAuthenticated: boolean;
  login: (name: string, rollNumber: string) => Promise<void>;
  logout: () => void;
  updateStudent: (student: Student) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to fetch completed subtopics from backend
  const fetchCompletedSubtopics = async (studentId: string): Promise<string[]> => {
    try {
      const res = await fetch('http://localhost:3001/api/progress/all', {
        headers: { 'student_id': studentId },
      });
      const data = await res.json();
      return data.completedSubtopics || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const savedStudentId = localStorage.getItem('student_id');
    if (savedStudentId) {
      // Fetch student data and completed subtopics from backend
      Promise.all([
        fetch(`http://localhost:3001/api/users/${savedStudentId}`).then(r => r.json()),
        fetchCompletedSubtopics(savedStudentId),
      ])
        .then(([data, completedSubtopics]) => {
          if (data && data.id) {
            const student: Student = {
              id: data.id,
              name: data.name,
              email: data.email,
              rollNumber: data.roll_number,
              avatar: data.avatar || '',
              totalProgress: completedSubtopics.length,
              completedSubtopics,
              currentTopic: '',
              currentSubtopic: '',
            };
            setCurrentStudent(student);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('student_id');
          }
        })
        .catch(() => {
          localStorage.removeItem('student_id');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (name: string, rollNumber: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roll_number: rollNumber }),
      });
      const data = await response.json();
      if (data.id) {
        // Fetch completed subtopics from DB
        const completedSubtopics = await fetchCompletedSubtopics(data.id);
        const student: Student = {
          id: data.id,
          name: data.name,
          email: data.email,
          rollNumber: data.roll_number,
          avatar: data.avatar || '',
          totalProgress: completedSubtopics.length,
          completedSubtopics,
          currentTopic: '',
          currentSubtopic: '',
        };
        setCurrentStudent(student);
        setIsAuthenticated(true);
        localStorage.setItem('student_id', data.id);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentStudent(null);
    setIsAuthenticated(false);
    setStudents([]);
    localStorage.removeItem('student_id');
  };

  const updateStudent = (student: Student) => {
    setCurrentStudent(student);
  };

  const value = {
    currentStudent,
    students,
    isAuthenticated,
    login,
    logout,
    updateStudent,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

