import React, { useState, useEffect, useRef } from 'react';
import { useStudyStore } from '../../store/studyStore';
import { Topic } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Volume2,
  VolumeX,
  Flame,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FocusTimerView: React.FC = () => {
  const {
    topics,
    subjects,
    activeTopicForTimer,
    setActiveTopicForTimer,
    logStudySession,
    todayStats,
  } = useStudyStore();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    activeTopicForTimer?.id || topics[0]?.id || ''
  );

  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [focusDuration, setFocusDuration] = useState<number>(25); // minutes
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState<number>(0);

  const timerRef = useRef<any>(null);

  // Play subtle web audio beep
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Audio context might be blocked if user hasn't interacted
    }
  };

  // Sync if store active topic changed
  useEffect(() => {
    if (activeTopicForTimer) {
      setSelectedTopicId(activeTopicForTimer.id);
    }
  }, [activeTopicForTimer]);

  // Mode durations
  const getModeDurationSeconds = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    if (mode === 'focus') return focusDuration * 60;
    if (mode === 'shortBreak') return 5 * 60;
    return 15 * 60;
  };

  const handleModeSwitch = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setTimerMode(mode);
    setTimeLeftSeconds(getModeDurationSeconds(mode));
  };

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime();

            if (timerMode === 'focus') {
              if (selectedTopicId) {
                logStudySession(selectedTopicId, focusDuration);
              }
              setSessionsCompletedToday((c) => c + 1);
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, selectedTopicId, focusDuration]);

  const toggleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeftSeconds(getModeDurationSeconds(timerMode));
  };

  const currentTopic = topics.find((t) => t.id === selectedTopicId);
  const currentSubject = currentTopic
    ? subjects.find((s) => s.id === currentTopic.subjectId)
    : null;

  // Format MM:SS
  const mins = Math.floor(timeLeftSeconds / 60);
  const secs = timeLeftSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const totalModeSeconds = getModeDurationSeconds(timerMode);
  const progressPercent = Math.round(
    ((totalModeSeconds - timeLeftSeconds) / totalModeSeconds) * 100
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-2">
        <span className="text-xs uppercase font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
          Deep Focus Studio
        </span>
        <h1 className="text-2xl font-bold text-slate-900">Pomodoro Study Timer</h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Study with full focus. Completed intervals automatically log study time to your syllabus topic and update your daily progress ring.
        </p>
      </div>

      {/* Main Timer Display */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center space-x-1 text-xs font-bold mb-8">
          <button
            onClick={() => handleModeSwitch('focus')}
            className={`px-5 py-2 rounded-xl transition ${
              timerMode === 'focus'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pomodoro Focus ({focusDuration}m)
          </button>
          <button
            onClick={() => handleModeSwitch('shortBreak')}
            className={`px-4 py-2 rounded-xl transition ${
              timerMode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => handleModeSwitch('longBreak')}
            className={`px-4 py-2 rounded-xl transition ${
              timerMode === 'longBreak'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Big Circular Countdown Display */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="#f1f5f9"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke={
                timerMode === 'focus'
                  ? '#4f46e5'
                  : timerMode === 'shortBreak'
                  ? '#10b981'
                  : '#3b82f6'
              }
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={820}
              strokeDashoffset={820 - (820 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Time digits in center */}
          <div className="absolute text-center">
            <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 font-mono">
              {timeFormatted}
            </div>
            <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mt-2">
              {timerMode === 'focus'
                ? isRunning
                  ? 'Focusing...'
                  : 'Ready to study'
                : 'Resting & Recharging'}
            </div>
          </div>
        </div>

        {/* Selected Topic Tag */}
        <div className="my-6 max-w-md w-full text-center">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
            Active Study Topic:
          </label>
          <select
            value={selectedTopicId}
            onChange={(e) => {
              setSelectedTopicId(e.target.value);
              const found = topics.find((t) => t.id === e.target.value);
              if (found) setActiveTopicForTimer(found);
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 text-center focus:outline-indigo-500"
          >
            {topics.map((t) => {
              const sub = subjects.find((s) => s.id === t.subjectId);
              return (
                <option key={t.id} value={t.id}>
                  [{sub?.code || 'SUB'}] {t.title} ({t.actualHoursSpent}h logged)
                </option>
              );
            })}
          </select>
        </div>

        {/* Controls: Play/Pause, Reset, Sound */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleReset}
            className="p-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleStartPause}
            className={`px-8 py-3.5 rounded-2xl text-white font-bold text-base shadow-lg transition active:scale-95 flex items-center space-x-2 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Session</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSoundEnabled((s) => !s)}
            className={`p-3 border rounded-2xl transition ${
              soundEnabled
                ? 'border-indigo-200 text-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute alert' : 'Enable audio chime'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Focus Stats & Streak Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Today's Focus Logged</div>
            <div className="text-lg font-bold text-slate-900">{todayStats.hoursDone} Hours</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Completed Pomodoros</div>
            <div className="text-lg font-bold text-slate-900">{sessionsCompletedToday} Sessions</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Study Velocity</div>
            <div className="text-lg font-bold text-slate-900">Consistent Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};
