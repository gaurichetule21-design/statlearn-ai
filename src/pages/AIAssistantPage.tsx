import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Bot, Send, User, Sparkles, BookOpen, Award, Layers, Loader2, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PROMPT_SUGGESTIONS = [
  'Explain Gross Value Added (GVA) at basic prices vs market prices in SNA 2008.',
  'How do we handle sub-sample replicate variance estimation in NSS multi-stage designs?',
  'What are the mandatory DPDP Act 2023 anonymization requirements for survey microdata?',
  'Which Python libraries and workflows should I use to transition from manual Excel tabulation?',
  'Explain the modified Laspeyres formula used in All-India CPI compilation.',
];

export const AIAssistantPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Namaste, **${currentUser?.name || 'Officer'}**! I am **StatLearn AI**, your dedicated Official Statistics & Competency Advisor.
      
I am grounded in your profile as **${currentUser?.designation || 'Statistical Officer'}** in the **${currentUser?.department || 'Ministry of Statistics'}**. 

How may I assist you today? You can ask me to:
- Explain complex econometric & statistical concepts (SNA 2008, Sampling Design, Price Indices)
- Guide you through Python & SQL workflows for official data pipelines
- Recommend targeted iGOT Karmayogi or NSSTA modules for your competency gaps
- Clarify statutory compliance under the DPDP Act 2023`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await api.chatAssistant(text, historyPayload);

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content:
            'I encountered an operational error while processing your request. Please check your connectivity and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col">
      {/* Header & Context Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
            <Bot className="w-4 h-4" />
            <span>AI Statistical Advisor</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">StatLearn AI Copilot</h1>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">{currentUser?.name}</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400">{currentUser?.jobRoleTitle}</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-amber-500 text-slate-950' : 'bg-indigo-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="prose prose-invert prose-xs max-w-none space-y-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
                <div
                  className={`text-[10px] mt-2 text-right ${
                    isUser ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analyzing official statistical methodologies & guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="py-2 shrink-0">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {PROMPT_SUGGESTIONS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 px-3 py-1.5 rounded-full transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="pt-2 border-t border-slate-800 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:border-amber-500 transition-colors"
        >
          <input
            type="text"
            placeholder="Ask anything on official statistics, Python pipelines, survey design, or iGOT modules..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center space-x-1"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
