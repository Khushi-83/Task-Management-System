import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getAnalytics, type AnalyticsData } from '../api/analytics';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const result = await getAnalytics();
      setData(result);
    } catch (error) {
      console.error("Failed to load analytics", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center text-slate-500 font-medium">Loading advanced analytics...</div>;
  if (!data) return <div className="flex h-64 items-center justify-center text-red-500 font-medium">Failed to load analytics data</div>;

  const PRIORITY_COLORS: Record<string, string> = {
    Low: '#3b82f6', // blue-500
    Medium: '#8b5cf6', // violet-500
    High: '#f43f5e', // rose-500
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">Deep insights into your productivity and task management.</p>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-white/10 z-0"></div>
          <div className="relative z-10 text-center transition-transform hover:scale-105 duration-300">
            <div className="text-5xl font-extrabold text-indigo-600 drop-shadow-sm">{data.productivityScore}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Productivity Score</div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 to-white/10 z-0"></div>
          <div className="relative z-10 text-center transition-transform hover:scale-105 duration-300">
            <div className="text-5xl font-extrabold text-emerald-500 drop-shadow-sm">{data.completionPercentage}%</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Completion Rate</div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/50 to-white/10 z-0"></div>
          <div className="relative z-10 text-center transition-transform hover:scale-105 duration-300">
            <div className="text-4xl font-extrabold text-amber-500 drop-shadow-sm">{data.averageCompletionHours}h</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Avg Time to Complete</div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/50 to-white/10 z-0"></div>
          <div className="relative z-10 text-center transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-extrabold text-rose-500 drop-shadow-sm">{data.mostProductiveDay}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Most Productive Day</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Completions Bar Chart */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-center items-center relative overflow-hidden h-[300px]">
          <h3 className="font-extrabold text-slate-800 self-start mb-4 uppercase tracking-wide text-sm z-10 relative">7-Day Completion Velocity</h3>
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 z-0"></div>
          <div className="relative z-10 w-full h-full">
            {data.completionsPerDay.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.completionsPerDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="text-sm text-slate-400 h-full flex items-center justify-center">No completions in last 7 days</div>}
          </div>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-center items-center relative overflow-hidden h-[300px]">
          <h3 className="font-extrabold text-slate-800 self-start mb-4 uppercase tracking-wide text-sm z-10 relative">Priority Distribution</h3>
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 z-0"></div>
          <div className="relative z-10 w-full h-full">
            {data.priorityDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.priorityDistribution}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="priority"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {data.priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#cbd5e1'} style={{ filter: `drop-shadow(0px 4px 6px ${PRIORITY_COLORS[entry.priority] || '#cbd5e1'}40)` }} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="text-sm text-slate-400 h-full flex items-center justify-center">No tasks to distribute</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
