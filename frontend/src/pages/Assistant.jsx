import React, { useState, useEffect, useRef } from "react";
import "./Assistant.css";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

function Assistant() {
  const navigate = useNavigate();
  const chatBodyRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chat]);

  const sendQuery = async () => {
    if (!message) return;
    setLoading(true);
    setChat((prev) => [...prev, { role: "user", text: message }]);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { role: "bot", text: data.response }]);
      setMessage("");
    } catch (err) {
      alert("AI Error! Server check karein.");
    }
    setLoading(false);
  };

return (
    <div className="assistant-container">
      <div className="chat-area">
        <div className="chat-header">🤖 AgriConnect AI Assistant</div>

        <div className="chat-body" ref={chatBodyRef}>
          {chat.map((msg, i) => (
            <div key={i} className={msg.role} style={{ 
                backgroundColor: msg.role === "bot" ? "#f0f0f0" : "#e1ffc7",
                padding: "10px", borderRadius: "10px", margin: "8px 0",
                maxWidth: "80%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start"
            }}>
              {/* 🟢 CHANGE THIS LINE: Wrap msg.text with ReactMarkdown */}
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
        </div>

        <div className="assistant-footer" style={{ padding: '20px', borderTop: '1px solid #ddd' }}>
          {/* ... (footer code remains the same) */}
          <div className="chat-input" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type here..."
              style={{ flex: 1, padding: '10px' }}
            />
            <button onClick={sendQuery}>Send</button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => navigate("/")} 
              style={{ background: 'white', border: '1px solid #444', padding: '6px 20px', borderRadius: '20px', cursor: 'pointer' }}
            >
              ⬅ Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assistant;