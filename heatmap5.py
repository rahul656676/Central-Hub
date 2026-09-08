import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the camera-matrix div with SiteHealthHeatmap
# Using a precise non-greedy regex
code = re.sub(
    r'<div className="data-grid camera-matrix".*?\]\.map\(site => \(.*?\}\)\}\s*</div>', 
    '<div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>', 
    code, 
    flags=re.DOTALL
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

