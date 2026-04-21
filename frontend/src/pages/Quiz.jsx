import React, { useState, useEffect, useRef } from "react";
import "./Assistant.css";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const navigate = useNavigate();
  const chatBodyRef = useRef(null);

  const [questions, setQuestions] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentContext, setCurrentContext] = useState("");

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chat]);

  const getQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/quiz/question");
      if (!res.ok) throw new Error("Backend unreachable");
      
      const data = await res.json();
      const rawText = data.raw_text; 
      setCurrentContext(data.context || "General Agriculture Knowledge");

      const questionsArray = rawText.split(/\d+\./).filter(q => q.trim() !== "");
      setQuestions(questionsArray);
      setCurrentIndex(0);
      setChat([{ role: "bot", text: `Question 1: ${questionsArray[0]}` }]);
    } catch (err) {
      alert("Backend error! Please ensure your Flask server (app.py) is running.");
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setChat((prev) => [...prev, { role: "bot", text: `Question ${nextIdx + 1}: ${questions[nextIdx]}` }]);
      setMessage("");
    }
  };

  const sendAnswer = async () => {
    if (!message) return;
    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentIndex],
          answer: message,
          context: currentContext
        }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { role: "bot", text: `📢 Feedback: ${data.feedback}` }]);
      setMessage(""); 
    } catch (err) {
      alert("Failed to connect to backend for feedback.");
    }
  };

  return (
    <div className="assistant-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="chat-header">
          📘 Agriculture Quiz Bot ({questions.length > 0 ? currentIndex + 1 : 0}/10)
        </div>

        <div className="chat-body" ref={chatBodyRef} style={{ flex: 1, overflowY: 'auto' }}>
          {chat.map((msg, i) => (
            <div key={i} className={msg.role} style={{ 
                backgroundColor: msg.text.includes("Feedback") ? "#e1ffc7" : "#f0f0f0",
                color: "#333", padding: "12px", borderRadius: "10px", margin: "8px 0",
                maxWidth: "85%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start"
              }}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="bot">Connecting to server...</div>}
        </div>

        {/* BOTTOM INPUT AND NAVIGATION SECTION */}
        <div className="quiz-controls-footer" style={{ padding: '20px', background: '#fff', borderTop: '1px solid #ddd' }}>
          <div className="chat-input" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            {questions.length === 0 ? (
              <button onClick={getQuestions} className="start-btn" style={{ width: '100%', padding: '15px' }}>
                🎯 Start 10 Question Quiz
              </button>
            ) : (
              <>
                <input
                  style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your answer..."
                  disabled={chat[chat.length - 1]?.text.includes("Feedback")}
                />
                <button 
                  onClick={sendAnswer} 
                  className="submit-btn" 
                  disabled={chat[chat.length - 1]?.text.includes("Feedback") || !message}
                  style={{ padding: '10px 20px' }}
                >
                  Submit
                </button>
                <button 
                  onClick={handleNext} 
                  className="next-btn" 
                  disabled={currentIndex === questions.length - 1 || !chat[chat.length - 1]?.text.includes("Feedback")} 
                  style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', borderRadius: '5px', border: 'none' }}
                >
                  Next ➡
                </button>
              </>
            )}
          </div>
          
          {/* THE BACK BUTTON CENTERED AT THE VERY BOTTOM */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={() => navigate("/")} 
              style={{ 
                background: 'none', 
                border: '1px solid #666', 
                padding: '8px 25px', 
                borderRadius: '20px', 
                cursor: 'pointer',
                color: '#444'
              }}
            >
              ⬅ Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;