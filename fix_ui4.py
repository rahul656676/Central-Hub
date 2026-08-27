import os
import re

# 1. Restore HealthMonitorView.jsx
with open('old_health.jsx', 'rb') as f:
    raw = f.read()
old_health = raw.decode('utf-16-le')

with open('src/components/HealthMonitorView.jsx', 'w', encoding='utf-8') as f:
    f.write(old_health)

# 2. Fix ConfigurationView.jsx Alert Rules State
with open('src/components/ConfigurationView.jsx', 'r', encoding='utf-8') as f:
    config_jsx = f.read()

config_jsx = config_jsx.replace(
    "const [toast, setToast] = useState(null);",
    "const [toast, setToast] = useState(null);\n  const [rules, setRules] = useState([\n    { id: 1, name: 'Rahul Sharma', contact: 'rahul656676@users.noreply.github.com', loc: 'All Locations', type: 'All Violations' },\n    { id: 2, name: 'Site Manager (Lugoba)', contact: '+255 123 456 789', loc: 'Lugoba', type: 'PPE Violations' }\n  ]);\n  const [newRule, setNewRule] = useState({ name: '', contact: '', loc: 'All Locations', type: 'All Violations' });\n"
)

config_jsx = config_jsx.replace(
    '<input type="text" placeholder="e.g. John Doe" style={{ width: \'100%\', padding: \'10px\', borderRadius: \'6px\', border: \'1px solid var(--card-border)\' }} />',
    '<input type="text" placeholder="e.g. John Doe" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} style={{ width: \'100%\', padding: \'10px\', borderRadius: \'6px\', border: \'1px solid var(--card-border)\' }} />'
)
config_jsx = config_jsx.replace(
    '<input type="text" placeholder="john@example.com" style={{ width: \'100%\', padding: \'10px\', borderRadius: \'6px\', border: \'1px solid var(--card-border)\' }} />',
    '<input type="text" placeholder="john@example.com" value={newRule.contact} onChange={e => setNewRule({...newRule, contact: e.target.value})} style={{ width: \'100%\', padding: \'10px\', borderRadius: \'6px\', border: \'1px solid var(--card-border)\' }} />'
)
config_jsx = config_jsx.replace(
    '<select style={{ width: \'100%\', padding: \'10px\', borderRadius: \'6px\', border: \'1px solid var(--card-border)\' }}>\n                     <option>All Locations</option>',
    '<select value={newRule.loc} onChange={e => setNewRule({...newRule, loc: e.target.value})} style={{ width: \'100%\', padding: \'10px\', borderRadius: \'6px\', border: \'1px solid var(--card-border)\' }}>\n                     <option>All Locations</option>'
)
config_jsx = config_jsx.replace(
    '<select style={{ width: \'100%\', padding: \'10px\', borderRadius: \'6px\', border: \'1px solid var(--card-border)\' }}>\n                     <option>All Violations</option>',
    '<select value={newRule.type} onChange={e => setNewRule({...newRule, type: e.target.value})} style={{ width: \'100%\', padding: \'10px\', borderRadius: \'6px\', border: \'1px solid var(--card-border)\' }}>\n                     <option>All Violations</option>'
)
config_jsx = config_jsx.replace(
    '<button type="button" style={{ padding: \'8px 16px\', background: \'var(--accent-blue)\', color: \'white\', border: \'none\', borderRadius: \'6px\', cursor: \'pointer\' }}>+ Add Recipient</button>',
    '<button type="button" onClick={() => { if(newRule.name && newRule.contact) { setRules([...rules, { id: Date.now(), ...newRule }]); setNewRule({ name: \'\', contact: \'\', loc: \'All Locations\', type: \'All Violations\' }); setToast(\'Alert Rule Added!\'); setTimeout(() => setToast(null), 3000); } }} style={{ padding: \'8px 16px\', background: \'var(--accent-blue)\', color: \'white\', border: \'none\', borderRadius: \'6px\', cursor: \'pointer\' }}>+ Add Recipient</button>'
)

static_tbody = '''<tbody>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>Rahul Sharma</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>rahul656676@users.noreply.github.com</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}><span style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>All Locations</span></td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>All Violations</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', color: '#ef4444', cursor: 'pointer' }}>Remove</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>Site Manager (Lugoba)</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>+255 123 456 789</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}><span style={{ background: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>Lugoba Only</span></td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>PPE Violations</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', color: '#ef4444', cursor: 'pointer' }}>Remove</td>
                </tr>
              </tbody>'''

dynamic_tbody = '''<tbody>
                {rules.map(rule => (
                  <tr key={rule.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{rule.name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{rule.contact}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}><span style={{ background: rule.loc === 'All Locations' ? '#e0f2fe' : '#fef08a', color: rule.loc === 'All Locations' ? '#0284c7' : '#854d0e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{rule.loc}</span></td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{rule.type}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', color: '#ef4444', cursor: 'pointer' }} onClick={() => { setRules(rules.filter(r => r.id !== rule.id)); setToast('Rule Removed!'); setTimeout(() => setToast(null), 3000); }}>Remove</td>
                  </tr>
                ))}
              </tbody>'''

config_jsx = config_jsx.replace(static_tbody, dynamic_tbody)

with open('src/components/ConfigurationView.jsx', 'w', encoding='utf-8') as f:
    f.write(config_jsx)

# 3. Fix Dashboard.jsx (Overview split-card-left injection & Thermal images)
with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    dashboard_jsx = f.read()

dashboard_jsx = dashboard_jsx.replace(
    '<img src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=400&q=80" alt="Thermal Normal"',
    '<img src="/cam4.png" alt=""'
)
dashboard_jsx = dashboard_jsx.replace(
    '<img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80" alt="Thermal Heat"',
    '<img src="/cam9.png" alt=""'
)

widget_code = '''<div className="split-card-left" style={{ flex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0 }}>Global Site Health & Compliance</h3>
                  <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>GLOBAL AVG HEALTH: 78%</span>
                </div>
                <div className="data-grid camera-matrix" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginTop: 0 }}>
                  
                  {[
                    { name: 'Premix', useCases: 9, compliance: 98, status: 'Online' },
                    { name: 'Impala', useCases: 5, compliance: 100, status: 'Online' },
                    { name: 'Lugoba', useCases: 9, compliance: 92, status: 'Warning' },
                    { name: 'Container Depot', useCases: 3, compliance: 100, status: 'Online' },
                    { name: 'Lake Steel', useCases: 4, compliance: 0, status: 'Offline' },
                  ].map(site => (
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
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>USE CASES</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{site.useCases}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AVG HEALTH</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: site.compliance < 50 ? 'var(--danger)' : site.compliance < 95 ? 'var(--warning)' : 'var(--success)' }}>
                            {site.compliance}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>'''

pattern = re.compile(r'<div className="split-card-left" style=\{\{ flex: 2 \}\}>.*?</div>\s*</div>\s*\{/\* Right Side: Universal Event Feed \*/\}', re.DOTALL)
dashboard_jsx = pattern.sub(widget_code + '\n\n              {/* Right Side: Universal Event Feed */}', dashboard_jsx)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(dashboard_jsx)

print("UI fixes applied successfully!")
