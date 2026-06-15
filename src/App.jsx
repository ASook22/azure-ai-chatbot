import React, { useState, useRef, useEffect } from 'react';

export default function App() {

  // 1. Core States for Tracking Conversations and active dialogue loops
  const [conversations, setConversations] = useState([
    {id: "chat1", title: 'Project Brainstorming'},
    {id: "chat2", title: 'React Debugging Help'}
  ]);

  const [activeChat, setActiveChat] = useState("chat1");

  const [messages, setMessages] = useState([
    {id: "msg1", sender: "bot", text: "Hello! I am your local AI assistant. How can I help you today?"}
  ]);

  const [input,setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatendRef = useRef(null);

 // 2. Auto-scroll to the latest message when messages update
 useEffect(() => {
  chatendRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages, isTyping]);

  // 3. Handles Form submission and mock AI responses with letter-by-letter streaming
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to the conversation
    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false); // Turn off the bouncing dots loading container

      const rawResponse = `Local Response: I processed your text: "${userMessage.text}". Ready for real AI integration!`;
      
      // Spawn a blank placeholder bubble for the bot response
      const botMessageId = Date.now() + 1;
      const initialBotBubble = { id: botMessageId, sender: 'bot', text: "" };
      setMessages(prev => [...prev, initialBotBubble]);

      let currentCharacterIndex = 0;

      // Set up a micro-timer running every 25 milliseconds to pull letters
      const typingTimer = setInterval(() => {
        if (currentCharacterIndex < rawResponse.length) {
          const nextLetter = rawResponse.charAt(currentCharacterIndex);
          
          // Target the specific active bubble by its unique id and append the text
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === botMessageId 
                ? { ...msg, text: msg.text + nextLetter } 
                : msg
            )
          );
          
          currentCharacterIndex++;
        } else {
          // Break the loop interval once all characters print out completely
          clearInterval(typingTimer);
        }
      }, 25); // Lower number = faster typing speed

    }, 1500); // 1.5 seconds loading state delay
  };
 //4. Appends a clean new workspace chat session card item to the sidebar 

 const handleNewChat = () => {
  const newId = `chat-${Date.now()}`;
  const newChat = { id: newId, title: `New Chat ${conversations.length + 1}` };
  setConversations((prev) => [newChat, ...prev]);
  setActiveChat(newId);

  //clear out the main window sandbox displau for a fresh chat instance

  setMessages([
    {id: Date.now(), sender: "bot", text: "Started a fresh chat instance channel. How can I assist you today?"}
  ]);

};



  return (
    <div className="app-layout">
      {/*Sidebar Navigation Panel Layout*/}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>+ New Chat </button>
        <div className="history-list">
          <p className="section-title">Recent Chats</p>
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`history-item ${chat.id === activeChat ? 'active' : ''}`}
              onClick={() => setActiveChat(chat.id)}
            >
              💬{chat.title}
            </div>
          ))}
        </div>
      </aside>

      {/*Main Conversation Window Layout Dashboard*/}
      <main className="chat-container">
        <header className="chat-header">
          <h2>Active Session: Local Core</h2>
          <span className="status-badge local">Local Dev</span>
        </header>

        <section className="message-area">
           {/*Loop over your messages state array dynamically to build individual bubbles */}
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              <p className="bubble-content">{msg.text}</p>
            </div>
          ))}

          {/*Condidtional rendering for the animated pulsing thinking bubble*/}
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
      </main>
    </div>
  );
}