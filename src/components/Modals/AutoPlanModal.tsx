import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';
import { X, Sparkles, Calendar, Clock, BookOpen, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AutoPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoPlanModal: React.FC<AutoPlanModalProps> = ({ isOpen, onClose }) => {
  const { subjects, exams, topics, smartAutoPlan, setActiveTab } = useStudyStore();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || ''
  );
  const [dailyHours, setDailyHours] = useState<number>(3.0);
  const [bufferDays, setBufferDays] = useState<number>(4);
  const [resultCount, setResultCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const targetExam = exams.find((e) => e.subjectId === selectedSubjectId);
  const uncompletedTopics = topics.filter(
    (t) => t.subjectId === selectedSubjectId && t.studyStatus !== 'completed'
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const count = smartAutoPlan(selectedSubjectId, dailyHours, bufferDays);
    setResultCount(count);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleDone = () => {
    setResultCount(null);
    onClose();
    setActiveTab('calendar');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Automatic Study Plan Generator
              </h3>
              <p className="text-xs text-slate-500">
                Intelligently distributes unfinished syllabus topics before exams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {resultCount !== null ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Generated {resultCount} Study &amp; Revision Sessions!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your uncompleted topics have been scheduled on your built-in calendar leading up to your exam cutoff date, accounting for topic difficulty and spaced revision.
            </p>
            <div className="pt-2">
              <button
                onClick={handleDone}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                View in Calendar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Course / Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-indigo-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Status info card */}
            <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs space-y-1.5 text-indigo-950">
              <div className="flex justify-between">
                <span className="font-bold">Uncompleted Syllabus:</span>
                <span className="font-extrabold text-indigo-600">
                  {uncompletedTopics.length} topics remain
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Linked Exam:</span>
                <span>
                  {targetExam ? `${targetExam.title} (${targetExam.examDate})` : 'No upcoming exam set'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Available Study Time
                </label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-indigo-500"
                >
                  <option value={1.5}>1.5 Hours / day</option>
                  <option value={2.0}>2.0 Hours / day</option>
                  <option value={3.0}>3.0 Hours / day</option>
                  <option value={4.0}>4.0 Hours / day</option>
                  <option value={5.0}>5.0 Hours / day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Revision Buffer Before Exam
                </label>
                <select
                  value={bufferDays}
                  onChange={(e) => setBufferDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-indigo-500"
                >
                  <option value={2}>2 Days Buffer</option>
                  <option value={3}>3 Days Buffer</option>
                  <option value={4}>4 Days Buffer (Recommended)</option>
                  <option value={7}>7 Days Buffer</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              The algorithm prioritizes <strong>Hard</strong> topics first, limits daily workload to your capacity, and automatically schedules spaced revision sessions before the final cutoff.
            </p>

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
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Smart Schedule</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
