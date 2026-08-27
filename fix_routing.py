with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    dashboard_jsx = f.read()

# Fix the routing fallback condition
dashboard_jsx = dashboard_jsx.replace(
    "{activeSolution !== 'Configuration' && activeSolution !== 'Health Monitor' && (",
    "{activeSolution !== 'Configuration' && activeSolution !== 'Health Monitor' && activeSolution !== 'Reports' && activeSolution !== 'Alert Rules' && ("
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(dashboard_jsx)
