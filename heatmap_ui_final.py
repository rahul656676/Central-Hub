with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Increase heatmap sizes
code = code.replace("fontSize: '0.75rem'", "fontSize: '0.9rem'")
code = code.replace("fontSize: '0.85rem'", "fontSize: '1rem'")
code = code.replace("fontSize: '0.8rem'", "fontSize: '0.95rem'")
code = code.replace("fontSize: '0.9rem'", "fontSize: '1.1rem'")
code = code.replace("padding: '8px'", "padding: '16px 12px'")
code = code.replace("padding: '2px'", "padding: '6px'")
code = code.replace("padding: '6px 4px'", "padding: '12px 8px'")
code = code.replace("padding: '12px 8px'", "padding: '16px 12px'")
code = code.replace("padding: '12px 2px'", "padding: '16px 6px'")
code = code.replace("minWidth: '800px'", "minWidth: '1000px'")

# Let's replace the structure
old_header = '''              {/* Command Center Layout */}
              <div className="card full-width-card split-card" style={{ marginTop: '24px' }}>
                
                {/* Left Side: Camera Matrix */}
                <div className="split-card-left" style={{ flex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>Global Site Health & Compliance</h3>
                    <span style={{ fontSize: '1.1rem', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>GLOBAL AVG HEALTH: 78%</span>
                  </div>
                  <div style={{ marginTop: "0px" }}><SiteHealthHeatmap /></div>
                </div>
  
                {/* Right Side: Universal Event Feed */}
                <div className="split-card-right" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>'''

# Wait, the fontSize: '0.75rem' in the span was replaced by '0.9rem', wait NO! It was replaced by '1.1rem' because 
# my code does: replace('0.75rem', '0.9rem') and THEN replace('0.9rem', '1.1rem')!
# So 0.75 -> 0.9 -> 1.1!
# So it's 1.1rem now.

new_header = '''              {/* Command Center Layout */}
              <div className="card full-width-card" style={{ marginTop: '24px', overflowX: 'auto', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Global Site Health Heatmap</h3>
                  <span style={{ fontSize: '1rem', background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '6px', fontWeight: 700 }}>GLOBAL AVG HEALTH: 78%</span>
                </div>
                <div style={{ marginTop: "0px", width: "100%", overflowX: "auto" }}><SiteHealthHeatmap /></div>
              </div>
  
              {/* Universal Event Feed */}
              <div className="card full-width-card" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column' }}>'''

code = code.replace(old_header, new_header)

# Now we must remove the extra </div> at the end of the event ticker.
# The end of the event ticker looks like:
#                     </div>
#                   </div>
#                 </div>
#               </div>
# 
#               {/* Cross-Site Comparisons (HQ Only) */}
old_footer = '''                    </div>
                  </div>
                </div>
              </div>

              {/* Cross-Site Comparisons (HQ Only) */}'''

new_footer = '''                    </div>
                  </div>
                </div>

              {/* Cross-Site Comparisons (HQ Only) */}'''

code = code.replace(old_footer, new_footer)

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
