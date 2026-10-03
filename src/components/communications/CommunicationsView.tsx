import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';
import { Send, CheckCircle2 } from 'lucide-react';

export const CommunicationsView: React.FC = () => {
  const { communicationChannels, escalationPolicies, sendTestNotification } = useOps();
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  const handleTestDispatch = async (channelId: string, channelName: string) => {
    setTestingId(channelId);
    setTestSuccessMessage(null);
    await sendTestNotification(channelId);
    setTestingId(null);
    setTestSuccessMessage(`Test notification confirmed delivered to ${channelName}`);
    setTimeout(() => setTestSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            COMMUNICATIONS &amp; ESCALATION MATRIX
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Microsoft Teams webhooks, email relays, on-call paging &amp; multi-tiered escalation matrix
          </p>
        </div>
      </div>

      {testSuccessMessage && (
        <div className="p-3 bg-[#0E1A14] border border-emerald-900 rounded text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{testSuccessMessage}</span>
        </div>
      )}

      {/* Channels Section */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Configured Operational Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {communicationChannels.map(ch => {
            const isTesting = testingId === ch.id;

            return (
              <div key={ch.id} className="p-4 bg-[#111726] rounded border border-[#1E293B] space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 font-sans">{ch.name}</span>
                    <span className="text-[10px] text-blue-400">
                      {ch.type}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400 break-all bg-[#0B0F17] p-2 rounded border border-[#1A2436]">
                    Endpoint: {ch.targetEndpoint.slice(0, 28)}••••••••
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <strong className="text-emerald-400">ENABLED</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Delivery:</span>
                      <span className="text-slate-300">
                        {new Date(ch.lastDeliveryAt).toLocaleTimeString()} ({ch.lastDeliveryStatus})
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleTestDispatch(ch.id, ch.name)}
                  disabled={isTesting}
                  className="w-full mt-2 py-1 bg-[#1A2436] hover:bg-[#23324C] border border-[#23334E] text-slate-200 rounded font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className={`w-3 h-3 ${isTesting ? 'animate-spin text-blue-400' : ''}`} />
                  <span>{isTesting ? 'DISPATCHING...' : 'DISPATCH TEST PAYLOAD'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Escalation Policies */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Incident Escalation Policy Matrix</h2>
        <div className="bg-[#111726] rounded border border-[#1E293B] overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B0F17] text-slate-400 font-medium border-b border-[#1A2332]">
              <tr>
                <th className="py-2 px-3.5">Severity Tier</th>
                <th className="py-2 px-3.5">Dispatched Channels</th>
                <th className="py-2 px-3.5">Initial Delay</th>
                <th className="py-2 px-3.5">Reminder Repeat</th>
                <th className="py-2 px-3.5">Auto-Escalate Window</th>
                <th className="py-2 px-3.5 text-right">Escalate Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030]">
              {escalationPolicies.map(pol => (
                <tr key={pol.id} className="hover:bg-[#151D2E]">
                  <td className="py-2.5 px-3.5 font-bold">
                    <span className={pol.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}>
                      {pol.severity}
                    </span>
                  </td>

                  <td className="py-2.5 px-3.5 text-slate-300">
                    {pol.channels.map(c => c.replace('comm-', '').toUpperCase()).join(', ')}
                  </td>

                  <td className="py-2.5 px-3.5 text-slate-400">
                    {pol.initialDelayMin === 0 ? 'Immediate (0s)' : `${pol.initialDelayMin} min`}
                  </td>

                  <td className="py-2.5 px-3.5 text-slate-400">
                    Every {pol.repeatIntervalMin} min
                  </td>

                  <td className="py-2.5 px-3.5 text-rose-400 font-bold">
                    If unacknowledged &gt; {pol.autoEscalateAfterMin} min
                  </td>

                  <td className="py-2.5 px-3.5 text-right font-sans text-slate-200">
                    {pol.escalateToTeam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
