import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';
import { TaskType, Topic } from '../../types';
import { format } from 'date-fns';
import { X, Calendar, Clock, BookOpen } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTopic?: Topic | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  defaultTopic,
}) => {
  const { subjects, topics, addTask } = useStudyStore();

  const [subjectId, setSubjectId] = useState<string>(
    defaultTopic?.subjectId || subjects[0]?.id || ''
  );
  const [topicId, setTopicId] = useState<string>(defaultTopic?.id || '');
  const [title, setTitle] = useState<string>(
    defaultTopic ? `${defaultTopic.title}` : ''
  );
  const [date, setDate] = useState<string>(
    defaultDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [startTime, setStartTime] = useState<string>('09:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [taskType, setTaskType] = useState<TaskType>('study');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubjectChange = (newSubId: string) => {
    setSubjectId(newSubId);
    const subTopics = topics.filter((t) => t.subjectId === newSubId);
    if (subTopics.length > 0) {
      setTopicId(subTopics[0].id);
      setTitle(subTopics[0].title);
    } else {
      setTopicId('');
      setTitle('');
    }
  };

  const handleTopicChange = (newTopId: string) => {
    setTopicId(newTopId);
    const top = topics.find((t) => t.id === newTopId);
    if (top) {
      setTitle(top.title);
      setDurationMinutes(Math.round((top.estimatedHours || 1) * 60));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    addTask({
      subjectId,
      topicId: topicId || undefined,
      title: title.trim(),
      date,
      startTime: startTime || undefined,
      durationMinutes: Number(durationMinutes) || 60,
      type: taskType,
      completed: false,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const availableTopics = topics.filter((t) => t.subjectId === subjectId);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Schedule Study Session</h3>
            <p className="text-xs text-slate-500">Connect to syllabus topics and plan on calendar</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-indigo-500"
                required
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session Type</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as TaskType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-indigo-500"
              >
                <option value="study">📖 Study Initial</option>
                <option value="revision">🔄 Revision Block</option>
                <option value="practice">✍️ Practice Questions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Link Syllabus Topic (Optional)
            </label>
            <select
              value={topicId}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
            >
              <option value="">-- No linked topic / General --</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.difficulty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Session Title</label>
            <input
              type="text"
              placeholder="e.g. Operating Systems — Deadlocks & Banker's Algorithm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-indigo-500"
              >
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins (1h)</option>
                <option value={90}>90 mins (1.5h)</option>
                <option value={120}>120 mins (2h)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Study Notes / Goal</label>
            <input
              type="text"
              placeholder="e.g. Review lecture slides 40-75 and solve 2 examples"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Schedule Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
