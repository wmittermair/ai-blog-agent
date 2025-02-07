import React, { useState } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Öffne den Chat-Verlauf beim ersten Senden
    if (!isHistoryOpen) {
      setIsHistoryOpen(true);
    }

    // Füge Nutzer-Nachricht hinzu
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    
    // Mock-Antwort
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Dies ist eine Test-Antwort vom KI-Assistenten. Ich helfe Ihnen gerne, mehr über die Themen in diesem Artikel zu erfahren.", 
        sender: 'bot' 
      }]);
    }, 1000);

    setInputText('');
  };

  return (
    <div className="chat-widget centered">
      {isHistoryOpen && (
        <div className="chat-history">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Stellen Sie eine Frage zum Artikel..."
        />
        <button type="submit">Fragen</button>
      </form>
    </div>
  );
};

export default ChatWidget;
