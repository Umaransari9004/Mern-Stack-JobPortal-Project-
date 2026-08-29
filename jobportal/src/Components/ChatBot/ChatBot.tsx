import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.tsx';
import QuickReplies from './QuickReplies.tsx';
// @ts-ignore: allow importing CSS without declaration file
import './ChatBot.css';
import { IconBriefcase } from '@tabler/icons-react';

// ═══════════════════════════════════════════════════════
//  🔧 CONFIGURE: Replace with your n8n Production Webhook URL
// ═══════════════════════════════════════════════════════
const N8N_WEBHOOK_URL = 'https://umaransari.app.n8n.cloud/webhook/chatbot';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  quickReplies?: string[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialQuickActions = [
    '🔍 Search Jobs',
    '📝 How to Apply',
    '📄 Resume Tips',
    '👤 Account Help',
    '💬 Talk to Support'
  ];

  // Initialize session
  useEffect(() => {
    let sid = localStorage.getItem('chatbot_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chatbot_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, showWelcome]);

  const toggleChat = () => setIsOpen(!isOpen);

  const formatTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async (text: string, isQuickReply = false) => {
    if (!text.trim()) return;
    if (showWelcome) setShowWelcome(false);

    const newUserMsg: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: formatTimestamp()
    };

    setMessages(prev => {
      const updated = [...prev];
      if (updated.length > 0 && updated[updated.length - 1].sender === 'bot') {
        const lastBot = { ...updated[updated.length - 1] };
        delete lastBot.quickReplies;
        updated[updated.length - 1] = lastBot;
      }
      return [...updated, newUserMsg];
    });

    if (!isQuickReply) setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId })
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.reply || data.response || data.message || data.text || "Sorry, I received an empty response.",
        sender: 'bot',
        timestamp: formatTimestamp(),
        quickReplies: data.quickReplies || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: formatTimestamp()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-['Inter',system-ui,sans-serif]">

      {/* ── Chat Window ── */}
      <div className={`cb-window absolute bottom-20 right-0 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden ${isOpen ? 'open' : ''}`}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4 flex justify-between items-center text-white shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg backdrop-blur-sm"><IconBriefcase/></div>
            <div className="flex flex-col">
              <strong className="text-base tracking-wide">JobPortal Bot</strong>
              <span className="text-xs flex items-center gap-1.5 opacity-90">
                <span className="cb-status-dot w-2 h-2 bg-green-400 rounded-full inline-block"></span> Online
              </span>
            </div>
          </div>
          <button onClick={toggleChat} className="bg-transparent border-none text-white text-3xl cursor-pointer opacity-80 hover:opacity-100 transition-opacity leading-none p-0">
            &times;
          </button>
        </div>

        {/* Messages */}
        <div className="cb-messages flex-1 bg-gray-50 px-4 py-5 overflow-y-auto flex flex-col gap-4 scroll-smooth">
          {showWelcome ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-14 h-14 text-blue-400 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg shadow-blue-500/20"><IconBriefcase/></div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Hi there! 👋</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">I'm JobBot. How can I help you with your career today?</p>
              <div className="flex flex-wrap justify-center gap-2.5 w-full">
                <QuickReplies replies={initialQuickActions} onQuickReply={(r: string) => sendMessage(r, true)} />
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div key={msg.id} className="flex flex-col w-full">
                  <ChatMessage text={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
                  {msg.quickReplies && msg.quickReplies.length > 0 && index === messages.length - 1 && (
                    <QuickReplies replies={msg.quickReplies} onQuickReply={(r: string) => sendMessage(r, true)} />
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="cb-msg flex self-start items-start">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs flex-shrink-0">💼</div>
                    <div className="flex items-center gap-1 px-4 py-4 bg-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                      <div className="cb-typing-dot w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60"></div>
                      <div className="cb-typing-dot w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60"></div>
                      <div className="cb-typing-dot w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center gap-3 z-10">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-blue-500 border-none flex items-center justify-center cursor-pointer transition-all hover:bg-blue-600 hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white translate-x-px">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Floating Bubble ── */}
      <button
        onClick={toggleChat}
        className="cb-bubble w-[60px] h-[60px] rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/30 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 border-none absolute bottom-0 right-0 z-[10000]"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
