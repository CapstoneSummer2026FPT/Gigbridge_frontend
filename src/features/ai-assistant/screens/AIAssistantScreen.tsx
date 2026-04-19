import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, FileText, Code, BarChart2, Lightbulb, Upload, X, Zap, MessageSquare } from 'lucide-react';
import { AppLayout } from '../../../shared/components/AppLayout';
import { useApp } from '../../../app/providers/AppProvider';

interface ChatMessage { role: 'user' | 'ai'; content: string; type?: 'text' | 'code' | 'insight'; timestamp: Date; }

const AI_FEATURES = [
  { icon: <FileText size={18} />, label: 'Proposal Writer', desc: 'Generate compelling proposals', color: '#00F0FF' },
  { icon: <Code size={18} />, label: 'Code Review', desc: 'Analyze and improve code', color: '#9F4BFF' },
  { icon: <BarChart2 size={18} />, label: 'Progress Insights', desc: 'Analyze project health', color: '#22C55E' },
  { icon: <Lightbulb size={18} />, label: 'Skill Advisor', desc: 'Career growth suggestions', color: '#F59E0B' },
];

const QUICK_PROMPTS = [
  'Write a proposal for a React developer role',
  'Analyze my earning trends and suggest improvements',
  'What skills should I learn next for maximum income?',
  'Draft a project status update for my client',
  'How can I improve my profile to get more jobs?',
  'Generate a professional bio for my portfolio',
];

const AI_RESPONSES: Record<string, { content: string; type: 'text' | 'insight' }> = {
  proposal: {
    content: `# AI-Generated Proposal\n\n**Subject: Experienced React Developer Ready to Deliver Excellence**\n\nDear [Client Name],\n\nThank you for posting this exciting opportunity. I am a Senior React Developer with 7+ years of experience building scalable, high-performance web applications, and I believe I am the perfect fit for your project.\n\n**Why Choose Me:**\n• Expert-level proficiency in React, TypeScript, and Next.js\n• Delivered 30+ similar projects with 4.9/5 client satisfaction\n• Strong communication and proactive project management\n• Available for daily stand-ups and quick questions\n\nI would love to discuss how I can bring your vision to life. Let's schedule a quick call!\n\nBest regards`,
    type: 'text',
  },
  skills: {
    content: `**🚀 Top Skills to Learn for Maximum Income in 2026:**\n\n1. **AI/ML Integration** (avg $125/hr, +142% demand)\n   - Learn: OpenAI API, LangChain, vector databases\n   \n2. **Web3 & Blockchain** (avg $115/hr, +89% demand)\n   - Learn: Solidity, ethers.js, DeFi protocols\n   \n3. **Cloud Architecture** (avg $110/hr, +52% demand)\n   - Learn: AWS CDK, Kubernetes, serverless\n\n**💡 Recommendation:** Your current React skills are highly valued. Adding AI/ML integration would likely increase your hourly rate by 30-40%.`,
    type: 'insight',
  },
  default: {
    content: `I understand your request. Based on my analysis of your profile and current market trends, here are my recommendations:\n\n**Immediate Actions:**\n1. Update your profile with recent project keywords (TypeScript, AI integration)\n2. Your proposal acceptance rate can improve by responding within 2 hours\n3. Adding a video introduction can increase interview invitations by 67%\n\n**Market Insight:** React developers in your experience range are averaging $95-115/hr in Q2 2026, placing you competitively at $95/hr. Consider a rate review in 2 months.\n\nHow else can I help you today?`,
    type: 'insight',
  },
};

export default function AIAssistantScreen() {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your personal AI Career Assistant, powered by GigBridge Intelligence.\n\nI can help you with:\n• Writing winning proposals\n• Analyzing your earning patterns\n• Career growth recommendations  \n• Code and document review\n• Project progress insights\n\nWhat would you like to accomplish today?`,
      type: 'text',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: messageText, type: 'text', timestamp: new Date() }]);
    setInput('');
    setIsThinking(true);

    await new Promise(r => setTimeout(r, 1200));

    const lowerText = messageText.toLowerCase();
    let response = AI_RESPONSES.default;
    if (lowerText.includes('proposal')) response = AI_RESPONSES.proposal;
    if (lowerText.includes('skill')) response = AI_RESPONSES.skills;

    setIsThinking(false);
    setMessages(prev => [...prev, { role: 'ai', content: response.content, type: response.type, timestamp: new Date() }]);
  };

  return (
    <AppLayout fullWidth>
      <div className="flex h-[calc(100vh-4rem)]" style={{ background: '#0A0F1C' }}>
        {/* Left Panel - Features */}
        <div className="hidden md:flex flex-col w-64 flex-shrink-0 p-4 overflow-y-auto"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          {/* AI Avatar */}
          <div className="text-center mb-6 pt-2">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center animate-orb"
              style={{ background: 'radial-gradient(circle at 30% 30%, rgba(0,240,255,0.9), rgba(159,75,255,0.7))' }}>
              <Bot size={36} style={{ color: '#0A0F1C' }} />
            </div>
            <p className="text-white font-bold">GigBridge AI</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
              <p className="text-xs" style={{ color: '#22C55E' }}>Online · Instant Response</p>
            </div>
          </div>

          {/* Features */}
          <p className="text-xs font-semibold mb-3" style={{ color: '#8892A4' }}>AI CAPABILITIES</p>
          <div className="space-y-2 mb-6">
            {AI_FEATURES.map(feature => (
              <button key={feature.label}
                onClick={() => setActiveFeature(activeFeature === feature.label ? null : feature.label)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  background: activeFeature === feature.label ? `${feature.color}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeFeature === feature.label ? feature.color + '40' : 'rgba(255,255,255,0.06)'}`,
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: feature.color + '20' }}>
                  <span style={{ color: feature.color }}>{feature.icon}</span>
                </div>
                <div>
                  <p className="text-white text-xs font-medium">{feature.label}</p>
                  <p className="text-[10px]" style={{ color: '#8892A4' }}>{feature.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Prompts */}
          <p className="text-xs font-semibold mb-3" style={{ color: '#8892A4' }}>QUICK PROMPTS</p>
          <div className="space-y-1">
            {QUICK_PROMPTS.slice(0, 4).map(prompt => (
              <button key={prompt} onClick={() => sendMessage(prompt)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#8892A4' }}>
                {prompt.length > 35 ? prompt.slice(0, 35) + '...' : prompt}
              </button>
            ))}
          </div>

          {/* Document Analyzer */}
          <div className="mt-6 upload-zone p-4" onClick={() => {}}>
            <Upload size={18} className="mx-auto mb-1" style={{ color: '#8892A4' }} />
            <p className="text-xs text-white font-medium">Analyze Document</p>
            <p className="text-[10px]" style={{ color: '#8892A4' }}>PDF, DOCX, Code files</p>
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,15,28,0.8)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center animate-orb"
                style={{ background: 'linear-gradient(135deg, #00F0FF, #9F4BFF)' }}>
                <Bot size={16} style={{ color: '#0A0F1C' }} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">GigBridge AI Assistant</p>
                <p className="text-xs" style={{ color: '#22C55E' }}>Powered by Advanced Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-purple text-xs">GPT-4o Enhanced</span>
              <button className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8892A4' }}
                onClick={() => setMessages([])}>
                Clear Chat
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'ai' ? (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                    style={{ background: 'linear-gradient(135deg, #00F0FF, #9F4BFF)' }}>
                    <Bot size={14} style={{ color: '#0A0F1C' }} />
                  </div>
                ) : (
                  <img src={user?.avatar} alt="" className="w-8 h-8 rounded-xl flex-shrink-0 mt-1" />
                )}
                <div className={`max-w-2xl ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className="px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,150,255,0.1))'
                        : msg.type === 'insight'
                          ? 'linear-gradient(135deg, rgba(159,75,255,0.08), rgba(0,240,255,0.04))'
                          : 'rgba(255,255,255,0.05)',
                      border: msg.role === 'user'
                        ? '1px solid rgba(0,240,255,0.25)'
                        : msg.type === 'insight'
                          ? '1px solid rgba(159,75,255,0.2)'
                          : '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    }}>
                    {msg.content}
                  </div>
                  <p className="text-[10px] px-1" style={{ color: '#4B5563' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00F0FF, #9F4BFF)' }}>
                  <Bot size={14} style={{ color: '#0A0F1C' }} />
                </div>
                <div className="px-5 py-4 rounded-2xl flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <span className="text-xs ml-1" style={{ color: '#8892A4' }}>AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts mobile */}
          <div className="px-5 py-2 flex gap-2 overflow-x-auto md:hidden">
            {QUICK_PROMPTS.slice(0, 3).map(p => (
              <button key={p} onClick={() => sendMessage(p)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8892A4' }}>
                {p.slice(0, 25)}...
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask me anything about your career, proposals, code..."
                  rows={2}
                  className="input-gb w-full px-4 py-3 resize-none text-sm"
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isThinking}
                className="btn-cyan p-3 rounded-xl flex-shrink-0 disabled:opacity-40 flex items-center gap-2">
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: '#4B5563' }}>
              AI responses are generated for guidance. Always verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
