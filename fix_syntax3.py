import re

for filename in ['src/components/AlertRulesView.jsx', 'src/components/ReportsView.jsx']:
    with open(filename, 'r', encoding='utf-8') as f:
        code = f.read()
    
    # 1. Clean up ALL triple }}}> to }}>
    code = code.replace("}}}>", "}}>")
    # 2. Fix the broken <tr key={rule.id}}> 
    code = code.replace("}}>", "}>") 
    # But wait, this breaks style={{ ... }}>
    # So let's restore style={{ ... }}>
    code = re.sub(r'(style=\{+.*?)\}\>', r'\1}}>', code)
    
    # Wait, the initial problem was style={ ... }> instead of style={{ ... }}>
    # Let's fix that specific instance!
    code = re.sub(r'style=\{\s*(width|padding)[^}]+\}\s*>', lambda m: m.group(0).replace('style={', 'style={{').replace('}>', '}}>'), code)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(code)
