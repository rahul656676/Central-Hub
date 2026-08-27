with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# I want to wrap the remaining parts of Fire & Smoke in a full-width-card or gridColumn
# Let's just inject className="full-width-card" into the header and grid.
code = code.replace(
    "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>\\n                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Live Thermal Sensors</h3>",
    "<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gridColumn: '1 / -1' }}>\\n                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Live Thermal Sensors</h3>"
)

code = code.replace(
    "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>",
    "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', gridColumn: '1 / -1' }}>"
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
