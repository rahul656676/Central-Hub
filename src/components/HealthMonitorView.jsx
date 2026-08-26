import React from 'react';
import { Activity, Server, HardDrive, Video, CheckCircle, AlertTriangle } from 'lucide-react';

const HealthMonitorView = () => {
  const sites = [
    { name: 'Premix', useCases: 9, compliance: 98, status: 'Online' },
    { name: 'Impala', useCases: 5, compliance: 100, status: 'Online' },
    { name: 'Lugoba', useCases: 9, compliance: 92, status: 'Warning' },
    { name: 'Container Depot', useCases: 3, compliance: 100, status: 'Online' },
    { name: 'Lake Steel', useCases: 4, compliance: 0, status: 'Offline' },
  ];

  return (
    <div className="card full-width-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc' }}>
        <Activity size={28} color="var(--accent-blue)" />
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Global Site Health & Compliance</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
            Location-wise average health compliance and active use cases.
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>NO OF USE CASES</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{site.useCases}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AVG HEALTH COMPLIANCE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: site.compliance < 50 ? 'var(--danger)' : site.compliance < 95 ? 'var(--warning)' : 'var(--success)' }}>
                    {site.compliance}%
                  </div>
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
