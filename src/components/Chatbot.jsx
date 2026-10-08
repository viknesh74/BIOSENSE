import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX, HelpCircle, Sparkles, RotateCcw, Copy, Check, AlertTriangle } from 'lucide-react';

// ── Google Gemini API Configuration ───────────────────────────────────────────
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── Groq Fallback ─────────────────────────────────────────────────────────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are BioSense AI, an expert veterinary and livestock health assistant embedded inside the smart IoT cattle-monitoring platform "BioSense Collar System".

Your core capabilities:
- Answer questions about cattle health, common diseases (FMD, Mastitis, Bloat, Theileriosis, Lumpy Skin, etc.), nutrition, vaccination, and dairy farm management.
- Interpret real-time telemetry data (heart rate, body temperature, battery, GPS, activity) from smart collars.
- Provide step-by-step actionable veterinary first-aid and organic/home remedies suitable for Indian dairy farmers.
- Flag critical emergencies when vitals are dangerous (Body Temp > 39.5°C / 103°F or < 38°C, Heart Rate < 40 or > 100 BPM).
- Support English, Tamil (தமிழ்), and Hindi (हिंदी). Always respond in the EXACT same language the user asks in (if user speaks in Tamil, answer in Tamil; if in Hindi, answer in Hindi; if in English, answer in English).

Response Guidelines:
- Keep answers practical, clear, structured, and farmer-friendly (2–4 concise paragraphs or bullet points).
- When discussing collar data, reference specific cattle names and collar IDs from the live farm telemetry.
- Always include veterinary consultation advice for severe symptoms.
- Be warm, helpful, and empathetic to dairy farmers.`;

export default function Chatbot() {
  const { cattle, t, language } = useContext(AppContext);
  const [messages, setMessages]                 = useState([]);
  const [inputText, setInputText]               = useState('');
  const [isListening, setIsListening]           = useState(false);
  const [speakResponses, setSpeakResponses]     = useState(false); // Text-only output by default
  const [isThinking, setIsThinking]             = useState(false);
  const [chatHistory, setChatHistory]           = useState([]); // { role: 'user' | 'model', text: string }
  const [copiedIndex, setCopiedIndex]           = useState(null);
  const [voices, setVoices]                     = useState([]);

  const chatEndRef       = useRef(null);
  const recognitionRef   = useRef(null);

  // ── Load Speech Synthesis Voices ──────────────────────────────────────────
  useEffect(() => {
let welcomeText = "Hello! I'm BioSense AI, your smart livestock health assistant. Ask me anything about your cattle's health, sensor readings, or farm advice. 🐄";
    if (language === 'ta') {
      welcomeText = 'வணக்கம்! நான் BioSense AI உதவியாளர். உங்கள் கால்நடைகளின் உடல்நிலை, வெப்பநிலை, இதயத்துடிப்பு பற்றி எந்த கேள்வியும் கேளுங்கள். நான் தமிழிலும் பதில் சொல்வேன்! 🐄';
    } else if (language === 'hi') {
      welcomeText = 'नमस्ते! मैं बायोसेन्स एआई सहायक हूँ। अपने पशुओं के स्वास्थ्य के बारे में कुछ भी पूछें। मैं हिंदी में भी जवाब दूंगा! 🐄';
    } else if (language === 'ml') {
      welcomeText = 'നമസ്കാരം! ഞാൻ BioSense AI സഹായിയാണ്. നിങ്ങളുടെ കന്നുകാലികളുടെ ആരോഗ്യം, താപനില, ഹൃദയമിടിപ്പ് എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കാം. ഞാൻ മലയാളത്തിലും മറുപടി നൽകും! 🐄';
    } else if (language === 'kn') {
      welcomeText = 'ನಮಸ್ಕಾರ! ನಾನು BioSense AI ಸಹಾಯಕ. ನಿಮ್ಮ ಜಾನುವಾರುಗಳ ಆರೋಗ್ಯ, ತಾಪಮಾನ, ಹೃದಯ ಬಡಿತದ ಬಗ್ಗೆ ಏನೇ ಇರಲಿ ಕೇಳಿ. ನಾನು ಕನ್ನಡದಲ್ಲೂ ಉತ್ತರಿಸುತ್ತೇನೆ! 🐄';
    }

    setMessages([{
      sender: 'bot',
      text: welcomeText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatHistory([]);
  }, [language]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ── Setup Speech Recognition ──────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
const langLocaleMap = {
      ta: 'ta-IN',
      hi: 'hi-IN',
      ml: 'ml-IN',
      kn: 'kn-IN',
      en: 'en-US'
    };
    rec.lang = langLocaleMap[language] || 'en-US';
    rec.onstart  = () => setIsListening(true);
    rec.onend    = () => setIsListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript) {
        setInputText(transcript);
        handleSend(transcript);
      }
    };
    rec.onerror = (err) => {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.abort();
      } catch (_) {}
    };
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(t(
        'Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.',
        'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. Google Chrome அல்லது Edge-ஐப் பயன்படுத்தவும்.',
        'इस ब्राउज़र में वाक् पहचान समर्थित नहीं है। कृपया Google Chrome या Edge का उपयोग करें।'
      ));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Cancel speech synthesis if speaking when user starts recording
      window.speechSynthesis?.cancel();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  // ── Speech Synthesis (Text to Speech) ──────────────────────────────────────
  const speakText = (text) => {
if (!speakResponses) return;
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langLocaleMap = {
      ta: 'ta-IN',
      hi: 'hi-IN',
      ml: 'ml-IN',
      kn: 'kn-IN',
      en: 'en-US'
    };
    utterance.lang = langLocaleMap[language] || 'en-US';
    const voices = window.speechSynthesis?.getVoices() || [];
    const voice  = voices.find(v => v.lang.startsWith(language));
    if (voice) utterance.voice = voice;
    window.speechSynthesis?.speak(utterance);
  };

  // ── Build Live Farm Telemetry Context ─────────────────────────────────────
  const buildCattleContext = () => {
    if (!cattle || cattle.length === 0) return 'No cattle collars registered currently in the system.';
    return cattle.map(c =>
      `- Collar ID: ${c.id} | Name: ${c.name}${c.nickname ? ` (${c.nickname})` : ''} | Breed: ${c.breed || 'N/A'} | Status: ${c.status} | Temp: ${c.telemetry?.temperature || 'N/A'}°C | Heart Rate: ${c.telemetry?.heartRate || 'N/A'} BPM | Battery: ${c.telemetry?.battery || 'N/A'}% | Last Update: ${c.telemetry?.timestamp || 'live'}`
    ).join('\n');
  };

  // ── Main Chat Send Handler ────────────────────────────────────────────────
  const handleSend = async (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isThinking) return;

    // Read API keys (prioritize Gemini, fallback to Groq)
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!geminiKey && !groqKey) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: '⚠️ AI API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      }]);
      return;
    }

    const userMsg = {
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    const enrichedUserPrompt = `[Live Farm Telemetry Context]\n${buildCattleContext()}\n\n[User Message]\n${trimmed}`;

    let responseText = '';

    try {
      // 1. Primary Attempt: Google Gemini API
      if (geminiKey) {
        const geminiContents = [
          ...chatHistory.map(turn => ({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }],
          })),
          {
            role: 'user',
            parts: [{ text: enrichedUserPrompt }],
          },
        ];

        const geminiRes = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: geminiContents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          const errData = await geminiRes.json().catch(() => ({}));
          console.warn('Gemini API returned error:', errData);
          throw new Error(errData?.error?.message || `Gemini error (HTTP ${geminiRes.status})`);
        }
      } 
      // 2. Fallback Attempt: Groq API
      else if (groqKey) {
        const groqMessages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatHistory.map(turn => ({
            role: turn.role === 'user' ? 'user' : 'assistant',
            content: turn.text,
          })),
          { role: 'user', content: enrichedUserPrompt },
        ];

        const groqRes = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          responseText = groqData.choices?.[0]?.message?.content || '';
        } else {
          const err = await groqRes.json().catch(() => ({}));
          throw new Error(err?.error?.message || `Groq error (HTTP ${groqRes.status})`);
        }
      }

      if (!responseText) {
        responseText = language === 'ta'
          ? 'மன்னிக்கவும், பதிலை உருவாக்குவதில் சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
          : language === 'hi'
          ? 'क्षमा करें, प्रतिक्रिया उत्पन्न करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Sorry, I could not generate a response. Please try asking again.';
      }

      // Update multi-turn history
      setChatHistory(prev => [
        ...prev,
        { role: 'user', text: trimmed },
        { role: 'model', text: responseText },
      ]);

      // Add bot message
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);

      // Speak response if voice enabled
      speakText(responseText);

    } catch (err) {
      console.error('AI Chat Error:', err);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `⚠️ ${err.message || 'Connection error with AI service.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const resetChat = () => {
    window.speechSynthesis?.cancel();
    setChatHistory([]);
    setMessages([{
      sender: 'bot',
      text: language === 'ta'
        ? 'உரையாடல் மீட்டமைக்கப்பட்டது. நான் உங்களுக்கு எப்படி உதவ முடியும்?'
        : language === 'hi'
        ? 'बातचीत रीसेट कर दी गई है। मैं आपकी कैसे मदद कर सकता हूँ?'
        : 'Chat reset. How can I help you and your cattle today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const quickQuestions = language === 'ta'
    ? [
        { label: 'காலர் 101 நிலை என்ன?',       query: 'காலர் ID 101 இன் தற்போதைய வெப்பநிலை மற்றும் இதயத்துடிப்பு நிலை என்ன?' },
        { label: 'அதிக காய்ச்சல் சிகிச்சை?',   query: 'மாட்டுக்கு அதிக காய்ச்சல் இருந்தால் உடனடியாக என்ன முதலுதவி சிகிச்சை செய்ய வேண்டும்?' },
        { label: 'மடிநோய் (Mastitis) தடுப்பது?', query: 'மடிநோய் வராமல் தடுக்க இயற்கை மற்றும் மருத்துவ வழிகள் என்ன?' },
        { label: 'பால் உற்பத்தி அதிகரிக்க?',    query: 'கால்நடைகளில் ஆரோக்கியமான பால் உற்பத்தியை அதிகரிக்க சிறந்த தீவன மேலாண்மை என்ன?' },
      ]
    : language === 'hi'
    ? [
        { label: 'कॉलर 101 स्थिति?',           query: 'कॉलर ID 101 की वर्तमान तापमान और हृदय गति स्थिति क्या है?' },
        { label: 'तेज बुखार का उपचार?',       query: 'यदि गाय को तेज बुखार हो तो तुरंत क्या प्राथमिक उपचार करना चाहिए?' },
        { label: 'थनैल (Mastitis) रोकथाम?',   query: 'मस्टाइटिस (थनैल) से बचाव के लिए जैविक और चिकित्सीय उपाय क्या हैं?' },
        { label: 'दूध उत्पादन बढ़ाना?',        query: 'पशुओं में स्वस्थ दूध उत्पादन बढ़ाने के लिए संतुलित आहार क्या होना चाहिए?' },
      ]
    : language === 'ml'
    ? [
        { label: 'കോളർ 101 അവസ്ഥ?',       query: 'കോളർ 101-ന്റെ നിലവിലെ ആരോഗ്യ നില എന്താണ്?' },
        { label: 'ഉയർന്ന താപനില ഉപദേശം?',  query: 'എന്റെ പശുവിന് ഉയർന്ന ശരീര താപനിലയുണ്ട്. ഞാൻ എന്ത് ചെയ്യണം?' },
        { label: 'അടിയന്തര നടപടികൾ?',      query: 'എന്റെ ഒരു മൃഗം എമർജൻസി അവസ്ഥയിലാണ്. ഞാൻ എന്തൊക്കെ നടപടികൾ എടുക്കണം?' },
      ]
    : language === 'kn'
    ? [
        { label: 'ಕಾಲರ್ 101 ಸ್ಥಿತಿ?',         query: 'ಕಾಲರ್ 101 ರ ಪ್ರಸ್ತುತ ಆರೋಗ್ಯ ಸ್ಥಿತಿ ಏನು?' },
        { label: 'ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಸಲಹೆ?',    query: 'ನನ್ನ ಜಾನುವಾರಿಗೆ ಹೆಚ್ಚಿನ ದೇಹದ ತಾಪಮಾನವಿದೆ. ನಾನು ಏನು ಮಾಡಬೇಕು?' },
        { label: 'ತುರ್ತು ಕ್ರಮಗಳು?',            query: 'ನನ್ನ ಪ್ರಾಣಿಗಳಲ್ಲಿ ಒಂದು ತುರ್ತು ಸ್ಥಿತಿಯಲ್ಲಿದೆ. ನಾನು ತಕ್ಷಣ ಯಾವ ಕ್ರಮಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬೇಕು?' },
      ]
    : [
        { label: 'Status of Collar 101?',     query: 'What is the current health and vitals status for Collar ID 101?' },
        { label: 'High Fever First-Aid?',     query: 'What immediate first-aid steps should I take if a cow has a high body temperature?' },
        { label: 'Prevent Mastitis?',         query: 'What are the effective organic and medical ways to prevent mastitis in dairy cattle?' },
        { label: 'Boost Milk Yield?',         query: 'What nutrition and feed management practices optimize healthy milk production?' },
      ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold font-display text-base text-white tracking-tight">
                {t('BioSense AI Assistant', 'BioSense AI உதவியாளர்', 'बायोसेन्स एआई सहायक')}
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-white/25 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-wider text-emerald-50 border border-white/20">
                <Sparkles size={10} className="text-amber-300" />
                Gemini 2.5
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] text-emerald-100 font-semibold uppercase tracking-wider">
                {t('Speech-to-Text · AI Text Answers', 'குரல் உள்ளீடு · AI உரை பதில்', 'वॉइस-टू-टेक्स्ट · AI टेक्स्ट उत्तर')}
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={resetChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
            title={t('Reset Conversation', 'உரையாடலை மீட்டமை', 'बातचीत रीसेट करें')}
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => {
              const nextState = !speakResponses;
              setSpeakResponses(nextState);
              if (!nextState) window.speechSynthesis?.cancel();
            }}
            className={`p-2 rounded-xl transition-all ${
              speakResponses ? 'bg-white/25 text-white shadow-sm' : 'bg-slate-900/40 text-slate-300'
            }`}
            title={speakResponses ? t('Mute Voice Responses', 'குரலை முடக்கு', 'आवाज म्यूट करें') : t('Enable Voice Responses', 'குரலை இயக்கு', 'आवाज सक्षम करें')}
          >
            {speakResponses ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 dark:bg-slate-950/40">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className="max-w-[88%] md:max-w-[80%] flex gap-2.5 items-start group">
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5">
                  <Bot size={16} />
                </div>
              )}
              
              <div className="flex flex-col">
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-tl-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Message Meta Info & Action Buttons */}
                <div className={`flex items-center gap-2 mt-1 px-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {msg.time}
                  </span>

                  {msg.sender === 'bot' && !msg.isError && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
                        title="Copy text"
                      >
                        {copiedIndex === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition-colors"
                        title="Listen to this response"
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* AI Thinking Animation */}
        {isThinking && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 border border-emerald-500/30 text-emerald-500">
                <Bot size={16} />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t('Gemini is analyzing...', 'Gemini பகுப்பாய்வு செய்கிறது...', 'Gemini विश्लेषण कर रहा है...')}
                </span>
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap gap-1.5 items-center shrink-0">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-bold uppercase tracking-wider">
          <HelpCircle size={12} className="text-emerald-500" />
          {t('Suggestions:', 'பரிந்துரைகள்:', 'सुझाव:')}
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.query)}
            disabled={isThinking || isListening}
            className="text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full transition-all disabled:opacity-50 shadow-2xs hover:scale-[1.02] active:scale-95"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Live Listening Indicator Bar (if active) */}
      {isListening && (
        <div className="px-4 py-2 bg-rose-500 text-white text-xs font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{t('Listening to your voice... Speak now in your language', 'உங்கள் குரலைக் கேட்கிறது... இப்போது பேசவும்', 'आपकी आवाज सुन रहा है... अब बोलें')}</span>
          </div>
          <button onClick={toggleListening} className="underline hover:text-rose-100 text-[11px]">
            {t('Stop', 'நிறுத்து', 'रोकें')}
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
        {/* Voice Input Button */}
        <button
          onClick={toggleListening}
          className={`p-3 rounded-xl transition-all relative shrink-0 ${
            isListening
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-750'
          }`}
          title={isListening ? t('Stop Listening', 'நிறுத்து', 'रोकें') : t('Voice Input (Click to speak)', 'குரல் உள்ளீடு (பேச கிளிக் செய்யவும்)', 'वॉइस इनपुट (बोलने के लिए क्लिक करें)')}
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

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            isListening
              ? t('Listening to your speech...', 'உங்கள் பேச்சைக் கேட்கிறது...', 'आपकी बात सुन रहा है...')
              : isThinking
              ? t('AI is thinking...', 'AI யோசிக்கிறது...', 'AI सोच रहा है...')
              : t('Ask anything about your livestock, symptoms, vitals...', 'உங்கள் கால்நடைகள், அறிகுறிகள் பற்றி கேட்கவும்...', 'अपने पशुओं, लक्षणों, विटल्स के बारे में पूछें...')
          }
          disabled={isListening || isThinking}
          className="flex-1 bg-slate-50 dark:bg-slate-850 dark:text-slate-100 border border-slate-200 dark:border-slate-750 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 transition-all placeholder:text-slate-400"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={isThinking || isListening || !inputText.trim()}
          className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-md shadow-emerald-700/15 hover:shadow-lg hover:shadow-emerald-700/25 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          title="Send"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
