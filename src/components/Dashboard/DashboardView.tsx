import React from 'react';
import { useStudyStore } from '../../store/studyStore';
import { format, parseISO } from 'date-fns';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Award,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowRight,
  BookOpen,
  AlarmClock,
  Dumbbell,
  Code2,
  ListTodo,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  onOpenAddTask: () => void;
  onOpenAutoPlan: () => void;
  onOpenReschedule: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddTask,
  onOpenAutoPlan,
  onOpenReschedule,
}) => {
  const {
    subjects,
    topics,
    exams,
    tasks,
    setActiveTab,
    toggleTaskComplete,
    todayStats,
    overallSyllabusProgress,
    getSubjectProgress,
    getExamReadiness,
    getExamPacing,
    overdueTasks,
    setActiveTopicForTimer,
    dailyStudyHoursGoal,
    habits,
    toggleHabit,
  } = useStudyStore();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = tasks.filter((t) => t.date === todayStr);

  const handleTaskCheckbox = (taskId: string, isCompleted: boolean) => {
    toggleTaskComplete(taskId);
    if (!isCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleStartTimerForTask = (taskTopicId?: string) => {
    if (taskTopicId) {
      const topic = topics.find((t) => t.id === taskTopicId);
      if (topic) {
        setActiveTopicForTimer(topic);
      }
    }
    setActiveTab('timer');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero: The 3 Core Academic Questions Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300 bg-indigo-950/70 px-3 py-1 rounded-full border border-indigo-700/50">
                Academic Progress Cockpit
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
                Daily Focus: {format(new Date(), 'EEEE, MMMM d')}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenAutoPlan}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Auto-Plan Remaining Days</span>
              </button>
            </div>
          </div>

          {/* Quick answers to the 3 questions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-indigo-700/50">
            {/* Question 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <span className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wide">
                1. What should I study today?
              </span>
              <div className="text-xl font-bold mt-1">
                {todayTasks.length === 0 ? (
                  <span className="text-indigo-200">No sessions scheduled</span>
                ) : (
                  <span>
                    {todayStats.pendingTasks} tasks pending ({todayTasks.length} planned)
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-200/80 mt-1">
                {todayStats.hoursDone}h completed of {dailyStudyHoursGoal}h daily target
              </p>
            </div>

            {/* Question 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <span className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wide">
                2. Syllabus completed?
              </span>
              <div className="text-xl font-bold mt-1 flex items-baseline space-x-2">
                <span>{overallSyllabusProgress.percentage}% Covered</span>
                <span className="text-xs text-indigo-300 font-normal">
                  ({overallSyllabusProgress.completedTopics}/{overallSyllabusProgress.totalTopics} topics)
                </span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallSyllabusProgress.percentage}%` }}
                />
              </div>
            </div>

            {/* Question 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <span className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wide">
                3. On track before exams?
              </span>
              <div className="text-xl font-bold mt-1 flex items-center space-x-2">
                {exams.length > 0 ? (
                  <>
                    <span className="text-emerald-300">
                      {exams[0].title.split(' ')[0]} in {getExamPacing(exams[0]).daysLeft}d
                    </span>
                  </>
                ) : (
                  <span>No exams added</span>
                )}
              </div>
              <p className="text-xs text-indigo-200/80 mt-1">
                {exams.length > 0 ? (
                  <span>
                    Status:{' '}
                    <strong className="text-white">
                      {getExamPacing(exams[0]).paceStatus}
                    </strong>
                  </span>
                ) : (
                  'Set target exam dates to start tracking'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Task Banner if any */}
      {overdueTasks.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                You have {overdueTasks.length} unfinished task{overdueTasks.length > 1 ? 's' : ''} from previous days
              </h4>
              <p className="text-xs text-amber-700">
                Avoid falling behind schedule before exams by automatically rescheduling them.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenReschedule}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition shrink-0"
          >
            Reschedule Missed Tasks
          </button>
        </div>
      )}

      {/* Daily Routine: 5 AM Wakeup, Gym, LeetCode Strip */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daily Routine &amp; Habits (5 AM &bull; Gym &bull; LeetCode)
              </h3>
              <p className="text-xs text-slate-500">
                Disciplined daily non-negotiables &bull; Target completion before Nov 16 exams
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('routine')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>Open Routine Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* 5 AM Wakeup */}
          {(() => {
            const wakeup = habits.find((h) => h.category === 'wakeup');
            const isDone = wakeup?.completedDates.includes(todayStr) || false;
            return (
              <div
                onClick={() => wakeup && toggleHabit(wakeup.id, todayStr)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200/60">
                    <AlarmClock className={`w-4 h-4 ${isDone ? 'text-emerald-600' : 'text-amber-500'}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">5:00 AM Wakeup</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{wakeup?.streak || 0}d streak</div>
                  </div>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
            );
          })()}

          {/* Gym Workout */}
          {(() => {
            const gym = habits.find((h) => h.category === 'gym');
            const isDone = gym?.completedDates.includes(todayStr) || false;
            return (
              <div
                onClick={() => gym && toggleHabit(gym.id, todayStr)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200/60">
                    <Dumbbell className={`w-4 h-4 ${isDone ? 'text-emerald-600' : 'text-emerald-500'}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Gym Workout</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{gym?.streak || 0}d streak</div>
                  </div>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
            );
          })()}

          {/* LeetCode Daily */}
          {(() => {
            const lc = habits.find((h) => h.category === 'leetcode');
            const isDone = lc?.completedDates.includes(todayStr) || false;
            return (
              <div
                onClick={() => lc && toggleHabit(lc.id, todayStr)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200/60">
                    <Code2 className={`w-4 h-4 ${isDone ? 'text-emerald-600' : 'text-indigo-600'}`} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">LeetCode Daily</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{lc?.streak || 0}d streak</div>
                  </div>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Main Grid: Today's Plan (Question 1) + Exam Countdowns & Readiness (Question 2 & 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Study Plan & Focus Queue */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Today's Study Plan</h2>
                  <p className="text-xs text-slate-500">
                    {todayTasks.length} sessions &bull; {todayStats.completedTasks} completed
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenAddTask}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                + Add Session
              </button>
            </div>

            {/* Daily Goal Ring & Stats Bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Visual Circular Progress */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#e2e8f0"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#4f46e5"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={138}
                      strokeDashoffset={138 - (138 * todayStats.progressPercentage) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-800">
                    {todayStats.progressPercentage}%
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Daily Goal: {dailyStudyHoursGoal} Hours
                  </div>
                  <div className="text-xs text-slate-500">
                    {todayStats.hoursDone}h completed &bull;{' '}
                    {Math.max(0, Number((dailyStudyHoursGoal - todayStats.hoursDone).toFixed(1)))}h remaining
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-lg">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Active Streak</span>
              </div>
            </div>

            {/* List of Today's Tasks */}
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-700">No study sessions planned for today</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Pick topics from your syllabus or use Smart Auto-Plan to schedule today's revision and study blocks.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <button
                    onClick={onOpenAddTask}
                    className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Add Session
                  </button>
                  <button
                    onClick={onOpenAutoPlan}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Auto-Plan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map((task) => {
                  const subject = subjects.find((s) => s.id === task.subjectId);
                  const isDone = task.completed;

                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-slate-50/70 border-slate-200 opacity-65'
                          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <button
                          onClick={() => handleTaskCheckbox(task.id, isDone)}
                          className="text-slate-400 hover:text-indigo-600 transition shrink-0"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: subject?.color || '#6366f1' }}
                            />
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                              {subject?.code || subject?.name || 'Study'}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                task.type === 'study'
                                  ? 'bg-blue-50 text-blue-700'
                                  : task.type === 'revision'
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {task.type}
                            </span>
                          </div>
                          <div
                            className={`text-sm font-semibold truncate ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                            {task.startTime && (
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{task.startTime}</span>
                              </span>
                            )}
                            <span>{task.durationMinutes} mins</span>
                            {task.notes && (
                              <span className="truncate max-w-[180px] hidden sm:inline text-slate-400">
                                &bull; {task.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action: Focus Timer launch */}
                      {!isDone && (
                        <button
                          onClick={() => handleStartTimerForTask(task.topicId)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold shrink-0 transition"
                          title="Start Pomodoro focus session for this topic"
                        >
                          <Play className="w-3 h-3 fill-indigo-600" />
                          <span className="hidden sm:inline">Focus</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Subject-Wise Syllabus Completion Progress Bars */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Syllabus Breakdown by Subject</h3>
                <p className="text-xs text-slate-500">Track coverage across each course</p>
              </div>
              <button
                onClick={() => setActiveTab('syllabus')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
              >
                <span>View Full Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {subjects.map((sub) => {
                const prog = getSubjectProgress(sub.id);
                const readiness = getExamReadiness(sub.id);

                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="font-bold text-slate-800">{sub.name}</span>
                        <span className="text-slate-400">({sub.code})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            readiness.status === 'Exam Ready'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : readiness.status === 'On Track'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {readiness.status} ({readiness.score}%)
                        </span>
                        <span className="font-bold text-slate-700">
                          {prog.completedTopics}/{prog.totalTopics} topics ({prog.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${prog.percentage}%`,
                          backgroundColor: sub.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Upcoming Exams, Readiness Scores & Calendar preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Exam Countdowns */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Exam Countdown & Readiness</h3>
                  <p className="text-xs text-slate-500">Days remaining and preparedness scores</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('exams')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3.5">
              {exams.map((exam) => {
                const subject = subjects.find((s) => s.id === exam.subjectId);
                const pacing = getExamPacing(exam);
                const readiness = getExamReadiness(exam.subjectId);

                return (
                  <div
                    key={exam.id}
                    className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all bg-gradient-to-br from-white to-slate-50/50 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: subject?.color || '#6366f1' }}
                          />
                          <span className="text-xs font-bold text-slate-500 uppercase">
                            {subject?.code}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{exam.title}</h4>
                        <p className="text-xs text-slate-500">
                          Exam: {format(parseISO(exam.examDate), 'MMM d, yyyy')}
                        </p>
                      </div>

                      {/* Live Days Countdown Pill */}
                      <div className="text-right">
                        <div className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold">
                          {pacing.daysLeft} Days Left
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Buffer: {exam.revisionDaysBuffer} days rev
                        </div>
                      </div>
                    </div>

                    {/* Readiness breakdown chips */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400">Readiness: </span>
                        <strong
                          className={
                            readiness.status === 'Exam Ready'
                              ? 'text-emerald-600'
                              : readiness.status === 'On Track'
                              ? 'text-blue-600'
                              : 'text-amber-600'
                          }
                        >
                          {readiness.score}%
                        </strong>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            pacing.paceStatus === 'Ahead of schedule'
                              ? 'bg-emerald-50 text-emerald-700'
                              : pacing.paceStatus === 'On track'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {pacing.paceStatus}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of uncompleted topics */}
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>{pacing.uncompletedTopics} topics remain</span>
                      <span>Target: {pacing.requiredTopicsPerDay} topics/day</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts to Planner & Focus Mode */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/60 rounded-2xl p-5 border border-indigo-100 space-y-3">
            <h4 className="text-sm font-bold text-indigo-950 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Smart Study Routine</span>
            </h4>
            <p className="text-xs text-indigo-800/80">
              Maintain an active revision schedule. Finishing a topic once is not enough—ensure you mark Revision and Practice problems separately.
            </p>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => setActiveTab('calendar')}
                className="flex-1 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-indigo-200 text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Open Calendar
              </button>
              <button
                onClick={() => setActiveTab('timer')}
                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Focus Pomodoro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
