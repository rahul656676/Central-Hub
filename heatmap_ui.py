import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update font sizes in SiteHealthHeatmap
# Replace small paddings and font sizes with larger ones
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


# 2. Break the split-card structure
old_structure = '''              <div className="card full-width-card split-card" style={{ marginTop: '24px' }}>
                
                {/* Left Side: Camera Matrix */}
                <div className="split-card-left" style={{ flex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>Global Site Health & Compliance</h3>
                    <span style={{ fontSize: '0.9rem', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>GLOBAL AVG HEALTH: 78%</span>
                  </div>
                  <div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>
                </div>
  
                {/* Right Side: Universal Event Feed */}
                <div className="split-card-right" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>'''

new_structure = '''              <div className="card full-width-card" style={{ marginTop: '24px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Global Site Health & Compliance Heatmap</h3>
                  <span style={{ fontSize: '0.95rem', background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>GLOBAL NETWORK HEALTH: 78%</span>
                </div>
                <SiteHealthHeatmap />
              </div>
              
              <div className="card full-width-card" style={{ marginTop: '24px' }}>'''

# Do the replacement (watch out for the 0.75rem that was just replaced with 0.9rem in the code)
code = code.replace(old_structure, new_structure)

# In case the exact text mismatch happens due to spacing, use regex
code = re.sub(
    r'<div className="card full-width-card split-card" style=\{\{ marginTop: \'24px\' \}\}>\s*\{\/\* Left Side: Camera Matrix \*\/\}\s*<div className="split-card-left" style=\{\{ flex: 2 \}\}>\s*<div style=\{\{ display: \'flex\', justifyContent: \'space-between\', alignItems: \'center\', marginBottom:\s*\'16px\' \}\}>\s*<h3 style=\{\{ margin: 0 \}\}>Global Site Health & Compliance</h3>\s*<span[^>]*>GLOBAL AVG HEALTH: 78%</span>\s*</div>\s*<div style=\{\{ marginTop: "0px" \}\}>\s*<SiteHealthHeatmap />\s*</div>\s*</div>\s*\{\/\* Right Side: Universal Event Feed \*\/\}\s*<div className="split-card-right" style=\{\{ flex: 1, display: \'flex\', flexDirection: \'column\' \}\}>',
    new_structure,
    code,
    flags=re.DOTALL
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

