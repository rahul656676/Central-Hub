import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# We need to replace the ENTIRE SiteHealthHeatmap function
start_marker = "// DYNAMIC SITE HEALTH HEATMAP COMPONENT"
end_marker = "const IncidentDrawer = ({ incident, onClose }) => {"

start_idx = code.find(start_marker)
end_idx = code.find(end_marker, start_idx)

new_component = '''// DYNAMIC SITE HEALTH HEATMAP COMPONENT
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

  const getHeatStyle = (val) => {
     if (val === 0) return { bg: '#f1f5f9', text: '#94a3b8', border: '#e2e8f0' };
     if (val >= 95) return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
     if (val >= 85) return { bg: '#fef9c3', text: '#a16207', border: '#fef08a' };
     return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '16px', borderRadius: '8px' }}>
      <table className="heatmap-table">
        <thead>
          <tr>
            <th className="heatmap-sticky-col" style={{ textAlign: 'left', background: 'white' }}>Location</th>
            {usecases.map(uc => (
              <th key={uc} style={{ textAlign: 'center' }}>{uc}</th>
            ))}
            <th style={{ textAlign: 'center', color: '#0f172a', borderLeft: '1px dashed #e2e8f0' }}>AVG Health</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.name} className="heatmap-row" style={{ background: 'white' }}>
              <td className="heatmap-sticky-col">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 0 2px white', background: row.avg === 0 ? '#cbd5e1' : row.avg >= 90 ? '#22c55e' : row.avg >= 80 ? '#f59e0b' : '#ef4444' }}></div>
                  {row.name}
                </div>
              </td>
              {row.scores.map((score, i) => {
                const style = getHeatStyle(score);
                return (
                  <td key={i} style={{ textAlign: 'center' }}>
                    <div className="heatmap-cell-badge" style={{ background: style.bg, color: style.text, border: 1px solid  }}>
                      {score === 0 ? '-' : score + '%'}
                    </div>
                  </td>
                );
              })}
              <td style={{ textAlign: 'center', borderLeft: '1px dashed #e2e8f0' }}>
                  <div className="heatmap-cell-badge" style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', fontSize: '1rem' }}>
                    {row.avg}%
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#f8fafc' }}>
            <td className="heatmap-sticky-col" style={{ padding: '16px 12px', fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', borderTop: '2px solid #cbd5e1', borderBottom: 'none' }}>GLOBAL METRICS</td>
            {ucAvgs.map((avg, i) => (
                <td key={i} style={{ padding: '16px 12px', textAlign: 'center', borderTop: '2px solid #cbd5e1', borderBottom: 'none' }}>
                  <div style={{ color: '#334155', fontSize: '1rem', fontWeight: 800 }}>
                    {avg}%
                  </div>
                </td>
            ))}
            <td style={{ padding: '16px 12px', textAlign: 'center', borderTop: '2px solid #cbd5e1', borderLeft: '1px dashed #e2e8f0', borderBottom: 'none' }}>
              <div className="heatmap-cell-badge" style={{ background: '#2563eb', color: 'white', border: 'none', fontSize: '1.05rem', padding: '8px 16px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
                {Math.round(ucAvgs.reduce((a,b)=>a+b,0)/ucAvgs.length)}%
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
\n'''

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + new_component + code[end_idx:]

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

