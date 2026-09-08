import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

heatmap_component = '''
// DYNAMIC SITE HEALTH HEATMAP COMPONENT
const SiteHealthHeatmap = () => {
  const locations = [
    'Premix', 'Impala', 'Lugoba', 'Container Depot', 'Lake Steel', 
    'AILL 1 & 2', 'Fuel Depot', 'Pipe & Cylinder', 'Lake Aviation', 
    'Lake Trans', 'Building Sol.', 'Kings Apt.', 'Showroom'
  ];
  
  const usecases = ['PPE', 'ANPR', 'Count', 'Loiter', 'Spillage', 'Fire', 'Prod.', 'Intrusion'];
  
  // Deterministic dummy data generation for consistent UI
  const data = locations.map(loc => {
    let totalHealth = 0;
    const scores = usecases.map(uc => {
       const hash = hashCode(loc + uc);
       // Base score around 85, plus/minus up to 15
       const score = Math.min(100, Math.max(0, 85 + (hash % 30) - 10));
       // If Lake Steel, make it offline/0
       if (loc === 'Lake Steel') return 0;
       totalHealth += score;
       return score;
    });
    return {
      name: loc,
      scores,
      avg: loc === 'Lake Steel' ? 0 : Math.round(totalHealth / usecases.length)
    };
  });

  const ucAvgs = usecases.map((uc, i) => {
    const sum = data.reduce((acc, row) => acc + row.scores[i], 0);
    return Math.round(sum / locations.length);
  });

  const getHeatColor = (val) => {
     if (val === 0) return '#f8fafc';
     if (val >= 95) return '#dcfce7'; // green
     if (val >= 85) return '#fef08a'; // yellow
     return '#fee2e2'; // red
  };
  const getTextColor = (val) => {
     if (val === 0) return '#94a3b8';
     if (val >= 95) return '#166534';
     if (val >= 85) return '#854d0e';
     return '#991b1b';
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '8px' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px', minWidth: '800px' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</th>
            {usecases.map(uc => (
              <th key={uc} style={{ padding: '8px', textAlign: 'center', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{uc}</th>
            ))}
            <th style={{ padding: '8px', textAlign: 'center', color: '#0f172a', fontSize: '0.75rem', fontWeight: 800 }}>AVG</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.name}>
              <td style={{ padding: '8px', fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '4px 0 0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: row.avg === 0 ? '#cbd5e1' : row.avg >= 90 ? '#22c55e' : row.avg >= 80 ? '#f59e0b' : '#ef4444' }}></div>
                  {row.name}
                </div>
              </td>
              {row.scores.map((score, i) => (
                <td key={i} style={{ padding: '2px', background: '#f8fafc' }}>
                  <div style={{ background: getHeatColor(score), color: getTextColor(score), padding: '6px 4px', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                    {score === 0 ? '-' : score + '%'}
                  </div>
                </td>
              ))}
              <td style={{ padding: '2px', background: '#f8fafc', borderRadius: '0 4px 4px 0' }}>
                  <div style={{ background: '#e2e8f0', color: '#0f172a', padding: '6px 4px', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                    {row.avg}%
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ padding: '12px 8px', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>GLOBAL AVG</td>
            {ucAvgs.map((avg, i) => (
                <td key={i} style={{ padding: '12px 2px' }}>
                  <div style={{ color: '#475569', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                    {avg}%
                  </div>
                </td>
            ))}
            <td style={{ padding: '12px 2px', textAlign: 'center', fontWeight: 800, color: '#2563eb', fontSize: '0.9rem' }}>
              {Math.round(ucAvgs.reduce((a,b)=>a+b,0)/ucAvgs.length)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
'''

# Insert the component definition after the TableToolbar
if "SiteHealthHeatmap =" not in code:
    code = code.replace("const IncidentDrawer = ({ incident, onClose }) => {", heatmap_component + "\nconst IncidentDrawer = ({ incident, onClose }) => {")

start_idx = code.find('<div className="data-grid camera-matrix"')
end_idx = code.find('<div className="split-card-right"', start_idx)
# Find the exact string to replace
block = code[start_idx:end_idx]
# We want to keep the final </div> which closes split-card-left
# The block ends with:
#                  </div>
#                </div>
#
#                {/* Right Side: Universal Event Feed */}

# Replace the camera-matrix div with SiteHealthHeatmap
# Find the FIRST </div> after the map finishes
end_matrix_idx = block.find('))}</div>')
if end_matrix_idx == -1:
    end_matrix_idx = block.find('))}\n  \n                  </div>')
if end_matrix_idx == -1:
    end_matrix_idx = block.rfind('</div>', 0, block.rfind('</div>'))

if start_idx != -1 and end_matrix_idx != -1:
    # Construct exact replacement
    # We replace from start_idx up to the </div> that closes camera-matrix
    code = code[:start_idx] + '<div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>' + block[end_matrix_idx+6:]

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

