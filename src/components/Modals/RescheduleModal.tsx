import React from 'react';
import { useStudyStore } from '../../store/studyStore';
import { X, AlertTriangle, Calendar, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose }) => {
  const { overdueTasks, rescheduleOverdueTasks, subjects } = useStudyStore();

  if (!isOpen) return null;

  const handleReschedule = (mode: 'today' | 'spread') => {
    rescheduleOverdueTasks(mode);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Missed-Task Rescheduler</h3>
              <p className="text-xs text-slate-500">
                {overdueTasks.length} uncompleted task{overdueTasks.length > 1 ? 's' : ''} from past days
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

        <div className="space-y-4 pt-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Life happens! Don't let incomplete tasks pile up in the past. Rebalance your schedule so you stay on track for your upcoming exams without burning out tomorrow.
          </p>

          {/* List of overdue tasks */}
          <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
            {overdueTasks.map((t) => {
              const sub = subjects.find((s) => s.id === t.subjectId);
              return (
                <div
                  key={t.id}
                  className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase mr-1.5"
                      style={{
                        backgroundColor: `${sub?.color || '#4f46e5'}20`,
                        color: sub?.color || '#4f46e5',
                      }}
                    >
                      {sub?.code}
                    </span>
                    <span className="font-semibold text-slate-800">{t.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{t.date}</span>
                </div>
              );
            })}
          </div>

          {/* Action options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleReschedule('today')}
              className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-left transition space-y-1 group"
            >
              <div className="text-xs font-bold text-indigo-900 group-hover:text-indigo-700">
                Move to Today
              </div>
              <p className="text-[11px] text-indigo-800/80">
                Roll over all unfinished tasks directly into today's study queue.
              </p>
            </button>

            <button
              onClick={() => handleReschedule('spread')}
              className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left transition space-y-1 group"
            >
              <div className="text-xs font-bold text-emerald-900 group-hover:text-emerald-700">
                Distribute Across Week (Recommended)
              </div>
              <p className="text-[11px] text-emerald-800/80">
                Evenly spread tasks across the next 5 days to avoid overloading tomorrow.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
