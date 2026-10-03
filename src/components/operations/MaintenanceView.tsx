import React from 'react';
import { useOps } from '../../context/OpsContext';
import { Calendar } from 'lucide-react';

export const MaintenanceView: React.FC = () => {
  const { maintenanceWindows, applications } = useOps();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            MAINTENANCE WINDOWS &amp; ALERT SILENCING
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Scheduled maintenance with selective alert silencing (application alerts suppressed, watchdog &amp; security unmuted)
          </p>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {maintenanceWindows.map(m => {
          const app = applications.find(a => a.id === m.applicationId);
          return (
            <div key={m.id} className="p-4 bg-[#111726] rounded border border-[#1E293B] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A2332] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-[#162033] text-indigo-400 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 font-sans">{m.title}</span>
                      <span className="text-xs text-blue-400 font-semibold">
                        {app?.name} ({m.environment})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">{m.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold text-[10px] uppercase">
                    {m.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-300">
                <div className="p-2.5 bg-[#0B0F17] rounded border border-[#1A2436]">
                  <span className="text-[9px] text-slate-500 uppercase">Window Period</span>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    {new Date(m.startTime).toLocaleDateString()} {new Date(m.startTime).toLocaleTimeString()}
                  </div>
                </div>

                <div className="p-2.5 bg-[#0B0F17] rounded border border-[#1A2436]">
                  <span className="text-[9px] text-slate-500 uppercase">Expected Impact</span>
                  <div className="text-slate-200 font-semibold mt-0.5">{m.expectedImpact}</div>
                </div>

                <div className="p-2.5 bg-[#0B0F17] rounded border border-[#1A2436]">
                  <span className="text-[9px] text-slate-500 uppercase">Alert Suppression Policy</span>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    Silences: {m.suppressMonitors.join(', ')}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 font-sans">
                    ✓ Watchdog &amp; WAF security remain active
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                <span>Approved by: {m.approvedBy}</span>
                <span>Auto-expires: {new Date(m.endTime).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
