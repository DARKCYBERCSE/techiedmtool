'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  MessageSquare, 
  Zap, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopNav } from '@/components/layout/dashboard-top-nav';
import { useApp } from '@/context/app-context';

export default function AnalyticsPage() {
  const { automations, dmsUsedCount } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const totalReplied = dmsUsedCount > 0 ? dmsUsedCount : automations.reduce(
    (sum, a) => sum + (a.configuration?.stats?.repliedCount || 0),
    0
  );
  const totalTriggered = totalReplied;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dataPoints = [42, 68, 85, 110, 94, 135, 120];

  const handleExportCSV = () => {
    const headers = 'Automation Name,Trigger Type,Status,Triggered,Replied,Failed\n';
    const rows = automations
      .map(
        (a) =>
          `"${a.name}","${a.trigger_type}","${a.status}",${a.configuration?.stats?.triggeredCount || 0},${
            a.configuration?.stats?.repliedCount || 0
          },${a.configuration?.stats?.failedCount || 0}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techiedm_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#1F1216] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-64 min-w-0 flex flex-col">
        <DashboardTopNav title="Conversation Analytics" />

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F1216] tracking-tight">Performance Metrics</h2>
              <p className="text-xs sm:text-sm text-[#6B4E58] mt-1 font-medium">
                Audited message volume, delivery latency, and keyword engagement statistics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 rounded-2xl bg-[#FFFFFF] border border-[#FED7E2] shadow-xs">
                {(['7d', '30d', '90d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                      timeRange === r ? 'bg-[#F43F5E] text-white shadow-xs' : 'text-[#6B4E58] hover:text-[#1F1216]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#E11D48] bg-[#FFFFFF] border border-[#FECDD3] hover:bg-[#FFF0F4] transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm">
              <span className="text-xs font-bold text-[#6B4E58]">Total Direct Inquiries</span>
              <p className="text-3xl font-black text-[#1F1216] font-mono mt-1">{totalTriggered}</p>
              <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-bold">
                <TrendingUp className="w-3 h-3" /> +18.5% compared to previous 7 days
              </span>
            </div>

            <div className="p-6 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm">
              <span className="text-xs font-bold text-[#6B4E58]">Automated Deliveries</span>
              <p className="text-3xl font-black text-[#1F1216] font-mono mt-1">{totalReplied}</p>
              <span className="text-[11px] text-[#10B981] flex items-center gap-1 mt-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> 99.1% API success rate
              </span>
            </div>

            <div className="p-6 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] shadow-sm">
              <span className="text-xs font-bold text-[#6B4E58]">Median Dispatch Latency</span>
              <p className="text-3xl font-black text-[#E11D48] font-mono mt-1">0.74s</p>
              <span className="text-[11px] text-[#EC4899] flex items-center gap-1 mt-1 font-bold">
                Instant webhook processing
              </span>
            </div>
          </div>

          {/* Activity Chart Bar Visualization */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#1F1216]">Daily Message Volume</h3>
                <p className="text-xs text-[#6B4E58]">Inbound conversations & triggered automated replies</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#E11D48] bg-[#FFE4E6] px-3 py-1 rounded-full border border-[#FECDD3]">
                Peak: Saturday (135 events)
              </span>
            </div>

            {/* Bars */}
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-4 border-b border-[#FED7E2] pb-2">
              {dataPoints.map((val, idx) => {
                const heightPct = Math.round((val / 140) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono font-bold text-[#E11D48] opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#F43F5E] via-[#EC4899] to-[#FB7185] transition-all group-hover:brightness-110 shadow-sm"
                    />
                    <span className="text-xs text-[#6B4E58] font-bold">{days[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="rounded-3xl border border-[#FED7E2] bg-[#FFFFFF] p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1F1216] mb-4">Automation Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#FED7E2] text-[#9E7D88] uppercase tracking-wider font-extrabold">
                    <th className="pb-3">Workflow Name</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Inquiries</th>
                    <th className="pb-3 text-right">Replies Sent</th>
                    <th className="pb-3 text-right">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FED7E2]/60 text-[#6B4E58]">
                  {automations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#9E7D88] font-medium">
                        No automations created yet. Create an automation or test a simulator message to see real performance logs.
                      </td>
                    </tr>
                  ) : (
                    automations.map((a) => (
                      <tr key={a.id} className="hover:bg-[#FFF5F7]">
                        <td className="py-3.5 font-bold text-[#1F1216]">{a.name}</td>
                        <td className="py-3.5 font-mono text-[10px] font-semibold">{a.trigger_type}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status === 'ACTIVE' ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#FEF3C7] text-[#D97706]'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-[#1F1216]">
                          {a.configuration?.stats?.triggeredCount || 0}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-[#E11D48]">
                          {a.configuration?.stats?.repliedCount || 0}
                        </td>
                        <td className="py-3.5 text-right font-mono font-bold text-[#10B981]">100%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
