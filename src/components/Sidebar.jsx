import React from 'react';
import { LayoutDashboard, MapPin, Settings, ShieldAlert, BarChart3, Truck } from 'lucide-react';

const locations = [
  "Premix (Micocheni + Taifa)",
  "Impala",
  "Lugoba",
  "Container Depot (AFICD)",
  "AILL 1 and 2 / Polytra",
  "Fuel Depot and Yard",
  "Lake Steel",
  "Pipe and Cylinder",
  "Lake Aviation (Dar, Kilimanjaro, Zanzibar)",
  "Lake Trans",
  "Building Solution",
  "Kings Apartment and Offices",
  "Lake Pipe Showroom and Retail sites"
];

const Sidebar = ({ activeLocation, setActiveLocation, isOpen, setIsOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <LayoutDashboard className="icon" size={28} />
        <span>Central Hub</span>
      </div>
      
      <div className="sidebar-nav">
        <div className="nav-section-title">Main View</div>
        <div 
          className={`nav-item ${activeLocation === 'All Locations' ? 'active' : ''}`}
          onClick={() => {
            setActiveLocation('All Locations');
            if (window.innerWidth <= 768) setIsOpen(false);
          }}
        >
          <MapPin size={18} />
          <span>All Locations (Overview)</span>
        </div>
        
        <div className="nav-section-title">Facilities & Depots</div>
        {locations.map((loc, index) => (
          <div 
            key={index} 
            className={`nav-item ${activeLocation === loc ? 'active' : ''}`}
            onClick={() => {
              setActiveLocation(loc);
              if (window.innerWidth <= 768) setIsOpen(false);
            }}
            title={loc}
          >
            <span style={{ minWidth: '18px', display: 'flex', justifyContent: 'center' }}>•</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loc}</span>
          </div>
        ))}
        
        <div className="nav-section-title">System Management</div>
        <div 
          className={`nav-item ${activeLocation === 'Configuration' ? 'active' : ''}`}
          onClick={() => {
            setActiveLocation('Configuration');
            if (window.innerWidth <= 768) setIsOpen(false);
          }}
        >
          <Settings size={18} />
          <span>Configuration</span>
        </div>
        <div 
          className={`nav-item ${activeLocation === 'Alert Rules' ? 'active' : ''}`}
          onClick={() => {
            setActiveLocation('Alert Rules');
            if (window.innerWidth <= 768) setIsOpen(false);
          }}
        >
          <ShieldAlert size={18} />
          <span>Alert Rules</span>
        </div>
        <div 
          className={`nav-item ${activeLocation === 'Reports' ? 'active' : ''}`}
          onClick={() => {
            setActiveLocation('Reports');
            if (window.innerWidth <= 768) setIsOpen(false);
          }}
        >
          <BarChart3 size={18} />
          <span>Reports</span>
        </div>
        <div 
          className={`nav-item ${activeLocation === 'Fleet Admin' ? 'active' : ''}`}
          onClick={() => {
            setActiveLocation('Fleet Admin');
            if (window.innerWidth <= 768) setIsOpen(false);
          }}
        >
          <Truck size={18} />
          <span>Fleet Admin</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
