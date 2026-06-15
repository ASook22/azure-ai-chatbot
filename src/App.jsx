import React from 'react';

export default function App() {
  return (
    <div className="app-layout">
      
      {/*Sidebar Navigation Panel Layout*/}
      <aside className="sidebar">
        <button className="new-chat-btn">+ New Chat</button>
        <div className="history-list">
          <p className="section-title">Recent Chats</p>
          <div className="history-item active">💬 Project Brainstorming</div>
          <div className="history-item">💬React Debugging Help</div> 
        </div>
      </aside>

      {/*Main Conversation Window Layout Dashboard*/}
      <main className="chat-container">
        <header className="chat-header">
          <h2>Active Session: Local Core</h2>
          <span className="status-badge local">Local Dev</span>
        </header>

        <section className="message-area">
          <div className="message-bubble bot">
            <div className="bubble-content"> Hello! I am your local AI assistant. How can I help you today?</div>
          </div>
          <div className="message-bubble user">
            <div className="bubble-content"> testing my application layout structure!</div>
          </div>
        </section>

        <form className="input-area">
          <input type="text" placeholder="Type your prompt here..." />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}