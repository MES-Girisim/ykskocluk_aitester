import { useState, useEffect, useRef } from 'react';
import { Send, ImagePlus, Loader2, BookOpen, X, Sparkles } from 'lucide-react';
import { Message } from './models/Message.ts';

const SUBJECTS = [
  'Matematik',
  'Biyoloji',
  'Kimya',
  'Fizik',
  'Türkçe',
  'Coğrafya',
  'Tarih',
  'Din',
];

const SUBJECT_ICONS: Record<string, string> = {
  Matematik: '∑',
  Biyoloji: '🧬',
  Kimya: '⚗️',
  Fizik: '⚛️',
  Türkçe: '📖',
  Coğrafya: '🌍',
  Tarih: '📜',
  Din: '☯️',
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() && !imagePreview) return;
    setIsLoading(true);
    try {
      let imageUrl = null;
      if (selectedImage && imagePreview) imageUrl = imagePreview;

      await new Promise((resolve) => setTimeout(resolve, 500));

      const placeholderMessage: Message = {
        id: crypto.randomUUID(),
        subject: selectedSubject,
        user_message: userMessage,
        image_url: imageUrl,
        ai_response: 'Merhaba, ben AI!',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, placeholderMessage]);
      setUserMessage('');
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-base: #0a0f0a;
          --bg-surface: #0f1710;
          --bg-elevated: #152016;
          --bg-card: #1a2b1c;
          --border: #243326;
          --border-bright: #2e4430;
          --green-dim: #22c55e22;
          --green-soft: #4ade80;
          --green-main: #22c55e;
          --green-bright: #86efac;
          --green-glow: #22c55e40;
          --text-primary: #e8f5e9;
          --text-secondary: #86a98a;
          --text-muted: #4a6b4e;
          --scrollbar-track: #0f1710;
          --scrollbar-thumb: #243326;
        }

        body {
          background: var(--bg-base);
          font-family: 'DM Sans', sans-serif;
          color: var(--text-primary);
          height: 100vh;
          overflow: hidden;
        }

        .app-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 860px;
          margin: 0 auto;
          position: relative;
        }

        .app-wrapper::before {
          content: '';
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #22c55e18 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* HEADER */
        .header {
          position: relative;
          z-index: 10;
          padding: 20px 28px 18px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(180deg, #0d150e 0%, transparent 100%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #166534, #15803d);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px var(--green-glow);
          flex-shrink: 0;
        }

        .header h1 {
          font-family: 'Sans', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .header-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 3px;
          letter-spacing: 0.3px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--green-dim);
          border: 1px solid var(--border-bright);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 500;
          color: var(--green-soft);
          letter-spacing: 0.3px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--green-main);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--green-main);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        /* SUBJECT PILLS */
        .subject-bar {
          display: flex;
          gap: 8px;
          padding: 14px 28px;
          overflow-x: auto;
          scrollbar-width: none;
          border-bottom: 1px solid var(--border);
          background: var(--bg-surface);
          flex-shrink: 0;
          position: relative;
          z-index: 5;
        }

        .subject-bar::-webkit-scrollbar { display: none; }

        .subject-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }

        .subject-pill:hover {
          border-color: var(--border-bright);
          color: var(--text-primary);
          background: var(--bg-elevated);
        }

        .subject-pill.active {
          background: linear-gradient(135deg, #166534, #15803d);
          border-color: #16a34a;
          color: #dcfce7;
          box-shadow: 0 0 16px var(--green-glow);
        }

        /* MESSAGES */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          z-index: 1;
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
        }

        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: var(--scrollbar-track); }
        .messages-area::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          opacity: 0.5;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-text {
          font-size: 14px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.6;
        }

        .msg-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: fadeUp 0.3s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .user-bubble-wrap {
          display: flex;
          justify-content: flex-end;
        }

        .user-bubble {
          max-width: 68%;
          min-width: 0;
          background: linear-gradient(135deg, #166534, #15803d);
          border-radius: 18px 18px 4px 18px;
          padding: 14px 18px;
          box-shadow: 0 4px 24px #166534aa;
        }

        .bubble-subject {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 6px;
          color: #86efac;
        }

        .bubble-text {
          font-size: 14.5px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
          overflow: hidden;
          color: #f0fdf4;
        }

        .bubble-img {
          margin-top: 10px;
          border-radius: 10px;
          max-width: 100%;
          max-height: 220px;
          object-fit: cover;
          border: 1px solid #ffffff22;
        }

        .ai-bubble-wrap {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          align-items: flex-start;
        }

        .ai-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #166534, #15803d);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          box-shadow: 0 0 12px var(--green-glow);
        }

        .ai-bubble {
          max-width: 68%;
          min-width: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-bright);
          border-radius: 18px 18px 18px 4px;
          padding: 14px 18px;
        }

        .ai-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--green-soft);
          margin-bottom: 6px;
        }

        .ai-text {
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--text-primary);
          white-space: pre-wrap;
          word-break: break-word;
          overflow-wrap: anywhere;
          overflow: hidden;
        }

        /* INPUT AREA */
        .input-area {
          position: relative;
          z-index: 10;
          padding: 16px 24px 20px;
          border-top: 1px solid var(--border);
          background: linear-gradient(0deg, #0a0f0a 70%, transparent 100%);
          flex-shrink: 0;
        }

        .image-preview-wrap {
          position: relative;
          display: inline-block;
          margin-bottom: 12px;
        }

        .image-preview {
          height: 72px;
          border-radius: 10px;
          border: 1px solid var(--border-bright);
          display: block;
        }

        .remove-img-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px;
          height: 22px;
          background: #dc2626;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: background 0.15s;
        }

        .remove-img-btn:hover { background: #b91c1c; }

        .input-row {
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        .textarea-wrap {
          flex: 1;
          position: relative;
        }

        .main-textarea {
          width: 100%;
          padding: 14px 48px 14px 16px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 14px;
          color: var(--text-primary);
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          line-height: 1.5;
          resize: none;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          min-height: 52px;
          max-height: 140px;
        }

        .main-textarea::placeholder { color: var(--text-muted); }

        .main-textarea:focus {
          border-color: var(--border-bright);
          box-shadow: 0 0 0 3px var(--green-glow);
        }

        .main-textarea:disabled { opacity: 0.5; cursor: not-allowed; }

        .img-attach-btn {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.15s;
        }

        .img-attach-btn:hover {
          border-color: var(--border-bright);
          color: var(--green-soft);
          background: var(--bg-card);
        }

        .img-attach-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .send-btn {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          transition: all 0.18s ease;
          box-shadow: 0 4px 16px var(--green-glow);
        }

        .send-btn:hover:not(:disabled) {
          box-shadow: 0 4px 24px #22c55e55;
          transform: translateY(-1px);
        }

        .send-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        /* CONFIG WARNING */
        .config-warning {
          margin: 16px 24px 0;
          padding: 14px 16px;
          background: #2d1b0022;
          border: 1px solid #78350f55;
          border-radius: 12px;
          color: #fbbf24;
          font-size: 13px;
          line-height: 1.5;
        }

        .config-warning code {
          font-family: 'Courier New', monospace;
          background: #78350f33;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 12px;
        }

        .config-warning pre {
          margin-top: 8px;
          background: #78350f22;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 11px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          line-height: 1.6;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

        <div className="app-wrapper">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <div className="logo-icon">
                <BookOpen size={20} color="#86efac" />
              </div>
              <div>
                <h1>AI Öğretmen</h1>
                <div className="header-subtitle">Sorularını sor, öğrenmeye başla</div>
              </div>
            </div>
            <div className="status-badge">
              <span className="status-dot" />
              Çevrimiçi
            </div>
          </header>

          {/* Subject pills */}
          <div className="subject-bar">
            {SUBJECTS.map((subject) => (
                <button
                    key={subject}
                    className={`subject-pill ${selectedSubject === subject ? 'active' : ''}`}
                    onClick={() => setSelectedSubject(subject)}
                >
                  <span>{SUBJECT_ICONS[subject]}</span>
                  {subject}
                </button>
            ))}
          </div>

          {/* Messages */}
          <div className="messages-area">
            {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Sparkles size={28} color="#4ade80" />
                  </div>
                  <div className="empty-text">
                    Henüz mesaj yok.<br />İlk soruyu sormak için hazırım!
                  </div>
                </div>
            ) : (
                messages.map((message) => (
                    <div key={message.id} className="msg-row">
                      <div className="user-bubble-wrap">
                        <div className="user-bubble">
                          <div className="bubble-subject">{message.subject}</div>
                          <p className="bubble-text">{message.user_message}</p>
                          {message.image_url && (
                              <img src={message.image_url} alt="Yüklenen görsel" className="bubble-img" />
                          )}
                        </div>
                      </div>

                      {message.ai_response && (
                          <div className="ai-bubble-wrap">
                            <div className="ai-avatar">
                              <Sparkles size={15} color="#86efac" />
                            </div>
                            <div className="ai-bubble">
                              <div className="ai-label">AI Öğretmen</div>
                              <p className="ai-text">{message.ai_response}</p>
                            </div>
                          </div>
                      )}
                    </div>
                ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-area">
            {imagePreview && (
                <div className="image-preview-wrap">
                  <img src={imagePreview} alt="Önizleme" className="image-preview" />
                  <button
                      className="remove-img-btn"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                  >
                    <X size={12} />
                  </button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <div className="textarea-wrap">
                <textarea
                    className="main-textarea"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Sorunuzu yazın... (Enter ile gönderin)"
                    rows={2}
                    disabled={isLoading}
                />
                  <button
                      type="button"
                      className="img-attach-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      title="Görsel ekle"
                  >
                    <ImagePlus size={15} />
                  </button>
                  <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                  />
                </div>

                <button
                    type="submit"
                    className="send-btn"
                    disabled={isLoading || (!userMessage.trim() && !imagePreview)}
                >
                  {isLoading ? (
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                      <Send size={20} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
  );
}

export default App;