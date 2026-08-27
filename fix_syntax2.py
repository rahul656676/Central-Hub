import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix the broken borderLeft syntax robustly
code = re.sub(
    r"borderLeft:\s*4px solid\s*\}\}",
    r"borderLeft: 4px solid  }}",
    code
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
