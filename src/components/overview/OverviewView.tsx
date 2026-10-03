import React from 'react';
import { useOps } from '../../context/OpsContext';
import { 
  Layers, 
  Server, 
  Radio, 
  AlertTriangle, 
  Cloud, 
  Database, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Terminal
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { 
    applications, 
    servers, 
    deadMan, 
    systemSummary, 
    lastUpdatedSecondsAgo, 
    setActiveTab, 
    setSelectedAppId, 
    setSelectedIncidentId,
    incidents,
    triggerSimulatedScenario,
    runAllProbes
  } = useOps();

  const activeIncident = incidents.find(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED');

  return (
    <div className="space-y-5">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-100 tracking-tight font-mono">
              OPERATIONS COMMAND CENTER
            </h1>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
            <span>Continuous infrastructure, DR resilience &amp; monitor plane</span>
            <span className="text-slate-600">·</span>
            <span>Telemetry refreshed {lastUpdatedSecondsAgo}s ago</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runAllProbes()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-200 bg-[#162033] hover:bg-[#1C2942] border border-[#243552] rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>PROBE MONITORS</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors"
          >
            <span>DAILY REPORT</span>
          </button>
        </div>
      </div>

      {/* 2. Global Health Metrics Bar (High-Density & Clean) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        
        {/* Applications */}
        <button
          onClick={() => setActiveTab('applications')}
          className="p-3 bg-[#111726] rounded border border-[#1E293B] hover:border-[#2D3E5E] text-left transition-all group"
        >
          <div className="text-[10px] font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>APPLICATIONS</span>
            <Layers className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
          </div>
          <div className="mt-1 text-base font-bold font-mono text-slate-100 tabular-nums">
            {systemSummary.healthyApps} / {systemSummary.totalApps}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {systemSummary.healthyApps === systemSummary.totalApps ? 'All nominal' : '1 degraded'}
          </div>
        </button>

        {/* Infrastructure */}
        <button
          onClick={() => setActiveTab('infrastructure')}
          className="p-3 bg-[#111726] rounded border border-[#1E293B] hover:border-[#2D3E5E] text-left transition-all group"
        >
          <div className="text-[10px] font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>VPS FLEET</span>
            <Server className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
          </div>
          <div className="mt-1 text-base font-bold font-mono text-slate-100 tabular-nums">
            {systemSummary.healthyServers} / {systemSummary.totalServers}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Hostinger Nodes
          </div>
        </button>

        {/* Monitors */}
        <button
          onClick={() => setActiveTab('monitors')}
          className="p-3 bg-[#111726] rounded border border-[#1E293B] hover:border-[#2D3E5E] text-left transition-all group"
        >
          <div className="text-[10px] font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>MONITORS</span>
            <Radio className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
          </div>
          <div className="mt-1 text-base font-bold font-mono text-slate-100 tabular-nums">
            {systemSummary.healthyMonitors} / {systemSummary.totalMonitors}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            30s intervals
          </div>
        </button>

        {/* Incidents */}
        <button
          onClick={() => setActiveTab('incidents')}
          className={`p-3 rounded border text-left transition-all group ${
            systemSummary.openIncidents > 0 
              ? 'bg-[#180E13] border-rose-900/80 hover:border-rose-700' 
              : 'bg-[#111726] border-[#1E293B] hover:border-[#2D3E5E]'
          }`}
        >
          <div className="text-[10px] font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>INCIDENTS</span>
            <AlertTriangle className={`w-3 h-3 ${systemSummary.openIncidents > 0 ? 'text-rose-400' : 'text-slate-500'}`} />
          </div>
          <div className={`mt-1 text-base font-bold font-mono tabular-nums ${systemSummary.openIncidents > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
            {systemSummary.openIncidents} open
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {systemSummary.criticalIncidents > 0 ? `${systemSummary.criticalIncidents} critical` : 'None critical'}
          </div>
        </button>

        {/* DR Readiness */}
        <button
          onClick={() => setActiveTab('resilience')}
          className="p-3 bg-[#111726] rounded border border-[#1E293B] hover:border-[#2D3E5E] text-left transition-all group"
        >
          <div className="text-[10px] font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>DR READY</span>
            <Cloud className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
          </div>
          <div className="mt-1 text-base font-bold font-mono text-slate-100 tabular-nums">
            {systemSummary.drReadinessCount} / {systemSummary.totalApps}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            RPO &lt; 15m
          </div>
        </button>

        {/* Backups */}
        <button
          onClick={() => setActiveTab('backups')}
          className="p-3 bg-[#111726] rounded border border-[#1E293B] hover:border-[#2D3E5E] text-left transition-all group"
        >
          <div className="text-[10px] font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>BACKUPS</span>
            <Database className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
          </div>
          <div className="mt-1 text-base font-bold font-mono text-slate-100 tabular-nums">
            {systemSummary.backupsCurrentCount} / {systemSummary.totalApps}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            SHA-256 ok
          </div>
        </button>

        {/* Cloudflare */}
        <button
          onClick={() => setActiveTab('cloudflare')}
          className="p-3 bg-[#111726] rounded border border-[#1E293B] hover:border-[#2D3E5E] text-left transition-all group"
        >
          <div className="text-[10px] font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>CLOUDFLARE</span>
            <ShieldCheck className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
          </div>
          <div className={`mt-1 text-xs font-bold font-mono truncate ${systemSummary.cloudflareStatus === 'DEGRADED' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {systemSummary.cloudflareStatus === 'DEGRADED' ? 'LB Failover' : 'Nominal'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            WAF / Anycast
          </div>
        </button>

        {/* External Watchdog */}
        <button
          onClick={() => setActiveTab('monitors')}
          className="p-3 bg-[#111726] rounded border border-[#1E293B] hover:border-[#2D3E5E] text-left transition-all group"
        >
          <div className="text-[10px] font-mono font-medium text-slate-400 flex items-center justify-between">
            <span>DEAD-MAN</span>
            <Activity className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
          </div>
          <div className={`mt-1 text-xs font-bold font-mono truncate ${deadMan.status === 'HEALTHY' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {deadMan.status === 'HEALTHY' ? 'Active' : 'Silence Alert'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Zurich node
          </div>
        </button>
      </div>

      {/* 3. The 5 Core Operational Answers Panel (Technical, Non-Slop) */}
      <div className="bg-[#111726] rounded border border-[#1E293B] p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A2332]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Core Operations Health Assessment
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Automated correlation engine · Zero manual inference
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
          {/* Q1 */}
          <div className="p-3 rounded bg-[#0B0F17] border border-[#1A2436] space-y-1">
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">
              1. What is healthy right now?
            </div>
            <div className="text-slate-200 font-semibold">
              {systemSummary.healthyApps} Apps &amp; 15 Nodes
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Cipher, Apex, Nimbus, Ascend, Vantage, Lumo, Client Platform nominal.
            </div>
          </div>

          {/* Q2 */}
          <div className={`p-3 rounded border space-y-1 ${activeIncident ? 'bg-[#180E13] border-rose-900/60' : 'bg-[#0B0F17] border-[#1A2436]'}`}>
            <div className="text-[9px] text-rose-400 uppercase tracking-wider">
              2. What is failing right now?
            </div>
            <div className="text-slate-100 font-semibold">
              {activeIncident ? 'Mosaic Primary & DB Pool' : 'No active failures'}
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              {activeIncident ? 'MySQL pool starved (500 connections) on vps-sg-mosa-prd-01.' : 'All health endpoints returning 200.'}
            </div>
          </div>

          {/* Q3 */}
          <div className={`p-3 rounded border space-y-1 ${activeIncident ? 'bg-[#18130E] border-amber-900/60' : 'bg-[#0B0F17] border-[#1A2436]'}`}>
            <div className="text-[9px] text-amber-400 uppercase tracking-wider">
              3. What is affected?
            </div>
            <div className="text-slate-100 font-semibold">
              {activeIncident ? 'Mosaic Exam Reports' : 'Zero blast radius'}
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              {activeIncident ? 'Public traffic moved to DR standby; Primary origin quarantined.' : 'All user journeys normal.'}
            </div>
          </div>

          {/* Q4 */}
          <div className="p-3 rounded bg-[#0B0F17] border border-[#1A2436] space-y-1">
            <div className="text-[9px] text-blue-400 uppercase tracking-wider">
              4. What should IT do?
            </div>
            <div className="text-slate-200 font-semibold">
              {activeIncident ? 'Execute Runbook RUN-001' : 'Maintain standard watch'}
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              {activeIncident ? 'Kill slow query PID 2841, flush pool, confirm 3 successful health checks.' : 'Continuous monitoring active.'}
            </div>
          </div>

          {/* Q5 */}
          <div className={`p-3 rounded border space-y-1 ${activeIncident ? 'bg-[#0B0F17] border-[#1A2436]' : 'bg-[#0E1713] border-emerald-900/60'}`}>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">
              5. Has it recovered?
            </div>
            <div className="text-slate-200 font-semibold">
              {activeIncident ? 'Pending 3 Consecutive Checks' : 'Verified (3/3 Checks)'}
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              {activeIncident ? 'Flapping prevention in effect; currently 0/3 verified on Primary.' : 'Confirmed nominal.'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Incident Correlation Box (If critical) */}
      {activeIncident && (
        <div className="bg-[#130E14] rounded border border-rose-900/80 p-4 space-y-3 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-950 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-bold text-rose-300 text-xs">{activeIncident.id}</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-200 font-sans font-semibold">{activeIncident.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerSimulatedScenario('RESOLVE_MOSAIC')}
                className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded text-[11px] transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Simulate 3-Check Recovery</span>
              </button>
              <button
                onClick={() => {
                  setSelectedIncidentId(activeIncident.id);
                  setActiveTab('incidents');
                }}
                className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-100 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <span>Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Blast Radius Correlation */}
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
              Correlated Root Cause Chain &amp; Failover Action:
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <div className="px-2 py-1 bg-[#1F1218] border border-rose-900 rounded text-rose-300">
                1. MySQL Max Conns Starved (500/500)
              </div>
              <span className="text-slate-600">→</span>
              <div className="px-2 py-1 bg-[#1F1218] border border-rose-900 rounded text-rose-300">
                2. Application /health Timeout (504)
              </div>
              <span className="text-slate-600">→</span>
              <div className="px-2 py-1 bg-[#1F1812] border border-amber-900 rounded text-amber-300">
                3. Exam Export Worker Stalled
              </div>
              <span className="text-slate-600">→</span>
              <div className="px-2 py-1 bg-[#0E1A14] border border-emerald-900 rounded text-emerald-300">
                4. Cloudflare Traffic Routed to DR Standby (sg-mosa-dr-01)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Scholario Applications Health Grid */}
      <div className="bg-[#111726] rounded border border-[#1E293B] overflow-hidden">
        <div className="p-3.5 border-b border-[#1A2332] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
              Application Systems Catalog
            </h2>
            <p className="text-[11px] text-slate-400">
              Live operational health, RTO/RPO targets, replication lag &amp; routing state
            </p>
          </div>
          <button
            onClick={() => setActiveTab('applications')}
            className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1"
          >
            <span>All details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B0F17] text-slate-400 font-medium border-b border-[#1A2332]">
              <tr>
                <th className="py-2 px-3.5">Application</th>
                <th className="py-2 px-3.5">Status</th>
                <th className="py-2 px-3.5">Primary (PRD)</th>
                <th className="py-2 px-3.5">Standby (DR)</th>
                <th className="py-2 px-3.5">Replication Lag</th>
                <th className="py-2 px-3.5">RTO / RPO</th>
                <th className="py-2 px-3.5 text-right">Uptime (30d)</th>
                <th className="py-2 px-3.5 text-right">Latency P95</th>
                <th className="py-2 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030]">
              {applications.map(app => {
                const prdServer = servers.find(s => s.id === app.prdServerId);
                const drServer = servers.find(s => s.id === app.drServerId);
                const isHealthy = app.status === 'HEALTHY';

                return (
                  <tr key={app.id} className="hover:bg-[#151D2E] transition-colors">
                    <td className="py-2.5 px-3.5 font-sans">
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span>{app.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">· {app.tier.replace('_', ' ')}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{app.description}</div>
                    </td>

                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                        <span className={`font-semibold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isHealthy ? 'Operational' : 'Critical'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {app.failoverState === 'DR_ACTIVE' ? 'DR Routed' : 'Primary Origin'}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-300">
                      <div>{prdServer?.hostname.split('.')[0]}</div>
                      <div className="text-slate-400 text-[10px]">{prdServer?.ip}</div>
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-300">
                      <div>{drServer?.hostname.split('.')[0]}</div>
                      <div className="text-slate-400 text-[10px]">{drServer?.ip}</div>
                    </td>

                    <td className="py-2.5 px-3.5 tabular-nums">
                      <div className={app.currentReplicationLagSec > 60 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {app.currentReplicationLagSec}s lag
                      </div>
                      <div className="text-[10px] text-slate-400">Target &lt; {app.rpoTargetMin * 60}s</div>
                    </td>

                    <td className="py-2.5 px-3.5 tabular-nums text-slate-400">
                      <div>RTO: {app.rtoTargetMin}m</div>
                      <div>RPO: {app.rpoTargetMin}m</div>
                    </td>

                    <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-200">
                      {app.uptime30d}%
                    </td>

                    <td className="py-2.5 px-3.5 text-right tabular-nums text-slate-300">
                      {app.p95Ms}ms
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-sans">
                      <button
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setActiveTab('applications');
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

      {/* 6. Hostinger VPS Fleet & Quick Runbook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* VPS Fleet */}
        <div className="lg:col-span-2 bg-[#111726] rounded border border-[#1E293B] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2332]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Hostinger VPS Fleet Telemetry
              </h3>
              <p className="text-[11px] text-slate-400">16 Dedicated Virtual Private Servers (SG, FRA, BOM, LON)</p>
            </div>
            <button
              onClick={() => setActiveTab('infrastructure')}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono"
            >
              All 16 Nodes →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {servers.slice(0, 6).map(srv => {
              const isCrit = srv.status === 'CRITICAL';
              return (
                <div 
                  key={srv.id}
                  onClick={() => {
                    setActiveTab('infrastructure');
                  }}
                  className={`p-2.5 rounded border cursor-pointer transition-all ${
                    isCrit 
                      ? 'bg-[#180E13] border-rose-900/80 hover:border-rose-700' 
                      : 'bg-[#0B0F17] border-[#1A2436] hover:border-[#283854]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">
                      {srv.hostname.split('.')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {srv.environment} · {srv.region}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-1 text-[11px] tabular-nums">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">CPU</div>
                      <div className={srv.telemetry.cpuPercent > 80 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {srv.telemetry.cpuPercent}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">RAM</div>
                      <div className={srv.telemetry.ramPercent > 80 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {srv.telemetry.ramPercent}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">Load</div>
                      <div className="text-slate-300">
                        {srv.telemetry.loadAvg[0].toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watchdog & Runbook */}
        <div className="space-y-4">
          <div className="bg-[#111726] rounded border border-[#1E293B] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>External Dead-Man Watchdog</span>
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${deadMan.status === 'HEALTHY' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              External independent probe in Zurich (Equinix ZH4). If Singapore core monitoring freezes, alerts fire through an isolated channel.
            </p>
            <div className="pt-2 border-t border-[#1A2332] text-[11px] font-mono space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Node:</span>
                <span className="text-slate-200">Zurich, Switzerland</span>
              </div>
              <div className="flex justify-between">
                <span>Heartbeat:</span>
                <span className="text-emerald-400">15s nominal</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111726] rounded border border-[#1E293B] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Active Runbook RUN-001</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Database Connection Pool Starvation &amp; Recovery
            </p>
            <button
              onClick={() => setActiveTab('runbooks')}
              className="w-full mt-1 py-1 bg-[#162033] hover:bg-[#1D2B44] border border-[#23334E] text-slate-200 rounded text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Execute Diagnostic Steps</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
