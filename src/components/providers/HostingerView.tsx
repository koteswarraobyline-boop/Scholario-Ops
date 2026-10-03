import React from 'react';
import { useOps } from '../../context/OpsContext';

export const HostingerView: React.FC = () => {
  const { servers } = useOps();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            HOSTINGER CLOUD VPS FLEET
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Provider hypervisor status, datacenter locations, hardware virtualization &amp; snapshot storage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/80 px-2 py-0.5 rounded flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Hostinger Cloud API: Connected</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded">
          <div className="text-[10px] text-slate-400 uppercase">Datacenter Regions</div>
          <div className="text-base font-bold text-slate-100">4 Global Hubs</div>
          <div className="text-[10px] text-slate-400 mt-0.5">SG, FRA, BOM, LON</div>
        </div>
        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded">
          <div className="text-[10px] text-slate-400 uppercase">Total vCPU Fleet</div>
          <div className="text-base font-bold text-slate-100">96 vCPU Cores</div>
          <div className="text-[10px] text-slate-400 mt-0.5">AMD EPYC Enterprise</div>
        </div>
        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded">
          <div className="text-[10px] text-slate-400 uppercase">Memory Fleet</div>
          <div className="text-base font-bold text-slate-100">384 GB DDR5</div>
          <div className="text-[10px] text-slate-400 mt-0.5">ECC Registered</div>
        </div>
        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded">
          <div className="text-[10px] text-slate-400 uppercase">NVMe Storage Fleet</div>
          <div className="text-base font-bold text-slate-100">4.8 TB NVMe</div>
          <div className="text-[10px] text-slate-400 mt-0.5">RAID-10 Mirrored</div>
        </div>
      </div>

      {/* VPS Hardware List */}
      <div className="bg-[#111726] rounded border border-[#1E293B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B0F17] text-slate-400 font-medium border-b border-[#1A2332]">
              <tr>
                <th className="py-2 px-3.5">Instance Hostname</th>
                <th className="py-2 px-3.5">Region DC</th>
                <th className="py-2 px-3.5">Hostinger Plan</th>
                <th className="py-2 px-3.5">Specs (CPU / RAM / Disk)</th>
                <th className="py-2 px-3.5">IPv4 Address</th>
                <th className="py-2 px-3.5">Power State</th>
                <th className="py-2 px-3.5 text-right">Provider Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030]">
              {servers.map(s => (
                <tr key={s.id} className="hover:bg-[#151D2E] transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-slate-100">
                    {s.hostname}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-300">
                    {s.region}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-400">
                    {s.plan.split('(')[0]}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-300">
                    {s.cpuCores} vCPU · {s.ramGb}GB · {s.diskGb}GB
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-400">
                    {s.ip}
                  </td>
                  <td className="py-2.5 px-3.5 text-emerald-400 font-bold text-[11px]">
                    RUNNING
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-emerald-400">
                    Verified
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
