import React from 'react';
import { useStudyStore } from '../store/studyStore';
import { TabType } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  Timer,
  BarChart3,
  Sparkles,
  RotateCcw,
  Plus,
  AlertTriangle,
  FolderDown,
  ListTodo,
} from 'lucide-react';

interface NavbarProps {
  onOpenAddTask: () => void;
  onOpenAutoPlan: () => void;
  onOpenReschedule: () => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddTask,
  onOpenAutoPlan,
  onOpenReschedule,
  onOpenBackup,
}) => {
  const {
    activeTab,
    setActiveTab,
    overallSyllabusProgress,
    todayStats,
    overdueTasks,
  } = useStudyStore();

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'routine', label: 'Daily Routine & Habits', icon: <ListTodo className="w-4 h-4" />, badge: '5 AM / Gym / LeetCode' },
    {
      id: 'syllabus',
      label: 'Syllabus Tracker',
      icon: <BookOpen className="w-4 h-4" />,
      badge: `${overallSyllabusProgress.percentage}%`,
    },
    { id: 'calendar', label: 'Built-in Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'exams', label: 'Exam Prep & Readiness', icon: <Award className="w-4 h-4" /> },
    { id: 'timer', label: 'Focus Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                  StudySync
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  Academic Cockpit
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Syllabus Tracker &bull; Built-in Planner &bull; Exam Readiness
              </p>
            </div>
          </div>

          {/* Quick Metrics & Overdue Alert */}
          <div className="hidden lg:flex items-center space-x-3">
            {overdueTasks.length > 0 && (
              <button
                onClick={onOpenReschedule}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold transition animate-pulse"
                title="Click to reschedule missed tasks"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? 's' : ''}</span>
              </button>
            )}

            <div className="flex items-center space-x-4 px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Today: </span>
                <span className="font-bold text-slate-800">{todayStats.hoursDone}h done</span>
                <span className="text-slate-400"> ({todayStats.completedTasks}/{todayStats.totalTasks} tasks)</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 font-medium">Syllabus: </span>
                <span className="font-bold text-indigo-600">{overallSyllabusProgress.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAutoPlan}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 border border-indigo-200/80 rounded-lg text-xs font-semibold shadow-xs transition"
              title="Automatically distribute remaining syllabus before exams"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Smart Auto-Plan</span>
            </button>

            <button
              onClick={onOpenAddTask}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-indigo-300 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Session</span>
            </button>

            <button
              onClick={onOpenBackup}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Backup, Restore or Reset Demo Data"
            >
              <FolderDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none border-t border-slate-100 py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
