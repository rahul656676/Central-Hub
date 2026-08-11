import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css';
import './index.css';

function App() {
  const [activeSolution, setActiveSolution] = useState('Overview');
  const [activeLocationFilter, setActiveLocationFilter] = useState('All Locations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('Rahul Jangir');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeSolution={activeSolution} 
        setActiveSolution={setActiveSolution} 
      />
      
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      <main className="main-content">
        <Header 
          toggleSidebar={toggleSidebar} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          userName={userName}
          setUserName={setUserName}
          activeLocationFilter={activeLocationFilter}
          setActiveLocationFilter={setActiveLocationFilter}
        />
        <Dashboard 
          activeSolution={activeSolution} 
          activeLocationFilter={activeLocationFilter}
          searchQuery={searchQuery} 
          userName={userName}
        />
      </main>
    </div>
  );
}

export default App;
