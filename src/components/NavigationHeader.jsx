import React from 'react';

export default function NavigationHeader({ currentTab, setCurrentTab }) {
  return (
    <header className="nav-header">
      <nav className="nav-links">
        <button 
          className={currentTab === 'checkout' ? 'active' : ''} 
          onClick={() => setCurrentTab('checkout')}
        >
          Pay appointment
        </button>
        <button 
          className={currentTab === 'history' ? 'active' : ''} 
          onClick={() => setCurrentTab('history')}
        >
          Payment history
        </button>
        <span className="nav-tag">Secure payments</span>
      </nav>
    </header>
  );
}