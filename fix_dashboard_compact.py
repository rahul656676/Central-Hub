import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_card = '''<div key={site.name} style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', background: 'white', position: 'relative', overflow: 'hidden' }}>
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
                    </div>'''

new_card = '''<div key={site.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '12px 16px', background: 'white', borderLeft: 4px solid  }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{site.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{site.useCases} Use Cases Active</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: site.compliance < 50 ? 'var(--danger)' : site.compliance < 95 ? 'var(--warning)' : 'var(--success)' }}>{site.compliance}%</div>
                          <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: site.status === 'Online' ? '#dcfce7' : site.status === 'Warning' ? '#fef08a' : '#fee2e2', color: site.status === 'Online' ? '#166534' : site.status === 'Warning' ? '#854d0e' : '#991b1b' }}>{site.status.toUpperCase()}</span>
                        </div>
                      </div>'''

code = code.replace(old_card, new_card)

# also change grid-template-columns to fit the compact list better
code = code.replace(
    "gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'",
    "gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'"
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
