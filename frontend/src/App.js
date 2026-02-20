import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [crops, setCrops] = useState([]);
  const [newCrop, setNewCrop] = useState({ name: '', type: '' });

  // Fetch Crops from Flask
  const fetchCrops = () => {
    fetch('http://127.0.0.1:5000/api/crops')
      .then(res => res.json())
      .then(data => setCrops(data));
  };

  useEffect(() => {
    if (isLoggedIn) fetchCrops();
  }, [isLoggedIn]);

  const handleAddCrop = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/api/crops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCrop),
    }).then(() => {
      fetchCrops();
      setNewCrop({ name: '', type: '' });
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="login-card">
        <h3>User Login</h3>
        <button className="btn" onClick={() => setIsLoggedIn(true)}>Demo Login</button>
      </div>
    );
  }

  return (
    <div>
      <Navbar user="Farmer John" onLogout={() => setIsLoggedIn(false)} />
      <div className="container">
        <h3>Crop Management</h3>
        <form onSubmit={handleAddCrop} style={{ marginBottom: '20px' }}>
          <input placeholder="Crop Name" value={newCrop.name} onChange={e => setNewCrop({...newCrop, name: e.target.value})} />
          <input placeholder="Type" value={newCrop.type} onChange={e => setNewCrop({...newCrop, type: e.target.value})} />
          <button type="submit">Add Crop</button>
        </form>

        <table className="crop-table">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Status</th></tr>
          </thead>
          <tbody>
            {crops.map((c, i) => (
              <tr key={i}><td>{c.name}</td><td>{c.type}</td><td>{c.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;