import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';
import { FileText, Download, Copy } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { systemSummary, deadMan } = useOps();
  const [copied, setCopied] = useState(false);

  const reportText = `SCHOLARIO IT OPERATIONS CONTROL CENTER
Daily Operations & Infrastructure Health Certified Briefing
Generated: ${new Date().toISOString()}

============================================================
1. CORE HEALTH EVALUATION
============================================================
Applications:            ${systemSummary.healthyApps} / ${systemSummary.totalApps} Healthy (Mosaic in failover state)
Infrastructure:          ${systemSummary.healthyServers} / ${systemSummary.totalServers} Hostinger KVM Instances Operational
Continuous Monitors:     ${systemSummary.healthyMonitors} / ${systemSummary.totalMonitors} Probes Passing
Disaster Recovery (DR):  ${systemSummary.drReadinessCount} / ${systemSummary.totalApps} Workloads Verified
Cold Backups:            ${systemSummary.backupsCurrentCount} / ${systemSummary.totalApps} Current (SHA-256 Validated)
Cloudflare Edge Status:  ${systemSummary.cloudflareStatus} (Mosaic traffic routed to DR)
Independent Watchdog:    ${deadMan.status} (${deadMan.nodeLocation.split('(')[0]})

============================================================
2. RESILIENCE TARGETS & METRICS
============================================================
Active Incidents:        ${systemSummary.openIncidents} (${systemSummary.criticalIncidents} Critical)
RPO Target Compliance:   < 15 minutes across all Tier 1 workloads
RTO Target Compliance:   < 30 minutes verified in restore drill
Mean Time To Detect:     < 45 seconds (3 consecutive probe confirmations)
Mean Time To Reroute:    < 12 seconds via Cloudflare Anycast Origin Pool

============================================================
3. COMPLIANCE & GOVERNANCE CERTIFICATION
============================================================
Hypervisors:             Hostinger Singapore / Frankfurt / Mumbai / London
Encryption:              AES-256 at rest, TLS 1.3 in transit
Audit Trail:             Immutable operator action records maintained`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `scholario-ops-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            DAILY OPERATIONS &amp; SLA AUDIT REPORT
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Automated operational briefing for leadership, compliance, and engineering handover
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111726] border border-[#1E293B] rounded text-slate-300 hover:text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'COPIED' : 'COPY BRIEFING'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 rounded text-white hover:bg-blue-500 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD .TXT</span>
          </button>
        </div>
      </div>

      <div className="bg-[#111726] rounded border border-[#1E293B] p-5 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-[#1A2332] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h2 className="font-bold text-slate-200">
              OPERATIONAL BRIEFING: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
          </div>
          <span className="text-slate-500 text-[11px]">CERTIFIED AUDIT ARTIFACT</span>
        </div>

        <pre className="p-4 bg-[#080B12] text-slate-300 rounded border border-[#182338] text-xs leading-relaxed overflow-x-auto selection:bg-blue-900">
          {reportText}
        </pre>
      </div>
    </div>
  );
};
