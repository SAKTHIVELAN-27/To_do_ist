import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';
import { X, Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { exportDataJson, importDataJson, resetToDefaultData } = useStudyStore();
  const [importJson, setImportJson] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studysync-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage({ type: 'success', text: 'Backup downloaded successfully!' });
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    const ok = importDataJson(importJson.trim());
    if (ok) {
      setStatusMessage({ type: 'success', text: 'Data imported successfully!' });
      setImportJson('');
      setTimeout(() => onClose(), 1200);
    } else {
      setStatusMessage({ type: 'error', text: 'Invalid JSON format. Please verify your backup file.' });
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all subjects, topics, and schedule to default demonstration data?')) {
      resetToDefaultData();
      setStatusMessage({ type: 'success', text: 'Reset to default sample data complete!' });
      setTimeout(() => onClose(), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Data Management &amp; Backup</h3>
            <p className="text-xs text-slate-500">Export, import, or reset your academic planner</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-5 pt-4">
          {/* Export & Reset */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="p-3.5 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 flex flex-col items-center justify-center space-y-1.5 transition"
            >
              <Download className="w-5 h-5 text-indigo-600" />
              <span>Export Backup (.JSON)</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center justify-center space-y-1.5 transition"
            >
              <RotateCcw className="w-5 h-5 text-slate-500" />
              <span>Reset to Demo Data</span>
            </button>
          </div>

          {/* Import JSON */}
          <form onSubmit={handleImport} className="space-y-2 border-t border-slate-100 pt-4">
            <label className="block text-xs font-bold text-slate-700">
              Restore from Backup (Paste JSON)
            </label>
            <textarea
              rows={4}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste previously exported JSON data here..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-indigo-500"
            />
            <button
              type="submit"
              disabled={!importJson.trim()}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Backup</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
