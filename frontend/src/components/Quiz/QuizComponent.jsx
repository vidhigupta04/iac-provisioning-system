import React, { useState } from 'react';

// Yeh component sirf logic handle karega aur child ko data pass karega
const QuizComponent = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAllQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/quiz/question");
      const data = await res.json();
      
      // AI response ko individual questions mein split karna
      // Agar backend string bhej raha hai toh regex use karenge
      const rawText = data.question;
      const questionsArray = rawText.split(/\d+\./).filter(q => q.trim() !== "");
      
      setQuestions(questionsArray);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Hum yeh saare functions aur data Quiz.jsx ko bhej rahe hain
  return children({
    questions,
    currentQuestion: questions[currentIndex],
    currentIndex,
    fetchAllQuestions,
    nextQuestion,
    loading
  });
};

export default QuizComponent;