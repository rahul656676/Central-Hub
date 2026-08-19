import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Maximize, Menu, Minimize, Edit2, Check, MapPin } from 'lucide-react';

const Header = ({ 
  toggleSidebar, 
  searchQuery, setSearchQuery, 
  userName, setUserName, 
  activeLocationFilter, setActiveLocationFilter,
  userRole, setUserRole
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const locations = [
    'All Locations',
    'Premix (Micocheni + Taifa)',
    'Impala',
    'Lugoba',
    'Container Depot (AFICD)',
    'AILL 1 & 2 / Polytra',
    'Fuel Depot and Yard',
    'Lake Steel',
    'Pipe and Cylinder',
    'Lake Aviation',
    'Lake Trans',
    'Building Solution',
    'Kings Apartment and Offices',
    'Lake Pipe Showroom and Retail'
  ];

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
        setIsEditingName(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleNameSave = () => {
    setUserName(tempName);
    setIsEditingName(false);
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button type="button" className="icon-btn mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="header-search">
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search analytics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="header-actions">
        {/* Role Switcher Mockup */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '20px', padding: '4px', fontSize: '0.75rem', fontWeight: 600, marginRight: '8px' }}>
          <button 
            type="button"
            onClick={() => {
              setUserRole('HEAD_OFFICE');
              setActiveLocationFilter('All Locations');
            }}
            style={{ padding: '4px 12px', borderRadius: '16px', border: 'none', background: userRole === 'HEAD_OFFICE' ? 'white' : 'transparent', color: userRole === 'HEAD_OFFICE' ? 'var(--accent-blue)' : 'var(--text-secondary)', boxShadow: userRole === 'HEAD_OFFICE' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Central
          </button>
          <button 
            type="button"
            onClick={() => {
              setUserRole('LOCAL_SITE');
              setActiveLocationFilter('Lugoba');
            }}
            style={{ padding: '4px 12px', borderRadius: '16px', border: 'none', background: userRole === 'LOCAL_SITE' ? 'white' : 'transparent', color: userRole === 'LOCAL_SITE' ? 'var(--accent-blue)' : 'var(--text-secondary)', boxShadow: userRole === 'LOCAL_SITE' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Local Site
          </button>
        </div>

        {/* Location Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} color="var(--accent-blue)" />
          {userRole === 'HEAD_OFFICE' ? (
            <select 
              className="location-dropdown"
              value={activeLocationFilter}
              onChange={(e) => setActiveLocationFilter(e.target.value)}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          ) : (
            <div className="location-dropdown" style={{ background: '#f8fafc', color: 'var(--text-muted)', cursor: 'not-allowed' }}>
              Lugoba (Local Mode)
            </div>
          )}
        </div>

        <button type="button" className="icon-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button type="button" className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            <span className="badge">3</span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu" style={{ 
              position: 'absolute', top: '100%', right: 0, marginTop: '16px', 
              width: '300px', borderRadius: '12px', zIndex: 100, overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--card-border)', fontWeight: '600' }}>
                Notifications
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', marginTop: '6px' }}></div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Loitering Alert - Gate 4</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>2 mins ago</div>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', marginTop: '6px' }}></div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Spillage Detected - Bay B</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>15 mins ago</div>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', marginTop: '6px' }}></div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>System Update Complete</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>1 hr ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div style={{ position: 'relative' }} ref={profileRef}>
          <div className="user-profile" onClick={() => setShowProfile(!showProfile)}>
            <div className="user-info" style={{ textAlign: 'right' }}>
              <span className="user-name">{userName}</span>
              <span className="user-role">System Admin</span>
            </div>
            <div className="avatar">
              {userName.charAt(0)}
            </div>
          </div>
          
          {showProfile && (
            <div className="dropdown-menu" style={{ 
              position: 'absolute', top: '100%', right: 0, marginTop: '16px', 
              width: '260px', borderRadius: '12px', zIndex: 100, padding: '16px'
            }}>
              {isEditingName ? (
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Edit Name</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--card-border)', background: '#f8fafc', color: 'var(--text-primary)' }}
                      autoFocus
                    />
                    <button type="button" onClick={handleNameSave} style={{ background: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{userName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>System Administrator</div>
                  
                  <button 
                    type="button"
                    onClick={() => { setIsEditingName(true); setTempName(userName); }}
                    style={{ width: '100%', padding: '8px 12px', background: '#f8fafc', border: '1px solid var(--card-border)', borderRadius: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                    onMouseOut={(e) => e.target.style.background = '#f8fafc'}
                  >
                    <Edit2 size={16} /> Change Profile Name
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
