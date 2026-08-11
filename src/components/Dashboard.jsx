import React, { useState, useEffect, useMemo } from 'react';
import { 
  HardHat, CarFront, Package, UserX, Droplets, Flame, Activity, ShieldAlert,
  Calendar, Settings, BarChart3, Truck, Sliders, BellDot, FileText
} from 'lucide-react';

// Simple deterministic hash for consistent random numbers per location
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Sub-component for Configuration View
const ConfigurationView = () => {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '32px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Sliders size={32} color="var(--accent-color)" />
        <div>
          <h2 style={{ margin: 0 }}>System Configuration</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
            Adjust global settings, manage user access, and configure API integrations.
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)' }}>
        {['General', 'User Roles', 'Camera Feeds'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              flex: 1, 
              padding: '16px', 
              background: activeTab === tab ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent-color)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--accent-color)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '32px', minHeight: '300px' }}>
        {activeTab === 'General' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>System Name</label>
              <input type="text" defaultValue="Lake Group Central Hub" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Timezone</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                  <option>East Africa Time (EAT)</option>
                  <option>Central Africa Time (CAT)</option>
                  <option>UTC</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Data Retention (Days)</label>
                <input type="number" defaultValue="90" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              </div>
            </div>
            <div>
              <button style={{ padding: '10px 24px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'User Roles' && (
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Active Users</h3>
              <button style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>+ Add User</button>
            </div>
            <div style={{ border: '1px solid var(--card-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <div className="metric" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                <div style={{ flex: 2 }}>Name</div>
                <div style={{ flex: 1 }}>Role</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Status</div>
              </div>
              <div className="metric" style={{ padding: '12px 16px' }}>
                <div style={{ flex: 2 }}>{userName}</div>
                <div style={{ flex: 1, color: 'var(--text-secondary)' }}>System Admin</div>
                <div style={{ flex: 1, textAlign: 'right', color: 'var(--success)' }}>Active</div>
              </div>
              <div className="metric" style={{ padding: '12px 16px' }}>
                <div style={{ flex: 2 }}>Security Manager</div>
                <div style={{ flex: 1, color: 'var(--text-secondary)' }}>Manager</div>
                <div style={{ flex: 1, textAlign: 'right', color: 'var(--success)' }}>Active</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Camera Feeds' && (
          <div style={{ textAlign: 'left' }}>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Integration endpoints for AI CCTV processing.</p>
             <div style={{ display: 'grid', gap: '16px' }}>
               <div style={{ padding: '16px', border: '1px solid var(--card-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <div style={{ fontWeight: '500' }}>Premix - Gate A (ANPR)</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>rtsp://192.168.1.101:554/stream1</div>
                 </div>
                 <div style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '4px', fontSize: '0.75rem' }}>Connected</div>
               </div>
               <div style={{ padding: '16px', border: '1px solid var(--card-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <div style={{ fontWeight: '500' }}>Impala - Loading Bay (Spillage)</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>rtsp://192.168.1.105:554/stream1</div>
                 </div>
                 <div style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: '4px', fontSize: '0.75rem' }}>Connected</div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ activeLocation, searchQuery = '', userName = 'Rahul Jangir' }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
    
    const timer = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString('en-US', options));
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Generate varied dummy data based on the active location
  const dummyData = useMemo(() => {
    const seed = hashCode(activeLocation);
    const mod = (val, max, min = 0) => ((seed * val) % max) + min;

    return [
      {
        id: 'ppe', title: 'PPE Monitoring', desc: 'Detect helmets, vests, and gloves.',
        icon: <HardHat size={24} />, iconClass: 'icon-ppe', status: mod(1, 10) > 8 ? 'Alert' : 'Safe',
        statusClass: mod(1, 10) > 8 ? 'alert' : 'safe',
        metrics: [
          { label: 'Compliance Rate', value: `${90 + mod(2, 9)}.${mod(3, 9)}%` },
          { label: 'Active Personnel', value: activeLocation === 'All Locations' ? '1,420' : `${20 + mod(4, 150)}` },
          { label: 'Recent Violations', value: `${mod(5, 5)}`, alert: mod(5, 5) > 2 }
        ]
      },
      {
        id: 'anpr', title: 'ANPR & Container Tracking', desc: 'Track vehicle plates and logistics containers.',
        icon: <CarFront size={24} />, iconClass: 'icon-anpr', status: 'Active', statusClass: 'safe',
        metrics: [
          { label: 'Vehicles Processed', value: activeLocation === 'All Locations' ? '3,480' : `${50 + mod(6, 400)}` },
          { label: 'Containers Tracked', value: activeLocation === 'All Locations' ? '12,040' : `${100 + mod(7, 1000)}` },
          { label: 'Unauthorized', value: `${mod(8, 3)}`, alert: mod(8, 3) > 0 }
        ]
      },
      {
        id: 'counting', title: 'Box / Sack / Bottle Counting', desc: 'Automated production and dispatch counting.',
        icon: <Package size={24} />, iconClass: 'icon-counting', status: 'Active', statusClass: 'safe',
        metrics: [
          { label: 'Daily Output', value: activeLocation === 'All Locations' ? '124,500' : `${1000 + mod(9, 20000)}` },
          { label: 'Accuracy', value: `${98 + mod(10, 2)}.${mod(11, 9)}%` },
          { label: 'Current Rate', value: `${100 + mod(12, 500)}/hr` }
        ]
      },
      {
        id: 'loitering', title: 'Loitering Detection', desc: 'Identify prolonged presence in sensitive areas.',
        icon: <UserX size={24} />, iconClass: 'icon-loitering', status: mod(13, 10) > 6 ? 'Alert' : 'Safe',
        statusClass: mod(13, 10) > 6 ? 'alert' : 'safe',
        metrics: [
          { label: 'Active Alerts', value: `${mod(14, 4)}`, alert: mod(14, 4) > 0 },
          { label: 'Zone', value: `Gate ${1 + mod(15, 6)}` },
          { label: 'Duration', value: `${mod(16, 20)} mins` }
        ]
      },
      {
        id: 'spill', title: 'Spillage Detection', desc: 'Detect oil, chemical, or material spills instantly.',
        icon: <Droplets size={24} />, iconClass: 'icon-spill', status: mod(17, 10) > 7 ? 'Warning' : 'Safe',
        statusClass: mod(17, 10) > 7 ? 'warning' : 'safe',
        metrics: [
          { label: 'Minor Spills', value: `${mod(18, 3)}` },
          { label: 'Location', value: `Sector ${String.fromCharCode(65 + mod(19, 5))}` },
          { label: 'Status', value: mod(18, 3) > 0 ? 'Containing' : 'Clear' }
        ]
      },
      {
        id: 'fire', title: 'Fire & Smoke Detection', desc: 'Early detection system for rapid response.',
        icon: <Flame size={24} />, iconClass: 'icon-fire', status: 'Safe', statusClass: 'safe',
        metrics: [
          { label: 'Sensors Active', value: `${10 + mod(20, 40)}/${10 + mod(20, 40)}` },
          { label: 'Temperatures', value: 'Normal' },
          { label: 'Last Test', value: `${1 + mod(21, 23)} hrs ago` }
        ]
      },
      {
        id: 'productivity', title: 'Productivity Tracking', desc: 'Analyze employee movement and task engagement.',
        icon: <Activity size={24} />, iconClass: 'icon-productivity', status: 'Active', statusClass: 'safe',
        metrics: [
          { label: 'Overall Efficiency', value: `${75 + mod(22, 20)}%` },
          { label: 'Idle Time', value: `${5 + mod(23, 15)}%` },
          { label: 'Active Zones', value: `${2 + mod(24, 8)}` }
        ]
      },
      {
        id: 'intrusion', title: 'Advanced Intrusion Alerts', desc: 'Detection of perimeter breaches in real time.',
        icon: <ShieldAlert size={24} />, iconClass: 'icon-intrusion', status: mod(25, 10) > 8 ? 'Alert' : 'Safe',
        statusClass: mod(25, 10) > 8 ? 'alert' : 'safe',
        metrics: [
          { label: 'Perimeter Status', value: mod(25, 10) > 8 ? 'Breach Detected' : 'Secure' },
          { label: 'Cameras Online', value: `${20 + mod(26, 30)}/${20 + mod(26, 30)}` },
          { label: 'Recent Breaches', value: mod(25, 10) > 8 ? '1' : '0' }
        ]
      }
    ];
  }, [activeLocation]);

  // System Management Views
  const renderSystemView = () => {
    switch (activeLocation) {
      case 'Configuration':
        return <ConfigurationView />;
      case 'Alert Rules':
        return (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <BellDot size={48} color="var(--warning)" style={{ margin: '0 auto 20px' }} />
            <h2>Alert Thresholds & Rules</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
              Define when alerts are triggered for PPE violations, intrusions, and loitering.
            </p>
            <div style={{ marginTop: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', textAlign: 'left' }}>
              <div className="metric"><span className="metric-label">Loitering Threshold</span> <span className="metric-value highlight">10 Minutes</span></div>
              <div className="metric"><span className="metric-label">PPE Hardhat Requirement</span> <span className="metric-value highlight">Strict</span></div>
              <div className="metric"><span className="metric-label">Spillage Sensitivity</span> <span className="metric-value highlight">High</span></div>
            </div>
          </div>
        );
      case 'Reports':
        return (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <FileText size={48} color="var(--success)" style={{ margin: '0 auto 20px' }} />
            <h2>Analytics & Reports</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
              Generate custom PDF and Excel reports for site productivity and safety compliance.
            </p>
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button className="nav-item active" style={{ border: 'none', background: 'var(--success)', color: '#fff' }}>Download Weekly Summary</button>
              <button className="nav-item" style={{ border: '1px solid var(--card-border)' }}>View Audit Logs</button>
            </div>
          </div>
        );
      case 'Fleet Admin':
        return (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <Truck size={48} color="#8b5cf6" style={{ margin: '0 auto 20px' }} />
            <h2>Fleet & Logistics Administration</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
              Manage registered vehicle plates, container manifests, and trusted driver profiles.
            </p>
            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
                <h4>Registered Vehicles</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>842</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
                <h4>Active Containers</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>1,105</div>
              </div>
            </div>
          </div>
        );
      default:
        return null; // Should not reach here
    }
  };

  const isSystemView = ['Configuration', 'Alert Rules', 'Reports', 'Fleet Admin'].includes(activeLocation);

  const filteredData = dummyData.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-area">
      <div className="page-header">
        <div>
          <h1>{activeLocation}</h1>
          <p>{isSystemView ? 'System Management Panel' : 'AI-Powered Video Analytics Overview'}</p>
        </div>
        <div className="date-display">
          <Calendar size={16} />
          <span>{currentDate}</span>
        </div>
      </div>

      {isSystemView ? (
        <div className="system-view-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {renderSystemView()}
        </div>
      ) : (
        <div className="dashboard-grid">
          {filteredData.length > 0 ? (
            filteredData.map((data) => (
              <div className="card" key={data.id}>
                <div className="card-header">
                  <div className="card-title-group">
                    <div className={`card-icon ${data.iconClass}`}>
                      {data.icon}
                    </div>
                    <div>
                      <div className="card-title">{data.title}</div>
                      <div className="card-desc">{data.desc}</div>
                    </div>
                  </div>
                </div>
                
                <div className="card-content">
                  {data.metrics.map((metric, idx) => (
                    <div className="metric" key={idx}>
                      <div className="metric-label">{metric.label}</div>
                      <div className={`metric-value ${metric.alert ? 'danger' : ''} ${idx === 0 && !metric.alert ? 'highlight' : ''}`}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="live-indicator">
                    <div className="dot"></div>
                    Live Monitoring
                  </div>
                  <div className={`card-status ${data.statusClass}`}>
                    {data.status === 'Alert' && <ShieldAlert size={12} style={{ marginRight: '4px' }} />}
                    {data.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No analytics modules found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
