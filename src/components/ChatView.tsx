import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { Send, MessageSquare, Shield, Smile, Sparkles } from 'lucide-react';

interface ChatViewProps {
  currentUser: User;
  darkMode: boolean;
}

export default function ChatView({ currentUser, darkMode }: ChatViewProps) {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat rooms
  const loadChats = async () => {
    try {
      const res = await fetch(`/api/chats?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setChats(data);
        if (data.length > 0 && !selectedChat) {
          setSelectedChat(data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching chats', err);
    } finally {
      setLoadingChats(false);
    }
  };

  // Load message history
  const loadMessages = async (otherUserId: string) => {
    try {
      const res = await fetch(`/api/messages?senderId=${currentUser.id}&receiverId=${otherUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error loading messages', err);
    }
  };

  useEffect(() => {
    loadChats();
  }, [currentUser]);

  useEffect(() => {
    if (selectedChat?.otherUser) {
      loadMessages(selectedChat.otherUser.id);
      
      // Auto-poll every 5 seconds for simulation
      const interval = setInterval(() => {
        loadMessages(selectedChat.otherUser.id);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat?.otherUser) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedChat.otherUser.id,
          message: messageText
        })
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
        loadChats(); // refresh list snippet

        // Simulate reply after 1.5 seconds if talking to Roberto or Alice
        setTimeout(async () => {
          try {
            const replies = [
              "That sounds great! I'm free on weekends.",
              "Yes, let's schedule our next exchange session.",
              "I would love to help you with that!",
              "Feel free to look at the sessions tab and schedule a convenient slot."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];

            await fetch('/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                senderId: selectedChat.otherUser.id,
                receiverId: currentUser.id,
                message: `[Auto-Partner]: ${randomReply}`
              })
            });

            if (selectedChat?.otherUser) {
              loadMessages(selectedChat.otherUser.id);
            }
          } catch (replyErr) {
            console.error('Error simulating reply', replyErr);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <div className={`rounded-2xl border flex overflow-hidden h-[600px] transition ${
      darkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200/50 shadow-2xs'
    }`} id="chat-system-view">
      
      {/* Left Chat Thread List */}
      <div className={`w-1/3 border-r flex flex-col ${
        darkMode ? 'border-slate-900' : 'border-slate-100'
      }`}>
        <div className={`p-4 font-extrabold text-[10px] border-b uppercase tracking-widest ${
          darkMode ? 'border-slate-900 text-slate-400 bg-slate-950/50' : 'border-slate-100 text-slate-500 bg-slate-50/50'
        }`}>
          My Conversations
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900">
          {loadingChats ? (
            <div className="p-4 text-center text-xs text-slate-400">Loading conversations...</div>
          ) : chats.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <MessageSquare className="h-8 w-8 mx-auto text-slate-300" />
              <p className="font-semibold">No active chat threads found.</p>
              <p className="text-[10px] text-slate-400 leading-normal">Send a swap request to starting messaging partners!</p>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 flex items-center space-x-3 cursor-pointer transition-all ${
                  selectedChat?.id === chat.id 
                    ? 'bg-blue-600/10 dark:bg-blue-500/10 border-l-4 border-blue-600' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
              >
                <img
                  className="h-10 w-10 rounded-full object-cover border border-slate-200/50 dark:border-slate-800"
                  src={chat.otherUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt=""
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 text-xs text-left">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`font-bold truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {chat.otherUser?.name || 'Peer partner'}
                    </span>
                  </div>
                  <p className="text-slate-400 truncate text-[11px]">
                    {chat.lastMessage ? chat.lastMessage.message : 'No messages yet.'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Thread Message Pane */}
      <div className="w-2/3 flex flex-col justify-between bg-linear-to-b from-slate-50/10 to-transparent dark:from-slate-950/20">
        {selectedChat?.otherUser ? (
          <>
            {/* Contact Header */}
            <div className={`p-4 border-b flex items-center space-x-3 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md ${
              darkMode ? 'border-slate-900' : 'border-slate-100'
            }`}>
              <img
                className="h-9 w-9 rounded-full object-cover border border-slate-200/80 dark:border-slate-800"
                src={selectedChat.otherUser.avatar}
                alt=""
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className={`font-bold text-xs block ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {selectedChat.otherUser.name}
                </span>
                <span className="text-[9px] text-emerald-500 font-bold block flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active Peer Exchange
                </span>
              </div>
            </div>

            {/* Bubble logs */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                  Say hi to initiate your educational plan!
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  const isSystem = msg.senderId === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center">
                        <span className="inline-block px-3 py-1 bg-slate-500/10 border border-slate-500/20 text-slate-400 rounded-full text-[10px] font-mono">
                          {msg.message}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-2.5 text-xs ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none shadow-xs' 
                          : darkMode 
                            ? 'bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800' 
                            : 'bg-white text-slate-800 rounded-bl-none shadow-2xs border border-slate-100/60'
                      }`}>
                        <p className="leading-relaxed font-normal text-left">{msg.message}</p>
                        <span className="text-[9px] text-white/60 dark:text-slate-500 mt-1 block text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input submit form */}
            <form 
              onSubmit={handleSendMessage} 
              className={`p-3 border-t bg-white dark:bg-slate-950 ${
                darkMode ? 'border-slate-900' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message to organize dates, content or ask questions..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className={`flex-1 text-xs px-4 py-3 rounded-xl border focus:outline-hidden ${
                    darkMode ? 'bg-slate-900 border-slate-850 text-white focus:border-blue-500' : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition disabled:opacity-50 active:scale-95 cursor-pointer shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 p-6">
            <MessageSquare className="h-10 w-10 text-slate-400" />
            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">No Active Thread Selected</h3>
            <p className="text-xs text-slate-400 leading-normal max-w-xs text-center">Select a contact profile from the left drawer to read and write messages.</p>
          </div>
        )}
      </div>

    </div>
  );
}
