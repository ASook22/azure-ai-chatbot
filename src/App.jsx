import React, { useState, useRef, useEffect } from 'react';

export default function App() {

  // 1. Core States initialized with Single New Chat Instance 
  const [conversations, setConversations] = useState([
    {id: "chat1", title: 'New Chat'},
  ]);

  const [activeChat, setActiveChat] = useState("chat1");

  const [chatMessages, setChatMessages] = useState({
    "chat-initial": [{ id: "m-init", sender: "bot", text: "Hello! I am your AI assistant. How can I help you today?" }]
  });

  const [input,setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatendRef = useRef(null);

  // Target isolated text stream matching the active highlighted sidebar item container. 
  const activeMessages = chatMessages[activeChat] || [];

 // 2. Auto-scroll to the latest message when messages update
 useEffect(() => {
  chatendRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [activeMessages, isTyping]);

  // 3. Handles Form submission and mock AI responses with letter-by-letter streaming
   // 3. Handles Form submission and mock AI responses with letter-by-letter streaming
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userPrompt = input.trim();
    const userMessage = { id: Date.now(), sender: 'user', text: userPrompt };
    
    // Check if this is the very first user prompt in this active chat session
    const isFirstMessage = (chatMessages[activeChat] || []).filter(m => m.sender === 'user').length === 0;

    // If it's the first message, rename the sidebar item and header text instantly
    if (isFirstMessage) {
      setConversations(prevConversations =>
        prevConversations.map(chat =>
          chat.id === activeChat
            ? { ...chat, title: userPrompt}
            : chat
        )
      );
    }

    // Lock user message bubble directly inside the key matching the active chat session id
    setChatMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), userMessage]
    }));
    
    setInput("");
    setIsTyping(true);

    // Calculate the accurate title name right here before entering the async timeout loop
    const targetTitle = isFirstMessage 
      ? userPrompt
      : (conversations.find(chat => chat.id === activeChat)?.title || "This Conversation");

    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false);

      // Clean title Name variable using our extracted targetTitle
          // FIXED: Pointed the template variable directly to your stable pre-calculated targetTitle
      const rawResponse = `Local Response: I processed your text regarding "${userMessage.text}" inside your "${targetTitle}" workspace.`;

     
      const botMessageId = Date.now() + 1;
      const initialBotBubble = { id: botMessageId, sender: 'bot', text: "" };

      // Initialize an empty response capsule bounded safely inside the active tracking frame ID mapping
      setChatMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), initialBotBubble]
      }));

      let currentCharacterIndex = 0;

      const typingTimer = setInterval(() => {
        if (currentCharacterIndex < rawResponse.length) {
          const nextLetter = rawResponse.charAt(currentCharacterIndex);
          
          setChatMessages(prevChats => ({
            ...prevChats,
            [activeChat]: prevChats[activeChat].map(msg => 
              msg.id === botMessageId ? { ...msg, text: msg.text + nextLetter } : msg
            )
          }));
          
          currentCharacterIndex++;
        } else {
          clearInterval(typingTimer);
        }
      }, 20);

    }, 1200);
  };


    // 4. Appends a clean new workspace chat session card item to the sidebar 
  const handleNewChat = () => {
    const currentChatHasNoMessages = (chatMessages[activeChat] || []).length === 0;

    if (currentChatHasNoMessages && conversations.find(c => c.id === activeChat)?.title == "New Chat") {
      return;
    }

    const newId = `chat-${Date.now()}`;
    const newChat = { id: newId, title: "New Chat" };

    setConversations(prev => [...prev, newChat]);
    setActiveChat(newId);
    setChatMessages(prev => ({ ...prev, 
      [newId]: [{ id: Date.now(), sender: "bot", text: "Started a fresh chat instance channel. How can I assist you today?" }] }));
  };

  const handleDeleteChat = () => {

    if (conversations.length === 1) {
      const resetId = `chat-${Date.now()}`;
      setConversations([{ id: resetId, title: "New Chat" }]);
      setActiveChat(resetId);
      setChatMessages({ [resetId]: [{ id: Date.now(), sender: "bot", text: "Hello! I am your AI assistant. How can I help you today?" }] 
    
    }); 
    return;
    }

    const currentActiveIndex = conversations.findIndex(c => c.id === activeChat);
    const fallbackActiveChat = currentActiveIndex === 0 
    ? conversations[1].id 
    : conversations[currentActiveIndex - 1].id;

    setConversations(prev => prev.filter(c => c.id !== activeChat));
    setActiveChat(prev => {
      const updatedMessages = { ...prev};
      delete updatedMessages[activeChat];
      return fallbackActiveChat;
    });

    setActiveChat(fallbackActiveChat);
}



  return (
    <div className="app-layout">
      {/*Sidebar Navigation Panel Layout*/}

        <header className="chat-header">
          <h2>AI Chatbot</h2>
          <span className="status-badge local">Local Dev</span>
        </header>

      <div className="main-content">
        
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
        <div className="chat-window-title">
          <h3>{conversations.find(c => c.id === activeChat)?.title || "Chat Console Workspace"}</h3>
          <button className="delete-chat-btn" onClick={handleDeleteChat} title="Delete Chat">
            🗑️
          </button>
        </div>

        <section className="message-area">
  
           {activeMessages.filter(m => m.sender === 'user').length === 0 ? (
            <div className="welcome-container">
              <h1>Welcome to your AI Assistant!</h1>
              <p>Send a prompt below to get started.</p>
            </div>
          ) : (
            /* Otherwise, loop over your messages state array dynamically to build individual bubbles */
            activeMessages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                <p className="bubble-content">{msg.text}</p>
              </div>
            ))
          )}
        
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
    </div>
  );
}