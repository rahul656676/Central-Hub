import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. We replace the wrapper <div className="card full-width-card split-card" ...>
# AND the left side up to the right side
# Since we just want to break them apart, we can change split-card to just full-width-card
# But they need to be siblings, not children!

# Let's replace the whole top block
pattern_top = r'<div className="card full-width-card split-card" style=\{\{ marginTop: \'24px\' \}\}>\s*\{\/\* Left Side: Camera Matrix \*\/\}\s*<div className="split-card-left" style=\{\{ flex: 2 \}\}>\s*<div style=\{\{ display: \'flex\', justifyContent: \'space-between\', alignItems: \'center\', marginBottom: \'16px\' \}\}>\s*<h3 style=\{\{ margin: 0 \}\}>Global Site Health & Compliance</h3>\s*<span style=\{\{ fontSize: \'.*?\', background: \'#dcfce7\', color: \'#166534\', padding: \'4px 8px\', borderRadius: \'4px\', fontWeight: 600 \}\}>GLOBAL AVG HEALTH: 78%</span>\s*</div>\s*<div style=\{\{ marginTop: "0px" \}\}><SiteHealthHeatmap /></div>\s*</div>\s*\{\/\* Right Side: Universal Event Feed \*\/\}\s*<div className="split-card-right" style=\{\{ flex: 1, display: \'flex\', flexDirection: \'column\' \}\}>'

new_top = '''              <div className="card full-width-card" style={{ marginTop: '24px', overflowX: 'auto', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Global Site Health Heatmap</h3>
                  <span style={{ fontSize: '1rem', background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '6px', fontWeight: 700 }}>GLOBAL AVG HEALTH: 78%</span>
                </div>
                <div style={{ marginTop: "0px", width: "100%", overflowX: "auto" }}><SiteHealthHeatmap /></div>
              </div>
  
              {/* Universal Event Feed */}
              <div className="card full-width-card" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column' }}>'''

code = re.sub(pattern_top, new_top, code, flags=re.DOTALL)

# 2. We need to remove the extra </div> at the end of the event ticker block
# It currently has 4 closing divs before {/* Cross-Site Comparisons (HQ Only) */}
# We need to change it to 3.
pattern_bottom = r'(\s*</div>\s*</div>\s*</div>\s*</div>\s*\{\/\* Cross-Site Comparisons \(HQ Only\) \*\/\})'

def remove_one_div(match):
    s = match.group(1)
    # remove the first </div> we see
    return s.replace('</div>', '', 1)

code = re.sub(pattern_bottom, remove_one_div, code)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

