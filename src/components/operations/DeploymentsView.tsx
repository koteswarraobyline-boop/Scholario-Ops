import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';
import { GitBranch, CheckCircle2, RotateCcw } from 'lucide-react';

export const DeploymentsView: React.FC = () => {
  const { deployments, applications, addAuditEntry } = useOps();
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);

  const handleRollback = (id: string, version: string) => {
    setRollingBackId(id);
    setTimeout(() => {
      addAuditEntry('DEPLOYMENT_ROLLBACK', 'INCIDENT', id, `Initiated rollback of release ${version}`);
      setRollingBackId(null);
    }, 800);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            DEPLOYMENT PIPELINE &amp; RELEASE VERIFICATION
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Automated CI/CD stages: Build → Deploy → Health Check → Smoke Test → Success with 1-click rollback
          </p>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {deployments.map(dep => {
          const app = applications.find(a => a.id === dep.applicationId);
          const isRollbackActive = rollingBackId === dep.id;

          return (
            <div key={dep.id} className="p-4 bg-[#111726] rounded border border-[#1E293B] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A2332] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-[#162033] text-blue-400 flex items-center justify-center">
                    <GitBranch className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 font-sans">{app?.name}</span>
                      <span className="text-xs text-blue-400 font-semibold">{dep.version}</span>
                      <span className="text-slate-500">({dep.commitHash})</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">{dep.commitMessage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-[10px] uppercase">
                    {dep.status}
                  </span>
                  {dep.rollbackAvailable && (
                    <button
                      onClick={() => handleRollback(dep.id, dep.version)}
                      disabled={isRollbackActive}
                      className="px-2.5 py-1 bg-[#1A2436] hover:bg-[#23324C] border border-[#23334E] text-slate-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className={`w-3 h-3 ${isRollbackActive ? 'animate-spin text-rose-400' : ''}`} />
                      <span>{isRollbackActive ? 'Rolling back...' : 'Rollback Release'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Pipeline Stages */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 rounded bg-[#0B0F17] border border-[#1A2436] flex items-center justify-between">
                  <span className="text-slate-300">1. Build Artifact</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="p-2 rounded bg-[#0B0F17] border border-[#1A2436] flex items-center justify-between">
                  <span className="text-slate-300">2. VPS Rolling Deploy</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="p-2 rounded bg-[#0B0F17] border border-[#1A2436] flex items-center justify-between">
                  <span className="text-slate-300">3. Health Check Probe</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="p-2 rounded bg-[#0B0F17] border border-[#1A2436] flex items-center justify-between">
                  <span className="text-slate-300">4. Synthetic Smoke Test</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Author: {dep.author} · Pipeline: {dep.durationSec}s</span>
                <span>Completed: {new Date(dep.startedAt).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
