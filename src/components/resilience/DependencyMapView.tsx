import React, { useState } from 'react';
import { useOps } from '../../context/OpsContext';

export const DependencyMapView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    title: string;
    type: string;
    status: string;
    lastChecked: string;
    dependencies: string[];
    dependents: string[];
  }>({
    id: 'node-cf',
    title: 'Cloudflare Anycast Network',
    type: 'Edge & CDN',
    status: 'OPERATIONAL',
    lastChecked: '4 seconds ago',
    dependencies: ['Hostinger Edge Transit', 'Primary Origin VIP'],
    dependents: ['Public Internet Users', 'Scholario Mobile App']
  });

  const topologyLevels = [
    {
      levelName: '1. Ingress & Edge',
      nodes: [
        { id: 'node-users', title: 'Global Districts & Users', type: 'Ingress', status: 'HEALTHY', deps: [], dependents: ['Cloudflare Edge'] },
        { id: 'node-cf', title: 'Cloudflare Anycast CDN & LB', type: 'Edge Routing', status: 'HEALTHY', deps: ['Global Users'], dependents: ['Hostinger VPS Cluster'] }
      ]
    },
    {
      levelName: '2. Application Compute (Hostinger VPS)',
      nodes: [
        { id: 'node-ciph', title: 'Cipher LMS Engine', type: 'Node.js Cluster', status: 'HEALTHY', deps: ['Cloudflare'], dependents: ['MySQL', 'Redis'] },
        { id: 'node-apex', title: 'Apex SIS Records', type: 'PHP 8.3 / FPM', status: 'HEALTHY', deps: ['Cloudflare'], dependents: ['PostgreSQL 16'] },
        { id: 'node-mosa', title: 'Mosaic Exam Analytics', type: 'Node.js Engine', status: 'CRITICAL', deps: ['Cloudflare'], dependents: ['MySQL Clickhouse (Starved)'] },
        { id: 'node-vant', title: 'Vantage Billing Engine', type: 'Go Core Service', status: 'HEALTHY', deps: ['Cloudflare'], dependents: ['PCI Database', 'Vault'] }
      ]
    },
    {
      levelName: '3. Data & Storage Tier',
      nodes: [
        { id: 'node-db-ciph', title: 'Cipher Primary MySQL', type: 'Database Master', status: 'HEALTHY', deps: ['Cipher VPS'], dependents: ['DR Standby Replica'] },
        { id: 'node-db-mosa', title: 'Mosaic Analytics DB', type: 'Database (Starved)', status: 'CRITICAL', deps: ['Mosaic VPS'], dependents: ['Exam Exporter'] },
        { id: 'node-redis', title: 'Distributed Redis Mesh', type: 'Session Cache', status: 'HEALTHY', deps: ['App Nodes'], dependents: ['Auth Session Store'] },
        { id: 'node-s3', title: 'Hostinger S3 Cold Vault', type: 'Object Storage', status: 'HEALTHY', deps: ['Snapshot Backup Cron'], dependents: ['Long-term Archives'] }
      ]
    },
    {
      levelName: '4. Disaster Recovery (DR)',
      nodes: [
        { id: 'node-dr-sg', title: 'Singapore DR Standby', type: 'KVM 8 Standby', status: 'HEALTHY', deps: ['Master Binlog Stream'], dependents: ['Failover Pool'] },
        { id: 'node-dr-fra', title: 'Frankfurt DR Standby', type: 'KVM 8 Standby', status: 'HEALTHY', deps: ['PG WAL Replication'], dependents: ['Failover Pool'] }
      ]
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
            DEPENDENCY TOPOLOGY &amp; BLAST RADIUS MAP
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Hierarchical topology illustrating ingress, compute workloads, database tiers &amp; DR standby channels
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-xs">
        
        {/* Left Map Canvas */}
        <div className="lg:col-span-2 bg-[#111726] rounded border border-[#1E293B] p-5 space-y-5">
          {topologyLevels.map((lvl, idx) => (
            <div key={lvl.levelName} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {lvl.levelName}
                </span>
                <div className="flex-1 h-px bg-[#1A2332]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {lvl.nodes.map(n => {
                  const isCrit = n.status === 'CRITICAL';
                  const isSelected = selectedNode.id === n.id;

                  return (
                    <button
                      key={n.id}
                      onClick={() => setSelectedNode({
                        id: n.id,
                        title: n.title,
                        type: n.type,
                        status: n.status,
                        lastChecked: 'Just now',
                        dependencies: n.deps,
                        dependents: n.dependents
                      })}
                      className={`p-2.5 rounded border text-left transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-[#162238] shadow-xs' 
                          : isCrit 
                            ? 'bg-[#180E13] border-rose-900/80' 
                            : 'bg-[#0B0F17] border-[#1A2436] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCrit ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className="text-[9px] uppercase text-slate-400">
                          {n.type}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-200 mt-1 truncate font-sans">{n.title}</div>
                      <div className="text-[10px] mt-1 text-slate-400">
                        {n.status}
                      </div>
                    </button>
                  );
                })}
              </div>

              {idx < topologyLevels.length - 1 && (
                <div className="flex justify-center py-0.5 text-slate-700">
                  <div className="w-px h-2.5 bg-[#1E293B]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Node Inspector */}
        <div className="bg-[#111726] rounded border border-[#1E293B] p-5 space-y-4">
          <div className="border-b border-[#1A2332] pb-2.5">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Topology Node Details</span>
            <h2 className="text-base font-bold text-slate-100 font-sans mt-0.5">{selectedNode.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">
                {selectedNode.type}
              </span>
              <span className="text-slate-600">·</span>
              <span className={`text-xs font-bold ${selectedNode.status === 'HEALTHY' || selectedNode.status === 'OPERATIONAL' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedNode.status}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Upstream Dependencies:</span>
              <div className="mt-1 space-y-1">
                {selectedNode.dependencies.length > 0 ? (
                  selectedNode.dependencies.map(d => (
                    <div key={d} className="p-2 bg-[#0B0F17] rounded border border-[#1A2436] text-slate-300">
                      ← {d}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500">None (Top of ingress tree)</div>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Downstream Dependents:</span>
              <div className="mt-1 space-y-1">
                {selectedNode.dependents.length > 0 ? (
                  selectedNode.dependents.map(d => (
                    <div key={d} className="p-2 bg-[#0B0F17] rounded border border-[#1A2436] text-slate-300">
                      → {d}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500">Terminal node</div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
