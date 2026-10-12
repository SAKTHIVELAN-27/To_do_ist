export type Difficulty = 'easy' | 'medium' | 'hard';

export type StudyStatus = 'not_started' | 'in_progress' | 'completed';

export type TaskType = 'study' | 'revision' | 'practice';

export interface Topic {
  id: string;
  moduleId: string;
  subjectId: string;
  title: string;
  difficulty: Difficulty;
  estimatedHours: number;
  actualHoursSpent: number;
  studyStatus: StudyStatus;
  revision1: boolean;
  revision2: boolean;
  practiceDone: boolean;
  notes?: string;
  order: number;
}

export interface Module {
  id: string;
  subjectId: string;
  title: string;
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  bgLight: string;
  icon: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  examDate: string; // YYYY-MM-DD
  targetFinishDate: string; // YYYY-MM-DD (buffer before exam)
  revisionDaysBuffer: number;
  priority: 'high' | 'medium' | 'low';
}

export interface StudyTask {
  id: string;
  subjectId: string;
  topicId?: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  durationMinutes: number;
  type: TaskType;
  completed: boolean;
  notes?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
  tasksCompleted: number;
}

export interface DailyHabit {
  id: string;
  title: string;
  category: 'wakeup' | 'gym' | 'leetcode' | 'custom';
  time: string; // e.g. "05:00 AM", "06:00 AM"
  icon: string;
  streak: number;
  completedDates: string[]; // list of YYYY-MM-DD strings
  details?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  problemLink?: string;
}

export interface ReadinessBreakdown {
  syllabusCoverage: number;
  revisionRate: number;
  practiceRate: number;
  score: number;
  status: 'Exam Ready' | 'On Track' | 'Needs Attention';
}

export type CalendarViewType = 'month' | 'week' | 'day';

export type TabType = 'dashboard' | 'syllabus' | 'calendar' | 'exams' | 'timer' | 'analytics' | 'routine';
