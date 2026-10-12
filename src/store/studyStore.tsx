import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Subject,
  Module,
  Topic,
  Exam,
  StudyTask,
  StudyStatus,
  TabType,
  ReadinessBreakdown,
  DailyHabit,
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_MODULES,
  INITIAL_TOPICS,
  INITIAL_EXAMS,
  INITIAL_TASKS,
  INITIAL_HABITS,
} from '../data/seedData';
import { format, isBefore, startOfDay, parseISO, differenceInCalendarDays, addDays } from 'date-fns';

const STORAGE_KEY = 'study_sync_planner_v3';

interface StudyStoreContextType {
  subjects: Subject[];
  modules: Module[];
  topics: Topic[];
  exams: Exam[];
  tasks: StudyTask[];
  habits: DailyHabit[];
  activeTab: TabType;
  selectedDate: string;
  dailyStudyHoursGoal: number;
  activeTopicForTimer: Topic | null;

  // Actions
  setActiveTab: (tab: TabType) => void;
  setSelectedDate: (date: string) => void;
  setDailyStudyHoursGoal: (hours: number) => void;
  setActiveTopicForTimer: (topic: Topic | null) => void;

  toggleTopicStudyStatus: (topicId: string, newStatus?: StudyStatus) => void;
  toggleTopicRevision1: (topicId: string) => void;
  toggleTopicRevision2: (topicId: string) => void;
  toggleTopicPractice: (topicId: string) => void;
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;

  addModule: (subjectId: string, title: string) => void;
  addSubject: (name: string, code: string, color: string) => void;
  deleteSubject: (id: string) => void;

  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  addTask: (task: Omit<StudyTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<StudyTask>) => void;
  toggleTaskComplete: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  moveTaskDate: (taskId: string, newDate: string, startTime?: string) => void;
  rescheduleOverdueTasks: (mode: 'today' | 'spread') => void;

  // Habit & Daily Routine Actions
  toggleHabit: (habitId: string, dateStr?: string) => void;
  addHabit: (habit: Omit<DailyHabit, 'id' | 'streak' | 'completedDates'>) => void;
  updateHabit: (id: string, updates: Partial<DailyHabit>) => void;
  deleteHabit: (id: string) => void;

  smartAutoPlan: (subjectId: string, dailyHours: number, bufferDays: number) => number;
  logStudySession: (topicId: string, durationMinutes: number) => void;

  resetToDefaultData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;

  // Computed Helpers
  getSubjectProgress: (subjectId: string) => {
    totalTopics: number;
    completedTopics: number;
    percentage: number;
    rev1Count: number;
    rev2Count: number;
    practiceCount: number;
    estimatedHours: number;
    actualHours: number;
  };
  getModuleProgress: (moduleId: string) => {
    totalTopics: number;
    completedTopics: number;
    percentage: number;
  };
  overallSyllabusProgress: {
    totalTopics: number;
    completedTopics: number;
    percentage: number;
  };
  getExamReadiness: (subjectId: string) => ReadinessBreakdown;
  getExamPacing: (exam: Exam) => {
    daysLeft: number;
    targetDaysLeft: number;
    uncompletedTopics: number;
    requiredTopicsPerDay: number;
    paceStatus: 'Ahead of schedule' | 'On track' | 'Behind schedule';
  };
  todayStats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    totalMinutes: number;
    completedMinutes: number;
    hoursDone: number;
    progressPercentage: number;
  };
  overdueTasks: StudyTask[];
}

const StudyContext = createContext<StudyStoreContextType | null>(null);

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [modules, setModules] = useState<Module[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_modules`);
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_topics`);
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exams`);
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_habits`);
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [dailyStudyHoursGoal, setDailyStudyHoursGoal] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goal`);
    return saved ? Number(saved) : 4.0;
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(() => format(new Date(), 'yyyy-MM-dd'));
  const [activeTopicForTimer, setActiveTopicForTimer] = useState<Topic | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_modules`, JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_topics`, JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_habits`, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_goal`, String(dailyStudyHoursGoal));
  }, [dailyStudyHoursGoal]);

  // Topic mutations
  const toggleTopicStudyStatus = (topicId: string, newStatus?: StudyStatus) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        let nextStatus: StudyStatus = newStatus || 'completed';
        if (!newStatus) {
          if (t.studyStatus === 'not_started') nextStatus = 'in_progress';
          else if (t.studyStatus === 'in_progress') nextStatus = 'completed';
          else nextStatus = 'not_started';
        }
        return { ...t, studyStatus: nextStatus };
      })
    );
  };

  const toggleTopicRevision1 = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, revision1: !t.revision1 } : t))
    );
  };

  const toggleTopicRevision2 = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, revision2: !t.revision2 } : t))
    );
  };

  const toggleTopicPractice = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, practiceDone: !t.practiceDone } : t))
    );
  };

  const addTopic = (topicData: Omit<Topic, 'id'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: `top-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTopics((prev) => [...prev, newTopic]);
  };

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    setTasks((prev) => prev.filter((task) => task.topicId !== id));
  };

  const addModule = (subjectId: string, title: string) => {
    const subjectModules = modules.filter((m) => m.subjectId === subjectId);
    const newMod: Module = {
      id: `mod-${Date.now()}`,
      subjectId,
      title,
      order: subjectModules.length + 1,
    };
    setModules((prev) => [...prev, newMod]);
  };

  const addSubject = (name: string, code: string, color: string) => {
    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name,
      code,
      color,
      bgLight: `${color}15`,
      icon: 'BookOpen',
    };
    setSubjects((prev) => [...prev, newSub]);
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setModules((prev) => prev.filter((m) => m.subjectId !== id));
    setTopics((prev) => prev.filter((t) => t.subjectId !== id));
    setExams((prev) => prev.filter((e) => e.subjectId !== id));
    setTasks((prev) => prev.filter((task) => task.subjectId !== id));
  };

  // Exam mutations
  const addExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}`,
    };
    setExams((prev) => [...prev, newExam]);
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  // Task mutations
  const addTask = (taskData: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<StudyTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextCompleted = !t.completed;

        // Auto update topic status if connected
        if (nextCompleted && t.topicId) {
          setTopics((topicList) =>
            topicList.map((top) => {
              if (top.id !== t.topicId) return top;
              if (t.type === 'study') return { ...top, studyStatus: 'completed' };
              if (t.type === 'revision') return { ...top, revision1: true };
              if (t.type === 'practice') return { ...top, practiceDone: true };
              return top;
            })
          );
        }

        return { ...t, completed: nextCompleted };
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const moveTaskDate = (taskId: string, newDate: string, startTime?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, date: newDate, ...(startTime ? { startTime } : {}) }
          : t
      )
    );
  };

  const rescheduleOverdueTasks = (mode: 'today' | 'spread') => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayDate = startOfDay(new Date());

    setTasks((prev) => {
      let spreadDayOffset = 0;
      return prev.map((t) => {
        const isPast = isBefore(startOfDay(parseISO(t.date)), todayDate);
        if (isPast && !t.completed) {
          if (mode === 'today') {
            return { ...t, date: todayStr };
          } else {
            const target = format(addDays(todayDate, spreadDayOffset % 5), 'yyyy-MM-dd');
            spreadDayOffset++;
            return { ...t, date: target };
          }
        }
        return t;
      });
    });
  };

  // Habits and Daily Routine
  const toggleHabit = (habitId: string, dateStr?: string) => {
    const targetDate = dateStr || format(new Date(), 'yyyy-MM-dd');

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const isDone = h.completedDates.includes(targetDate);
        let nextCompletedDates: string[];
        let nextStreak = h.streak;

        if (isDone) {
          nextCompletedDates = h.completedDates.filter((d) => d !== targetDate);
          nextStreak = Math.max(0, h.streak - 1);
        } else {
          nextCompletedDates = [...h.completedDates, targetDate];
          nextStreak = h.streak + 1;
        }

        return {
          ...h,
          completedDates: nextCompletedDates,
          streak: nextStreak,
        };
      })
    );
  };

  const addHabit = (habitData: Omit<DailyHabit, 'id' | 'streak' | 'completedDates'>) => {
    const newHabit: DailyHabit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      streak: 0,
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<DailyHabit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Smart Study Plan Generator
  const smartAutoPlan = (subjectId: string, dailyHours: number, bufferDays: number): number => {
    const targetExam = exams.find((e) => e.subjectId === subjectId);
    const uncompletedTopics = topics.filter(
      (t) => t.subjectId === subjectId && t.studyStatus !== 'completed'
    );

    if (uncompletedTopics.length === 0) return 0;

    const todayDate = new Date();
    const cutoffDate = targetExam
      ? addDays(parseISO(targetExam.examDate), -Math.max(1, bufferDays))
      : addDays(todayDate, 10);

    const daysAvailable = Math.max(1, differenceInCalendarDays(cutoffDate, todayDate));

    const sortedTopics = [...uncompletedTopics].sort((a, b) => {
      const rank = { hard: 3, medium: 2, easy: 1 };
      return rank[b.difficulty] - rank[a.difficulty];
    });

    const newTasks: StudyTask[] = [];
    let currentDayIndex = 0;
    let currentDayAllocatedMinutes = 0;
    const maxDailyMinutes = Math.max(60, dailyHours * 60);

    for (const topic of sortedTopics) {
      const topicEstimatedMinutes = Math.round((topic.estimatedHours || 1.5) * 60);

      if (
        currentDayAllocatedMinutes + topicEstimatedMinutes > maxDailyMinutes &&
        currentDayIndex < daysAvailable - 1
      ) {
        currentDayIndex++;
        currentDayAllocatedMinutes = 0;
      }

      const assignedDate = format(addDays(todayDate, currentDayIndex), 'yyyy-MM-dd');
      const startHour = 9 + Math.floor(currentDayAllocatedMinutes / 60);
      const startMinute = currentDayAllocatedMinutes % 60;
      const formattedTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;

      newTasks.push({
        id: `task-gen-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        subjectId: topic.subjectId,
        topicId: topic.id,
        title: `${topic.title} (Study)`,
        date: assignedDate,
        startTime: formattedTime,
        durationMinutes: topicEstimatedMinutes,
        type: 'study',
        completed: false,
      });

      if (currentDayIndex + 2 < daysAvailable) {
        newTasks.push({
          id: `task-gen-rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          subjectId: topic.subjectId,
          topicId: topic.id,
          title: `Revision: ${topic.title}`,
          date: format(addDays(todayDate, currentDayIndex + 2), 'yyyy-MM-dd'),
          startTime: '16:00',
          durationMinutes: 45,
          type: 'revision',
          completed: false,
        });
      }

      currentDayAllocatedMinutes += topicEstimatedMinutes;
    }

    setTasks((prev) => [...prev, ...newTasks]);
    return newTasks.length;
  };

  const logStudySession = (topicId: string, durationMinutes: number) => {
    const hours = Number((durationMinutes / 60).toFixed(2));
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              actualHoursSpent: Number((t.actualHoursSpent + hours).toFixed(2)),
              studyStatus: t.studyStatus === 'not_started' ? 'in_progress' : t.studyStatus,
            }
          : t
      )
    );
  };

  const resetToDefaultData = () => {
    setSubjects(INITIAL_SUBJECTS);
    setModules(INITIAL_MODULES);
    setTopics(INITIAL_TOPICS);
    setExams(INITIAL_EXAMS);
    setTasks(INITIAL_TASKS);
    setHabits(INITIAL_HABITS);
    setDailyStudyHoursGoal(4.0);
    localStorage.clear();
  };

  const exportDataJson = () => {
    const payload = {
      subjects,
      modules,
      topics,
      exams,
      tasks,
      habits,
      dailyStudyHoursGoal,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.subjects && data.modules && data.topics) {
        setSubjects(data.subjects);
        setModules(data.modules);
        setTopics(data.topics);
        if (data.exams) setExams(data.exams);
        if (data.tasks) setTasks(data.tasks);
        if (data.habits) setHabits(data.habits);
        if (data.dailyStudyHoursGoal) setDailyStudyHoursGoal(data.dailyStudyHoursGoal);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const getSubjectProgress = (subjectId: string) => {
    const subTopics = topics.filter((t) => t.subjectId === subjectId);
    const totalTopics = subTopics.length;
    if (totalTopics === 0) {
      return {
        totalTopics: 0,
        completedTopics: 0,
        percentage: 0,
        rev1Count: 0,
        rev2Count: 0,
        practiceCount: 0,
        estimatedHours: 0,
        actualHours: 0,
      };
    }
    const completedTopics = subTopics.filter((t) => t.studyStatus === 'completed').length;
    const rev1Count = subTopics.filter((t) => t.revision1).length;
    const rev2Count = subTopics.filter((t) => t.revision2).length;
    const practiceCount = subTopics.filter((t) => t.practiceDone).length;
    const estimatedHours = subTopics.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
    const actualHours = subTopics.reduce((acc, t) => acc + (t.actualHoursSpent || 0), 0);

    return {
      totalTopics,
      completedTopics,
      percentage: Math.round((completedTopics / totalTopics) * 100),
      rev1Count,
      rev2Count,
      practiceCount,
      estimatedHours: Number(estimatedHours.toFixed(1)),
      actualHours: Number(actualHours.toFixed(1)),
    };
  };

  const getModuleProgress = (moduleId: string) => {
    const modTopics = topics.filter((t) => t.moduleId === moduleId);
    const totalTopics = modTopics.length;
    if (totalTopics === 0) return { totalTopics: 0, completedTopics: 0, percentage: 0 };
    const completedTopics = modTopics.filter((t) => t.studyStatus === 'completed').length;
    return {
      totalTopics,
      completedTopics,
      percentage: Math.round((completedTopics / totalTopics) * 100),
    };
  };

  const overallSyllabusProgress = useMemo(() => {
    const totalTopics = topics.length;
    if (totalTopics === 0) return { totalTopics: 0, completedTopics: 0, percentage: 0 };
    const completedTopics = topics.filter((t) => t.studyStatus === 'completed').length;
    return {
      totalTopics,
      completedTopics,
      percentage: Math.round((completedTopics / totalTopics) * 100),
    };
  }, [topics]);

  const getExamReadiness = (subjectId: string): ReadinessBreakdown => {
    const subTopics = topics.filter((t) => t.subjectId === subjectId);
    if (subTopics.length === 0) {
      return { syllabusCoverage: 0, revisionRate: 0, practiceRate: 0, score: 0, status: 'Needs Attention' };
    }
    const total = subTopics.length;
    const studyDone = subTopics.filter((t) => t.studyStatus === 'completed').length;
    const revisionDone = subTopics.filter((t) => t.revision1 || t.revision2).length;
    const practiceDone = subTopics.filter((t) => t.practiceDone).length;

    const syllabusCoverage = Math.round((studyDone / total) * 100);
    const revisionRate = Math.round((revisionDone / total) * 100);
    const practiceRate = Math.round((practiceDone / total) * 100);

    const weightedScore = Math.round(
      0.5 * syllabusCoverage + 0.3 * revisionRate + 0.2 * practiceRate
    );

    let status: 'Exam Ready' | 'On Track' | 'Needs Attention' = 'Needs Attention';
    if (weightedScore >= 80) status = 'Exam Ready';
    else if (weightedScore >= 50) status = 'On Track';

    return {
      syllabusCoverage,
      revisionRate,
      practiceRate,
      score: weightedScore,
      status,
    };
  };

  const getExamPacing = (exam: Exam) => {
    const todayDate = new Date();
    const examDateObj = parseISO(exam.examDate);
    const targetDateObj = parseISO(exam.targetFinishDate);

    const daysLeft = Math.max(0, differenceInCalendarDays(examDateObj, todayDate));
    const targetDaysLeft = Math.max(1, differenceInCalendarDays(targetDateObj, todayDate));

    const subTopics = topics.filter((t) => t.subjectId === exam.subjectId);
    const uncompletedTopics = subTopics.filter((t) => t.studyStatus !== 'completed').length;

    const requiredTopicsPerDay = Number((uncompletedTopics / targetDaysLeft).toFixed(1));

    let paceStatus: 'Ahead of schedule' | 'On track' | 'Behind schedule' = 'On track';
    if (uncompletedTopics === 0 || requiredTopicsPerDay <= 0.5) {
      paceStatus = 'Ahead of schedule';
    } else if (requiredTopicsPerDay > 1.8) {
      paceStatus = 'Behind schedule';
    }

    return {
      daysLeft,
      targetDaysLeft,
      uncompletedTopics,
      requiredTopicsPerDay,
      paceStatus,
    };
  };

  const todayStats = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayTasks = tasks.filter((t) => t.date === todayStr);

    const totalTasks = todayTasks.length;
    const completedTasks = todayTasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const totalMinutes = todayTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
    const completedMinutes = todayTasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + t.durationMinutes, 0);

    const hoursDone = Number((completedMinutes / 60).toFixed(1));
    const goalMinutes = dailyStudyHoursGoal * 60;
    const progressPercentage = goalMinutes > 0 ? Math.min(100, Math.round((completedMinutes / goalMinutes) * 100)) : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalMinutes,
      completedMinutes,
      hoursDone,
      progressPercentage,
    };
  }, [tasks, dailyStudyHoursGoal]);

  const overdueTasks = useMemo(() => {
    const todayDate = startOfDay(new Date());
    return tasks.filter((t) => !t.completed && isBefore(startOfDay(parseISO(t.date)), todayDate));
  }, [tasks]);

  return (
    <StudyContext.Provider
      value={{
        subjects,
        modules,
        topics,
        exams,
        tasks,
        habits,
        activeTab,
        selectedDate,
        dailyStudyHoursGoal,
        activeTopicForTimer,
        setActiveTab,
        setSelectedDate,
        setDailyStudyHoursGoal,
        setActiveTopicForTimer,
        toggleTopicStudyStatus,
        toggleTopicRevision1,
        toggleTopicRevision2,
        toggleTopicPractice,
        addTopic,
        updateTopic,
        deleteTopic,
        addModule,
        addSubject,
        deleteSubject,
        addExam,
        updateExam,
        deleteExam,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        moveTaskDate,
        rescheduleOverdueTasks,
        toggleHabit,
        addHabit,
        updateHabit,
        deleteHabit,
        smartAutoPlan,
        logStudySession,
        resetToDefaultData,
        exportDataJson,
        importDataJson,
        getSubjectProgress,
        getModuleProgress,
        overallSyllabusProgress,
        getExamReadiness,
        getExamPacing,
        todayStats,
        overdueTasks,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudyStore = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudyStore must be used within a StudyProvider');
  return context;
};
