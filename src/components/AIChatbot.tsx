import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Minimize2, Brain, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Props {
  studentId: string;
  topicId?: string;
  subtopicId?: string;
  onClose?: () => void;
}

export function AIChatbot({ studentId, topicId = 'general', subtopicId, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your **AI Study Buddy** 🤖\n\nI can help you with:\n• 📚 Concept explanations\n• 💡 Problem-solving hints\n• 📋 Study plans\n• 🎯 What to learn next\n• 🎤 Interview prep\n\nWhat would you like help with?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking time with slight delay for realistic UX
    setTimeout(() => {
      const aiResponse = aiService.generateChatResponse(currentInput, {
        topicId,
        subtopicId,
        studentProgress: 0,
        studentId
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 600 + Math.random() * 400);
  };

  // Floating bubble when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center text-white z-50 group"
        title="Open AI Study Buddy"
      >
        <MessageCircle size={26} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
        
        {/* Tooltip */}
        <div className="absolute right-20 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Study Buddy
        </div>
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-white z-50"
        title="Open AI Study Buddy"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  // Format message text with basic markdown-like rendering
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold
      const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: boldFormatted }} />
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 w-[420px] max-h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Brain size={20} />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-1.5">
              AI Study Buddy
              <Sparkles size={14} className="text-yellow-300" />
            </h3>
            <p className="text-xs text-emerald-50">Powered by ML</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-white/15 rounded-lg transition-colors"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/15 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex gap-2 overflow-x-auto">
        {[
          { label: '💡 Hint', msg: 'Give me a hint' },
          { label: '📋 Plan', msg: 'Study plan' },
          { label: '🎯 Next', msg: 'What should I learn next?' },
          { label: '🎤 Interview', msg: 'Interview prep tips' }
        ].map(action => (
          <button
            key={action.label}
            onClick={() => {
              setInput(action.msg);
              setTimeout(() => {
                const btn = document.getElementById('chatbot-send-btn');
                btn?.click();
              }, 100);
            }}
            className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all whitespace-nowrap"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ maxHeight: '400px' }}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {formatText(message.text)}
              </div>
              <span className={`text-[10px] mt-2 block ${
                message.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your studies..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-gray-50"
            disabled={isLoading}
          />
          <button
            id="chatbot-send-btn"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-300 text-white px-4 py-2.5 rounded-xl transition-all flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
