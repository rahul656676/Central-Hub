with open('src/components/ReportsView.jsx', 'rb') as f:
    raw = f.read()

# PowerShell Set-Content without -Encoding utf8 writes UTF-16LE or Windows-1252.
# Let's try to decode as UTF-16LE first.
try:
    content = raw.decode('utf-16-le')
except UnicodeDecodeError:
    content = raw.decode('windows-1252')

with open('src/components/ReportsView.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Converted to UTF-8")
