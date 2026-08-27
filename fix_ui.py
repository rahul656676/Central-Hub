import re

with open('frontend/src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: De-duplicate backendAlerts
# We'll inject a uniqueAlerts calculation right before it's mapped.
content = content.replace(
    "backendAlerts.map(alert => (",
    "backendAlerts.filter((alert, index, self) => index === self.findIndex((t) => t.description === alert.description && t.camera_id === alert.camera_id)).slice(0, 4).map(alert => ("
)

# Fix 2: Replace Thermal placeholders
content = content.replace(
    "[Infrared Feed Normal]",
    "<img src=\"https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=400&q=80\" alt=\"Thermal Normal\" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'hue-rotate(90deg) saturate(200%)' }} />"
)

content = content.replace(
    "[Infrared Heat Spot Detected]",
    "<div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 2, fontWeight: 'bold' }}>HEAT SPOT</div><img src=\"https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80\" alt=\"Thermal Heat\" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(100%) hue-rotate(300deg) saturate(500%) contrast(150%)' }} />"
)

# Also fix the height and add position relative to the heat spot container
content = content.replace(
    "height: '100px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444'",
    "height: '140px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', position: 'relative', overflow: 'hidden'"
)
content = content.replace(
    "height: '100px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'",
    "height: '140px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', overflow: 'hidden'"
)

with open('frontend/src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed UI issues!")
