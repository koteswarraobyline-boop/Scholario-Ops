import React from 'react';
import { useOps } from '../../context/OpsContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useOps();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            ADMINISTRATIVE AUDIT LOGS
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Immutable record of all privileged operator commands, failovers, incident actions &amp; Cloudflare routing alterations
          </p>
        </div>
      </div>

      <div className="bg-[#111726] rounded border border-[#1E293B] overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0B0F17] text-slate-400 font-medium border-b border-[#1A2332]">
            <tr>
              <th className="py-2 px-3.5">Timestamp</th>
              <th className="py-2 px-3.5">Operator</th>
              <th className="py-2 px-3.5">Category</th>
              <th className="py-2 px-3.5">Action</th>
              <th className="py-2 px-3.5">Target Resource</th>
              <th className="py-2 px-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172030]">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-[#151D2E]">
                <td className="py-2.5 px-3.5 text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>

                <td className="py-2.5 px-3.5 font-sans font-semibold text-slate-200 whitespace-nowrap">
                  {log.operator}
                </td>

                <td className="py-2.5 px-3.5 text-slate-400">
                  {log.category}
                </td>

                <td className="py-2.5 px-3.5 text-blue-400 font-semibold whitespace-nowrap">
                  {log.action}
                </td>

                <td className="py-2.5 px-3.5 text-slate-300 whitespace-nowrap">
                  {log.targetId}
                </td>

                <td className="py-2.5 px-3.5 font-sans text-slate-300 max-w-md">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
