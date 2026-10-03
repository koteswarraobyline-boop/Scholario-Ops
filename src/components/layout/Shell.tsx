import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';
import { 
  Activity, 
  AlertTriangle, 
  Bell, 
  Layers, 
  Server, 
  RefreshCw, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Cloud, 
  ShieldCheck, 
  Database, 
  Terminal, 
  GitBranch, 
  Calendar, 
  FileText, 
  Sliders, 
  Radio, 
  Cpu, 
  Lock, 
  ExternalLink,
  Zap,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Shield
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';

interface ShellProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: string;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { 
    activeTab, 
    setActiveTab, 
    systemSummary, 
    lastUpdatedSecondsAgo, 
    setIsCommandPaletteOpen,
    incidents,
    setSelectedIncidentId,
    deadMan,
    triggerSimulatedScenario,
    runAllProbes
  } = useOps();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeCriticalIncident = incidents.find(i => i.severity === 'CRITICAL' && (i.status === 'OPEN' || i.status === 'INVESTIGATING' || i.status === 'MITIGATING' || i.status === 'ACKNOWLEDGED'));

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    runAllProbes();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navSections: NavSection[] = [
    {
      title: 'Command Center',
      items: [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: systemSummary.openIncidents > 0 ? `${systemSummary.openIncidents}` : undefined, badgeColor: systemSummary.criticalIncidents > 0 ? 'text-rose-400 font-semibold' : 'text-amber-400' },
        { id: 'alerts', label: 'Alerts', icon: Bell }
      ]
    },
    {
      title: 'Monitoring',
      items: [
        { id: 'applications', label: 'Applications', icon: Layers, count: `${systemSummary.healthyApps}/${systemSummary.totalApps}` },
        { id: 'monitors', label: 'Monitors', icon: Radio, count: `${systemSummary.healthyMonitors}/${systemSummary.totalMonitors}` },
        { id: 'infrastructure', label: 'Infrastructure', icon: Server, count: `${systemSummary.healthyServers}/${systemSummary.totalServers}` },
        { id: 'dependencies', label: 'Dependencies', icon: Cpu }
      ]
    },
    {
      title: 'Resilience',
      items: [
        { id: 'resilience', label: 'PRD / DR Readiness', icon: Cloud, badge: `${systemSummary.drReadinessCount}/${systemSummary.totalApps}` },
        { id: 'backups', label: 'Backups', icon: Database, badge: `${systemSummary.backupsCurrentCount}/${systemSummary.totalApps}` },
        { id: 'failover', label: 'Failover Console', icon: RefreshCw }
      ]
    },
    {
      title: 'Providers',
      items: [
        { id: 'hostinger', label: 'Hostinger VPS', icon: Server },
        { id: 'cloudflare', label: 'Cloudflare Edge', icon: ShieldCheck, badge: systemSummary.cloudflareStatus === 'DEGRADED' ? 'Degraded' : 'Active', badgeColor: systemSummary.cloudflareStatus === 'DEGRADED' ? 'text-amber-400' : 'text-emerald-400' }
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'deployments', label: 'Deployments', icon: GitBranch },
        { id: 'changes', label: 'Changes', icon: FileText },
        { id: 'maintenance', label: 'Maintenance', icon: Calendar },
        { id: 'runbooks', label: 'Runbooks', icon: Terminal }
      ]
    },
    {
      title: 'Communications',
      items: [
        { id: 'communications', label: 'Notifications', icon: Bell },
        { id: 'escalation', label: 'Escalation Policies', icon: Sliders }
      ]
    },
    {
      title: 'Analytics & Compliance',
      items: [
        { id: 'uptime', label: 'Uptime SLA', icon: Activity },
        { id: 'reports', label: 'Daily Ops Report', icon: FileText },
        { id: 'audit', label: 'Audit Logs', icon: Shield }
      ]
    }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F17] text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-200">
      <CommandPalette />

      {/* LEFT SIDEBAR - Deep Carbon Enterprise Look */}
      <aside 
        className={`${isSidebarCollapsed ? 'w-14' : 'w-60'} shrink-0 bg-[#0B0F17] text-slate-400 flex flex-col border-r border-[#1B2436] transition-all duration-150 z-30 select-none`}
      >
        {/* Brand header */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-[#1B2436] bg-[#070A10]">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="leading-none">
                <span className="font-bold text-xs tracking-wider text-slate-100 font-mono">SCHOLARIO</span>
                <span className="text-[10px] text-slate-500 font-mono ml-1.5">OPS</span>
              </div>
            </div>
          ) : (
            <div className="w-5 h-5 mx-auto rounded bg-blue-600 flex items-center justify-center text-white font-bold">
              <Activity className="w-3.5 h-3.5" />
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-slate-500 hover:text-slate-200 p-1 rounded transition-colors"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-2.5 px-2 space-y-3.5">
          {navSections.map(section => (
            <div key={section.title} className="space-y-0.5">
              {!isSidebarCollapsed && (
                <div className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  {section.title}
                </div>
              )}
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                      isActive 
                        ? 'bg-[#182338] text-white font-medium border-l-2 border-blue-500 pl-1.5' 
                        : 'text-slate-400 hover:bg-[#121927] hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1 text-left text-[11px]">{item.label}</span>
                    )}
                    {!isSidebarCollapsed && item.count && (
                      <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                        {item.count}
                      </span>
                    )}
                    {!isSidebarCollapsed && item.badge && (
                      <span className={`font-mono text-[10px] tabular-nums ${item.badgeColor || 'text-slate-500'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Watchdog Status */}
        <div className="p-2.5 border-t border-[#1B2436] bg-[#070A10] text-[10px]">
          {!isSidebarCollapsed ? (
            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[9px] uppercase tracking-wider">Independent Watchdog</span>
                <span className={`w-1.5 h-1.5 rounded-full ${deadMan.status === 'HEALTHY' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-ping'}`} />
              </div>
              <div className="text-slate-400 text-[10px] truncate">
                Zurich ZH4 · 15s Heartbeat
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className={`w-1.5 h-1.5 rounded-full ${deadMan.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </div>
          )}
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0E131F]">
        
        {/* TOP BAR */}
        <header className="h-12 bg-[#0B0F17] border-b border-[#1B2436] px-5 flex items-center justify-between shrink-0 z-20">
          
          {/* Left Zone: Environment Tag & Context */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline tracking-tight font-mono">
              SCHOLARIO IT OPS
            </span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>CLUSTER: SINGAPORE (HOSTINGER PRD)</span>
            </div>
          </div>

          {/* Center Zone: Search bar */}
          <div className="flex-1 max-w-sm mx-4">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-2.5 py-1 bg-[#121927] hover:bg-[#162033] border border-[#1E293B] rounded text-xs text-slate-400 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                <span className="truncate text-[11px]">Search apps, VPS, monitors, runbooks...</span>
              </div>
              <kbd className="hidden sm:inline-block font-mono text-[9px] px-1 py-0.2 bg-[#0B0F17] border border-slate-700 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Zone: System Health, Simulator & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Health Status Indicator */}
            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono transition-colors border ${
                systemSummary.overallHealth === 'CRITICAL'
                  ? 'border-rose-900/80 bg-rose-950/40 text-rose-300 hover:bg-rose-950/60'
                  : systemSummary.overallHealth === 'WARNING'
                    ? 'border-amber-900/80 bg-amber-950/40 text-amber-300 hover:bg-amber-950/60'
                    : 'border-emerald-900/80 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                systemSummary.overallHealth === 'CRITICAL' ? 'bg-rose-500 animate-pulse' :
                systemSummary.overallHealth === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span className="text-[11px]">
                {systemSummary.criticalIncidents > 0 
                  ? `${systemSummary.criticalIncidents} CRITICAL INCIDENT` 
                  : systemSummary.openIncidents > 0 
                    ? `${systemSummary.openIncidents} INCIDENT OPEN`
                    : 'ALL SYSTEMS OPERATIONAL'}
              </span>
            </button>

            {/* Ops Simulator Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSimMenu(!showSimMenu)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-slate-300 bg-[#162033] hover:bg-[#1D2B44] border border-[#23334E] rounded transition-colors"
                title="Interactive Operations Simulator"
              >
                <Zap className="w-3 h-3 text-blue-400" />
                <span className="hidden md:inline">SIMULATOR</span>
              </button>

              {showSimMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-[#0F172A] rounded border border-[#23334E] p-2 z-50 text-xs space-y-1 shadow-2xl animate-in fade-in"
                  onMouseLeave={() => setShowSimMenu(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                    Live Operational Scenarios
                  </div>
                  <button
                    onClick={() => {
                      triggerSimulatedScenario('RESOLVE_MOSAIC');
                      setShowSimMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded text-left hover:bg-[#162033] text-emerald-400 font-mono text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <div>Verify Recovery &amp; Failback</div>
                      <div className="text-[10px] text-slate-400 font-sans">Confirms 3 passes, restores pool &amp; resolves INC-1042</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      triggerSimulatedScenario('TRIGGER_MOSAIC_FAIL');
                      setShowSimMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded text-left hover:bg-[#162033] text-rose-400 font-mono text-[11px]"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <div>
                      <div>Inject MySQL Pool Exhaustion</div>
                      <div className="text-[10px] text-slate-400 font-sans">Triggers 3 check failures, INC-1042 &amp; DR failover</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      triggerSimulatedScenario('DEADMAN_SILENCE');
                      setShowSimMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded text-left hover:bg-[#162033] text-amber-400 font-mono text-[11px]"
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <div>
                      <div>Toggle Watchdog Silence</div>
                      <div className="text-[10px] text-slate-400 font-sans">Simulates external dead-man timeout</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      triggerSimulatedScenario('RESET_ALL');
                      setShowSimMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-1.5 rounded text-left hover:bg-[#162033] text-slate-400 text-[11px] font-mono"
                  >
                    <RefreshCw className="w-3 h-3 text-slate-400 shrink-0" />
                    <div>Reset State to Baseline</div>
                  </button>
                </div>
              )}
            </div>

            {/* Poll Probes */}
            <button
              onClick={handleManualRefresh}
              className={`p-1 text-slate-400 hover:text-slate-100 hover:bg-[#162033] rounded transition-colors ${isRefreshing ? 'animate-spin text-blue-400' : ''}`}
              title="Poll telemetry & probe all monitors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Operator avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="font-mono text-[11px] text-slate-300">A. Mehta</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="On-Call Primary" />
            </div>

          </div>
        </header>

        {/* ACTIVE CRITICAL INCIDENT BANNER - Crisp Industrial Severity Strip */}
        {activeCriticalIncident && (
          <div className="bg-[#170B0E] border-b border-rose-900/60 px-5 py-2 flex items-center justify-between text-xs shrink-0 font-mono animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                CRITICAL [{activeCriticalIncident.id}]
              </span>
              <span className="text-slate-300 text-[11px] font-sans">
                Mosaic production health check failed: MySQL connection pool starved. Cloudflare has routed traffic to DR standby.
              </span>
              <span className="text-slate-500 text-[10px] hidden md:inline">
                Opened {activeCriticalIncident.durationMinutes}m ago · Owner: {activeCriticalIncident.owner.split('(')[0]}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedIncidentId(activeCriticalIncident.id);
                setActiveTab('incidents');
              }}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded text-[11px] font-mono transition-colors"
            >
              <span>INVESTIGATE</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-5 bg-[#0E131F] text-slate-100">
          <div className="max-w-7xl mx-auto space-y-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
