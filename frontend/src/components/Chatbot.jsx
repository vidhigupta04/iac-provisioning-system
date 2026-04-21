import React, { useState } from "react";
import "./Chatbot.css";
import { useNavigate } from "react-router-dom";


function Chatbot() {
  const navigate = useNavigate(); 
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = { sender: "user", text: message };
    setChat([...chat, userMsg]);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.response,
      };

      setChat((prev) => [...prev, botMsg]);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button className="chat-btn" onClick={() => navigate("/assistant")}>
  💬
</button>

      {/* Chat Window */}
      {open && (
        <div className="chat-box">
          <div className="chat-header">🌾 Agri AI Assistant</div>

          <div className="chat-body">
            {chat.map((msg, i) => (
              <div key={i} className={msg.sender}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about crops..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;