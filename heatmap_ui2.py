with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("fontSize: '0.75rem'", "fontSize: '0.9rem'")
code = code.replace("fontSize: '0.85rem'", "fontSize: '1rem'")
code = code.replace("fontSize: '0.8rem'", "fontSize: '0.95rem'")
code = code.replace("fontSize: '0.9rem'", "fontSize: '1.1rem'")
code = code.replace("padding: '8px'", "padding: '16px 12px'")
code = code.replace("padding: '2px'", "padding: '6px'")
code = code.replace("padding: '6px 4px'", "padding: '12px 8px'")
code = code.replace("padding: '12px 8px'", "padding: '16px 12px'")
code = code.replace("padding: '12px 2px'", "padding: '16px 6px'")
code = code.replace("minWidth: '800px'", "minWidth: '1000px'")

# Let's find exactly the line <div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>
old_lines = [
    '                <div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>',
    '              <div className="card full-width-card split-card" style={{ marginTop: \'24px\' }}>'
]

new_card = '''              <div className="card full-width-card" style={{ marginTop: '24px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Global Site Health & Compliance Heatmap</h3>
                  <span style={{ fontSize: '0.95rem', background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>GLOBAL NETWORK HEALTH: 78%</span>
                </div>
                <SiteHealthHeatmap />
              </div>
              
              <div className="card full-width-card" style={{ marginTop: '24px' }}>
'''

# We must replace the original split-card div and the SiteHealthHeatmap call
if '                <div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>' in code:
    code = code.replace('              <div className="card full-width-card split-card" style={{ marginTop: \'24px\' }}>\n                <div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>', new_card)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

