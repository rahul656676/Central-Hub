import React from 'react';
import { Activity, Server, HardDrive, Video, CheckCircle, AlertTriangle } from 'lucide-react';

const HealthMonitorView = () => {
  const sites = [
    { name: 'Premix (Micocheni & Taifa)', gpu: 78, disk: 45, cams: 12, total: 12, status: 'Online' },
    { name: 'Impala', gpu: 42, disk: 30, cams: 8, total: 8, status: 'Online' },
    { name: 'Lugoba', gpu: 91, disk: 88, cams: 14, total: 15, status: 'Warning' },
    { name: 'Container Depot (AFICD)', gpu: 65, disk: 50, cams: 22, total: 22, status: 'Online' },
    { name: 'AILL 1 & 2 / Polytra', gpu: 55, disk: 60, cams: 18, total: 18, status: 'Online' },
    { name: 'Fuel Depot and Yard', gpu: 30, disk: 25, cams: 6, total: 6, status: 'Online' },
    { name: 'Lake Steel', gpu: 0, disk: 0, cams: 0, total: 10, status: 'Offline' },
    { name: 'Pipe and Cylinder', gpu: 48, disk: 40, cams: 8, total: 8, status: 'Online' },
    { name: 'Lake Aviation', gpu: 20, disk: 15, cams: 4, total: 4, status: 'Online' },
    { name: 'Lake Trans', gpu: 85, disk: 70, cams: 16, total: 16, status: 'Online' },
    { name: 'Building Solution', gpu: 60, disk: 55, cams: 10, total: 10, status: 'Online' },
    { name: 'Kings Apartment', gpu: 25, disk: 20, cams: 5, total: 5, status: 'Online' },
  ];

  return (
    <div className="card full-width-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc' }}>
        <Activity size={28} color="var(--accent-blue)" />
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Global Site Health Monitor</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
            Real-time server infrastructure status across all 12 operational sites.
          </p>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {sites.map((site) => (
            <div key={site.name} style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', background: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: site.status === 'Online' ? 'var(--success)' : site.status === 'Warning' ? 'var(--warning)' : 'var(--danger)' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{site.name}</h4>
                {site.status === 'Online' && <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Online</span>}
                {site.status === 'Warning' && <span style={{ background: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Warning</span>}
                {site.status === 'Offline' && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>Offline</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Server size={14}/> GPU Load</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: site.gpu > 85 ? 'var(--danger)' : 'var(--text-primary)' }}>{site.gpu}%</div>
                  <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '4px' }}>
                    <div style={{ width: site.gpu + '%', height: '100%', background: site.gpu > 85 ? 'var(--danger)' : 'var(--accent-blue)', borderRadius: '2px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><HardDrive size={14}/> Disk Usage</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: site.disk > 85 ? 'var(--warning)' : 'var(--text-primary)' }}>{site.disk}%</div>
                  <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '4px' }}>
                    <div style={{ width: site.disk + '%', height: '100%', background: site.disk > 85 ? 'var(--warning)' : 'var(--accent-blue)', borderRadius: '2px' }}></div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Video size={14} /> Cameras Online
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: site.cams < site.total ? 'var(--danger)' : 'var(--success)' }}>
                  {site.cams} / {site.total}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthMonitorView;
