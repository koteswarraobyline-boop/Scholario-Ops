import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';
import { 
  Radio, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Activity
} from 'lucide-react';

export const MonitorsView: React.FC = () => {
  const { monitors, applications, runProbeCheck, runAllProbes } = useOps();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [probingId, setProbingId] = useState<string | null>(null);

  const handleManualCheck = (id: string) => {
    setProbingId(id);
    runProbeCheck(id);
    setTimeout(() => setProbingId(null), 500);
  };

  const filteredMonitors = monitors
    .filter(m => {
      if (filterType === 'ALL') return true;
      if (filterType === 'FAILING') return m.status !== 'HEALTHY';
      return m.type === filterType;
    })
    .filter(m => {
      const q = search.toLowerCase();
      const app = applications.find(a => a.id === m.applicationId);
      return (
        m.name.toLowerCase().includes(q) ||
        m.target.toLowerCase().includes(q) ||
        app?.name.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            MONITORING PROBE ENGINE
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            55+ continuous probes (HTTPS, DB replication, connection pools, worker heartbeats &amp; dead-man watchdog)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runAllProbes()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-200 bg-[#162033] hover:bg-[#1C2942] border border-[#243552] rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>PROBE ALL TARGETS</span>
          </button>
        </div>
      </div>

      {/* 4 Monitoring Operational Principles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded space-y-1">
          <div className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">1. Consecutive Failures</div>
          <div className="text-xs font-semibold text-slate-200">3-Failure Threshold</div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Automatic retry on blips #1 &amp; #2. Incidents fire exclusively upon confirmed 3/3 failure sequence.
          </p>
        </div>

        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded space-y-1">
          <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">2. Consecutive Recovery</div>
          <div className="text-xs font-semibold text-slate-200">3-Pass Verification</div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Flapping prevention. Incidents do not resolve until 3 consecutive successful health probe confirmations.
          </p>
        </div>

        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded space-y-1">
          <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">3. Deduplication</div>
          <div className="text-xs font-semibold text-slate-200">Deterministic Fingerprint</div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Single root incidents generated using <code>app:env:monitor:type</code> identifier hash.
          </p>
        </div>

        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded space-y-1">
          <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">4. Dead-Man Watchdog</div>
          <div className="text-xs font-semibold text-slate-200">Zurich Node Isolation</div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Isolated probe monitors the monitoring plane. If Singapore control plane silences, alarms trigger.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111726] p-2.5 rounded border border-[#1E293B] font-mono text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'ALL', label: 'All Probes' },
            { id: 'FAILING', label: 'Failing (1)' },
            { id: 'HTTPS', label: 'HTTPS' },
            { id: 'DB_CONN', label: 'Database' },
            { id: 'DB_REPLICATION', label: 'Replication' },
            { id: 'DEAD_MAN', label: 'Dead-Man' },
            { id: 'SSL', label: 'SSL' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterType === f.id
                  ? 'bg-[#182338] text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search probe or target..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-[#0B0F17] border border-[#1E293B] rounded text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Monitors List */}
      <div className="bg-[#111726] rounded border border-[#1E293B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B0F17] text-slate-400 font-medium border-b border-[#1A2332]">
              <tr>
                <th className="py-2 px-3.5">Probe Target</th>
                <th className="py-2 px-3.5">Type</th>
                <th className="py-2 px-3.5">Application</th>
                <th className="py-2 px-3.5">Interval</th>
                <th className="py-2 px-3.5">Consecutive Check Status</th>
                <th className="py-2 px-3.5">Latency</th>
                <th className="py-2 px-3.5">Health</th>
                <th className="py-2 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030]">
              {filteredMonitors.map(m => {
                const app = applications.find(a => a.id === m.applicationId);
                const isCrit = m.status === 'CRITICAL';
                const isProbing = probingId === m.id;

                return (
                  <tr key={m.id} className={`hover:bg-[#151D2E] transition-colors ${isCrit ? 'bg-[#180E13]' : ''}`}>
                    <td className="py-2.5 px-3.5 font-sans">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                        <span className="font-semibold text-slate-100">{m.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-sm">
                        {m.target}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-400">
                      {m.type}
                    </td>

                    <td className="py-2.5 px-3.5 font-sans text-slate-200">
                      {app?.name || 'Platform Core'}
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-400 tabular-nums">
                      {m.intervalSec}s
                    </td>

                    <td className="py-2.5 px-3.5 tabular-nums">
                      {m.consecutiveFailures > 0 ? (
                        <span className="text-rose-400 font-bold">
                          {m.consecutiveFailures}/{m.failureConfirmationThreshold} Consecutive Failures
                        </span>
                      ) : (
                        <span className="text-emerald-400">
                          {m.consecutiveRecoveries} Consecutive Passes
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 tabular-nums">
                      <span className={m.responseTimeMs > 2000 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {m.responseTimeMs}ms
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <span className={`font-semibold ${m.status === 'HEALTHY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-sans">
                      <button
                        onClick={() => handleManualCheck(m.id)}
                        disabled={isProbing}
                        className="px-2 py-0.5 text-slate-300 hover:text-white hover:bg-[#1D2B44] border border-[#23334E] rounded text-[11px] transition-colors inline-flex items-center gap-1 font-mono"
                      >
                        <RefreshCw className={`w-3 h-3 ${isProbing ? 'animate-spin text-blue-400' : ''}`} />
                        <span>PROBE</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
