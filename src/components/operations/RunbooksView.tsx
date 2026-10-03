import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';
import { Terminal, CheckCircle2, Square } from 'lucide-react';

export const RunbooksView: React.FC = () => {
  const { runbooks, selectedRunbookId, setSelectedRunbookId, toggleRunbookStep } = useOps();
  const [activeRbId, setActiveRbId] = useState<string>(selectedRunbookId || runbooks[0]?.id || 'run-db-starve');

  const currentRunbook = runbooks.find(r => r.id === activeRbId) || runbooks[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            OPERATIONAL RUNBOOKS &amp; MITIGATION SOPs
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Standard Operating Procedures, incident checklists &amp; read-only CLI diagnostic commands
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Left List */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono px-1">
            Available Runbooks
          </div>
          {runbooks.map(rb => {
            const completedCount = rb.steps.filter(s => s.completed).length;
            const isSelected = rb.id === currentRunbook.id;

            return (
              <button
                key={rb.id}
                onClick={() => setActiveRbId(rb.id)}
                className={`w-full text-left p-3 rounded border transition-all text-xs space-y-1 font-mono ${
                  isSelected
                    ? 'bg-[#182338] border-blue-500/80 text-white'
                    : 'bg-[#111726] border-[#1E293B] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{rb.id}</span>
                  <span className="text-[10px] text-slate-500">~{rb.estimatedDurationMin}m</span>
                </div>
                <div className="font-semibold text-slate-200 line-clamp-1 font-sans">{rb.title}</div>
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <span>Progress:</span>
                  <span className={completedCount === rb.steps.length ? 'text-emerald-400 font-bold' : 'text-blue-400'}>
                    {completedCount} / {rb.steps.length} steps
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Runbook Workspace */}
        <div className="md:col-span-3 bg-[#111726] rounded border border-[#1E293B] p-5 space-y-5">
          <div className="border-b border-[#1A2332] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-400 font-bold">
                  {currentRunbook.id}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 uppercase">
                  Category: {currentRunbook.category}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 font-sans mt-0.5">{currentRunbook.title}</h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">{currentRunbook.description}</p>
            </div>

            <div className="text-xs text-right text-slate-400">
              <span>Estimated Execution: </span>
              <strong className="text-slate-200">~{currentRunbook.estimatedDurationMin}m</strong>
            </div>
          </div>

          {/* Interactive Steps Checklist */}
          <div className="space-y-3 font-mono text-xs">
            {currentRunbook.steps.map(step => (
              <div
                key={step.id}
                onClick={() => toggleRunbookStep(currentRunbook.id, step.id)}
                className={`p-3.5 rounded border cursor-pointer transition-all ${
                  step.completed
                    ? 'bg-[#0E1A14] border-emerald-900/60'
                    : 'bg-[#0B0F17] border-[#1A2436] hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-blue-400 shrink-0">
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${step.completed ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                        Step {step.id}: {step.title}
                      </span>
                      {step.completedAt && (
                        <span className="text-[10px] text-slate-500">
                          Verified {step.completedAt} by {step.completedBy}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 font-sans text-xs">{step.instruction}</p>

                    {step.command && (
                      <div className="mt-2 p-2 bg-[#05080E] text-slate-200 rounded border border-[#182338] text-[11px] flex items-center justify-between">
                        <code>$ {step.command}</code>
                        <span className="text-[10px] text-slate-500 uppercase font-sans">Diagnostic Only</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
