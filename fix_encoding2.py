with open('src/components/HealthMonitorView.jsx', 'rb') as f:
    raw = f.read()

try:
    content = raw.decode('utf-16-le')
except UnicodeDecodeError:
    content = raw.decode('windows-1252')

with open('src/components/HealthMonitorView.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Converted HealthMonitorView to UTF-8")
