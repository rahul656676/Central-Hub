import React from 'react';
import { 
  LayoutDashboard, Map, Settings, AlertTriangle, 
  FileText, Truck, Shield, HardHat, Car, 
  Package, Flame, Users, Activity, Droplets 
} from 'lucide-react';

const Sidebar = ({ isOpen, activeSolution, setActiveSolution, closeSidebar }) => {
  const solutions = [
    { name: 'Overview', icon: <LayoutDashboard size={18} /> },
    { name: 'PPE Monitoring', icon: <HardHat size={18} /> },
    { name: 'ANPR & Containers', icon: <Car size={18} /> },
    { name: 'Counting & Throughput', icon: <Package size={18} /> },
    { name: 'Loitering Detection', icon: <Users size={18} /> },
    { name: 'Spillage Control', icon: <Droplets size={18} /> },
    { name: 'Fire & Smoke', icon: <Flame size={18} /> },
    { name: 'Productivity', icon: <Activity size={18} /> },
    { name: 'Intrusion Alerts', icon: <Shield size={18} /> }
  ];

  const systemManagement = [
    { name: 'Configuration', icon: <Settings size={18} /> },
    { name: 'Alert Rules', icon: <AlertTriangle size={18} /> },
    { name: 'Reports', icon: <FileText size={18} /> },
    { name: 'Fleet Admin', icon: <Truck size={18} /> }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <Activity size={28} className="icon" />
        <span>Central Hub</span>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section-title">AI Solutions</div>
        {solutions.map((item) => (
          <div 
            key={item.name}
            className={`nav-item ${activeSolution === item.name ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveSolution(item.name);
              if (closeSidebar) closeSidebar();
            }}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
        
        <div className="nav-section-title" style={{ marginTop: '24px' }}>System Management</div>
        {systemManagement.map((item) => (
          <div 
            key={item.name}
            className={`nav-item ${activeSolution === item.name ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveSolution(item.name);
              if (closeSidebar) closeSidebar();
            }}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
