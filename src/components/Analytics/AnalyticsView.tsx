import React from 'react';
import { useStudyStore } from '../../store/studyStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, addDays } from 'date-fns';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  Calendar,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    subjects,
    topics,
    tasks,
    overallSyllabusProgress,
    getSubjectProgress,
    getExamReadiness,
    dailyStudyHoursGoal,
  } = useStudyStore();

  // Generate 7-day planned vs actual data
  const today = new Date();
  const past7DaysData = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayLabel = format(d, 'EEE (MMM d)');

    const dayTasks = tasks.filter((t) => t.date === dateStr);
    const plannedMins = dayTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
    const completedMins = dayTasks
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + t.durationMinutes, 0);

    return {
      name: dayLabel,
      PlannedHours: Number((plannedMins / 60).toFixed(1)),
      ActualHours: Number((completedMins / 60).toFixed(1)),
    };
  });

  // Subject syllabus vs readiness data
  const subjectAnalyticsData = subjects.map((sub) => {
    const prog = getSubjectProgress(sub.id);
    const readiness = getExamReadiness(sub.id);
    return {
      name: sub.code,
      fullName: sub.name,
      SyllabusCoverage: prog.percentage,
      ReadinessScore: readiness.score,
    };
  });

  // Velocity & Predicted completion date calculation
  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.studyStatus === 'completed').length;
  const remainingTopics = totalTopics - completedTopics;

  // Assuming an average student velocity of 1.2 topics per day
  const estimatedDaysToFinishAll = Math.ceil(remainingTopics / 1.2);
  const predictedCompletionDate = format(addDays(today, estimatedDaysToFinishAll), 'MMMM d, yyyy');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
        <span className="text-xs uppercase font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
          Academic Velocity
        </span>
        <h1 className="text-2xl font-bold text-slate-900">Study Analytics &amp; Pace Forecast</h1>
        <p className="text-xs text-slate-500">
          Visualize planned vs actual study hours, syllabus mastery, and projected exam readiness dates.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Syllabus Completion</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {overallSyllabusProgress.percentage}%
          </div>
          <p className="text-xs text-slate-500">
            {overallSyllabusProgress.completedTopics} of {overallSyllabusProgress.totalTopics} topics studied
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Predicted Completion</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">
            {predictedCompletionDate}
          </div>
          <p className="text-xs text-slate-500">
            Based on {remainingTopics} remaining topics @ current pace
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Daily Capacity Goal</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {dailyStudyHoursGoal} Hours / Day
          </div>
          <p className="text-xs text-slate-500">
            Optimal workload threshold to prevent exam burnout
          </p>
        </div>
      </div>

      {/* Planned vs Actual Study Hours Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Planned vs Actual Study Hours (Last 7 Days)
          </h3>
          <p className="text-xs text-slate-500">
            Compare scheduled study blocks with actual completed focus hours.
          </p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={past7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="PlannedHours" name="Planned Hours" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ActualHours" name="Actual Hours Done" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Coverage vs Exam Readiness Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Syllabus Coverage vs. Exam Readiness Score by Subject
          </h3>
          <p className="text-xs text-slate-500">
            Readiness accounts for Revision and Practice questions alongside raw topic reading.
          </p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="SyllabusCoverage" name="Syllabus Coverage %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ReadinessScore" name="Exam Readiness %" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
