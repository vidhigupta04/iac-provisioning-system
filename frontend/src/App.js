import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({ name: '', fertilizer: '', quantity: '', area: '' });

  // EC2 Backend URL
  const API_BASE_URL = "http://3.106.250.251:5001/api";

  // 1. Function to handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        fetchData();
      } else {
        alert("Invalid User ID or Password");
      }
    } catch (err) {
      alert("Backend is offline. Check your EC2 connection!");
    }
  };

  // 2. Fetch Dashboard Data from Database
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/crops`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCrops(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  // 3. Save New Crop to Database
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormData({ name: '', fertilizer: '', quantity: '', area: '' });
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // --- VIEW 1: LOGIN PAGE ---
  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <span className="leaf-icon">🌿</span>
            <h2>AgriConnect</h2>
            <p>Enter credentials to access farm data</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>User Email</label>
              <input 
                type="email" 
                placeholder="admin@farm.com" 
                onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                required 
              />
            </div>
            <button type="submit" className="login-btn">Secure Login</button>
            {/* Demo Login for bypass */}
            <button type="button" style={{marginTop: '10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer'}} onClick={() => setIsLoggedIn(true)}>Demo Login (Bypass)</button>
          </form>
          <div className="login-footer">Protected by Agri-Secure IaC</div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: YOUR UPDATED DASHBOARD ---
  return (
    <div className="farm-portal">
      <nav className="top-nav">
        <div className="logo">🌿 <span>AgriConnect</span> Portal</div>
        <button className="logout-link" onClick={() => setIsLoggedIn(false)}>Logout</button>
      </nav>

      <header className="hero-stats">
        <h2>Welcome back, Farmer!</h2>
        <p>You have <b>{crops.length}</b> active crop batches in your database.</p>
      </header>

      <div className="main-grid">
        {/* Form Section */}
        <section className="form-container">
          <h3>🌱 Log New Planting</h3>
          <form onSubmit={handleSave}>
            <label>Crop Name</label>
            <input 
              placeholder="e.g. Organic Wheat" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required
            />
            
            <label>Fertilizer Used</label>
            <input 
              placeholder="e.g. NPK / Compost" 
              value={formData.fertilizer} 
              onChange={e => setFormData({...formData, fertilizer: e.target.value})} 
            />
            
            <div className="row">
              <div className="col">
                <label>Quantity (kg)</label>
                <input 
                  type="number" 
                  value={formData.quantity} 
                  onChange={e => setFormData({...formData, quantity: e.target.value})} 
                />
              </div>
              <div className="col">
                <label>Land Area (Acres)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.area} 
                  onChange={e => setFormData({...formData, area: e.target.value})} 
                />
              </div>
            </div>
            <button className="btn-save" type="submit">Add to Inventory</button>
          </form>
        </section>

        {/* Inventory Cards Section */}
        <section className="inventory-grid">
          {crops.map((crop, i) => (
            <div className="crop-card" key={i}>
              <div className="card-header">
                <h4>{crop.name}</h4>
                <span className="badge">Active</span>
              </div>
              <div className="card-details">
                <p><strong>Fertilizer:</strong> {crop.fertilizer || 'Not Specified'}</p>
                <p><strong>Quantity:</strong> {crop.quantity} kg</p>
                <p><strong>Coverage:</strong> {crop.area} Acres</p>
                <p className="time">ID: #{crop.id || i+1} | Recorded in Database</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;