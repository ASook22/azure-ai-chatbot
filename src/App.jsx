import React, { useState, useRef, useEffect } from 'react';

export default function App() {
  // 1. Core States
  const [conversations, setConversations] = useState([
    { id: "chat1", title: 'New Chat' },
  ]);

  const [activeChat, setActiveChat] = useState("chat1");

  const [chatMessages, setChatMessages] = useState({
    "chat1": [{ id: "m-init", sender: "bot", text: "Hello! I am your AI assistant. How can I help you today?" }]
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatendRef = useRef(null);
  const activeMessages = chatMessages[activeChat] || [];

  // 2. Auto-scroll to the latest message
  useEffect(() => {
    chatendRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  // 3. Handles Form submission and live Azure API call
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userPrompt = input.trim();
    const userMessage = { id: Date.now(), sender: 'user', text: userPrompt };

    // Check if this is the first user prompt to rename the chat
    const isFirstMessage = (chatMessages[activeChat] || []).filter(m => m.sender === 'user').length === 0;

    if (isFirstMessage) {
      setConversations(prev => prev.map(chat => 
        chat.id === activeChat ? { ...chat, title: userPrompt } : chat
      ));
    }

    // Add user message to UI
    setChatMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), userMessage]
    }));

    setInput("");
    setIsTyping(true);

    try {
      // Connect to your backend
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) throw new Error("Failed to connect");

      const data = await response.json();
      const botMessage = { id: Date.now() + 1, sender: 'bot', text: data.reply };

      // Update UI with Azure response
      setChatMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), botMessage]
      }));
    } catch (error) {
      console.error("Backend error:", error);
      const errorMsg = { id: Date.now() + 1, sender: 'bot', text: "Error: Could not reach the server." };
      setChatMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), errorMsg] }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-layout">
      <header className="chat-header">
      <h2>AI Chatbot</h2>
      {/* Dynamic status badge that changes based on activity */}
    </header>

      <div className="main-content">
        <main className="chat-container">
          <div className="chat-window-title">
            <h3>{conversations.find(c => c.id === activeChat)?.title || "Chat Console"}</h3>
          </div>

          <section className="message-area">
            {activeMessages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                <p className="bubble-content">{msg.text}</p>
              </div>
            ))}

            {isTyping && (
              <div className="message-bubble bot">
                <div className="bubble-content">
                  <div className="typing-indicator"> 
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatendRef} />
          </section>

          <form className="input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your prompt here..."
              disabled={isTyping}
            />
            <button type="submit" disabled={!input.trim() || isTyping}>Send</button>
          </form>

          <div className="chat-footer">
          <p>Powered by Azure OpenAI | AI can make mistakes. Consider checking important information.</p>
        </div>
        </main>
      </div>
    </div>
  );
}