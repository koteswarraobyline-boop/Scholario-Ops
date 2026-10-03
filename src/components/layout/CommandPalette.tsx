import React, { useState, useEffect, useRef } from 'react';
import { useOps } from '../../context/OpsContext';
import { 
  Search, 
  Server, 
  Layers, 
  AlertTriangle, 
  Activity, 
  BookOpen, 
  Cloud, 
  GitBranch, 
  X,
  ArrowRight
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    applications, 
    servers, 
    monitors, 
    incidents, 
    runbooks, 
    deployments,
    setSelectedAppId,
    setSelectedServerId,
    setSelectedIncidentId,
    setSelectedRunbookId,
    setActiveTab
  } = useOps();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const matchedApps = applications.filter(a => 
    !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.codeName.toLowerCase().includes(q)
  );

  const matchedServers = servers.filter(s => 
    !q || s.hostname.toLowerCase().includes(q) || s.ip.includes(q) || s.region.toLowerCase().includes(q) || s.environment.toLowerCase().includes(q)
  );

  const matchedIncidents = incidents.filter(i => 
    !q || i.id.toLowerCase().includes(q) || i.title.toLowerCase().includes(q) || i.severity.toLowerCase().includes(q)
  );

  const matchedMonitors = monitors.filter(m => 
    !q || m.name.toLowerCase().includes(q) || m.target.toLowerCase().includes(q) || m.type.toLowerCase().includes(q)
  );

  const matchedRunbooks = runbooks.filter(r => 
    !q || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
  );

  const matchedDeployments = deployments.filter(d => 
    !q || d.version.toLowerCase().includes(q) || d.commitHash.toLowerCase().includes(q) || d.commitMessage.toLowerCase().includes(q)
  );

  const handleSelect = (action: () => void) => {
    action();
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#101624] text-slate-100 rounded border border-[#223048] overflow-hidden flex flex-col max-h-[75vh] shadow-2xl font-mono text-xs"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1E293B] bg-[#0A0F1A]">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search systems, VPS nodes, incidents (INC-1042), monitors, runbooks..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button 
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-2 space-y-3">
          {/* Quick Actions / Jump to Sections */}
          {!q && (
            <div className="px-2 py-0.5 text-[10px] text-slate-500 uppercase tracking-wider">Quick Navigation</div>
          )}
          {!q && (
            <div className="grid grid-cols-2 gap-1.5 px-1 font-sans">
              <button 
                onClick={() => handleSelect(() => setActiveTab('overview'))}
                className="flex items-center gap-2 p-2 rounded text-left hover:bg-[#162033] text-slate-300 transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>Command Center Overview</span>
              </button>
              <button 
                onClick={() => handleSelect(() => setActiveTab('incidents'))}
                className="flex items-center gap-2 p-2 rounded text-left hover:bg-[#162033] text-slate-300 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Active Incidents Console</span>
              </button>
              <button 
                onClick={() => handleSelect(() => setActiveTab('resilience'))}
                className="flex items-center gap-2 p-2 rounded text-left hover:bg-[#162033] text-slate-300 transition-colors"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>PRD / DR Readiness &amp; Failover</span>
              </button>
              <button 
                onClick={() => handleSelect(() => setActiveTab('infrastructure'))}
                className="flex items-center gap-2 p-2 rounded text-left hover:bg-[#162033] text-slate-300 transition-colors"
              >
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hostinger VPS Infrastructure</span>
              </button>
            </div>
          )}

          {/* Incidents Matches */}
          {matchedIncidents.length > 0 && (
            <div>
              <div className="px-2 py-0.5 text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Incidents ({matchedIncidents.length})</span>
              </div>
              <div className="space-y-1">
                {matchedIncidents.map(inc => (
                  <button
                    key={inc.id}
                    onClick={() => handleSelect(() => {
                      setActiveTab('incidents');
                      setSelectedIncidentId(inc.id);
                    })}
                    className="w-full flex items-center justify-between p-2 rounded text-left hover:bg-[#162033] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${inc.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                      <span className="font-semibold text-slate-100 shrink-0">{inc.id}</span>
                      <span className="text-slate-400 truncate font-sans text-xs">{inc.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-slate-500">
                      <span className="text-[10px] uppercase">{inc.status}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Applications Matches */}
          {matchedApps.length > 0 && (
            <div>
              <div className="px-2 py-0.5 text-[10px] text-slate-500 uppercase tracking-wider">Applications ({matchedApps.length})</div>
              <div className="space-y-1">
                {matchedApps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleSelect(() => {
                      setActiveTab('applications');
                      setSelectedAppId(app.id);
                    })}
                    className="w-full flex items-center justify-between p-2 rounded text-left hover:bg-[#162033] transition-colors group font-sans"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-semibold text-slate-100">{app.name}</span>
                      <span className="text-slate-500 truncate">· {app.description}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                      <span className={app.status === 'HEALTHY' ? 'text-emerald-400' : 'text-rose-400'}>
                        {app.status}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VPS Servers */}
          {matchedServers.length > 0 && (
            <div>
              <div className="px-2 py-0.5 text-[10px] text-slate-500 uppercase tracking-wider">VPS Servers ({matchedServers.length})</div>
              <div className="space-y-1">
                {matchedServers.slice(0, 5).map(srv => (
                  <button
                    key={srv.id}
                    onClick={() => handleSelect(() => {
                      setActiveTab('infrastructure');
                      setSelectedServerId(srv.id);
                    })}
                    className="w-full flex items-center justify-between p-2 rounded text-left hover:bg-[#162033] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Server className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-200 font-medium">{srv.hostname}</span>
                      <span className="text-slate-500">({srv.ip})</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-slate-500">
                      <span>{srv.environment} · {srv.region}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monitors */}
          {matchedMonitors.length > 0 && (
            <div>
              <div className="px-2 py-0.5 text-[10px] text-slate-500 uppercase tracking-wider">Monitors ({matchedMonitors.length})</div>
              <div className="space-y-1">
                {matchedMonitors.slice(0, 4).map(mon => (
                  <button
                    key={mon.id}
                    onClick={() => handleSelect(() => setActiveTab('monitors'))}
                    className="w-full flex items-center justify-between p-2 rounded text-left hover:bg-[#162033] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 font-sans">
                      <Activity className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-200 font-medium truncate">{mon.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                      <span className="text-slate-500">{mon.responseTimeMs}ms</span>
                      <span className={mon.status === 'HEALTHY' ? 'text-emerald-400' : 'text-rose-400'}>
                        {mon.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Runbooks */}
          {matchedRunbooks.length > 0 && (
            <div>
              <div className="px-2 py-0.5 text-[10px] text-slate-500 uppercase tracking-wider">Runbooks ({matchedRunbooks.length})</div>
              <div className="space-y-1">
                {matchedRunbooks.map(rb => (
                  <button
                    key={rb.id}
                    onClick={() => handleSelect(() => {
                      setActiveTab('runbooks');
                      setSelectedRunbookId(rb.id);
                    })}
                    className="w-full flex items-center justify-between p-2 rounded text-left hover:bg-[#162033] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 font-sans">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-slate-200 font-medium">{rb.title}</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">~{rb.estimatedDurationMin}m</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#1E293B] bg-[#0A0F1A] text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>ESC to close</span>
          </div>
          <span>Scholario Command Palette</span>
        </div>
      </div>
    </div>
  );
};
