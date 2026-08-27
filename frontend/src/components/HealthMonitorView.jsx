import React, { useState } from 'react';
import { Activity, Server, HardDrive, Video, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const HealthMonitorView = () => {
  const [selectedSite, setSelectedSite] = useState(null);

  const sites = [
    { name: 'Premix', useCases: 9, compliance: 98, status: 'Online', gpu: '42%', disk: '65%', cpu: '30%', cameras: '12/12 Online' },
    { name: 'Impala', useCases: 5, compliance: 100, status: 'Online', gpu: '20%', disk: '40%', cpu: '15%', cameras: '6/6 Online' },
    { name: 'Lugoba', useCases: 9, compliance: 92, status: 'Warning', gpu: '85%', disk: '90%', cpu: '70%', cameras: '14/15 Online' },
    { name: 'Container Depot', useCases: 3, compliance: 100, status: 'Online', gpu: '15%', disk: '30%', cpu: '10%', cameras: '4/4 Online' },
    { name: 'Lake Steel', useCases: 4, compliance: 0, status: 'Offline', gpu: '0%', disk: '0%', cpu: '0%', cameras: '0/8 Online' },
  ];

  // Calculate global average ignoring completely offline sites for a fairer metric, or include them? User wants avg of *every* site.
  // 98 + 100 + 92 + 100 + 0 = 390 / 5 = 78%
  const globalAvg = Math.round(sites.reduce((acc, site) => acc + site.compliance, 0) / sites.length);
  const totalUseCases = sites.reduce((acc, site) => acc + site.useCases, 0);

  if (selectedSite) {
    return (
      <div className="card full-width-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setSelectedSite(null)} style={{ background: 'white', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={20} color="var(--text-secondary)" />
            </button>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{selectedSite.name} - Detailed Health</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>Status: <strong style={{ color: selectedSite.status === 'Online' ? 'var(--success)' : selectedSite.status === 'Warning' ? 'var(--warning)' : 'var(--danger)' }}>{selectedSite.status}</strong></p>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SITE AVG HEALTH</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: selectedSite.compliance < 50 ? 'var(--danger)' : selectedSite.compliance < 95 ? 'var(--warning)' : 'var(--success)' }}>
              {selectedSite.compliance}%
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', background: 'white' }}>
             <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Server size={18} /> GPU Load</h4>
             <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{selectedSite.gpu}</div>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', background: 'white' }}>
             <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} /> CPU Load</h4>
             <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{selectedSite.cpu}</div>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', background: 'white' }}>
             <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}><HardDrive size={18} /> Storage</h4>
             <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{selectedSite.disk}</div>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', background: 'white' }}>
             <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Video size={18} /> Cameras</h4>
             <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{selectedSite.cameras}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card full-width-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity size={28} color="var(--accent-blue)" />
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Global Site Health & Compliance</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
              Click on any site to view its detailed health metrics.
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL USE CASES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalUseCases}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>GLOBAL AVG HEALTH</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: globalAvg < 50 ? 'var(--danger)' : globalAvg < 90 ? 'var(--warning)' : 'var(--success)' }}>{globalAvg}%</div>
            </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {sites.map((site) => (
            <div 
              key={site.name} 
              onClick={() => setSelectedSite(site)}
              style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', background: 'white', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AVG HEALTH</div>
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
