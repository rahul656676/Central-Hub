import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the hardcoded <tbody> for PPE Monitoring with dynamic data
ppe_table_original = '''                    <tbody>
                      <tr onClick={() => handleRowClick({ type: 'PPE Violation', time: 'Today, 10:42 AM', camera: 'Gate 4 - Loading', location: 'Gate 4 - Loading', violation: 'No Helmet', worker: 'EMP-0892', supervisor: 'Rajesh K.' })}>
                        <td><Thumbnail icon={User} color="#ef4444" /></td>
                        <td>Today, 10:42 AM</td>
                        <td>Gate 4 - Loading</td>
                        <td><span style={{ color: '#ef4444', fontWeight: 600 }}>No Helmet</span></td>
                        <td><button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>Alert Supervisor</button></td>
                      </tr>
                      <tr onClick={() => handleRowClick({ type: 'PPE Violation', time: 'Today, 09:15 AM', camera: 'Area B - Processing', location: 'Area B - Processing', violation: 'No Vest', worker: 'EMP-1044', supervisor: 'Amit S.' })}>
                        <td><Thumbnail icon={User} color="#f59e0b" /></td>
                        <td>Today, 09:15 AM</td>
                        <td>Area B - Processing</td>
                        <td><span style={{ color: '#f59e0b', fontWeight: 600 }}>No Vest</span></td>
                        <td><button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>Alert Supervisor</button></td>
                      </tr>
                      <tr onClick={() => handleRowClick({ type: 'PPE Violation', time: 'Yesterday, 14:20 PM', camera: 'South Perimeter', location: 'South Perimeter', violation: 'No Gloves', worker: 'Unknown', supervisor: 'Amit S.' })}>
                        <td><Thumbnail icon={User} color="#3b82f6" /></td>
                        <td>Yesterday, 14:20 PM</td>
                        <td>South Perimeter</td>
                        <td><span style={{ color: '#3b82f6', fontWeight: 600 }}>No Gloves</span></td>
                        <td><button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>Review Footage</button></td>
                      </tr>
                    </tbody>'''

ppe_table_dynamic = '''                    <tbody>
                      {backendAlerts && backendAlerts.filter(a => a.usecase === 'PPE Monitoring').map(alert => (
                        <tr key={alert.id} onClick={() => handleRowClick({ 
                          type: alert.alert_type, 
                          time: new Date(alert.timestamp).toLocaleString(), 
                          camera: alert.camera_id, 
                          location: alert.site_id, 
                          violation: alert.description,
                          snapshot_url: alert.snapshot_url,
                          confidence: alert.confidence
                        })}>
                          <td><Thumbnail icon={User} color={alert.severity === 'high' ? '#ef4444' : '#f59e0b'} /></td>
                          <td>{new Date(alert.timestamp).toLocaleString()}</td>
                          <td>{alert.camera_id} - {alert.site_id}</td>
                          <td><span style={{ color: alert.severity === 'high' ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{alert.description}</span></td>
                          <td><button type="button" className="action-btn" onClick={(e) => e.stopPropagation()}>Alert Supervisor</button></td>
                        </tr>
                      ))}
                      {(!backendAlerts || backendAlerts.filter(a => a.usecase === 'PPE Monitoring').length === 0) && (
                        <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>No recent PPE violations detected.</td></tr>
                      )}
                    </tbody>'''

code = code.replace(ppe_table_original, ppe_table_dynamic)

# Also update IncidentDrawer to use real snapshot and confidence
drawer_original = '''  const IncidentDrawer = ({ incident, onClose }) => {
    if (!incident) return null;
  
    const getDrawerImage = () => {
      switch(incident.type) {
        case 'ANPR': return "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80";
        case 'PPE Violation': return "https://images.unsplash.com/photo-1504917595217-d4bfd27eb278?auto=format&fit=crop&w=800&q=80";
        case 'Spillage': return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80";
        default: return "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?auto=format&fit=crop&w=800&q=80";
      }
    };'''

drawer_dynamic = '''  const IncidentDrawer = ({ incident, onClose }) => {
    if (!incident) return null;
  
    const getDrawerImage = () => {
      if (incident.snapshot_url && incident.snapshot_url.startsWith('http')) {
         return incident.snapshot_url;
      }
      switch(incident.type) {
        case 'ANPR': return "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80";
        case 'PPE Violation': return "https://images.unsplash.com/photo-1504917595217-d4bfd27eb278?auto=format&fit=crop&w=800&q=80";
        case 'Spillage': return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80";
        default: return "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?auto=format&fit=crop&w=800&q=80";
      }
    };'''

code = code.replace(drawer_original, drawer_dynamic)

# Add confidence to drawer if available
confidence_original = '''              </div>
              <div className="detail-row">
                <span className="detail-label">Location</span>'''

confidence_dynamic = '''              </div>
              {incident.confidence && (
                <div className="detail-row">
                  <span className="detail-label">AI Confidence</span>
                  <span className="detail-value" style={{color: 'var(--accent-blue)', fontWeight: 'bold'}}>{(incident.confidence * 100).toFixed(1)}%</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Location</span>'''

code = code.replace(confidence_original, confidence_dynamic)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

