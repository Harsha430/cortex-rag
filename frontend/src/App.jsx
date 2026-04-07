import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, Upload, Shield, Globe, Cpu, User, Bot, 
  Loader2, FileText, MessageSquare, Settings, 
  History, Sparkles, Terminal, Plus, ChevronRight,
  Command, Box, Search
} from 'lucide-react';
import './index.css';

const API_BASE = 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (overrideInput = null) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        message: textToSend,
        history: messages
      });

      const aiMsg = { 
        role: 'ai', 
        content: response.data.response,
        tool: response.data.tool_used 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I encountered a neural disconnect. Please ensure the backend is running and try again.",
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE}/upload`, formData);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Successfully indexed **${file.name}**. You can now ask questions about its content.` 
      }]);
    } catch (error) {
      console.error(error);
      alert('Upload failed.');
    } finally {
      setUploading(false);
      fileRef.current.value = null;
    }
  };

  const quickPrompts = [
    { label: "Search trends", icon: <Globe size={14} />, text: "Search for the latest trends in AI engineering 2024" },
    { label: "Analyze Doc", icon: <FileText size={14} />, text: "Summarize the uploaded document and extract key insights" },
    { label: "Solve Math", icon: <Terminal size={14} />, text: "Calculate the compound interest for $10k at 5% over 10 years" }
  ];

  return (
    <div className="app-container">
      {/* Acrylic Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Box className="logo-icon" size={32} />
          <span className="logo-text">Cortex</span>
        </div>

        <div className="sidebar-section">
          <button 
            className="nav-item active" 
            onClick={() => setMessages([])}
            style={{ width: '100%', cursor: 'pointer', background: 'hsla(var(--primary) / 0.1)', border: '1px solid hsla(var(--primary) / 0.2)' }}
          >
            <Plus size={18} />
            <span style={{ fontWeight: 600 }}>New Session</span>
          </button>
          
          <div style={{ marginTop: '40px' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsla(var(--text-primary) / 0.3)', letterSpacing: '0.1em', marginBottom: '16px', paddingLeft: '8px' }}>
              Intelligence Core
            </p>
            <div className="nav-item active">
              <Command size={18} />
              <span>General Reasoning</span>
            </div>
            <div className="nav-item">
              <Shield size={18} />
              <span>Research Agent</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-white)', paddingTop: '20px' }}>
          <div className="nav-item">
            <Search size={18} />
            <span>Market Search</span>
          </div>
          <div className="nav-item">
            <Settings size={18} />
            <span>Preferences</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="session-badge">Neural Research v3</div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="file"
              ref={fileRef}
              onChange={handleUpload}
              style={{ display: 'none' }}
              accept=".pdf,.txt"
            />
            <button 
              onClick={() => fileRef.current.click()} 
              className="pill-btn"
              title="Inject Knowledge"
              style={{ width: 'auto', padding: '0 20px', borderRadius: '100px', gap: '8px', fontSize: '0.85rem' }}
            >
              {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              <span>Inject Knowledge</span>
            </button>
          </div>
        </header>

        <section className="chat-window" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="hero-v3">
              <div className="hero-glow">
                <Sparkles size={32} color="hsl(var(--primary))" />
              </div>
              <h1 className="hero-title">Cortex Intelligence</h1>
              <p className="hero-sub">
                The next generation of hybrid retrieval and reasoning. 
                Seamlessly integrated with web search, document indexing, and 
                Python-driven logic.
              </p>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {quickPrompts.map((prompt, i) => (
                  <button key={i} className="chip-v3" onClick={() => handleSend(prompt.text)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {prompt.icon}
                      {prompt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role}`}>
                <div className="avatar" style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: msg.role === 'user' ? 'hsl(var(--primary))' : 'hsla(var(--text-primary) / 0.05)',
                  border: msg.role === 'ai' ? '1px solid var(--border-white)' : 'none'
                }}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                  {msg.role === 'ai' && !msg.isError && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      {msg.tool === 'search_tool' && (
                        <div className="session-badge" style={{ color: '#60a5fa', borderColor: '#60a5fa44', background: '#60a5fa11' }}>
                          <Globe size={12} style={{ marginRight: '6px' }} /> WEB SEARCH
                        </div>
                      )}
                      {msg.tool === 'rag_tool' && (
                        <div className="session-badge" style={{ color: '#34d399', borderColor: '#34d39944', background: '#34d39911' }}>
                          <FileText size={12} style={{ marginRight: '6px' }} /> KNOWLEDGE BASE
                        </div>
                      )}
                      {msg.tool === 'python_repl_tool' && (
                        <div className="session-badge" style={{ color: '#f472b6', borderColor: '#f472b644', background: '#f472b611' }}>
                          <Terminal size={12} style={{ marginRight: '6px' }} /> LOGIC EXECUTION
                        </div>
                      )}
                      {!msg.tool && (
                        <div className="session-badge" style={{ color: 'hsla(var(--text-primary) / 0.4)', borderColor: 'var(--border-white)', background: 'transparent' }}>
                          <Cpu size={12} style={{ marginRight: '6px' }} /> CORE ENGINE
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="msg-row ai">
              <div className="avatar" style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                background: 'hsla(var(--text-primary) / 0.05)',
                border: '1px solid var(--border-white)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <div className="neural-pulse"></div>
              </div>
              <div className="ai-bubble shimmer-loading" style={{ minWidth: '200px', height: '60px' }}>
                {/* Neural Shimmer */}
              </div>
            </div>
          )}
        </section>

        <footer className="input-container">
          <div className="input-pill">
            <button className="pill-btn" style={{ marginLeft: '4px' }}>
              <Plus size={20} />
            </button>
            <input
              type="text"
              className="main-input"
              placeholder="Query the Cortex..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              className="pill-btn send-pill" 
              onClick={() => handleSend()} 
              disabled={!input.trim() || loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={22} />}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: 'hsla(var(--text-primary) / 0.2)', fontWeight: 600, letterSpacing: '0.02em' }}>
            ENGINEERED FOR PRECISION • AI MODEL L3.1-8B
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
