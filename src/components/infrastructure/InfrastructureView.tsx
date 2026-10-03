import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';
import { VpsServer } from '../../types';
import { 
  Server, 
  Search, 
  X, 
  Terminal, 
  ArrowRight
} from 'lucide-react';

interface VpsDetailModalProps {
  server: VpsServer;
  onClose: () => void;
}

export const VpsDetailModal: React.FC<VpsDetailModalProps> = ({ server, onClose }) => {
  const { applications } = useOps();
  const [activeTab, setActiveTab] = useState<'system' | 'processes' | 'services' | 'logs'>('system');
  const app = applications.find(a => a.id === server.applicationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-4xl bg-[#101624] text-slate-100 rounded border border-[#223048] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-[#1E293B] bg-[#0A0F1A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${server.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
            <div>
              <div className="flex items-center gap-2 font-mono">
                <h2 className="text-base font-bold text-slate-100">{server.hostname}</h2>
                <span className="text-xs text-blue-400 font-semibold">{server.environment}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">{server.ip}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hostinger {server.region} · {server.plan} · Workload: <strong>{app?.name}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-[#1E293B] bg-[#0C121E] text-xs font-mono">
          {[
            { id: 'system', label: 'System & Telemetry' },
            { id: 'processes', label: `Processes (${server.processes.length})` },
            { id: 'services', label: `Services (${server.services.length})` },
            { id: 'logs', label: `Operational Logs (${server.logs.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs font-mono">
          
          {/* TAB: SYSTEM */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#0A0F1A] border border-[#1E293B] rounded">
                  <div className="text-[10px] text-slate-400 uppercase">CPU Load</div>
                  <div className={`text-base font-bold tabular-nums ${server.telemetry.cpuPercent > 80 ? 'text-rose-400' : 'text-slate-100'}`}>
                    {server.telemetry.cpuPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{server.cpuCores} vCPU Cores</div>
                </div>

                <div className="p-3 bg-[#0A0F1A] border border-[#1E293B] rounded">
                  <div className="text-[10px] text-slate-400 uppercase">Memory RAM</div>
                  <div className={`text-base font-bold tabular-nums ${server.telemetry.ramPercent > 80 ? 'text-rose-400' : 'text-slate-100'}`}>
                    {server.telemetry.ramPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{server.ramGb} GB DDR5</div>
                </div>

                <div className="p-3 bg-[#0A0F1A] border border-[#1E293B] rounded">
                  <div className="text-[10px] text-slate-400 uppercase">NVMe Storage</div>
                  <div className="text-base font-bold text-slate-100 tabular-nums">
                    {server.telemetry.diskPercent}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{server.diskGb} GB NVMe</div>
                </div>

                <div className="p-3 bg-[#0A0F1A] border border-[#1E293B] rounded">
                  <div className="text-[10px] text-slate-400 uppercase">System Uptime</div>
                  <div className="text-base font-bold text-slate-100 tabular-nums">
                    {server.uptimeDays} days
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Agent v{server.agentVersion} Connected</div>
                </div>
              </div>

              {/* Load & Network */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#0A0F1A] rounded border border-[#1E293B] space-y-1.5">
                  <div className="text-xs font-bold text-slate-300">Load Average (1m, 5m, 15m)</div>
                  <div className="text-sm font-semibold text-slate-100">
                    {server.telemetry.loadAvg.map(l => l.toFixed(2)).join('  ·  ')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Observed: {new Date(server.telemetry.observedAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="p-3.5 bg-[#0A0F1A] rounded border border-[#1E293B] space-y-1.5">
                  <div className="text-xs font-bold text-slate-300">Network Interface Traffic</div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Inbound Traffic:</span>
                    <strong>{(server.telemetry.networkInKbps / 1024).toFixed(1)} Mbps</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Outbound Traffic:</span>
                    <strong>{(server.telemetry.networkOutKbps / 1024).toFixed(1)} Mbps</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#0A0F1A] rounded border border-[#1E293B] text-slate-400 flex justify-between">
                <span>Kernel: <strong className="text-slate-200">{server.os}</strong></span>
                <span>Hypervisor: <strong className="text-slate-200">Hostinger KVM</strong></span>
              </div>
            </div>
          )}

          {/* TAB: PROCESSES */}
          {activeTab === 'processes' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-300">Active High-Resource Processes</div>
              <div className="border border-[#1E293B] rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0F1A] text-slate-400 border-b border-[#1E293B]">
                    <tr>
                      <th className="py-2 px-3">PID</th>
                      <th className="py-2 px-3">Command</th>
                      <th className="py-2 px-3">User</th>
                      <th className="py-2 px-3 text-right">CPU %</th>
                      <th className="py-2 px-3 text-right">Memory (MB)</th>
                      <th className="py-2 px-3 text-right">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#172030]">
                    {server.processes.map(p => (
                      <tr key={p.pid} className="hover:bg-[#151D2E]">
                        <td className="py-2 px-3 text-slate-300">{p.pid}</td>
                        <td className="py-2 px-3 text-slate-100 font-semibold">{p.name}</td>
                        <td className="py-2 px-3 text-slate-400">{p.user}</td>
                        <td className={`py-2 px-3 text-right font-bold ${p.cpuPercent > 50 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {p.cpuPercent}%
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums text-slate-300">{p.memMb} MB</td>
                        <td className="py-2 px-3 text-right text-emerald-400">
                          {p.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-300">Managed Systemd Daemons</div>
              <div className="border border-[#1E293B] rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0F1A] text-slate-400 border-b border-[#1E293B]">
                    <tr>
                      <th className="py-2 px-3">Service Name</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Version</th>
                      <th className="py-2 px-3">PID</th>
                      <th className="py-2 px-3 text-right">Memory</th>
                      <th className="py-2 px-3 text-right">Last Restart</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#172030]">
                    {server.services.map(svc => (
                      <tr key={svc.name} className="hover:bg-[#151D2E]">
                        <td className="py-2 px-3 font-semibold text-slate-100">{svc.name}</td>
                        <td className="py-2 px-3">
                          <span className={`font-semibold ${svc.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {svc.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-400">{svc.version}</td>
                        <td className="py-2 px-3 text-slate-300">{svc.pid}</td>
                        <td className="py-2 px-3 text-right tabular-nums text-slate-300">{svc.memoryMb} MB</td>
                        <td className="py-2 px-3 text-right text-slate-400">{svc.lastRestart}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-300">Operational Syslog Stream</div>
              <div className="bg-[#070A10] text-slate-300 p-3 rounded border border-[#1E293B] space-y-1.5 text-[11px] max-h-64 overflow-y-auto">
                {server.logs.length > 0 ? (
                  server.logs.map(log => (
                    <div key={log.id} className="flex items-start gap-2">
                      <span className="text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className={`px-1 rounded text-[9px] uppercase font-bold shrink-0 ${
                        log.level === 'error' ? 'bg-rose-950 text-rose-300 border border-rose-900' : 'bg-blue-950 text-blue-300 border border-blue-900'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-slate-400 shrink-0">[{log.service}]</span>
                      <span className={log.level === 'error' ? 'text-rose-300' : 'text-slate-300'}>
                        {log.message}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 py-4 text-center">No anomalous syslog events.</div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 px-6 border-t border-[#1E293B] bg-[#0A0F1A] flex justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-[#1A2436] hover:bg-[#23324C] text-slate-200 rounded text-xs font-mono transition-colors">
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export const InfrastructureView: React.FC = () => {
  const { servers, applications, selectedServerId, setSelectedServerId } = useOps();
  const [filter, setFilter] = useState<'ALL' | 'PRD' | 'DR' | 'HEALTHY' | 'CRITICAL'>('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'hostname' | 'cpu' | 'ram' | 'disk'>('hostname');

  const selectedServer = servers.find(s => s.id === selectedServerId);

  const filteredServers = servers
    .filter(s => {
      if (filter === 'PRD') return s.environment === 'PRD';
      if (filter === 'DR') return s.environment === 'DR';
      if (filter === 'HEALTHY') return s.status === 'HEALTHY';
      if (filter === 'CRITICAL') return s.status !== 'HEALTHY';
      return true;
    })
    .filter(s => {
      const q = search.toLowerCase();
      return (
        s.hostname.toLowerCase().includes(q) ||
        s.ip.includes(q) ||
        s.region.toLowerCase().includes(q) ||
        s.plan.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'cpu') return b.telemetry.cpuPercent - a.telemetry.cpuPercent;
      if (sortBy === 'ram') return b.telemetry.ramPercent - a.telemetry.ramPercent;
      if (sortBy === 'disk') return b.telemetry.diskPercent - a.telemetry.diskPercent;
      return a.hostname.localeCompare(b.hostname);
    });

  return (
    <div className="space-y-5">
      {selectedServer && (
        <VpsDetailModal
          server={selectedServer}
          onClose={() => setSelectedServerId(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            HOSTINGER VPS INFRASTRUCTURE
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            16 Dedicated Virtual Private Servers (Singapore, Frankfurt, Mumbai, London)
          </p>
        </div>

        {/* Search, Filter & Sort */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hostname, IP, region..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[#0B0F17] border border-[#1E293B] rounded text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-48"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-[#0B0F17] rounded border border-[#1E293B]">
            {(['ALL', 'PRD', 'DR', 'HEALTHY', 'CRITICAL'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  filter === f ? 'bg-[#182338] text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2 py-1 bg-[#0B0F17] border border-[#1E293B] rounded text-xs text-slate-300 focus:outline-none"
          >
            <option value="hostname">Sort: Hostname</option>
            <option value="cpu">Sort: CPU %</option>
            <option value="ram">Sort: RAM %</option>
            <option value="disk">Sort: Disk %</option>
          </select>
        </div>
      </div>

      {/* Servers Table */}
      <div className="bg-[#111726] rounded border border-[#1E293B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B0F17] text-slate-400 font-medium border-b border-[#1A2332]">
              <tr>
                <th className="py-2 px-3.5">VPS Hostname</th>
                <th className="py-2 px-3.5">Environment</th>
                <th className="py-2 px-3.5">Application</th>
                <th className="py-2 px-3.5">Region</th>
                <th className="py-2 px-3.5">CPU Load</th>
                <th className="py-2 px-3.5">RAM Usage</th>
                <th className="py-2 px-3.5">Disk NVMe</th>
                <th className="py-2 px-3.5">Load (1m)</th>
                <th className="py-2 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030]">
              {filteredServers.map(s => {
                const app = applications.find(a => a.id === s.applicationId);
                const isCrit = s.status === 'CRITICAL';

                return (
                  <tr 
                    key={s.id}
                    onClick={() => setSelectedServerId(s.id)}
                    className={`hover:bg-[#151D2E] cursor-pointer transition-colors ${isCrit ? 'bg-[#180E13]' : ''}`}
                  >
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                        <span className="font-bold text-slate-100">{s.hostname.split('.')[0]}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{s.ip}</div>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <span className={s.environment === 'PRD' ? 'text-blue-400 font-semibold' : 'text-slate-400'}>
                        {s.environment}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 font-sans text-slate-200">
                      {app?.name}
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-400">
                      {s.region}
                    </td>

                    <td className="py-2.5 px-3.5 tabular-nums">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-800 h-1.5 rounded overflow-hidden">
                          <div 
                            className={`h-full ${s.telemetry.cpuPercent > 80 ? 'bg-rose-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(100, s.telemetry.cpuPercent)}%` }}
                          />
                        </div>
                        <span className={s.telemetry.cpuPercent > 80 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                          {s.telemetry.cpuPercent}%
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 tabular-nums">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-800 h-1.5 rounded overflow-hidden">
                          <div 
                            className={`h-full ${s.telemetry.ramPercent > 80 ? 'bg-rose-500' : 'bg-blue-400'}`}
                            style={{ width: `${Math.min(100, s.telemetry.ramPercent)}%` }}
                          />
                        </div>
                        <span className={s.telemetry.ramPercent > 80 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                          {s.telemetry.ramPercent}%
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 tabular-nums text-slate-300">
                      {s.telemetry.diskPercent}%
                    </td>

                    <td className="py-2.5 px-3.5 tabular-nums text-slate-300">
                      {s.telemetry.loadAvg[0].toFixed(2)}
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-sans">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedServerId(s.id);
                        }}
                        className="px-2 py-0.5 text-slate-300 hover:text-white hover:bg-[#1D2B44] border border-[#23334E] rounded text-[11px] transition-colors"
                      >
                        Inspect
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
