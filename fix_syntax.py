import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix the broken borderLeft syntax
# Find: borderLeft: 4px solid  }}
# Replace with: borderLeft: 4px solid  }}
code = code.replace(
    "borderLeft: 4px solid  }}",
    "borderLeft: 4px solid  }}"
)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
