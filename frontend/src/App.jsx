import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

// Pages Import
import Assistant from "./pages/Assistant";
import Quiz from "./pages/Quiz";

/* ---------------- LOGIN COMPONENT ---------------- */
function Login({ onLoginSuccess }) {
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await res.json();
            if (data.success) {
                onLoginSuccess();
            } else {
                alert("Invalid User ID or Password");
            }
        } catch (err) {
            alert("Backend is offline. Start your Python app!");
        }
    };

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
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Secure Login</button>
                </form>
                <div className="login-footer">Protected by Agri-Secure IaC</div>
            </div>
        </div>
    );
}

/* ---------------- HOME / DASHBOARD COMPONENT ---------------- */
function Home({ onLogout }) {
    const [crops, setCrops] = useState([]);
    const [formData, setFormData] = useState({ name: '', fertilizer: '', quantity: '', area: '' });
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/api/crops');
            const data = await res.json();
            if (Array.isArray(data)) setCrops(data);
        } catch (err) {
            console.error("Fetch error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        await fetch('http://127.0.0.1:5000/api/crops', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        setFormData({ name: '', fertilizer: '', quantity: '', area: '' });
        fetchData();
    };

    return (
        <div className="farm-portal">
            <nav className="top-nav">
                <div className="logo">🌿 <span>AgriConnect</span> Portal</div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="logout-link" onClick={() => navigate("/assistant")}>🤖 AI Assistant</button>
                    <button className="logout-link" onClick={() => navigate("/quiz")}>📘 Quiz Bot</button>
                    <button className="logout-link" onClick={onLogout}>Logout</button>
                </div>
            </nav>

            <header className="hero-stats">
                <h2>Welcome back, Farmer!</h2>
                <p>You have <b>{crops.length}</b> active crop batches in your database.</p>
            </header>

            <div className="main-grid">
                <section className="form-container">
                    <h3>🌱 Log New Planting</h3>
                    <form onSubmit={handleSave}>
                        <label>Crop Name</label>
                        <input
                            placeholder="e.g. Organic Wheat"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <label>Fertilizer Used</label>
                        <input
                            placeholder="e.g. NPK / Compost"
                            value={formData.fertilizer}
                            onChange={e => setFormData({ ...formData, fertilizer: e.target.value })}
                        />
                        <div className="row">
                            <div className="col">
                                <label>Quantity (kg)</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <label>Land Area (Acres)</label>
                                <input
                                    type="number"
                                    value={formData.area}
                                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                                />
                            </div>
                        </div>
                        <button className="btn-save" type="submit">Add to Inventory</button>
                    </form>
                </section>

                <section className="inventory-grid">
                    {crops.map((crop, i) => (
                        <div className="crop-card" key={i}>
                            <div className="card-header">
                                <h4>{crop.crop_name || crop.name}</h4>
                                <span className="badge">Active</span>
                            </div>
                            <div className="card-details">
                                <p><strong>Fertilizer:</strong> {crop.fertilizer}</p>
                                <p><strong>Quantity:</strong> {crop.quantity} kg</p>
                                <p><strong>Coverage:</strong> {crop.area} Acres</p>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}

/* ---------------- MAIN APP ROUTER ---------------- */
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
    };

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
                />
                <Route 
                    path="/dashboard" 
                    element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/" />} 
                />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/quiz" element={<Quiz />} />
            </Routes>
        </Router>
    );
}