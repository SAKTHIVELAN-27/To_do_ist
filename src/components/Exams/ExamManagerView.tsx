import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';
import { Exam } from '../../types';
import { format, parseISO } from 'date-fns';
import {
  Award,
  Plus,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle,
  HelpCircle,
  Trash2,
} from 'lucide-react';

interface ExamManagerViewProps {
  onOpenAutoPlan: () => void;
}

export const ExamManagerView: React.FC<ExamManagerViewProps> = ({ onOpenAutoPlan }) => {
  const {
    subjects,
    exams,
    topics,
    addExam,
    deleteExam,
    getExamReadiness,
    getExamPacing,
    getSubjectProgress,
  } = useStudyStore();

  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [examSubjectId, setExamSubjectId] = useState(subjects[0]?.id || '');
  const [examTitle, setExamTitle] = useState('');
  const [examDateStr, setExamDateStr] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [targetDateStr, setTargetDateStr] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [revisionBuffer, setRevisionBuffer] = useState('4');
  const [examPriority, setExamPriority] = useState<'high' | 'medium' | 'low'>('high');

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !examSubjectId) return;

    addExam({
      subjectId: examSubjectId,
      title: examTitle.trim(),
      examDate: examDateStr,
      targetFinishDate: targetDateStr,
      revisionDaysBuffer: parseInt(revisionBuffer) || 4,
      priority: examPriority,
    });

    setExamTitle('');
    setShowAddExamModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                Backward Planning
              </span>
              <span className="text-xs text-slate-400">Exam Preparation &amp; Readiness</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Exam Countdown &amp; Readiness Engine
            </h1>
            <p className="text-xs text-slate-500">
              Syllabus completion alone isn't enough. We evaluate syllabus coverage (50%), revision (30%), and practice questions (20%) to determine actual exam readiness.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAutoPlan}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Plan Syllabus</span>
            </button>
            <button
              onClick={() => setShowAddExamModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
          </div>
        </div>

        {/* Readiness Formula Transparency Alert */}
        <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-start space-x-3 text-xs text-indigo-950">
          <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Transparent Exam Readiness Formula:</span>
            <p className="text-indigo-800/90 leading-relaxed">
              <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-indigo-900">
                Readiness Score = (0.50 × Syllabus Coverage) + (0.30 × Revision Complete) + (0.20 × Practice Problems)
              </code>
              <br />
              This prevents false confidence when a student reads a chapter once without revising or solving numerical/exam questions.
            </p>
          </div>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exams.map((exam) => {
          const subject = subjects.find((s) => s.id === exam.subjectId);
          const readiness = getExamReadiness(exam.subjectId);
          const pacing = getExamPacing(exam);
          const progress = getSubjectProgress(exam.subjectId);

          return (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Title, Countdown badge, Priority */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: subject?.color || '#6366f1' }}
                      />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {subject?.code} &bull; {subject?.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{exam.title}</h3>
                  </div>

                  <div className="text-right">
                    <div className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-extrabold flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>{pacing.daysLeft} Days Left</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                      {format(parseISO(exam.examDate), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>

                {/* Readiness Score Breakdown Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Exam Readiness Score</div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {readiness.score}%
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            readiness.status === 'Exam Ready'
                              ? 'bg-emerald-100 text-emerald-800'
                              : readiness.status === 'On Track'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {readiness.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <div className="text-slate-400">Pacing Velocity:</div>
                      <span
                        className={`font-bold ${
                          pacing.paceStatus === 'Ahead of schedule'
                            ? 'text-emerald-600'
                            : pacing.paceStatus === 'On track'
                            ? 'text-blue-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {pacing.paceStatus}
                      </span>
                    </div>
                  </div>

                  {/* 3 Weighted Components */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Syllabus (50%)
                      </div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">
                        {readiness.syllabusCoverage}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {progress.completedTopics}/{progress.totalTopics} done
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Revision (30%)
                      </div>
                      <div className="text-sm font-bold text-purple-700 mt-0.5">
                        {readiness.revisionRate}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {progress.rev1Count} revised
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Practice (20%)
                      </div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">
                        {readiness.practiceRate}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {progress.practiceCount} solved
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preparation Milestones / Pacing targets */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target 1st Round Finish:</span>
                    </span>
                    <span className="font-bold text-slate-800">
                      {format(parseISO(exam.targetFinishDate), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reserved Mock &amp; Revision Buffer:</span>
                    </span>
                    <span className="font-bold text-indigo-600">
                      {exam.revisionDaysBuffer} Days Reserved
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                      <span>Required Daily Pace:</span>
                    </span>
                    <span className="font-bold text-slate-800">
                      {pacing.requiredTopicsPerDay} topics / day
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => deleteExam(exam.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  title="Delete Exam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenAutoPlan}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Daily Schedule</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Upcoming Exam</h3>
            <p className="text-xs text-slate-500 mb-4">
              Set your exam date and buffer days to work backward.
            </p>

            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={examSubjectId}
                  onChange={(e) => setExamSubjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-indigo-500"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. End Semester Exam"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examDateStr}
                    onChange={(e) => setExamDateStr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Finish 1st Round By
                  </label>
                  <input
                    type="date"
                    value={targetDateStr}
                    onChange={(e) => setTargetDateStr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Revision Buffer (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={revisionBuffer}
                    onChange={(e) => setRevisionBuffer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={examPriority}
                    onChange={(e) => setExamPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-indigo-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
