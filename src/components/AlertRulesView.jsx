import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const AlertRulesView = () => {
  const [toast, setToast] = useState(null);
  const [rules, setRules] = useState([
    { id: 1, name: 'Rahul Sharma', contact: 'rahul656676@users.noreply.github.com', loc: 'All Locations', type: 'All Violations' },
    { id: 2, name: 'Site Manager (Lugoba)', contact: '+255 123 456 789', loc: 'Lugoba', type: 'PPE Violations' }
  ]);
  const [newRule, setNewRule] = useState({ name: '', contact: '', loc: 'All Locations', type: 'All Violations' });

  return (
    <div className="card full-width-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#10b981', color: 'white', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 9999 }}>
          {toast}
        </div>
      )}

      <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Bell size={28} color="var(--accent-blue)" />
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>System Alert Rules</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
              Manage recipients for automated incident alerts via Email and SMS.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Manage Alert Receivers</h3>
            <button type="button" onClick={() => { if(newRule.name && newRule.contact) { setRules([...rules, { id: Date.now(), ...newRule }]); setNewRule({ name: '', contact: '', loc: 'All Locations', type: 'All Violations' }); setToast('Alert Rule Added!'); setTimeout(() => setToast(null), 3000); } }} style={{ padding: '8px 16px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Add Recipient</button>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
             <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Recipient Name</label>
                <input type="text" placeholder="e.g. John Doe" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }} />
             </div>
             <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email / Phone</label>
                <input type="text" placeholder="john@example.com" value={newRule.contact} onChange={e => setNewRule({...newRule, contact: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }} />
             </div>
             <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Target Location</label>
                <select value={newRule.loc} onChange={e => setNewRule({...newRule, loc: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
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
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Incident Type</label>
                <select value={newRule.type} onChange={e => setNewRule({...newRule, type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
                     <option>All Violations</option>
                     <option>PPE Monitoring</option>
                     <option>ANPR & Containers</option>
                     <option>Counting & Throughput</option>
                     <option>Loitering Detection</option>
                     <option>Spillage Control</option>
                     <option>Fire & Smoke</option>
                     <option>Productivity</option>
                     <option>Intrusion Alerts</option>
                  </select>
             </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', borderBottom: '2px solid var(--card-border)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Contact</th>
                <th style={{ padding: '12px' }}>Location Scope</th>
                <th style={{ padding: '12px' }}>Incident Types</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{rule.name}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{rule.contact}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}><span style={{ background: rule.loc === 'All Locations' ? '#e0f2fe' : '#fef08a', color: rule.loc === 'All Locations' ? '#0284c7' : '#854d0e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{rule.loc}</span></td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{rule.type}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', color: '#ef4444', cursor: 'pointer' }} onClick={() => { setRules(rules.filter(r => r.id !== rule.id)); setToast('Rule Removed!'); setTimeout(() => setToast(null), 3000); }}>Remove</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlertRulesView;
