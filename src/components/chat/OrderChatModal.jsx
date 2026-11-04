import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bike, Check, CheckCheck, Clock, ShieldCheck, Sparkles, Phone } from 'lucide-react';
import { playStatusNotificationChime } from '../../lib/soundNotifications';

export function OrderChatModal({
  isOpen,
  onClose,
  orderId = 'GADA-8291',
  riderName = 'Babatunde Adeleke',
  riderPhone = '+234 907 268 8238',
  storeName = 'Store Dispatch'
}) {
  const [messages, setMessages] = useState(() => {
    const storageKey = `gada_chat_${orderId}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'msg_init',
        sender: 'rider',
        text: `Hello! I'm ${riderName}, your assigned Gadaride courier for order #${orderId}. I've picked up your package and am on my way.`,
        time: 'Just now',
        status: 'delivered'
      }
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(`gada_chat_${orderId}`, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages, orderId]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Simulate Rider Typing & Response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      playStatusNotificationChime();

      let replyText = 'Understood! Arriving shortly at your delivery address.';
      const lower = text.toLowerCase();
      if (lower.includes('gate') || lower.includes('outside')) {
        replyText = "Copy that, I'm pulling up to your gate in 2 minutes. Please keep your phone reachable!";
      } else if (lower.includes('where') || lower.includes('eta') || lower.includes('far')) {
        replyText = "Currently around your zone corridor. Traffic is clear, ETA is roughly 5 - 10 minutes.";
      } else if (lower.includes('call') || lower.includes('phone')) {
        replyText = "Sure, I will ring you as soon as I arrive at the dropoff point.";
      } else if (lower.includes('security') || lower.includes('leave')) {
        replyText = "Noted! I will hand the parcel over to your estate security post.";
      }

      const riderReply = {
        id: `msg_${Date.now() + 1}`,
        sender: 'rider',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };

      setMessages((prev) => [...prev, riderReply]);
    }, 1500);
  };

  const quickReplies = [
    "I'm at the gate",
    "Please call when outside",
    "What's your current ETA?",
    "Leave package with security"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
        {/* Chat Header */}
        <div
          style={{
            background: '#FFFFFF',
            color: '#0F172A',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B00, #EA580C)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255, 107, 0, 0.25)'
                }}
              >
                <Bike size={20} color="#FFFFFF" />
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid #FFFFFF'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  {riderName}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    background: '#DCFCE7',
                    color: '#166534',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontWeight: '800',
                    border: '1px solid #BBF7D0'
                  }}
                >
                  ● Online Courier
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', fontWeight: '500' }}>
                Order <strong style={{ color: '#0F172A' }}>#{orderId}</strong> &bull; <span style={{ color: '#059669', fontWeight: '700' }}>En route</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href={`tel:${riderPhone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '800',
                background: '#059669',
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                textDecoration: 'none'
              }}
              title={`Call ${riderName}`}
            >
              <Phone size={14} color="#FFFFFF" />
              <span>Call</span>
            </a>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#F1F5F9',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E2E8F0',
                cursor: 'pointer'
              }}
              title="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Delivery Security Badge */}
        <div className="bg-emerald-50 px-4 py-2 text-[11px] text-emerald-900 flex items-center justify-between border-b border-emerald-100 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Encrypted In-App Rider & Customer Channel</span>
          </div>
          <span className="text-emerald-700 font-bold">Fast Response</span>
        </div>

        {/* Scrollable Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          <div className="text-center my-2">
            <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
              Today • Order #{orderId} Live Dispatch
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === 'customer';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-amber-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 px-1">
                  <span>{m.time}</span>
                  {isMe && <CheckCheck size={12} className="text-amber-600" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-2xl rounded-bl-none w-fit">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </span>
              <span className="text-[11px] font-medium text-gray-500">{riderName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Shortcuts */}
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr) => (
            <button
              key={qr}
              type="button"
              onClick={() => handleSend(qr)}
              className="text-[11px] bg-gray-50 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 border border-gray-200 rounded-full px-3 py-1 text-gray-600 shrink-0 transition"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type message to your rider..."
            className="flex-1 text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="h-10 w-10 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderChatModal;
