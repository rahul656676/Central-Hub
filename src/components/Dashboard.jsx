import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, CheckCircle, Sliders, Camera, Car, User, Box, Flame, Droplets, Download, Filter, Search, Activity, Video, X, FileText, Mail, Bell } from 'lucide-react';
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

// Dummy image placeholder component
const Thumbnail = ({ icon: Icon, color = '#94a3b8' }) => (
  <div className="thumbnail-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
    <Icon size={24} color={color} />
  </div>
);

// Reusable Toolbar for Tables
const TableToolbar = ({ title }) => (
  <div className="table-toolbar">
    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
      {title}
    </h3>
    <div className="toolbar-actions">
      <div style={{ position: 'relative' }}>
        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
        <input type="text" placeholder="Search logs..." style={{ padding: '8px 12px 8px 32px', borderRadius: '6px', border: '1px solid var(--card-border)', background: '#f8fafc', fontSize: '0.875rem' }} />
      </div>
      <select className="filter-dropdown">
        <option>Last 24 Hours</option>
        <option>Last 7 Days</option>
        <option>This Month</option>
      </select>
      <button type="button" className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Export PDF">
        <Download size={14} /> Export
      </button>
    </div>
  </div>
);

// INCIDENT DRAWER COMPONENT
const IncidentDrawer = ({ incident, onClose }) => {
  if (!incident) return null;

  const getDrawerImage = () => {
    switch(incident.type) {
      case 'ANPR': return "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80";
      case 'PPE Violation': return "https://images.unsplash.com/photo-1504917595217-d4bfd27eb278?auto=format&fit=crop&w=800&q=80";
      case 'Spillage': return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80";
      default: return "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?auto=format&fit=crop&w=800&q=80";
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className={`incident-drawer ${incident ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--accent-blue)" />
            Incident Report
          </h3>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="drawer-body">
          {/* Main Image Placeholder */}
          <div className="drawer-image-placeholder" style={{ padding: 0 }}>
            <img src={getDrawerImage()} alt="Incident Snapshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="status-dot alert" style={{ margin: 0 }}></span> Live Feed Captured
            </div>
          </div>

          <div className="drawer-section">
            <h4>Event Details</h4>
            <div className="drawer-grid">
              <div className="drawer-kv">
                <span className="k">Type</span>
                <span className="v">{incident.type}</span>
              </div>
              <div className="drawer-kv">
                <span className="k">Time</span>
                <span className="v">{incident.time}</span>
              </div>
              <div className="drawer-kv">
                <span className="k">Location</span>
                <span className="v">{incident.location || 'N/A'}</span>
              </div>
              <div className="drawer-kv">
                <span className="k">Confidence</span>
                <span className="v" style={{ color: 'var(--success)' }}>{incident.confidence || '98%'}</span>
              </div>
            </div>
          </div>

          {incident.type === 'ANPR' && (
            <div className="drawer-section">
              <h4>Vehicle Intelligence</h4>
              <div className="drawer-grid">
                <div className="drawer-kv">
                  <span className="k">License Plate</span>
                  <span className="v"><span className="license-plate">{incident.plate}</span></span>
                </div>
                <div className="drawer-kv">
                  <span className="k">Container ID</span>
                  <span className="v">{incident.container || 'NONE'}</span>
                </div>
                <div className="drawer-kv">
                  <span className="k">Registered Driver</span>
                  <span className="v">{incident.driver || 'Unknown'}</span>
                </div>
                <div className="drawer-kv">
                  <span className="k">Weighbridge Data</span>
                  <span className="v">{incident.weight || 'Pending'}</span>
                </div>
              </div>
            </div>
          )}

          {incident.type === 'PPE Violation' && (
            <div className="drawer-section">
              <h4>Worker Intelligence</h4>
              <div className="drawer-grid">
                <div className="drawer-kv">
                  <span className="k">Violation</span>
                  <span className="v" style={{ color: 'var(--danger)' }}>{incident.violation}</span>
                </div>
                <div className="drawer-kv">
                  <span className="k">Facial ID Match</span>
                  <span className="v">{incident.worker || 'EMP-0012'}</span>
                </div>
                <div className="drawer-kv">
                  <span className="k">Supervisor</span>
                  <span className="v">{incident.supervisor || 'Rajesh K.'}</span>
                </div>
                <div className="drawer-kv">
                  <span className="k">History</span>
                  <span className="v">2nd Offense this month</span>
                </div>
              </div>
            </div>
          )}

          {incident.type === 'Spillage' && (
            <div className="drawer-section">
              <h4>Spillage Intelligence</h4>
              <div className="drawer-grid">
                <div className="drawer-kv">
                  <span className="k">Material Suspected</span>
                  <span className="v">{incident.material}</span>
                </div>
                <div className="drawer-kv">
                  <span className="k">Estimated Area</span>
                  <span className="v">2.5 sq meters</span>
                </div>
                <div className="drawer-kv">
                  <span className="k">Hazard Level</span>
                  <span className="v" style={{ color: incident.hazard === 'High' ? 'var(--danger)' : 'var(--warning)' }}>{incident.hazard}</span>
                </div>
              </div>
            </div>
          )}

          <div className="drawer-section" style={{ marginTop: '40px' }}>
            <h4 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>Operator Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="action-btn" style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', gap: '8px', background: 'var(--danger)', color: 'white' }}>
                <AlertTriangle size={16} /> Flag as Critical
              </button>
              <button className="action-btn" style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Mail size={16} /> Email Supervisor Report
              </button>
              <button className="action-btn" style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', gap: '8px', background: '#f8fafc', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
                <Download size={16} /> Download Full Video Snippet
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

import ConfigurationView from './ConfigurationView';
import HealthMonitorView from './HealthMonitorView';

const Dashboard = ({ activeSolution, activeLocationFilter, searchQuery, userName, userRole }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions));
  }, []);

  const locHash = hashCode(activeLocationFilter);
  const m = activeLocationFilter === 'All Locations' ? 1 : 0.8 + (locHash % 70) / 100;

  const handleRowClick = (incidentData) => {
    setSelectedIncident(incidentData);
  };

  const isSystemView = ['Configuration', 'Alert Rules', 'Reports', 'Health Monitor'].includes(activeSolution);
  if (isSystemView) {
    return (
      <div className="dashboard-area animate-fade-in">
        <div className="page-header">
          <div>
            <h1>{activeSolution}</h1>
            <p>System Management Panel</p>
          </div>
        </div>
        <div className="dashboard-grid">
          {activeSolution === 'Configuration' && <ConfigurationView />}
          {activeSolution === 'Health Monitor' && <HealthMonitorView />}
          {activeSolution !== 'Configuration' && activeSolution !== 'Health Monitor' && (
            <div className="card full-width-card" style={{ textAlign: 'center', padding: '60px' }}>
              <h2 style={{ color: 'var(--text-secondary)' }}>{activeSolution} View</h2>
              <p style={{ color: 'var(--text-muted)' }}>Advanced configuration module goes here.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderSolutionView = () => {
    switch (activeSolution) {
      case 'Overview':
        return (
          <>
            {/* Top Metrics */}
            <div className="card one-third-card">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}><Activity size={20} /></div>
                <div><div className="card-title">Live System Status</div><div className="card-desc">Overall health</div></div>
              </div>
              <div className="metric-value success" style={{ display: 'flex', alignItems: 'center' }}>
                <span className="status-dot live"></span> Operational
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>99.98% Uptime across {activeLocationFilter}</p>
            </div>
            
            <div className="card one-third-card">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: '#fee2e2', color: '#ef4444' }}><AlertTriangle size={20} /></div>
                <div><div className="card-title">Critical Alerts Today</div><div className="card-desc">Needs attention</div></div>
              </div>
              <div className="metric-value danger" style={{ display: 'flex', alignItems: 'center' }}>
                <span className="status-dot alert"></span> {Math.floor(14 * m)}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>+3 from yesterday</p>
            </div>
            
            <div className="card one-third-card">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}><Video size={20} /></div>
                <div><div className="card-title">Active AI Cameras</div><div className="card-desc">Currently streaming</div></div>
              </div>
              <div className="metric-value accent">42 / 42</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>All edge nodes connected</p>
            </div>
            
            {/* Command Center Layout */}
            <div className="card full-width-card split-card" style={{ marginTop: '24px' }}>
              
              {/* Left Side: Camera Matrix */}
              <div className="split-card-left" style={{ flex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0 }}>Command Center: Live Feeds</h3>
                  <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>LIVE</span>
                </div>
                <div className="data-grid camera-matrix" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginTop: 0 }}>
                  <div style={{ background: '#0f172a', height: '180px', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 2 }}>CAM-01: Main Gate (ANPR)</div>
                    <img src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=400&q=80" alt="Camera Feed" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  </div>
                  <div style={{ background: '#0f172a', height: '180px', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 2 }}>CAM-04: Assembly Area (PPE)</div>
                    <img src="/cam4.png" alt="Camera Feed" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  </div>
                  <div style={{ background: '#0f172a', height: '180px', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 2 }}>CAM-09: Perimeter Fence</div>
                    <img src="/cam9.jpg" alt="Camera Feed" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  </div>
                  <div style={{ background: '#0f172a', height: '180px', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 2 }}>CAM-12: Chemical Depot</div>
                    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80" alt="Camera Feed" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  </div>
                </div>
              </div>

              {/* Right Side: Universal Event Feed */}
              <div className="split-card-right" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '16px', marginTop: 0 }}>Universal Event Ticker</h3>
                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px', paddingRight: '8px' }}>
                  
                  {/* Event Item */}
                  <div style={{ padding: '12px', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', marginTop: '6px' }}></div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Intrusion Detected</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Perimeter Fence North - Human</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Just now</div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '12px', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', marginTop: '6px' }}></div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>PPE Violation: No Helmet</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Assembly Area - Zone B</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>2 mins ago</div>
                    </div>
                  </div>

                  <div style={{ padding: '12px', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '6px' }}></div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>ANPR: Authorized Vehicle</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Plate: T 123 ABC - Main Gate</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>5 mins ago</div>
                    </div>
                  </div>

                  <div style={{ padding: '12px', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '6px' }}></div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>System Sync Complete</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>All 42 nodes responding</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>15 mins ago</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Cross-Site Comparisons (HQ Only) */}
            {userRole === 'HEAD_OFFICE' && activeLocationFilter === 'All Locations' && (
              <div className="card full-width-card" style={{ marginTop: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Cross-Site Alerts Comparison (Last 7 Days)</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { site: 'Premix', ppe: 45, loitering: 20, anpr: 12 },
                      { site: 'Lugoba', ppe: 85, loitering: 45, anpr: 32 },
                      { site: 'Container Depot', ppe: 25, loitering: 10, anpr: 65 },
                      { site: 'Impala', ppe: 30, loitering: 15, anpr: 8 },
                      { site: 'AILL', ppe: 60, loitering: 35, anpr: 20 },
                    ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="site" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="ppe" name="PPE Violations" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="loitering" name="Loitering Alerts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="anpr" name="ANPR Mismatches" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
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
            <div className="card full-width-card split-card">
              <div className="split-card-left">
                <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Compliance Metrics</h3>
                <div className="metric-grid">
                  <div className="metric-box"><div className="metric-label">Overall Compliance</div><div className="metric-value accent">{(92.4 + (m%2)).toFixed(1)}%</div></div>
                  <div className="metric-box"><div className="metric-label">Total Violations</div><div className="metric-value danger">{Math.floor(160 * m)}</div></div>
                  <div className="metric-box"><div className="metric-label">Workers Scanned</div><div className="metric-value">{Math.floor(2140 * m)}</div></div>
                </div>
              </div>
              <div className="split-card-right">
                <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Violation Breakdown</h3>
                <div style={{ height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ppeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {ppeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="card full-width-card" style={{ marginTop: '24px' }}>
              <TableToolbar title="Recent Violations Log" />
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Snapshot</th>
                      <th>Timestamp</th>
                      <th>Camera Location</th>
                      <th>Violation Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr onClick={() => handleRowClick({ type: 'PPE Violation', time: 'Today, 10:42 AM', camera: 'Gate 4 - Loading', location: 'Gate 4 - Loading', violation: 'No Helmet', worker: 'EMP-0892', supervisor: 'Rajesh K.' })}>
                      <td><Thumbnail icon={User} color="#ef4444" /></td>
                      <td>Today, 10:42 AM</td>
                      <td>Gate 4 - Loading</td>
                      <td><span style={{ color: '#ef4444', fontWeight: 600 }}>No Helmet</span></td>
                      <td><button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>Alert Supervisor</button></td>
                    </tr>
                    <tr onClick={() => handleRowClick({ type: 'PPE Violation', time: 'Today, 09:15 AM', camera: 'Area B - Processing', location: 'Area B - Processing', violation: 'No Vest', worker: 'EMP-1044', supervisor: 'Amit S.' })}>
                      <td><Thumbnail icon={User} color="#f59e0b" /></td>
                      <td>Today, 09:15 AM</td>
                      <td>Area B - Processing</td>
                      <td><span style={{ color: '#f59e0b', fontWeight: 600 }}>No Vest</span></td>
                      <td><button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>Alert Supervisor</button></td>
                    </tr>
                    <tr onClick={() => handleRowClick({ type: 'PPE Violation', time: 'Yesterday, 16:30 PM', camera: 'Gate 1 - Main', location: 'Gate 1 - Main', violation: 'No Helmet', worker: 'EMP-0211', supervisor: 'Sanjay M.' })}>
                      <td><Thumbnail icon={User} color="#ef4444" /></td>
                      <td>Yesterday, 16:30 PM</td>
                      <td>Gate 1 - Main</td>
                      <td><span style={{ color: '#ef4444', fontWeight: 600 }}>No Helmet</span></td>
                      <td><button type="button" className="action-btn" style={{ background: '#e2e8f0' }} onClick={(e) => e.stopPropagation()}>Resolved</button></td>
                    </tr>
                  </tbody>
                </table>
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
          <>
            <div className="card full-width-card">
              <h3 style={{ marginBottom: '20px' }}>Vehicle & Container Throughput</h3>
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

            <div className="card full-width-card" style={{ marginTop: '24px' }}>
              <TableToolbar title="Live Gate Activity Log" />
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Number Plate</th>
                      <th>Container ID</th>
                      <th>In Time</th>
                      <th>Out Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr onClick={() => handleRowClick({ type: 'ANPR', time: '14:02:15', location: 'Main Gate Inbound', camera: 'CAM-01', plate: 'T 123 ABC', container: 'MSKU 1928374', driver: 'Rahul Kumar (Auth)', weight: '14,250 kg' })}>
                      <td><Thumbnail icon={Car} color="#3b82f6" /></td>
                      <td><span className="license-plate">T 123 ABC</span></td>
                      <td>MSKU 1928374</td>
                      <td>14:02:15</td>
                      <td>-</td>
                      <td><span style={{ color: '#10b981', fontWeight: 600 }}>Matched</span></td>
                    </tr>
                    <tr onClick={() => handleRowClick({ type: 'ANPR', time: '13:45:00', location: 'Gate 2 Outbound', camera: 'CAM-03', plate: 'T 987 XYZ', container: 'NONE', driver: 'Unknown Visitor', weight: '2,100 kg' })}>
                      <td><Thumbnail icon={Car} color="#3b82f6" /></td>
                      <td><span className="license-plate">T 987 XYZ</span></td>
                      <td>NONE</td>
                      <td>13:45:00</td>
                      <td>14:10:22</td>
                      <td><span style={{ color: '#64748b', fontWeight: 600 }}>Visitor</span></td>
                    </tr>
                    <tr onClick={() => handleRowClick({ type: 'ANPR', time: '12:30:00', location: 'Gate 4 Cargo', camera: 'CAM-11', plate: 'T 444 DEF', container: 'CMAU 9991112', driver: 'Sandeep Singh', weight: 'ERROR' })}>
                      <td><Thumbnail icon={Car} color="#ef4444" /></td>
                      <td><span className="license-plate">T 444 DEF</span></td>
                      <td>CMAU 9991112</td>
                      <td>12:30:00</td>
                      <td>-</td>
                      <td><span style={{ color: '#ef4444', fontWeight: 600 }}>Mismatch Error</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
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
          <>
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

            <div className="card full-width-card" style={{ marginTop: '24px' }}>
              <TableToolbar title="Shift Performance Log" />
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Line / Batch ID</th>
                      <th>Item Type</th>
                      <th>Target Quota</th>
                      <th>Actual Counted</th>
                      <th>Rejected/Defects</th>
                      <th>Last Scanned</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Line 1 - BTH-092</td>
                      <td><div style={{display:'flex', gap:'8px', alignItems:'center'}}><Box size={16}/> Sacks (50kg)</div></td>
                      <td>2,000</td>
                      <td>1,842</td>
                      <td style={{ color: '#ef4444' }}>14</td>
                      <td>Just now</td>
                    </tr>
                    <tr>
                      <td>Line 2 - BTH-093</td>
                      <td><div style={{display:'flex', gap:'8px', alignItems:'center'}}><Box size={16}/> Cartons</div></td>
                      <td>1,500</td>
                      <td>1,505</td>
                      <td style={{ color: '#10b981' }}>2</td>
                      <td>2 mins ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
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
          <>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Active Loitering Threats</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="status-dot alert"></span> <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Live Monitoring</span>
              </div>
            </div>
            
            <div className="data-grid">
              <div className="data-grid-card">
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <Thumbnail icon={User} color="#ef4444" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Perimeter Fence - North</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Detected 10 mins ago</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#ef4444', fontWeight: 600 }}>Dwell: 14 mins</div>
                  <button type="button" className="action-btn">Dispatch Guard</button>
                </div>
              </div>
              <div className="data-grid-card">
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <Thumbnail icon={User} color="#f59e0b" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Loading Bay C</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Detected 5 mins ago</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 600 }}>Dwell: 6 mins</div>
                  <button type="button" className="action-btn">Review Feed</button>
                </div>
              </div>
            </div>
          </>
        );

      case 'Spillage Control':
        const spillData = [
          { name: 'Chemical/Hazardous', value: Math.floor(2*m) },
          { name: 'Oil/Lubricant', value: Math.floor(5*m) },
          { name: 'Water', value: Math.floor(14*m) },
          { name: 'Dry Powder/Material', value: Math.floor(8*m) },
        ];
        return (
          <>
            <div className="card full-width-card split-card">
              <div className="split-card-left">
                <h3 style={{ marginBottom: '20px' }}>Spillage Incident Breakdown</h3>
                <div className="metric-grid">
                  <div className="metric-box"><div className="metric-label">Spills Detected (Week)</div><div className="metric-value danger">{Math.floor(29 * m)}</div></div>
                  <div className="metric-box"><div className="metric-label">Avg Clean-up Time</div><div className="metric-value accent">{Math.floor(14 * m)} mins</div></div>
                  <div className="metric-box"><div className="metric-label">Unresolved Spills</div><div className="metric-value warning">1</div></div>
                </div>
              </div>
              <div className="split-card-right">
                <h3 style={{ marginBottom: '10px' }}>Spill Types Detected</h3>
                <div style={{ height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={spillData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        <Cell fill="#ef4444" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#8b5cf6" />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card full-width-card" style={{ marginTop: '24px' }}>
              <TableToolbar title="Incident Response Log" />
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Spill Snapshot</th>
                      <th>Location</th>
                      <th>Material Suspected</th>
                      <th>Detected At</th>
                      <th>Cleared At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr onClick={() => handleRowClick({ type: 'Spillage', time: '14:22:00', camera: 'CAM-12', location: 'Chemical Storage B', material: 'Hazardous Liquid (Acidic)', hazard: 'High' })}>
                      <td><Thumbnail icon={Droplets} color="#ef4444" /></td>
                      <td>Chemical Storage B</td>
                      <td><span style={{ color: '#ef4444', fontWeight: 600 }}>Hazardous Liquid</span></td>
                      <td>14:22:00</td>
                      <td><span style={{ color: '#f59e0b' }}>Pending</span></td>
                      <td><button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>Dispatch Cleaning Crew</button></td>
                    </tr>
                    <tr onClick={() => handleRowClick({ type: 'Spillage', time: '09:15:00', camera: 'CAM-08', location: 'Forklift Pathway 2', material: 'Oil / Lubricant', hazard: 'Medium' })}>
                      <td><Thumbnail icon={Droplets} color="#f59e0b" /></td>
                      <td>Forklift Pathway 2</td>
                      <td>Oil / Lubricant</td>
                      <td>09:15:00</td>
                      <td>09:45:00</td>
                      <td><button type="button" className="action-btn" style={{ background: '#e2e8f0' }} onClick={(e) => e.stopPropagation()}>Resolved</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'Fire & Smoke':
        const fireData = [
          { time: '00:00', temp: 22, critical: 60 },
          { time: '04:00', temp: 21, critical: 60 },
          { time: '08:00', temp: 25, critical: 60 },
          { time: '12:00', temp: 34, critical: 60 },
          { time: '14:00', temp: 58, critical: 60 },
          { time: '16:00', temp: 30, critical: 60 },
          { time: '20:00', temp: 26, critical: 60 },
        ];
        return (
          <>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Live Thermal Sensors</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="status-dot live"></span> <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sensors Online</span>
              </div>
            </div>
            
            <div className="data-grid">
              <div className="data-grid-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 600 }}>Zone A - Storage</div>
                  <Flame size={20} color="#10b981" />
                </div>
                <div style={{ background: '#0f172a', height: '100px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  [Infrared Feed Normal]
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Current Temp:</span>
                  <span style={{ fontWeight: 600 }}>24°C</span>
                </div>
              </div>
              <div className="data-grid-card" style={{ border: '1px solid #f59e0b', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 600 }}>Zone C - Generator</div>
                  <Flame size={20} color="#f59e0b" />
                </div>
                <div style={{ background: '#0f172a', height: '100px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  [Infrared Heat Spot Detected]
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Current Temp:</span>
                  <span style={{ fontWeight: 600, color: '#f59e0b' }}>58°C</span>
                </div>
              </div>
            </div>
          </>
        );

      case 'Productivity':
        const prodData = [
          { zone: 'Assembly Line 1', active: Math.floor(320*m), idle: Math.floor(40*m) },
          { zone: 'Packaging', active: Math.floor(280*m), idle: Math.floor(60*m) },
          { zone: 'Loading Bay', active: Math.floor(190*m), idle: Math.floor(110*m) },
          { zone: 'Forklift Path', active: Math.floor(210*m), idle: Math.floor(50*m) },
        ];
        return (
          <>
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

            <div className="card full-width-card" style={{ marginTop: '24px' }}>
              <TableToolbar title="Workstation Live Status" />
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Station Name</th>
                      <th>Status</th>
                      <th>Idle Duration</th>
                      <th>Workers Present</th>
                      <th>Supervisor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Assembly Line 1</td>
                      <td><span className="status-dot live"></span><span style={{ color: '#10b981', fontWeight: 600 }}>Active</span></td>
                      <td>-</td>
                      <td>12</td>
                      <td>John D.</td>
                    </tr>
                    <tr>
                      <td>Loading Bay</td>
                      <td><span className="status-dot alert"></span><span style={{ color: '#94a3b8', fontWeight: 600 }}>Idle</span></td>
                      <td><span style={{ color: '#ef4444' }}>45 mins</span></td>
                      <td>3</td>
                      <td>Sarah K.</td>
                    </tr>
                    <tr>
                      <td>Packaging Area</td>
                      <td><span className="status-dot live"></span><span style={{ color: '#10b981', fontWeight: 600 }}>Active</span></td>
                      <td>-</td>
                      <td>8</td>
                      <td>Mike R.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
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
          <>
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

            <div className="card full-width-card" style={{ marginTop: '24px' }}>
              <TableToolbar title="Perimeter Security Log" />
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Intrusion Snapshot</th>
                      <th>Camera ID</th>
                      <th>Classification</th>
                      <th>Confidence</th>
                      <th>Time of Breach</th>
                      <th>Threat Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><Thumbnail icon={User} color="#ef4444" /></td>
                      <td>Fence-Cam 04</td>
                      <td>Human</td>
                      <td>98%</td>
                      <td>02:14:00 AM</td>
                      <td><span style={{ color: '#ef4444', fontWeight: 600 }}>High</span></td>
                    </tr>
                    <tr>
                      <td><Thumbnail icon={Car} color="#f59e0b" /></td>
                      <td>Gate 3 Outer</td>
                      <td>Vehicle</td>
                      <td>91%</td>
                      <td>04:30:15 AM</td>
                      <td><span style={{ color: '#f59e0b', fontWeight: 600 }}>Medium</span></td>
                    </tr>
                    <tr>
                      <td><Thumbnail icon={Camera} color="#94a3b8" /></td>
                      <td>Fence-Cam 12</td>
                      <td>Animal (Dog)</td>
                      <td>85%</td>
                      <td>05:45:00 AM</td>
                      <td><span style={{ color: '#94a3b8', fontWeight: 600 }}>Low (Ignored)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
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

      <div className="dashboard-grid animate-fade-in" key={activeSolution}>
        {renderSolutionView()}
      </div>

      <IncidentDrawer incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
    </div>
  );
};

export default Dashboard;
