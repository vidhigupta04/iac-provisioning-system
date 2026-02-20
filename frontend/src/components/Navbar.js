import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav style={{ backgroundColor: '#2e7d32', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
      <h2 style={{ margin: 0 }}>Agri-Connect</h2>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '15px' }}>Welcome, {user}</span>
            <button onClick={onLogout} style={{ cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <span>Please Login</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;