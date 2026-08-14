import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, AlertTriangle, CheckCircle, ShieldAlert, Sliders } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

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

// Colors for Recharts
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0891b2'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="custom-tooltip-value" style={{ color: entry.color }}>
            {entry.name}: <span style={{ fontWeight: 600 }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ---------------------------------------------------------
// Sub-components for System Management Views (Kept from before but light-themed)
// ---------------------------------------------------------
const ConfigurationView = () => {
  const [activeTab, setActiveTab] = useState('General');
  return (
    <div className="card full-width-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Sliders size={28} color="var(--accent-blue)" />
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>System Configuration</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
            Adjust global settings, manage user access, and configure API integrations.
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', background: '#f8fafc' }}>
        {['General', 'User Roles', 'Camera Feeds'].map(tab => (
          <button 
            type="button"
            key={tab}
            onClick={(e) => { e.preventDefault(); setActiveTab(tab); }}
            style={{ 
              flex: 1, padding: '16px', background: activeTab === tab ? '#ffffff' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid var(--accent-blue)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
              cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400', transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '32px', minHeight: '300px', background: '#ffffff' }}>
        {activeTab === 'General' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>System Name</label>
              <input type="text" defaultValue="Lake Group Central Hub" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
            </div>
            <div>
              <button type="button" onClick={(e) => e.preventDefault()} style={{ padding: '10px 24px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Save Changes</button>
            </div>
          </div>
        )}
        {activeTab === 'User Roles' && (
          <div style={{ color: 'var(--text-secondary)' }}>User roles management interface.</div>
        )}
        {activeTab === 'Camera Feeds' && (
          <div style={{ color: 'var(--text-secondary)' }}>RTSP stream configuration interface.</div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------
const Dashboard = ({ activeSolution, activeLocationFilter, searchQuery }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions));
  }, []);

  // Use the location filter to generate a deterministic random multiplier (0.8 to 1.5)
  const locHash = hashCode(activeLocationFilter);
  const m = activeLocationFilter === 'All Locations' ? 1 : 0.8 + (locHash % 70) / 100;

  // Render System Management views if selected
  const isSystemView = ['Configuration', 'Alert Rules', 'Reports', 'Fleet Admin'].includes(activeSolution);
  if (isSystemView) {
    return (
      <div className="dashboard-area">
        <div className="page-header">
          <div>
            <h1>{activeSolution}</h1>
            <p>System Management Panel</p>
          </div>
        </div>
        <div className="dashboard-grid">
          {activeSolution === 'Configuration' && <ConfigurationView />}
          {activeSolution !== 'Configuration' && (
            <div className="card full-width-card" style={{ textAlign: 'center', padding: '60px' }}>
              <h2 style={{ color: 'var(--text-secondary)' }}>{activeSolution} View</h2>
              <p style={{ color: 'var(--text-muted)' }}>Advanced configuration module goes here.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Solution-Specific Data Generation (Mutated by Location multiplier 'm')
  // ---------------------------------------------------------
  
  const renderSolutionView = () => {
    switch (activeSolution) {
      case 'Overview':
        const trendData = [
          { name: 'Mon', alerts: Math.floor(120 * m), processed: Math.floor(4000 * m) },
          { name: 'Tue', alerts: Math.floor(150 * m), processed: Math.floor(3000 * m) },
          { name: 'Wed', alerts: Math.floor(90 * m), processed: Math.floor(5000 * m) },
          { name: 'Thu', alerts: Math.floor(200 * m), processed: Math.floor(4500 * m) },
          { name: 'Fri', alerts: Math.floor(180 * m), processed: Math.floor(4800 * m) },
          { name: 'Sat', alerts: Math.floor(80 * m), processed: Math.floor(2000 * m) },
          { name: 'Sun', alerts: Math.floor(60 * m), processed: Math.floor(1500 * m) },
        ];
        
        return (
          <>
            <div className="card one-third-card">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}><CheckCircle size={20} /></div>
                <div><div className="card-title">System Status</div><div className="card-desc">Overall health</div></div>
              </div>
              <div className="metric-value success">Operational</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>99.98% Uptime across {activeLocationFilter}</p>
            </div>
            
            <div className="card one-third-card">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: '#fee2e2', color: '#ef4444' }}><AlertTriangle size={20} /></div>
                <div><div className="card-title">Total Alerts Today</div><div className="card-desc">Needs attention</div></div>
              </div>
              <div className="metric-value danger">{Math.floor(142 * m)}</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>+12% from yesterday</p>
            </div>
            
            <div className="card one-third-card">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}><Sliders size={20} /></div>
                <div><div className="card-title">Active AI Modules</div><div className="card-desc">Currently running</div></div>
              </div>
              <div className="metric-value accent">8 / 8</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>All edge nodes connected</p>
            </div>
            
            <div className="card full-width-card">
              <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Weekly Alert vs Processing Trend</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="processed" name="Total Events Processed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProcessed)" />
                    <Area type="monotone" dataKey="alerts" name="Alerts Triggered" stroke="#ef4444" fillOpacity={1} fill="url(#colorAlerts)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        );
        
      case 'PPE Monitoring':
        const ppeData = [
          { name: 'No Helmet', value: Math.floor(45 * m) },
          { name: 'No Vest', value: Math.floor(82 * m) },
          { name: 'No Gloves', value: Math.floor(21 * m) },
          { name: 'No Boots', value: Math.floor(12 * m) },
        ];
        
        return (
          <>
            <div className="card full-width-card" style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Compliance Metrics</h3>
                <div className="metric-grid">
                  <div className="metric-box">
                    <div className="metric-label">Overall Compliance</div>
                    <div className="metric-value accent">{(92.4 + (m%2)).toFixed(1)}%</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Total Violations</div>
                    <div className="metric-value danger">{Math.floor(160 * m)}</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-label">Workers Scanned</div>
                    <div className="metric-value">{Math.floor(2140 * m)}</div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid var(--card-border)', paddingLeft: '24px' }}>
                <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Violation Breakdown</h3>
                <div style={{ height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ppeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {ppeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        );

      case 'ANPR & Containers':
        const anprData = [
          { time: '08:00', vehicles: Math.floor(40*m), containers: Math.floor(35*m) },
          { time: '10:00', vehicles: Math.floor(85*m), containers: Math.floor(80*m) },
          { time: '12:00', vehicles: Math.floor(120*m), containers: Math.floor(110*m) },
          { time: '14:00', vehicles: Math.floor(150*m), containers: Math.floor(145*m) },
          { time: '16:00', vehicles: Math.floor(90*m), containers: Math.floor(85*m) },
          { time: '18:00', vehicles: Math.floor(30*m), containers: Math.floor(25*m) },
        ];
        
        return (
          <div className="card full-width-card">
            <h3 style={{ marginBottom: '20px' }}>Vehicle & Container Throughput (Today)</h3>
            <div className="metric-grid">
              <div className="metric-box"><div className="metric-label">Plates Scanned</div><div className="metric-value accent">{Math.floor(515 * m)}</div></div>
              <div className="metric-box"><div className="metric-label">Containers Matched</div><div className="metric-value success">{Math.floor(480 * m)}</div></div>
              <div className="metric-box"><div className="metric-label">Mismatches/Errors</div><div className="metric-value danger">{Math.floor(12 * m)}</div></div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={anprData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="vehicles" name="Vehicles Processed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="containers" name="Containers Tracked" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'Counting & Throughput':
        const countingData = [
          { time: '08:00', actual: Math.floor(120*m), target: 150 },
          { time: '10:00', actual: Math.floor(180*m), target: 150 },
          { time: '12:00', actual: Math.floor(190*m), target: 200 },
          { time: '14:00', actual: Math.floor(140*m), target: 150 },
          { time: '16:00', actual: Math.floor(210*m), target: 200 },
          { time: '18:00', actual: Math.floor(160*m), target: 150 },
        ];
        return (
          <div className="card full-width-card">
            <h3 style={{ marginBottom: '20px' }}>Production Throughput (Target vs Actual)</h3>
            <div className="metric-grid">
              <div className="metric-box"><div className="metric-label">Items Counted Today</div><div className="metric-value accent">{Math.floor(8450 * m)}</div></div>
              <div className="metric-box"><div className="metric-label">Current Rate (Items/Hr)</div><div className="metric-value">{Math.floor(412 * m)}</div></div>
              <div className="metric-box"><div className="metric-label">AI Accuracy</div><div className="metric-value success">99.8%</div></div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={countingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="target" name="Target Throughput" stroke="#94a3b8" strokeDasharray="5 5" fill="none" />
                  <Area type="monotone" dataKey="actual" name="Actual Counted" stroke="#8b5cf6" fillOpacity={0.2} fill="#8b5cf6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'Loitering Detection':
        const loiteringData = [
          { zone: 'Gate A', alerts: Math.floor(12*m) },
          { zone: 'Gate B', alerts: Math.floor(3*m) },
          { zone: 'Perimeter Fence', alerts: Math.floor(25*m) },
          { zone: 'Loading Bay', alerts: Math.floor(8*m) },
          { zone: 'Restricted Area 1', alerts: Math.floor(18*m) },
        ];
        return (
          <div className="card full-width-card">
            <h3 style={{ marginBottom: '20px' }}>Loitering Alerts by Zone</h3>
            <div className="metric-grid">
              <div className="metric-box"><div className="metric-label">Total Loitering Alerts</div><div className="metric-value danger">{Math.floor(66 * m)}</div></div>
              <div className="metric-box"><div className="metric-label">Avg Dwell Time</div><div className="metric-value accent">{Math.floor(4.2 * m)} mins</div></div>
              <div className="metric-box"><div className="metric-label">Most Active Zone</div><div className="metric-value" style={{fontSize:'1.1rem', marginTop:'8px'}}>Perimeter Fence</div></div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loiteringData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="zone" type="category" stroke="#94a3b8" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="alerts" name="Total Alerts" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'Spillage Control':
        const spillData = [
          { name: 'Chemical/Hazardous', value: Math.floor(2*m) },
          { name: 'Oil/Lubricant', value: Math.floor(5*m) },
          { name: 'Water', value: Math.floor(14*m) },
          { name: 'Dry Powder/Material', value: Math.floor(8*m) },
        ];
        return (
          <div className="card full-width-card" style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '20px' }}>Spillage Incident Breakdown</h3>
              <div className="metric-grid">
                <div className="metric-box"><div className="metric-label">Spills Detected (Week)</div><div className="metric-value danger">{Math.floor(29 * m)}</div></div>
                <div className="metric-box"><div className="metric-label">Avg Clean-up Time</div><div className="metric-value accent">{Math.floor(14 * m)} mins</div></div>
                <div className="metric-box"><div className="metric-label">Unresolved Spills</div><div className="metric-value warning">1</div></div>
              </div>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid var(--card-border)', paddingLeft: '24px' }}>
              <h3 style={{ marginBottom: '10px' }}>Spill Types Detected</h3>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={spillData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#ef4444" /> {/* Hazardous */}
                      <Cell fill="#f59e0b" /> {/* Oil */}
                      <Cell fill="#3b82f6" /> {/* Water */}
                      <Cell fill="#8b5cf6" /> {/* Dry */}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'Fire & Smoke':
        const fireData = [
          { time: '00:00', temp: 22, critical: 60 },
          { time: '04:00', temp: 21, critical: 60 },
          { time: '08:00', temp: 25, critical: 60 },
          { time: '12:00', temp: 34, critical: 60 },
          { time: '14:00', temp: 58, critical: 60 }, // Spike!
          { time: '16:00', temp: 30, critical: 60 },
          { time: '20:00', temp: 26, critical: 60 },
        ];
        return (
          <div className="card full-width-card">
            <h3 style={{ marginBottom: '20px' }}>Thermal & Smoke Sensor Trends</h3>
            <div className="metric-grid">
              <div className="metric-box"><div className="metric-label">Active Sensors</div><div className="metric-value success">42 / 42</div></div>
              <div className="metric-box"><div className="metric-label">Temperature Anomalies</div><div className="metric-value warning">1</div></div>
              <div className="metric-box"><div className="metric-label">False Alarms Filtered</div><div className="metric-value accent">3</div></div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fireData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 80]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="critical" name="Critical Threshold (°C)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="temp" name="Max Temp Detected (°C)" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'Productivity':
        const prodData = [
          { zone: 'Assembly Line 1', active: Math.floor(320*m), idle: Math.floor(40*m) },
          { zone: 'Packaging', active: Math.floor(280*m), idle: Math.floor(60*m) },
          { zone: 'Loading Bay', active: Math.floor(190*m), idle: Math.floor(110*m) },
          { zone: 'Forklift Path', active: Math.floor(210*m), idle: Math.floor(50*m) },
        ];
        return (
          <div className="card full-width-card">
            <h3 style={{ marginBottom: '20px' }}>Workforce Efficiency by Zone</h3>
            <div className="metric-grid">
              <div className="metric-box"><div className="metric-label">Active Man-Hours</div><div className="metric-value accent">{Math.floor(16.6 * m)}K</div></div>
              <div className="metric-box"><div className="metric-label">Avg Idle Time</div><div className="metric-value warning">18%</div></div>
              <div className="metric-box"><div className="metric-label">Overall Efficiency</div><div className="metric-value success">82%</div></div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="zone" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="active" stackId="a" name="Active Time (Mins)" fill="#0ea5e9" />
                  <Bar dataKey="idle" stackId="a" name="Idle Time (Mins)" fill="#e2e8f0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'Intrusion Alerts':
        const intrudData = [
          { time: '00:00', breaches: Math.floor(6*m) },
          { time: '04:00', breaches: Math.floor(8*m) },
          { time: '08:00', breaches: 0 },
          { time: '12:00', breaches: 0 },
          { time: '16:00', breaches: Math.floor(1*m) },
          { time: '20:00', breaches: Math.floor(4*m) },
          { time: '24:00', breaches: Math.floor(7*m) },
        ];
        return (
          <div className="card full-width-card">
            <h3 style={{ marginBottom: '20px' }}>Perimeter Breaches by Time of Day</h3>
            <div className="metric-grid">
              <div className="metric-box"><div className="metric-label">Breaches Detected (Week)</div><div className="metric-value danger">{Math.floor(26 * m)}</div></div>
              <div className="metric-box"><div className="metric-label">False Positives (Wildlife)</div><div className="metric-value">14</div></div>
              <div className="metric-box"><div className="metric-label">Active Patrol Dispatches</div><div className="metric-value accent">{Math.floor(8 * m)}</div></div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={intrudData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="breaches" name="Confirmed Intrusions" stroke="#eab308" fillOpacity={0.2} fill="#eab308" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-area">
      <div className="page-header">
        <div>
          <h1>{activeLocationFilter !== 'All Locations' ? activeLocationFilter : 'Global Overview'}</h1>
          <p>Analyzing: <strong style={{color: 'var(--accent-blue)'}}>{activeSolution}</strong></p>
        </div>
        <div className="date-display">
          <Calendar size={16} />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {renderSolutionView()}
      </div>
    </div>
  );
};

export default Dashboard;
