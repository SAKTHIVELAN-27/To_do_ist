import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';
import { CalendarViewType, StudyTask } from '../../types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  parseISO,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Award,
  Calendar as CalendarIcon,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CalendarViewProps {
  onOpenAddTaskForDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onOpenAddTaskForDate }) => {
  const {
    subjects,
    tasks,
    exams,
    topics,
    toggleTaskComplete,
    deleteTask,
    setActiveTopicForTimer,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    dailyStudyHoursGoal,
  } = useStudyStore();

  const [currentDate, setCurrentDate] = useState<Date>(() => parseISO(selectedDate));
  const [viewType, setViewType] = useState<CalendarViewType>('month');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Navigation handlers
  const handlePrev = () => {
    if (viewType === 'month') setCurrentDate((d) => subMonths(d, 1));
    else if (viewType === 'week') setCurrentDate((d) => subWeeks(d, 1));
    else setCurrentDate((d) => subDays(d, 1));
  };

  const handleNext = () => {
    if (viewType === 'month') setCurrentDate((d) => addMonths(d, 1));
    else if (viewType === 'week') setCurrentDate((d) => addWeeks(d, 1));
    else setCurrentDate((d) => addDays(d, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(format(today, 'yyyy-MM-dd'));
  };

  // Filter tasks by subject
  const filteredTasks = tasks.filter((t) => {
    if (selectedSubjectFilter === 'all') return true;
    return t.subjectId === selectedSubjectFilter;
  });

  const handleTaskCheckbox = (taskId: string, isCompleted: boolean) => {
    toggleTaskComplete(taskId);
    if (!isCompleted) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const handleFocusTimer = (taskTopicId?: string) => {
    if (taskTopicId) {
      const topic = topics.find((t) => t.id === taskTopicId);
      if (topic) setActiveTopicForTimer(topic);
    }
    setActiveTab('timer');
  };

  // Month interval
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Week interval
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hoursArray = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 AM to 9:00 PM

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Header Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {viewType === 'month' && format(currentDate, 'MMMM yyyy')}
                {viewType === 'week' &&
                  `Week of ${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`}
                {viewType === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h1>
              <p className="text-xs text-slate-500">
                Connected directly to syllabus topics &amp; exam milestones
              </p>
            </div>
          </div>

          {/* Right Controls: Prev/Next/Today & View Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-semibold">
              <button
                onClick={() => setViewType('month')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewType === 'month'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewType('week')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewType === 'week'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewType('day')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewType === 'day'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Day
              </button>
            </div>

            {/* Prev / Next / Today */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handlePrev}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Today
              </button>
              <button
                onClick={handleNext}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Add Session CTA */}
            <button
              onClick={() => onOpenAddTaskForDate(format(currentDate, 'yyyy-MM-dd'))}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Session</span>
            </button>
          </div>
        </div>

        {/* Filter by Subject & Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Filter Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-indigo-500 text-xs"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Study</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Revision</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Practice</span>
            </span>
            <span className="flex items-center space-x-1 font-bold text-rose-600">
              <Award className="w-3 h-3 text-rose-500" />
              <span>Exam Date</span>
            </span>
          </div>
        </div>
      </div>

      {/* 1. MONTH VIEW */}
      {viewType === 'month' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center py-2.5 text-xs font-bold text-slate-500">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Grid of Days */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {monthDays.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());
              const isSelected = dayStr === selectedDate;

              const dayTasks = filteredTasks.filter((t) => t.date === dayStr);
              const dayExams = exams.filter((e) => e.examDate === dayStr);
              const totalMins = dayTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
              const plannedHours = Number((totalMins / 60).toFixed(1));

              return (
                <div
                  key={dayStr}
                  onClick={() => {
                    setSelectedDate(dayStr);
                    setCurrentDate(day);
                  }}
                  className={`min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 cursor-pointer transition flex flex-col justify-between ${
                    !isCurrentMonth ? 'bg-slate-50/40 text-slate-300' : 'bg-white'
                  } ${isToday ? 'bg-indigo-50/20' : ''} ${
                    isSelected ? 'ring-2 ring-indigo-500 ring-inset' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Day header: Number + Workload indicator */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-indigo-600 text-white'
                          : isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>

                    {plannedHours > 0 && isCurrentMonth && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          plannedHours > 4.5
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                        title={`${plannedHours} hours planned`}
                      >
                        {plannedHours}h
                      </span>
                    )}
                  </div>

                  {/* Day items */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-[85px] scrollbar-none">
                    {/* Exam Milestones */}
                    {dayExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 rounded text-[10px] font-bold truncate flex items-center space-x-1"
                        title={`Exam: ${exam.title}`}
                      >
                        <Award className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{exam.title}</span>
                      </div>
                    ))}

                    {/* Task Chips */}
                    {dayTasks.slice(0, 3).map((task) => {
                      const sub = subjects.find((s) => s.id === task.subjectId);
                      return (
                        <div
                          key={task.id}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center space-x-1 ${
                            task.completed
                              ? 'bg-slate-100 text-slate-400 line-through'
                              : 'bg-indigo-50 text-indigo-900 border border-indigo-100'
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: sub?.color || '#4f46e5' }}
                          />
                          <span className="truncate">{task.title}</span>
                        </div>
                      );
                    })}

                    {dayTasks.length > 3 && (
                      <div className="text-[9px] text-slate-400 font-bold pl-1">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Quick Add icon hover button */}
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddTaskForDate(dayStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-indigo-600 rounded"
                      title="Add task on this date"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. WEEK VIEW */}
      {viewType === 'week' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Week days columns header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-3">
              {weekDays.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const isToday = isSameDay(day, new Date());
                const dayTasks = filteredTasks.filter((t) => t.date === dayStr);
                const plannedMins = dayTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
                const plannedHours = Number((plannedMins / 60).toFixed(1));

                return (
                  <div
                    key={dayStr}
                    onClick={() => {
                      setSelectedDate(dayStr);
                      setCurrentDate(day);
                    }}
                    className={`cursor-pointer px-2 py-1 ${
                      isToday ? 'bg-indigo-50/80 rounded-xl' : ''
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase">
                      {format(day, 'EEE')}
                    </div>
                    <div
                      className={`text-sm font-extrabold mx-auto mt-0.5 w-7 h-7 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-indigo-600 text-white' : 'text-slate-900'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400 mt-1">
                      {plannedHours}h planned
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Week days content column cards */}
            <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[480px] p-2 bg-slate-50/30">
              {weekDays.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const dayTasks = filteredTasks.filter((t) => t.date === dayStr);
                const dayExams = exams.filter((e) => e.examDate === dayStr);

                return (
                  <div key={dayStr} className="p-2 space-y-2">
                    {/* Exam badge */}
                    {dayExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="p-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-bold flex items-center space-x-1"
                      >
                        <Award className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                        <span className="truncate">{exam.title}</span>
                      </div>
                    ))}

                    {/* Task list */}
                    {dayTasks.map((task) => {
                      const sub = subjects.find((s) => s.id === task.subjectId);
                      return (
                        <div
                          key={task.id}
                          className={`p-2.5 rounded-xl border text-xs transition space-y-1.5 ${
                            task.completed
                              ? 'bg-slate-50 border-slate-200 opacity-60'
                              : 'bg-white border-slate-200 shadow-xs hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase"
                              style={{
                                backgroundColor: `${sub?.color || '#4f46e5'}20`,
                                color: sub?.color || '#4f46e5',
                              }}
                            >
                              {sub?.code || 'Task'}
                            </span>
                            <button
                              onClick={() => handleTaskCheckbox(task.id, task.completed)}
                              className="text-slate-400 hover:text-indigo-600"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          <div
                            className={`font-semibold line-clamp-2 ${
                              task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span>{task.startTime || `${task.durationMinutes}m`}</span>
                            {!task.completed && (
                              <button
                                onClick={() => handleFocusTimer(task.topicId)}
                                className="text-indigo-600 hover:underline font-bold"
                              >
                                Focus
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <button
                      onClick={() => onOpenAddTaskForDate(dayStr)}
                      className="w-full py-2 border border-dashed border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg text-slate-400 text-xs font-semibold flex items-center justify-center space-x-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. DAY VIEW */}
      {viewType === 'day' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Detailed Timeline: {format(currentDate, 'EEEE, MMMM d')}
              </h2>
              <p className="text-xs text-slate-500">
                Workload:{' '}
                {Number(
                  (
                    filteredTasks
                      .filter((t) => t.date === format(currentDate, 'yyyy-MM-dd'))
                      .reduce((acc, t) => acc + t.durationMinutes, 0) / 60
                  ).toFixed(1)
                )}
                h scheduled
              </p>
            </div>

            <button
              onClick={() => onOpenAddTaskForDate(format(currentDate, 'yyyy-MM-dd'))}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Session</span>
            </button>
          </div>

          {/* Hourly Timeline */}
          <div className="space-y-3">
            {hoursArray.map((hour) => {
              const hourStr = `${String(hour).padStart(2, '0')}:00`;
              const dayStr = format(currentDate, 'yyyy-MM-dd');
              const tasksAtHour = filteredTasks.filter(
                (t) => t.date === dayStr && t.startTime && t.startTime.startsWith(String(hour).padStart(2, '0'))
              );

              return (
                <div key={hour} className="flex items-start space-x-4 min-h-[50px] group">
                  <div className="w-14 text-xs font-bold text-slate-400 pt-1 shrink-0">
                    {hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                  </div>

                  <div className="flex-1 border-t border-slate-100 pt-1 min-h-[50px]">
                    {tasksAtHour.length > 0 ? (
                      <div className="space-y-2">
                        {tasksAtHour.map((task) => {
                          const sub = subjects.find((s) => s.id === task.subjectId);
                          return (
                            <div
                              key={task.id}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                                task.completed
                                  ? 'bg-slate-50 border-slate-200 opacity-60'
                                  : 'bg-white border-slate-200 shadow-xs'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleTaskCheckbox(task.id, task.completed)}
                                  className="text-slate-400 hover:text-indigo-600"
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                  ) : (
                                    <Circle className="w-5 h-5" />
                                  )}
                                </button>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase"
                                      style={{
                                        backgroundColor: `${sub?.color || '#4f46e5'}20`,
                                        color: sub?.color || '#4f46e5',
                                      }}
                                    >
                                      {sub?.name}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                      {task.durationMinutes} mins
                                    </span>
                                  </div>
                                  <div
                                    className={`text-sm font-bold ${
                                      task.completed
                                        ? 'line-through text-slate-500'
                                        : 'text-slate-900'
                                    }`}
                                  >
                                    {task.title}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {!task.completed && (
                                  <button
                                    onClick={() => handleFocusTimer(task.topicId)}
                                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                                  >
                                    <Play className="w-3 h-3 fill-indigo-600" />
                                    <span>Focus</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        onClick={() => onOpenAddTaskForDate(dayStr)}
                        className="h-9 rounded-lg border border-transparent hover:border-dashed hover:border-slate-200 hover:bg-slate-50/50 cursor-pointer flex items-center px-3 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition"
                      >
                        + Click to schedule at {hourStr}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
