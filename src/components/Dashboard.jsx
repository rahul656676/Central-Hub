import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, CheckCircle, Sliders, Camera, Car, User, Box, Flame, Droplets, Download, Filter, Search, Activity, Video, X, FileText, Mail, Bell } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useAlerts } from '../api/useAlerts';

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

// DYNAMIC SITE HEALTH HEATMAP COMPONENT
const SiteHealthHeatmap = () => {
  const locations = [
    'Premix', 'Impala', 'Lugoba', 'Container Depot', 'Lake Steel', 
    'AILL 1 & 2', 'Fuel Depot', 'Pipe & Cylinder', 'Lake Aviation', 
    'Lake Trans', 'Building Sol.', 'Kings Apt.', 'Showroom'
  ];
  
  const usecases = ['PPE', 'ANPR', 'Count', 'Loiter', 'Spillage', 'Fire', 'Prod.', 'Intrusion'];
  
  // Deterministic dummy data generation for consistent UI
  const data = locations.map(loc => {
    let totalHealth = 0;
    const scores = usecases.map(uc => {
       const hash = hashCode(loc + uc);
       // Base score around 85, plus/minus up to 15
       const score = Math.min(100, Math.max(0, 85 + (hash % 30) - 10));
       // If Lake Steel, make it offline/0
       if (loc === 'Lake Steel') return 0;
       totalHealth += score;
       return score;
    });
    return {
      name: loc,
      scores,
      avg: loc === 'Lake Steel' ? 0 : Math.round(totalHealth / usecases.length)
    };
  });

  const ucAvgs = usecases.map((uc, i) => {
    const sum = data.reduce((acc, row) => acc + row.scores[i], 0);
    return Math.round(sum / locations.length);
  });

  const getHeatColor = (val) => {
     if (val === 0) return '#f8fafc';
     if (val >= 95) return '#dcfce7'; // green
     if (val >= 85) return '#fef08a'; // yellow
     return '#fee2e2'; // red
  };
  const getTextColor = (val) => {
     if (val === 0) return '#94a3b8';
     if (val >= 95) return '#166534';
     if (val >= 85) return '#854d0e';
     return '#991b1b';
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '8px' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px', minWidth: '800px' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</th>
            {usecases.map(uc => (
              <th key={uc} style={{ padding: '8px', textAlign: 'center', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{uc}</th>
            ))}
            <th style={{ padding: '8px', textAlign: 'center', color: '#0f172a', fontSize: '0.75rem', fontWeight: 800 }}>AVG</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.name}>
              <td style={{ padding: '8px', fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '4px 0 0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: row.avg === 0 ? '#cbd5e1' : row.avg >= 90 ? '#22c55e' : row.avg >= 80 ? '#f59e0b' : '#ef4444' }}></div>
                  {row.name}
                </div>
              </td>
              {row.scores.map((score, i) => (
                <td key={i} style={{ padding: '2px', background: '#f8fafc' }}>
                  <div style={{ background: getHeatColor(score), color: getTextColor(score), padding: '6px 4px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                    {score === 0 ? '-' : score + '%'}
                  </div>
                </td>
              ))}
              <td style={{ padding: '2px', background: '#f8fafc', borderRadius: '0 4px 4px 0' }}>
                  <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '6px 4px', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                    {row.avg}%
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ padding: '12px 8px', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>GLOBAL AVG</td>
            {ucAvgs.map((avg, i) => (
                <td key={i} style={{ padding: '12px 2px' }}>
                  <div style={{ color: '#475569', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                    {avg}%
                  </div>
                </td>
            ))}
            <td style={{ padding: '12px 2px', textAlign: 'center', fontWeight: 800, color: '#2563eb', fontSize: '0.9rem' }}>
              {Math.round(ucAvgs.reduce((a,b)=>a+b,0)/ucAvgs.length)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

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
import ReportsView from './ReportsView';
import AlertRulesView from './AlertRulesView';

const Dashboard = ({ activeSolution, activeLocationFilter, searchQuery, userName, userRole }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { alerts: backendAlerts, loading: alertsLoading } = useAlerts(activeLocationFilter);

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
          {activeSolution === 'Reports' && <ReportsView />}
          {activeSolution === 'Alert Rules' && <AlertRulesView />}
          {activeSolution !== 'Configuration' && activeSolution !== 'Health Monitor' && activeSolution !== 'Reports' && activeSolution !== 'Alert Rules' && (
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
                  <h3 style={{ margin: 0 }}>Global Site Health & Compliance</h3>
                  <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>GLOBAL AVG HEALTH: 78%</span>
                </div>
                <div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>
              </div>

              {/* Right Side: Universal Event Feed */}
              