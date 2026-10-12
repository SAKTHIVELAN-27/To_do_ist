import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';
import { Topic, Difficulty, StudyStatus } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCw,
  Edit3,
  Calendar,
  Play,
  ChevronDown,
  ChevronRight,
  Flame,
  Trash2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SyllabusViewProps {
  onScheduleTopic: (topic: Topic) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({ onScheduleTopic }) => {
  const {
    subjects,
    modules,
    topics,
    toggleTopicStudyStatus,
    toggleTopicRevision1,
    toggleTopicRevision2,
    toggleTopicPractice,
    addTopic,
    deleteTopic,
    addModule,
    addSubject,
    deleteSubject,
    getSubjectProgress,
    getModuleProgress,
    setActiveTopicForTimer,
    setActiveTab,
  } = useStudyStore();

  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    subjects[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | Difficulty>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed' | 'needs_revision' | 'needs_practice'>('all');
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  // Modals / forms state
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // New Topic Form State
  const [newTopicModuleId, setNewTopicModuleId] = useState('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<Difficulty>('medium');
  const [newTopicHours, setNewTopicHours] = useState('2.0');

  // New Module Form State
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // New Subject Form State
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#6366f1');

  const activeSubject = subjects.find((s) => s.id === activeSubjectId) || subjects[0];
  const subjectProgress = activeSubject ? getSubjectProgress(activeSubject.id) : null;
  const subjectModules = modules.filter((m) => m.subjectId === activeSubject?.id);

  const toggleModuleCollapse = (modId: string) => {
    setCollapsedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleStudyStatusClick = (topicId: string, currentStatus: StudyStatus) => {
    const next: StudyStatus =
      currentStatus === 'not_started'
        ? 'in_progress'
        : currentStatus === 'in_progress'
        ? 'completed'
        : 'not_started';

    toggleTopicStudyStatus(topicId, next);
    if (next === 'completed') {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
  };

  const handleFocusTimer = (topic: Topic) => {
    setActiveTopicForTimer(topic);
    setActiveTab('timer');
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicModuleId || !activeSubject) return;

    addTopic({
      moduleId: newTopicModuleId,
      subjectId: activeSubject.id,
      title: newTopicTitle.trim(),
      difficulty: newTopicDifficulty,
      estimatedHours: parseFloat(newTopicHours) || 1.5,
      actualHoursSpent: 0,
      studyStatus: 'not_started',
      revision1: false,
      revision2: false,
      practiceDone: false,
      order: topics.length + 1,
    });

    setNewTopicTitle('');
    setShowAddTopicModal(false);
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim() || !activeSubject) return;
    addModule(activeSubject.id, newModuleTitle.trim());
    setNewModuleTitle('');
    setShowAddModuleModal(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;
    addSubject(newSubjectName.trim(), newSubjectCode.trim(), newSubjectColor);
    setNewSubjectName('');
    setNewSubjectCode('');
    setShowAddSubjectModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subject Selector Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Syllabus Tracker
              </span>
              <span className="text-xs text-slate-400">Multi-Factor Progress Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Course Syllabus &amp; Checklists
            </h1>
            <p className="text-xs text-slate-500">
              Track initial study, Revision 1 &amp; 2, and practice questions separately to measure true exam readiness.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Subject</span>
            </button>
            <button
              onClick={() => {
                if (subjectModules.length > 0) {
                  setNewTopicModuleId(subjectModules[0].id);
                  setShowAddTopicModal(true);
                } else {
                  setShowAddModuleModal(true);
                }
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic</span>
            </button>
          </div>
        </div>

        {/* Subjects Tab Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
          {subjects.map((sub) => {
            const prog = getSubjectProgress(sub.id);
            const isSelected = sub.id === activeSubject?.id;

            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubjectId(sub.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: sub.color }}
                />
                <span>{sub.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {prog.percentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Subject Progress Banner */}
        {activeSubject && subjectProgress && (
          <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeSubject.color }}
                />
                <h3 className="text-base font-bold text-slate-900">
                  {activeSubject.name} ({activeSubject.code})
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {subjectProgress.completedTopics} of {subjectProgress.totalTopics} topics studied &bull;{' '}
                {subjectProgress.actualHours}h logged of ~{subjectProgress.estimatedHours}h estimated
              </p>
            </div>

            {/* Micro Stats Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">Initial Study</div>
                <div className="text-xs font-extrabold text-indigo-600">
                  {subjectProgress.percentage}%
                </div>
              </div>
              <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">Rev 1 Done</div>
                <div className="text-xs font-extrabold text-purple-600">
                  {subjectProgress.rev1Count}/{subjectProgress.totalTopics}
                </div>
              </div>
              <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">Practice Done</div>
                <div className="text-xs font-extrabold text-emerald-600">
                  {subjectProgress.practiceCount}/{subjectProgress.totalTopics}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topic or concept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-indigo-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 text-xs">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-indigo-500"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-indigo-500"
            >
              <option value="all">All Progress</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Study Completed</option>
              <option value="needs_revision">Needs Revision</option>
              <option value="needs_practice">Needs Practice</option>
            </select>

            <button
              onClick={() => setShowAddModuleModal(true)}
              className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 rounded-lg font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modules and Topics Accordion List */}
      <div className="space-y-4">
        {subjectModules.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No modules created for this subject</h3>
            <p className="text-xs text-slate-400 mt-1">
              Break down this subject into units or modules to track topics and difficulty.
            </p>
            <button
              onClick={() => setShowAddModuleModal(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Add First Module
            </button>
          </div>
        ) : (
          subjectModules.map((mod) => {
            const modProgress = getModuleProgress(mod.id);
            const isCollapsed = !!collapsedModules[mod.id];

            let modTopics = topics.filter((t) => t.moduleId === mod.id);

            // Apply search
            if (searchQuery.trim()) {
              modTopics = modTopics.filter((t) =>
                t.title.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }

            // Apply difficulty filter
            if (filterDifficulty !== 'all') {
              modTopics = modTopics.filter((t) => t.difficulty === filterDifficulty);
            }

            // Apply status filter
            if (filterStatus === 'not_started') {
              modTopics = modTopics.filter((t) => t.studyStatus === 'not_started');
            } else if (filterStatus === 'in_progress') {
              modTopics = modTopics.filter((t) => t.studyStatus === 'in_progress');
            } else if (filterStatus === 'completed') {
              modTopics = modTopics.filter((t) => t.studyStatus === 'completed');
            } else if (filterStatus === 'needs_revision') {
              modTopics = modTopics.filter((t) => !t.revision1);
            } else if (filterStatus === 'needs_practice') {
              modTopics = modTopics.filter((t) => !t.practiceDone);
            }

            return (
              <div
                key={mod.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => toggleModuleCollapse(mod.id)}
                  className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-4 transition select-none"
                >
                  <div className="flex items-center space-x-3">
                    <button className="text-slate-400">
                      {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {modProgress.completedTopics} of {modProgress.totalTopics} topics completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Module Progress Bar */}
                    <div className="hidden sm:flex items-center space-x-2 w-32">
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${modProgress.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {modProgress.percentage}%
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewTopicModuleId(mod.id);
                        setShowAddTopicModal(true);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Topic</span>
                    </button>
                  </div>
                </div>

                {/* Topics Table List */}
                {!isCollapsed && (
                  <div className="divide-y divide-slate-100">
                    {modTopics.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No topics match the selected search/filters in this module.
                      </div>
                    ) : (
                      modTopics.map((topic) => (
                        <div
                          key={topic.id}
                          className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          {/* Left: Title, Difficulty & Hours */}
                          <div className="space-y-1.5 max-w-lg">
                            <div className="flex items-center space-x-2">
                              {/* Difficulty Tag */}
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  topic.difficulty === 'hard'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : topic.difficulty === 'medium'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {topic.difficulty}
                              </span>

                              <h4 className="text-sm font-bold text-slate-900">{topic.title}</h4>
                            </div>

                            <div className="flex items-center space-x-3 text-xs text-slate-400">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Est: {topic.estimatedHours}h</span>
                              </span>
                              <span>&bull;</span>
                              <span>Logged: {topic.actualHoursSpent}h</span>
                              {topic.notes && (
                                <>
                                  <span>&bull;</span>
                                  <span className="truncate max-w-[200px] text-slate-500">
                                    {topic.notes}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Middle: Multi-Checklist (Study, Rev 1, Rev 2, Practice) */}
                          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
                            {/* Study Status Button */}
                            <button
                              onClick={() => handleStudyStatusClick(topic.id, topic.studyStatus)}
                              className={`px-3 py-1.5 rounded-lg font-bold border transition flex items-center space-x-1.5 ${
                                topic.studyStatus === 'completed'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : topic.studyStatus === 'in_progress'
                                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                              }`}
                              title="Click to toggle: Not Started -> In Progress -> Completed"
                            >
                              {topic.studyStatus === 'completed' ? (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              ) : null}
                              <span className="capitalize">
                                {topic.studyStatus.replace('_', ' ')}
                              </span>
                            </button>

                            {/* Revision 1 Checkbox */}
                            <button
                              onClick={() => toggleTopicRevision1(topic.id)}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition ${
                                topic.revision1
                                  ? 'bg-purple-50 border-purple-300 text-purple-700'
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-purple-300'
                              }`}
                              title="First revision completed"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Rev 1</span>
                            </button>

                            {/* Revision 2 Checkbox */}
                            <button
                              onClick={() => toggleTopicRevision2(topic.id)}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition ${
                                topic.revision2
                                  ? 'bg-purple-100 border-purple-400 text-purple-800'
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-purple-300'
                              }`}
                              title="Second revision completed"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Rev 2</span>
                            </button>

                            {/* Practice Checkbox */}
                            <button
                              onClick={() => toggleTopicPractice(topic.id)}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition ${
                                topic.practiceDone
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300'
                              }`}
                              title="Exam questions & problem sets completed"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Practice</span>
                            </button>
                          </div>

                          {/* Right: Quick Actions (Schedule to Calendar, Start Pomodoro Focus) */}
                          <div className="flex items-center space-x-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <button
                              onClick={() => onScheduleTopic(topic)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Schedule to Calendar"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleFocusTimer(topic)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Start Focus Timer on this topic"
                            >
                              <Play className="w-4 h-4 fill-slate-400 hover:fill-indigo-600" />
                            </button>
                            <button
                              onClick={() => deleteTopic(topic.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                              title="Delete topic"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Syllabus Topic</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add to {activeSubject?.name} for tracking study, revision, and practice.
            </p>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Module</label>
                <select
                  value={newTopicModuleId}
                  onChange={(e) => setNewTopicModuleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-indigo-500"
                  required
                >
                  {subjectModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Memory Management & Paging Architecture"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newTopicDifficulty}
                    onChange={(e) => setNewTopicDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-indigo-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newTopicHours}
                    onChange={(e) => setNewTopicHours(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Module / Unit</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new module to {activeSubject?.name}.
            </p>

            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Module Name</label>
                <input
                  type="text"
                  placeholder="e.g. Module 5: File Systems & I/O"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Subject</h3>
            <p className="text-xs text-slate-500 mb-4">Create a new academic subject course.</p>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Networks"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS-404"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Theme Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={newSubjectColor}
                    onChange={(e) => setNewSubjectColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <span className="text-xs text-slate-500 font-mono">{newSubjectColor}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
