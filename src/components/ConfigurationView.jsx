import React, { useState, useRef } from 'react';
import { Sliders, CheckCircle, Video, MapPin, Upload } from 'lucide-react';
import RoiCanvas from './RoiCanvas';
import { saveUseCaseConfig } from '../api/useConfig';

const ConfigurationView = () => {
  const [activeTab, setActiveTab] = useState('Sites');
  const [useCaseConfig, setUseCaseConfig] = useState(false);
  const roiDataRef = useRef(null);
  
  const handleSave = async () => {
    try {
      await saveUseCaseConfig({
        camera_id: "cam_loading_bay_01",
        usecase_name: useCaseConfig,
        settings: {
          roi: roiDataRef.current
        }
      });
      alert('Configuration saved to database!');
      setUseCaseConfig(false);
    } catch (err) {
      alert('Failed to save. Is the backend running?');
    }
  };

  return (
    <div className="card full-width-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Sliders size={28} color="var(--accent-blue)" />
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>System Configuration</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
            Onboard new sites, manage camera streams, and deploy AI use-cases.
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', background: '#f8fafc' }}>
        {['Sites', 'Cameras', 'Use Cases'].map(tab => (
          <button 
            type="button"
            key={tab}
            onClick={(e) => { e.preventDefault(); setActiveTab(tab); setUseCaseConfig(false); }}
            style={{ 
              flex: 1, padding: '16px', background: activeTab === tab ? '#ffffff' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid var(--accent-blue)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
              cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400', transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '32px', minHeight: '400px', background: '#ffffff' }}>
        
        {/* SITES TAB */}
        {activeTab === 'Sites' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} color="var(--accent-blue)" /> Add New Site</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Site Name</label>
                <input type="text" placeholder="e.g., Lake Aviation Zanzibar" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Location / Address</label>
                <input type="text" placeholder="Zanzibar, Tanzania" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Timezone</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'white' }}>
                  <option>Africa/Dar_es_Salaam</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
            <div>
              <button type="button" style={{ padding: '10px 24px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Save Site</button>
            </div>
          </div>
        )}

        {/* CAMERAS TAB */}
        {activeTab === 'Cameras' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Video size={20} color="var(--accent-blue)" /> Onboard Camera</h3>
              <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f8fafc', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '6px', cursor: 'pointer' }}>
                <Upload size={16} /> Bulk CSV Upload
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Camera Name</label>
                  <input type="text" placeholder="e.g., Gate 3 Entrance" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Assign to Site</label>
                  <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'white' }}>
                    <option>Lugoba</option>
                    <option>Premix</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>RTSP Stream URL</label>
                  <input type="text" placeholder="rtsp://admin:pass@192.168.1.100:554/stream1" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" style={{ padding: '10px 24px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Save Camera</button>
                  <button type="button" style={{ padding: '10px 24px', background: '#f8fafc', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Test Connection</button>
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: '300px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Live Preview</label>
                <div style={{ width: '100%', height: '260px', background: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', border: '1px dashed var(--card-border)' }}>
                  Click "Test Connection" to load frame
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USE CASES TAB */}
        {activeTab === 'Use Cases' && !useCaseConfig && (
          <div className="animate-fade-in">
            <h3 style={{ margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Assign Use Cases to Camera</h3>
            
            <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Select Camera</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'white' }}>
                <option>Lugoba - Gate 3 Entrance</option>
                <option>Premix - Loading Bay A</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {['PPE / Safety Gear Check', 'Vehicle Recognition (ANPR)', 'Container Tracking', 'Spill Detection', 'Fire and Smoke', 'Intrusion Alerts', 'Loitering Detection', 'Stock Counting', 'Productivity Insights'].map((uc) => (
                <div key={uc} style={{ padding: '16px', border: '1px solid var(--card-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" id={uc} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <label htmlFor={uc} style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--text-primary)' }}>{uc}</label>
                  </div>
                  <button type="button" onClick={() => setUseCaseConfig(uc)} style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#f1f5f9', border: 'none', borderRadius: '4px', color: 'var(--accent-blue)', cursor: 'pointer' }}>
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INDIVIDUAL USE CASE CONFIG (ROI) */}
        {activeTab === 'Use Cases' && useCaseConfig && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button type="button" onClick={() => setUseCaseConfig(false)} style={{ padding: '6px 12px', border: '1px solid var(--card-border)', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>&larr; Back</button>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Configure: {useCaseConfig}</h3>
            </div>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)' }}>Region of Interest (ROI)</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Draw a polygon on the live frame to restrict where the AI analyzes footage.</p>
                
                <RoiCanvas onSave={(data) => { roiDataRef.current = data; }} />
              </div>
              
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)' }}>Model Parameters (JSON Config)</h4>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Confidence Threshold</label>
                  <input type="number" step="0.1" defaultValue="0.6" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
                </div>
                
                {useCaseConfig === 'Loitering Detection' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Dwell Time (seconds)</label>
                    <input type="number" defaultValue="30" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }} />
                  </div>
                )}
                
                {useCaseConfig === 'PPE / Safety Gear Check' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Required Parts</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><input type="checkbox" defaultChecked /> Helmet</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><input type="checkbox" defaultChecked /> Vest</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><input type="checkbox" /> Gloves</label>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '16px' }}>
                  <button type="button" onClick={handleSave} style={{ padding: '10px 24px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Save Configuration</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConfigurationView;
