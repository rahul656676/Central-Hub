import React, { useState } from 'react';
import { FileText, Download, Calendar, MapPin, Filter } from 'lucide-react';

const ReportsView = () => {
  const [location, setLocation] = useState('All Locations');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dummyData = [
    { id: 1, date: '2026-08-27 10:45 AM', location: 'Lugoba', type: 'PPE Violation', detail: 'No Helmet Detected' },
    { id: 2, date: '2026-08-27 09:12 AM', location: 'Premix', type: 'Loitering', detail: 'Person loitering in Zone B for > 2 mins' },
    { id: 3, date: '2026-08-26 16:30 PM', location: 'Impala', type: 'Fire & Smoke', detail: 'High temp anomaly (55°C) in Generator Room' },
    { id: 4, date: '2026-08-26 14:15 PM', location: 'Lugoba', type: 'ANPR', detail: 'Unauthorized vehicle plate (T 987 XYZ)' },
    { id: 5, date: '2026-08-25 11:20 AM', location: 'Container Depot', type: 'Spillage', detail: 'Chemical spill detected in Sector 4' }
  ];

  // Filtering based on UI states
  const filteredData = dummyData.filter(item => {
    if (location !== 'All Locations' && item.location !== location) return false;
    if (startDate && new Date(item.date.split(' ')[0]) < new Date(startDate)) return false;
    if (endDate && new Date(item.date.split(' ')[0]) > new Date(endDate)) return false;
    return true;
  });

  const handleExport = () => {
    // Calling the CSV export endpoint from our backend
    // Since backend might be offline in demo, we can just trigger a download prompt or window.open
    window.open('http://localhost:8000/reports/export-alerts?format=csv', '_blank');
  };

  return (
    <div className="card full-width-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <FileText size={28} color="var(--accent-blue)" />
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>System Reports & Analytics</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
              Filter incident data date-wise and location-wise. Export to Excel/CSV.
            </p>
          </div>
        </div>
        <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
          <Download size={18} /> Export to Excel
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        {/* FILTERS */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', background: '#f1f5f9', padding: '16px', borderRadius: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}><MapPin size={14} style={{display:'inline', marginBottom:'-2px'}}/> Location Filter</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', width: '200px' }>
                <option>All Locations</option>
                <option>Premix (Micocheni + Taifa)</option>
                <option>Impala</option>
                <option>Lugoba</option>
                <option>Container Depot (AFICD)</option>
                <option>Lake Steel</option>
                <option>AILL 1 & 2 / Polytra</option>
                <option>Fuel Depot and Yard</option>
                <option>Pipe and Cylinder</option>
                <option>Lake Aviation</option>
                <option>Lake Trans</option>
                <option>Building Solution</option>
                <option>Kings Apartment</option>
                <option>Showroom</option>
              </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}><Calendar size={14} style={{display:'inline', marginBottom:'-2px'}}/> Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}><Calendar size={14} style={{display:'inline', marginBottom:'-2px'}}/> End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }} />
          </div>
          <button style={{ padding: '10px 20px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <Filter size={16} /> Apply Filters
          </button>
        </div>

        {/* DATA TABLE */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', borderBottom: '2px solid var(--card-border)' }}>
              <th style={{ padding: '16px' }}>Date & Time</th>
              <th style={{ padding: '16px' }}>Location</th>
              <th style={{ padding: '16px' }}>Incident Type</th>
              <th style={{ padding: '16px' }}>Details / Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                <td style={{ padding: '16px', fontWeight: 500 }}>{row.date}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{row.location}</span>
                </td>
                <td style={{ padding: '16px', fontWeight: 600, color: row.type === 'PPE Violation' ? '#ef4444' : row.type === 'Fire & Smoke' ? '#f59e0b' : 'var(--text-primary)' }}>{row.type}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{row.detail}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No reports found for the selected date and location.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsView;

