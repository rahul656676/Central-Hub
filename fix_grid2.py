import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the specific Live Thermal Sensors header
code = re.sub(
    r"<div style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center',\s*marginTop:\s*'32px'\s*\}\}>\s*<h3 style=\{\{\s*color:\s*'var\(--text-primary\)',\s*margin:\s*0\s*\}\}>Live Thermal Sensors</h3>",
    r"<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gridColumn: '1 / -1' }}>\n              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Live Thermal Sensors</h3>",
    code
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
