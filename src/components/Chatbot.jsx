import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';

// ── Groq API (free, no GCP setup needed) ─────────────────────────────────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile'; // free, fast, multilingual

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are BioSense AI, an expert veterinary and livestock health assistant embedded inside a smart IoT cattle-monitoring platform called "BioSense Collar System".

Your role:
- Answer questions about cattle health, diseases, feeding, and farm management
- Interpret live telemetry data (heart rate, body temperature, battery, GPS) from smart collars
- Give actionable veterinary first-aid advice
- Recommend when to contact a vet urgently
- Support BOTH English and Tamil (தமிழ்) languages — always reply in the SAME language the user writes in

Guidelines:
- Keep answers concise but helpful (2–4 sentences unless more detail is needed)
- Use simple language suitable for Indian dairy farmers
- Reference specific collar IDs and animal names when the user mentions them
- If a reading seems dangerous (temp > 40°C, heart rate < 40 or > 120 BPM), flag it clearly with ⚠️
- Never make up sensor readings — only use the live data provided in each message
- Be warm, reassuring, and practical`;

export default function Chatbot() {
  const { cattle, t, language } = useContext(AppContext);
  const [messages, setMessages]         = useState([]);
  const [inputText, setInputText]       = useState('');
  const [isListening, setIsListening]   = useState(false);
  const [speakResponses, setSpeakResponses] = useState(true);
  const [isThinking, setIsThinking]     = useState(false);
  const [chatHistory, setChatHistory]   = useState([]); // multi-turn memory
  const chatEndRef    = useRef(null);
  const recognitionRef = useRef(null);

  // ── Welcome message ───────────────────────────────────────────────────────────
  useEffect(() => {
    setMessages([{
      sender: 'bot',
      text: language === 'ta'
        ? 'வணக்கம்! நான் BioSense AI உதவியாளர். உங்கள் கால்நடைகளின் உடல்நிலை, வெப்பநிலை, இதயத்துடிப்பு பற்றி எந்த கேள்வியும் கேளுங்கள். நான் தமிழிலும் பதில் சொல்வேன்! 🐄'
        : language === 'hi'
        ? 'नमस्ते! मैं बायोसेन्स एआई सहायक हूँ। अपने पशुओं के स्वास्थ्य के बारे में कुछ भी पूछें। मैं हिंदी में भी जवाब दूंगा! 🐄'
        : "Hello! I'm BioSense AI, your smart livestock health assistant. Ask me anything about your cattle's health, sensor readings, or farm advice. I understand Hindi and Tamil too! 🐄",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatHistory([]); // reset history on language change
  }, [language]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ── Speech Recognition ────────────────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    rec.onstart  = () => setIsListening(true);
    rec.onend    = () => setIsListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
      handleSend(transcript);
    };
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported. Please use Google Chrome.');
      return;
    }
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
  };

  // ── Speech Synthesis ──────────────────────────────────────────────────────────
  const speakText = (text) => {
    if (!speakResponses) return;
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    const voices = window.speechSynthesis?.getVoices() || [];
    const voice  = voices.find(v => v.lang.startsWith(language === 'ta' ? 'ta' : language === 'hi' ? 'hi' : 'en'));
    if (voice) utterance.voice = voice;
    window.speechSynthesis?.speak(utterance);
  };

  // ── Live telemetry context ────────────────────────────────────────────────────
  const buildCattleContext = () => {
    if (!cattle || cattle.length === 0) return 'No cattle registered yet.';
    return cattle.map(c =>
      `Collar ID ${c.id} | Name: ${c.name}${c.nickname ? ` (${c.nickname})` : ''} | Breed: ${c.breed} | Age: ${c.age} | Status: ${c.status} | Heart Rate: ${c.telemetry.heartRate} BPM | Temperature: ${c.telemetry.temperature}°C | Battery: ${c.telemetry.battery}%`
    ).join('\n');
  };

  // ── Send to Groq ──────────────────────────────────────────────────────────────
  const handleSend = async (textToSend = inputText) => {
    if (!textToSend.trim() || isThinking) return;

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: '⚠️ Groq API key not configured. Please add VITE_GROQ_API_KEY to your .env file. Get a free key at console.groq.com',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      }]);
      return;
    }

    const userMessage = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    // Enrich user message with live telemetry
    const enrichedText = `[Live Farm Telemetry]\n${buildCattleContext()}\n\n[User Question]\n${textToSend}`;

    // Build full conversation for Groq (OpenAI format)
    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory,
      { role: 'user', content: enrichedText },
    ];

    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model:       GROQ_MODEL,
          messages:    groqMessages,
          temperature: 0.7,
          max_tokens:  512,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const responseText = data.choices?.[0]?.message?.content || 'No response received.';

      // Save to conversation history (without telemetry in user turn to save tokens)
      setChatHistory(prev => [
        ...prev,
        { role: 'user',      content: textToSend },
        { role: 'assistant', content: responseText },
      ]);

      setMessages(prev => [...prev, {
        sender: 'bot',
        text:   responseText,
        time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      speakText(responseText);

    } catch (err) {
      console.error('Groq error:', err);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text:   `⚠️ ${err.message}`,
        time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = language === 'ta'
    ? [
        { label: 'காலர் 101 நிலை என்ன?',       query: 'காலர் 101 இன் தற்போதைய நிலை என்ன?' },
        { label: 'வெப்பநிலை அதிகமாக இருந்தால்?', query: 'மாட்டின் வெப்பநிலை அதிகமாக இருந்தால் என்ன செய்வது?' },
        { label: 'அவசரநிலையில் என்ன செய்வது?',  query: 'என் மாடு Emergency நிலையில் உள்ளது. என்ன செய்வது?' },
      ]
    : language === 'hi'
    ? [
        { label: 'कॉलर 101 की स्थिति?',      query: 'कॉलर 101 की वर्तमान स्वास्थ्य स्थिति क्या है?' },
        { label: 'उच्च तापमान सलाह?',       query: 'मेरी गाय का शरीर का तापमान अधिक है। मुझे क्या करना चाहिए?' },
        { label: 'आपातकालीन कदम?',         query: 'मेरा एक पशु आपातकालीन स्थिति में है। मुझे तुरंत क्या कदम उठाने चाहिए?' },
      ]
    : [
        { label: 'Status of Collar 101?',    query: 'What is the current health status of Collar ID 101?' },
        { label: 'High temperature advice?', query: 'My cattle has a high body temperature. What should I do?' },
        { label: 'Emergency action steps?',  query: 'One of my cattle is in Emergency status. What immediate steps should I take?' },
      ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold font-display">{t('BioSense AI Assistant', 'BioSense AI உதவியாளர்')}</h3>
              <span className="flex items-center gap-1 text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles size={9} />
                Llama 3.3
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] text-emerald-100 font-semibold uppercase tracking-wider">
                {t('AI Powered · Voice Enabled', 'AI இயக்கம் · குரல் வசதி')}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSpeakResponses(!speakResponses)}
          className={`p-2 rounded-xl transition-all ${speakResponses ? 'bg-white/20 text-white' : 'bg-slate-800/40 text-slate-300'}`}
          title={speakResponses ? 'Mute Voice' : 'Unmute Voice'}
        >
          {speakResponses ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] flex gap-2.5 items-start">
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 text-emerald-500 mt-0.5">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-tl-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[9px] block text-right mt-1.5 font-medium ${msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Thinking dots */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 text-emerald-500">
                <Bot size={16} />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-2.5 bg-slate-100/50 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-1.5 items-center shrink-0">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
          <HelpCircle size={12} />
          {t('Suggestions:', 'பரிந்துரைகள்:')}
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.query)}
            disabled={isThinking}
            className="text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full transition-all disabled:opacity-50"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
        <button
          onClick={toggleListening}
          className={`p-3 rounded-xl transition-all relative shrink-0 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
          }`}
          title={isListening ? 'Stop listening' : 'Voice Input'}
        >
          {isListening ? (
            <>
              <MicOff size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
            </>
          ) : (
            <Mic size={20} />
          )}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            isListening  ? t('Listening...', 'கேட்கிறது...', 'सुन रहा है...')
            : isThinking ? t('AI is thinking...', 'AI யோசிக்கிறது...', 'AI सोच रहा है...')
            : t('Ask anything about your livestock...', 'உங்கள் மாடுகளைப் பற்றி கேளுங்கள்...', 'अपने पशुओं के बारे में कुछ भी पूछें...')
          }
          disabled={isListening || isThinking}
          className="flex-1 bg-slate-50 dark:bg-slate-850 dark:text-slate-100 border border-slate-200 dark:border-slate-750 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-60 transition-all"
        />

        <button
          onClick={() => handleSend()}
          disabled={isThinking || !inputText.trim()}
          className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-md shadow-emerald-700/10 hover:shadow-lg hover:shadow-emerald-700/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          title="Send"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
