import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';
import { DailyHabit } from '../../types';
import { format, parseISO, addDays, subDays } from 'date-fns';
import {
  AlarmClock,
  Dumbbell,
  Code2,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Droplet,
  Moon,
  Trash2,
  Calendar,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DailyRoutineView: React.FC = () => {
  const {
    habits,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    setActiveTab,
  } = useStudyStore();

  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('06:00 AM');
  const [newCategory, setNewCategory] = useState<'wakeup' | 'gym' | 'leetcode' | 'custom'>('custom');
  const [newDetails, setNewDetails] = useState('');

  // LeetCode editing state
  const [editingLeetCodeId, setEditingLeetCodeId] = useState<string | null>(null);
  const [leetCodeTitle, setLeetCodeTitle] = useState('');
  const [leetCodeDifficulty, setLeetCodeDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [leetCodeLink, setLeetCodeLink] = useState('https://leetcode.com/problemset/all/');

  const handlePrevDay = () => {
    setSelectedDate((d) => format(subDays(parseISO(d), 1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    setSelectedDate((d) => format(addDays(parseISO(d), 1), 'yyyy-MM-dd'));
  };

  const handleToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleToggle = (habitId: string, isDone: boolean) => {
    toggleHabit(habitId, selectedDate);
    if (!isDone) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleSaveLeetCode = (habit: DailyHabit) => {
    updateHabit(habit.id, {
      details: leetCodeTitle.trim() || habit.details,
      difficulty: leetCodeDifficulty,
      problemLink: leetCodeLink.trim() || habit.problemLink,
    });
    setEditingLeetCodeId(null);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let icon = 'Calendar';
    if (newCategory === 'wakeup') icon = 'AlarmClock';
    else if (newCategory === 'gym') icon = 'Dumbbell';
    else if (newCategory === 'leetcode') icon = 'Code2';

    addHabit({
      title: newTitle.trim(),
      category: newCategory,
      time: newTime,
      icon,
      details: newDetails.trim() || undefined,
    });

    setNewTitle('');
    setNewDetails('');
    setShowAddModal(false);
  };

  const completedCount = habits.filter((h) =>
    h.completedDates.includes(selectedDate)
  ).length;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const getHabitIcon = (habit: DailyHabit) => {
    if (habit.category === 'wakeup') return <AlarmClock className="w-5 h-5 text-amber-600" />;
    if (habit.category === 'gym') return <Dumbbell className="w-5 h-5 text-emerald-600" />;
    if (habit.category === 'leetcode') return <Code2 className="w-5 h-5 text-indigo-600" />;
    if (habit.title.toLowerCase().includes('water')) return <Droplet className="w-5 h-5 text-blue-500" />;
    if (habit.title.toLowerCase().includes('sleep')) return <Moon className="w-5 h-5 text-indigo-500" />;
    return <Calendar className="w-5 h-5 text-slate-600" />;
  };

  const isSelectedToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 bg-white/10 rounded-full border border-white/10 text-indigo-200">
                Disciplined High-Performance Routine
              </span>
              <span className="text-xs text-indigo-300 font-medium">Daily Habits &amp; To-Do</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              5:00 AM Wakeup &bull; Gym &bull; LeetCode &bull; Academic Deep Work
            </h1>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
              Consistent daily execution builds exam mastery. Wake up early, train physically, solve daily algorithmic problems, and conquer your 4 syllabus blocks.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Routine / Task</span>
            </button>
          </div>
        </div>

        {/* Date Selector Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevDay}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-white">
              {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
            </span>
            <button
              onClick={handleNextDay}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isSelectedToday && (
              <button
                onClick={handleToday}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] font-bold"
              >
                Jump to Today
              </button>
            )}
          </div>

          {/* Daily Routine Completion Bar */}
          <div className="flex items-center space-x-3">
            <span className="text-indigo-200 font-semibold">
              Today's Routine: {completedCount} / {habits.length} ({progressPercent}%)
            </span>
            <div className="w-28 bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Habits & To-Do Checklist */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Daily To-Do &amp; Habits Checklist</h3>
                <p className="text-xs text-slate-500">
                  Tick off items as you complete them throughout your day
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {completedCount} Completed
              </span>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => {
                const isDone = habit.completedDates.includes(selectedDate);

                return (
                  <div
                    key={habit.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-slate-50/70 border-slate-200 opacity-70'
                        : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <button
                        onClick={() => handleToggle(habit.id, isDone)}
                        className="text-slate-400 hover:text-indigo-600 transition shrink-0 mt-0.5"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-500" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="p-1 rounded-lg bg-slate-50 border border-slate-100">
                            {getHabitIcon(habit)}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {habit.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                            {habit.time}
                          </span>
                          {habit.difficulty && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                habit.difficulty === 'Hard'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : habit.difficulty === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              LeetCode {habit.difficulty}
                            </span>
                          )}
                        </div>

                        {habit.details && (
                          <p className="text-xs text-slate-500 leading-relaxed pl-1">
                            {habit.details}
                          </p>
                        )}

                        {habit.problemLink && (
                          <div className="pt-1 pl-1 flex items-center space-x-2">
                            <a
                              href={habit.problemLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center space-x-1"
                            >
                              <span>Open LeetCode Problem</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => {
                                setEditingLeetCodeId(habit.id);
                                setLeetCodeTitle(habit.details || '');
                                setLeetCodeDifficulty(habit.difficulty || 'Medium');
                                setLeetCodeLink(habit.problemLink || 'https://leetcode.com/problemset/all/');
                              }}
                              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center space-x-0.5"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                              <span>Edit Problem</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side: Streak Badge & Actions */}
                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-800 text-xs font-bold">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{habit.streak}d Streak</span>
                      </div>

                      {habit.category === 'custom' && (
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 transition"
                          title="Delete habit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): LeetCode Tracker & Today's Schedule Bridge */}
        <div className="lg:col-span-4 space-y-6">
          {/* LeetCode Daily Focus Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50/50 rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">LeetCode Daily Drill</h4>
                  <p className="text-[11px] text-slate-500">Problem Solving Streak</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200 shadow-xs">
                DSA Focus
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Solve at least 1 Medium or 2 Easy questions every day to keep your data structures &amp; algorithms sharp before campus placements and semester coding labs.
            </p>

            <div className="p-3 bg-white rounded-xl border border-indigo-100/80 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Daily Target:</span>
                <span className="font-bold text-slate-800">Arrays / Two Pointers / Trees</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Recommended Time:</span>
                <span className="font-bold text-slate-800">45 - 60 Minutes</span>
              </div>
            </div>

            <a
              href="https://leetcode.com/problemset/all/"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Solve Today's Problem on LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Bridge to Today's Academic Calendar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Academic Study Routine</h4>
                <p className="text-xs text-slate-500">1 Topic per subject scheduled daily</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                <span className="font-semibold text-blue-900">09:00 AM &bull; Operating Systems</span>
                <span className="font-bold text-blue-700">1 Topic</span>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                <span className="font-semibold text-purple-900">11:30 AM &bull; Models of Computation</span>
                <span className="font-bold text-purple-700">1 Topic</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">02:30 PM &bull; Database Systems</span>
                <span className="font-bold text-emerald-700">1 Topic</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                <span className="font-semibold text-amber-900">05:00 PM &bull; Cloud Infrastructure</span>
                <span className="font-bold text-amber-700">1 Topic</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('calendar')}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition"
            >
              Open Full Built-in Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Add Custom Habit / Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Daily Routine Task / Habit</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add custom goals to track every single day.
            </p>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Routine Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cold shower, Read 20 pages, Lab assignment"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 05:30 AM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-indigo-500"
                  >
                    <option value="custom">Custom Task</option>
                    <option value="wakeup">Wakeup / Morning</option>
                    <option value="gym">Gym &amp; Fitness</option>
                    <option value="leetcode">Coding / LeetCode</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Chest & triceps workout, 4 sets each"
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Add Routine Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit LeetCode Modal */}
      {editingLeetCodeId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Edit LeetCode Daily Problem</h3>
            <p className="text-xs text-slate-500 mb-4">Update the specific problem for today.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Problem Name</label>
                <input
                  type="text"
                  placeholder="e.g. 15. 3Sum or 206. Reverse Linked List"
                  value={leetCodeTitle}
                  onChange={(e) => setLeetCodeTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={leetCodeDifficulty}
                    onChange={(e) => setLeetCodeDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL (Optional)</label>
                  <input
                    type="text"
                    value={leetCodeLink}
                    onChange={(e) => setLeetCodeLink(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLeetCodeId(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const h = habits.find((item) => item.id === editingLeetCodeId);
                    if (h) handleSaveLeetCode(h);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Problem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
