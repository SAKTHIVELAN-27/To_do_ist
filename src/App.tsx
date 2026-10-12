import React, { useState } from 'react';
import { StudyProvider, useStudyStore } from './store/studyStore';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { CalendarView } from './components/Calendar/CalendarView';
import { SyllabusView } from './components/Syllabus/SyllabusView';
import { ExamManagerView } from './components/Exams/ExamManagerView';
import { FocusTimerView } from './components/Focus/FocusTimerView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { DailyRoutineView } from './components/Routine/DailyRoutineView';
import { AddTaskModal } from './components/Modals/AddTaskModal';
import { AutoPlanModal } from './components/Modals/AutoPlanModal';
import { RescheduleModal } from './components/Modals/RescheduleModal';
import { BackupModal } from './components/Modals/BackupModal';
import { Topic } from './types';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useStudyStore();

  // Modals state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addTaskDate, setAddTaskDate] = useState<string | undefined>(undefined);
  const [addTaskTopic, setAddTaskTopic] = useState<Topic | null>(null);

  const [isAutoPlanOpen, setIsAutoPlanOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const handleOpenAddTask = (date?: string, topic?: Topic | null) => {
    setAddTaskDate(date);
    setAddTaskTopic(topic || null);
    setIsAddTaskOpen(true);
  };

  const handleScheduleTopicFromSyllabus = (topic: Topic) => {
    handleOpenAddTask(undefined, topic);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenAddTask={() => handleOpenAddTask()}
        onOpenAutoPlan={() => setIsAutoPlanOpen(true)}
        onOpenReschedule={() => setIsRescheduleOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenAddTask={() => handleOpenAddTask()}
            onOpenAutoPlan={() => setIsAutoPlanOpen(true)}
            onOpenReschedule={() => setIsRescheduleOpen(true)}
          />
        )}

        {activeTab === 'routine' && <DailyRoutineView />}

        {activeTab === 'syllabus' && (
          <SyllabusView onScheduleTopic={handleScheduleTopicFromSyllabus} />
        )}

        {activeTab === 'calendar' && (
          <CalendarView onOpenAddTaskForDate={(date) => handleOpenAddTask(date)} />
        )}

        {activeTab === 'exams' && (
          <ExamManagerView onOpenAutoPlan={() => setIsAutoPlanOpen(true)} />
        )}

        {activeTab === 'timer' && <FocusTimerView />}

        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Interactive Modals */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          setAddTaskTopic(null);
        }}
        defaultDate={addTaskDate}
        defaultTopic={addTaskTopic}
      />

      <AutoPlanModal
        isOpen={isAutoPlanOpen}
        onClose={() => setIsAutoPlanOpen(false)}
      />

      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200/70 bg-white py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudySync &bull; Personal Study Planner &amp; Exam Countdown</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-indigo-600 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className="hover:text-indigo-600 transition"
            >
              Syllabus
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className="hover:text-indigo-600 transition"
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className="hover:text-indigo-600 transition"
            >
              Exam Readiness
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <StudyProvider>
      <MainAppContent />
    </StudyProvider>
  );
}

export default App;
