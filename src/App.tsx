import { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase, supabaseConfigError, supabaseConfigured, Message } from './lib/supabase';

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

const ENV_TEMPLATE =
  'VITE_SUPABASE_URL=https://<proje-id>.supabase.co\nVITE_SUPABASE_ANON_KEY=<anon-public-key>';

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
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!supabaseConfigured) {
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabaseConfigured) return;

    if (!userMessage.trim()) return;

    setIsLoading(true);

    try {
      let imageUrl = null;

      if (selectedImage && imagePreview) {
        imageUrl = imagePreview;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: selectedSubject,
          user_message: userMessage,
          image_url: imageUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        setUserMessage('');
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto h-screen flex flex-col">
        <header className="bg-white shadow-sm py-6 px-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Öğretmen</h1>
          <p className="text-gray-600 mt-1">Sorularını sor, öğrenmeye başla</p>
        </header>

        {!supabaseConfigured && (
          <div className="mx-6 mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800">
            <strong>Yapılandırma eksik:</strong> Lütfen proje kök dizininde bir{' '}
            <code className="font-mono bg-yellow-100 px-1 rounded">.env</code> dosyası oluşturun ve
            aşağıdaki değişkenleri ekleyin:
            <pre className="mt-2 text-sm bg-yellow-100 rounded p-2 overflow-x-auto">
              {ENV_TEMPLATE}
            </pre>
            {supabaseConfigError && (
              <p className="mt-2 text-sm font-semibold text-yellow-900">{supabaseConfigError}</p>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">Henüz mesaj yok. İlk soruyu sor!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-2xl">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-md">
                      <div className="text-xs font-semibold mb-1 opacity-90">{message.subject}</div>
                      <p className="whitespace-pre-wrap">{message.user_message}</p>
                      {message.image_url && (
                        <img
                          src={message.image_url}
                          alt="User uploaded"
                          className="mt-3 rounded-lg max-w-xs"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {message.ai_response && (
                  <div className="flex justify-start">
                    <div className="max-w-2xl bg-white rounded-2xl rounded-tl-sm px-5 py-3 shadow-md">
                      <div className="text-xs font-semibold mb-1 text-blue-600">AI Öğretmen</div>
                      <p className="text-gray-800 whitespace-pre-wrap">{message.ai_response}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={isLoading}
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoading}
              >
                <ImageIcon className="w-5 h-5" />
                Görsel Seç
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {imagePreview && (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Sorunuzu buraya yazın..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !userMessage.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-end"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Gönder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
