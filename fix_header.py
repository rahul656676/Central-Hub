import re

with open('src/components/Header.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix the header container style
code = code.replace(
    '''<header className="top-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', minHeight: '70px', gap: '16px' }}>''',
    '''<header className="top-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', minHeight: '70px', gap: '12px' }}>'''
)

# Fix the right panel flexWrap and add some mobile-friendly styling
code = code.replace(
    '''<div className="header-right-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1 }}>''',
    '''<div className="header-right-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', justifyContent: 'flex-end', flex: 1, overflowX: 'auto', paddingBottom: '4px' }}>'''
)

with open('src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
