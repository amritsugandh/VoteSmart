import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition, useTextToSpeech } from '@/hooks/useSpeech';
import { chatService } from '@/services/api';
import './ChatPanel.css';
export default function ChatPanel() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [userState, setUserState] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isListening, transcript, startListening, stopListening, isSupported: speechSupported, setTranscript } = useSpeechRecognition();
  const { isSpeaking, speak, stop: stopSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  const states = t('states', { returnObjects: true }) || [];
  const quickActions = t('chat.quickActions', { returnObjects: true }) || [];

  // Add intro message on mount
  useEffect(() => {
    setMessages([{ id: 'intro', text: t('chat.intro'), sender: 'assistant', time: new Date() }]);
  }, [i18n.language]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Update input when voice transcript changes
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isThinking) return;

    const userMsg = { id: Date.now(), text: msg, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTranscript('');
    setIsThinking(true);

    try {
      const data = await chatService.sendMessage(msg, userState, i18n.language);
      const aiMsg = { id: Date.now() + 1, text: data.response, sender: 'assistant', time: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Offline fallback
      const aiMsg = { id: Date.now() + 1, text: t('chat.errorMessage'), sender: 'assistant', time: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    }
    setIsThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setUserState(state);
    if (state) {
      const query = t('chat.stateQuery', { state, defaultValue: `I am from ${state}. What do I need to do to vote here?` });
      handleSend(query);
    }
  };

  const handleVoice = () => {
    if (isListening) { stopListening(); }
    else { startListening(i18n.language === 'hi' ? 'hi-IN' : 'en-IN'); }
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="chat-page">
      <div className="chat-panel glass-card">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-avatar">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Kiran" alt="Kiran" />
          </div>
          <div className="chat-info">
            <h2>{t('chat.title')} <span className="chat-subtitle">({t('chat.subtitle')})</span></h2>
            <p className="chat-status"><span className="status-dot"></span> {t('chat.online')}</p>
          </div>
          <div className="chat-state-select">
            <label>{t('chat.stateLabel')}</label>
            <select value={userState} onChange={handleStateChange} className="select">
              <option value="">{t('chat.selectState')}</option>
              {states.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" role="log" aria-live="polite">
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                className={`chat-msg ${msg.sender}-msg`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="msg-header">
                  <span className="msg-sender">{msg.sender === 'assistant' ? '🤖 Kiran' : '👤 You'}</span>
                  {msg.sender === 'assistant' && ttsSupported && (
                    <button
                      className="btn-ghost msg-speak-btn"
                      onClick={() => isSpeaking ? stopSpeaking() : speak(msg.text, i18n.language === 'hi' ? 'hi-IN' : 'en-IN')}
                      aria-label={t('accessibility.readAloud')}
                    >
                      {isSpeaking ? '🔇' : '🔊'}
                    </button>
                  )}
                </div>
                <div className="msg-text" dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                <span className="msg-time">{msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <div className="typing-indicator">
              <span className="typing-avatar">🤖</span>
              <div className="typing-dots"><span /><span /><span /></div>
              <span className="typing-label">{t('chat.thinking')}</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && quickActions.length > 0 && (
          <div className="quick-actions">
            {quickActions.map((action, i) => (
              <button key={i} className="quick-btn" onClick={() => handleSend(action.query)}>
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            {speechSupported && (
              <button
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={handleVoice}
                aria-label={isListening ? t('chat.listening') : t('chat.voiceInput')}
                title={t('chat.voiceInput')}
              >
                🎙️
              </button>
            )}
            <textarea
              ref={inputRef}
              className="chat-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              rows={1}
              aria-label={t('chat.placeholder')}
            />
            <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim() && !isThinking} aria-label={t('chat.send')}>
              <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
