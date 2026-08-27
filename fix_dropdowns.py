import re

locations = [
    'Premix (Micocheni + Taifa)',
    'Impala',
    'Lugoba',
    'Container Depot (AFICD)',
    'Lake Steel',
    'AILL 1 & 2 / Polytra',
    'Fuel Depot and Yard',
    'Pipe and Cylinder',
    'Lake Aviation',
    'Lake Trans',
    'Building Solution',
    'Kings Apartment',
    'Showroom'
]

use_cases = [
    'All Violations',
    'PPE Monitoring',
    'ANPR & Containers',
    'Counting & Throughput',
    'Loitering Detection',
    'Spillage Control',
    'Fire & Smoke',
    'Productivity',
    'Intrusion Alerts'
]

# 1. Update AlertRulesView.jsx
with open('src/components/AlertRulesView.jsx', 'r', encoding='utf-8') as f:
    alert_code = f.read()

# Replace location dropdown
loc_options = "\n".join([f"                     <option>{loc}</option>" for loc in ['All Locations'] + locations])
alert_code = re.sub(
    r"<select value=\{newRule\.loc\}.*?>.*?</select>",
    f"<select value={{newRule.loc}} onChange={{e => setNewRule({{...newRule, loc: e.target.value}})}} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }}>\n{loc_options}\n                  </select>",
    alert_code,
    flags=re.DOTALL
)

# Replace incident type dropdown
type_options = "\n".join([f"                     <option>{uc}</option>" for uc in use_cases])
alert_code = re.sub(
    r"<select value=\{newRule\.type\}.*?>.*?</select>",
    f"<select value={{newRule.type}} onChange={{e => setNewRule({{...newRule, type: e.target.value}})}} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)' }}>\n{type_options}\n                  </select>",
    alert_code,
    flags=re.DOTALL
)

with open('src/components/AlertRulesView.jsx', 'w', encoding='utf-8') as f:
    f.write(alert_code)

# 2. Update ReportsView.jsx
with open('src/components/ReportsView.jsx', 'r', encoding='utf-8') as f:
    reports_code = f.read()

# Replace location dropdown in reports
rep_loc_options = "\n".join([f"                <option>{loc}</option>" for loc in ['All Locations'] + locations])
reports_code = re.sub(
    r"<select value=\{location\} onChange=\{\(e\) => setLocation\(e\.target\.value\)\} style=\{\{ padding: '10px', borderRadius: '6px', border: '1px solid var\(--card-border\)', width: '200px' \}\}>.*?</select>",
    f"<select value={{location}} onChange={{(e) => setLocation(e.target.value)}} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', width: '200px' }}>\n{rep_loc_options}\n              </select>",
    reports_code,
    flags=re.DOTALL
)
with open('src/components/ReportsView.jsx', 'w', encoding='utf-8') as f:
    f.write(reports_code)

# 3. Update Dashboard.jsx to include ALL locations in the compact list
dashboard_sites = [
    "{ name: 'Premix', useCases: 9, compliance: 98, status: 'Online' }",
    "{ name: 'Impala', useCases: 5, compliance: 100, status: 'Online' }",
    "{ name: 'Lugoba', useCases: 9, compliance: 92, status: 'Warning' }",
    "{ name: 'Container Depot', useCases: 3, compliance: 100, status: 'Online' }",
    "{ name: 'Lake Steel', useCases: 4, compliance: 0, status: 'Offline' }",
    "{ name: 'AILL 1 & 2', useCases: 4, compliance: 100, status: 'Online' }",
    "{ name: 'Fuel Depot', useCases: 7, compliance: 95, status: 'Online' }",
    "{ name: 'Pipe & Cylinder', useCases: 3, compliance: 88, status: 'Warning' }",
    "{ name: 'Lake Aviation', useCases: 2, compliance: 100, status: 'Online' }",
    "{ name: 'Lake Trans', useCases: 6, compliance: 91, status: 'Warning' }",
    "{ name: 'Building Solution', useCases: 4, compliance: 100, status: 'Online' }",
    "{ name: 'Kings Apartment', useCases: 5, compliance: 96, status: 'Online' }",
    "{ name: 'Showroom', useCases: 2, compliance: 100, status: 'Online' }"
]
dashboard_sites_str = "[\n                      " + ",\n                      ".join(dashboard_sites) + "\n                    ]"

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    dashboard_code = f.read()

dashboard_code = re.sub(
    r"\[\s*\{\s*name:\s*'Premix'.*?\]\.map\(site =>",
    f"{dashboard_sites_str}.map(site =>",
    dashboard_code,
    flags=re.DOTALL
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(dashboard_code)

