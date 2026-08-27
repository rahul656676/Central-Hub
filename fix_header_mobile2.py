import re

with open('src/components/Header.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# I will rewrite the return statement of Header.jsx completely to fix the mobile layout once and for all.
# I'll use a Regex to replace everything from "return (" to the end of the file.

new_return = '''return (
    <header className="top-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '12px 16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', minHeight: '70px', gap: '16px' }}>
      
      {/* 1. Menu (Left) */}
      <div style={{ display: 'flex', alignItems: 'center', order: 1 }}>
        <button type="button" className="icon-btn mobile-menu-btn" onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <Menu size={24} />
        </button>
      </div>
      
      {/* 2. Search (Desktop Only) */}
      <div className="header-search desktop-only" style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 16px', borderRadius: '24px', width: '280px', border: '1px solid transparent', order: 2, marginLeft: '8px' }}>
        <Search size={18} color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Search analytics..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', marginLeft: '12px', width: '100%', fontSize: '0.875rem' }}
        />
      </div>

      {/* Spacer to push right items on Desktop */}
      <div className="desktop-only" style={{ flex: 1, order: 3 }}></div>
      
      {/* 3. Action Icons (Notifs, Profile - Far Right on both Mobile and Desktop) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', order: 4, marginLeft: 'auto' }}>
        <button type="button" className="desktop-only" onClick={toggleFullscreen} title="Toggle Fullscreen" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#64748b' }}>
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button type="button" onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#64748b', position: 'relative' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '4px', right: '6px', background: '#ef4444', border: '2px solid white', width: '10px', height: '10px', borderRadius: '50%' }}></span>
          </button>
          
          {showNotifications && (
            <div style={{ position: 'absolute', top: '100%', right: '-50px', marginTop: '8px', width: '320px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', color: '#0f172a' }}>
                Notifications
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>Loitering Alert - Gate 4</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>2 mins ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div style={{ position: 'relative', marginLeft: '4px' }} ref={profileRef}>
          <div onClick={() => setShowProfile(!showProfile)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '4px', borderRadius: '24px', transition: 'background 0.2s' }}>
            <div className="desktop-only" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{userName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>System Admin</div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              {userName.charAt(0)}
            </div>
          </div>
          
          {showProfile && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '260px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 100, padding: '16px' }}>
              {isEditingName ? (
                <div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }} autoFocus />
                    <button type="button" onClick={handleNameSave} style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Check size={16} /></button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>{userName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '16px' }}>System Administrator</div>
                  <button type="button" onClick={() => { setIsEditingName(true); setTempName(userName); }} style={{ width: '100%', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Edit2 size={16} /> Change Profile Name</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Filters (HQ/Local + Dropdown) - Full width on Mobile, Inline on Desktop */}
      <div className="mobile-filters-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', order: 5 }}>
        
        {/* Sleek Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <button 
            type="button"
            onClick={() => { setUserRole('HEAD_OFFICE'); setActiveLocationFilter('All Locations'); }}
            style={{ padding: '6px 16px', border: 'none', background: userRole === 'HEAD_OFFICE' ? 'white' : 'transparent', color: userRole === 'HEAD_OFFICE' ? '#0f172a' : '#64748b', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: userRole === 'HEAD_OFFICE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
          >
            HQ
          </button>
          <button 
            type="button"
            onClick={() => { setUserRole('LOCAL_SITE'); setActiveLocationFilter('Lugoba'); }}
            style={{ padding: '6px 16px', border: 'none', background: userRole === 'LOCAL_SITE' ? 'white' : 'transparent', color: userRole === 'LOCAL_SITE' ? '#0f172a' : '#64748b', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: userRole === 'LOCAL_SITE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
          >
            Local
          </button>
        </div>

        {/* Location Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <div className="desktop-only" style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={16} color="#3b82f6" />
          </div>
          {userRole === 'HEAD_OFFICE' ? (
            <div style={{ position: 'relative', width: '100%' }}>
              <select 
                value={activeLocationFilter}
                onChange={(e) => setActiveLocationFilter(e.target.value)}
                style={{ width: '100%', appearance: 'none', padding: '8px 36px 8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', outline: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          ) : (
            <div style={{ width: '100%', padding: '8px 16px', borderRadius: '8px', background: '#f8fafc', color: '#94a3b8', border: '1px solid #e2e8f0', fontSize: '0.875rem', fontWeight: 500, cursor: 'not-allowed' }}>
              Lugoba (Local Mode)
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
'''

code = re.sub(r'return \(\s*<header className="top-header".*', new_return, code, flags=re.DOTALL)

with open('src/components/Header.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

