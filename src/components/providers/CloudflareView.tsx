import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';
import { AlertTriangle } from 'lucide-react';

export const CloudflareView: React.FC = () => {
  const { cloudflareZones } = useOps();
  const [selectedZoneId, setSelectedZoneId] = useState<string>(cloudflareZones[0]?.id || 'cf-mosaic');

  const selectedZone = cloudflareZones.find(z => z.id === selectedZoneId) || cloudflareZones[0];

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            CLOUDFLARE ANYCAST EDGE &amp; DNS
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Read-only edge telemetry, TLS certificates, WAF events, DNS records &amp; configuration drift detection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/80 px-2 py-0.5 rounded flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Edge API: Synchronized</span>
          </span>
        </div>
      </div>

      {/* Configuration Drift Warning (if detected) */}
      {selectedZone.driftDetected && (
        <div className="p-3 bg-[#1F1710] border border-amber-900 rounded text-xs space-y-1 font-mono">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Configuration Drift Detected on {selectedZone.domain}</span>
          </div>
          <p className="text-slate-300 font-sans">
            Edge DNS record target differs from Terraform state repository. {selectedZone.driftDetails}
          </p>
        </div>
      )}

      {/* Zone Selector */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="text-slate-400">Select Zone:</span>
        <div className="flex items-center gap-1">
          {cloudflareZones.map(z => (
            <button
              key={z.id}
              onClick={() => setSelectedZoneId(z.id)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedZone.id === z.id
                  ? 'bg-[#182338] text-white font-medium border border-blue-500/50'
                  : 'bg-[#111726] border border-[#1E293B] text-slate-400 hover:text-slate-200'
              }`}
            >
              {z.domain}
            </button>
          ))}
        </div>
      </div>

      {/* Zone Detail Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded">
          <div className="text-[10px] text-slate-400 uppercase">Zone Status</div>
          <div className={`text-base font-bold mt-0.5 ${selectedZone.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {selectedZone.status}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Proxy active &amp; accelerated</div>
        </div>

        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded">
          <div className="text-[10px] text-slate-400 uppercase">SSL / TLS Version</div>
          <div className="text-base font-bold text-slate-100 mt-0.5">{selectedZone.tlsVersion}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Valid until {new Date(selectedZone.sslExpiresAt).toLocaleDateString()}</div>
        </div>

        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded">
          <div className="text-[10px] text-slate-400 uppercase">Active Origin Route</div>
          <div className="text-xs font-bold text-slate-100 truncate mt-1">
            {selectedZone.loadBalancer.activeOrigin}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Pool: {selectedZone.loadBalancer.poolName}</div>
        </div>

        <div className="p-3 bg-[#111726] border border-[#1E293B] rounded">
          <div className="text-[10px] text-slate-400 uppercase">WAF Mitigated Events (24h)</div>
          <div className="text-base font-bold text-slate-100 tabular-nums mt-0.5">{selectedZone.wafEvents24h.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">DDoS &amp; Bot Defense Shielded</div>
        </div>
      </div>

      {/* DNS Records Table */}
      <div className="bg-[#111726] rounded border border-[#1E293B] overflow-hidden space-y-3 p-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1A2332] pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            DNS Zone Records ({selectedZone.domain})
          </h2>
          <span className="text-[11px] text-slate-400">
            Last checked {new Date(selectedZone.lastChecked).toLocaleTimeString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F17] text-slate-400 font-medium border-b border-[#1A2332]">
              <tr>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Target Content</th>
                <th className="py-2 px-3">Proxy</th>
                <th className="py-2 px-3">TTL</th>
                <th className="py-2 px-3 text-right">Modified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030]">
              {selectedZone.dnsRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-[#151D2E]">
                  <td className="py-2 px-3 font-bold text-slate-200">{rec.type}</td>
                  <td className="py-2 px-3 font-semibold text-slate-100">{rec.name}</td>
                  <td className="py-2 px-3 text-slate-300">{rec.target}</td>
                  <td className="py-2 px-3">
                    <span className={rec.proxied ? 'text-amber-400' : 'text-slate-400'}>
                      {rec.proxied ? 'Proxied' : 'DNS Only'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">{rec.ttl === 1 ? 'Auto' : `${rec.ttl}s`}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{rec.lastModified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
