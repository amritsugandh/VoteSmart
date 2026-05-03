import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { feedbackService } from '@/services/api';
import './FeedbackPage.css';

export default function FeedbackPage() {
  const { t } = useTranslation();
  const [type, setType] = useState('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackService.submit({ type, message, rating });
    } catch {
      // Save offline
      const fb = JSON.parse(localStorage.getItem('votesmart_feedback') || '[]');
      fb.push({ type, message, rating, savedAt: new Date().toISOString() });
      localStorage.setItem('votesmart_feedback', JSON.stringify(fb));
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="feedback-page page-container">
        <motion.div className="glass-card feedback-success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="success-emoji">🙏</span>
          <h2>{t('feedback.success')}</h2>
          <p>{t('feedback.successDesc')}</p>
          <button className="btn btn-primary" onClick={() => { setSubmitted(false); setMessage(''); setRating(0); }}>Submit Another</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="feedback-page page-container">
      <h1 className="gradient-text">{t('feedback.title')}</h1>
      <form className="glass-card feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('feedback.type')}</label>
          <div className="feedback-types">
            {['bug', 'suggestion', 'general'].map(tp => (
              <button key={tp} type="button" className={`type-btn ${type === tp ? 'active' : ''}`} onClick={() => setType(tp)}>
                {t(`feedback.types.${tp}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('feedback.rating')}</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" className={`star ${s <= rating ? 'filled' : ''}`} onClick={() => setRating(s)} aria-label={`${s} star`}>⭐</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('feedback.message')}</label>
          <textarea className="textarea" rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder={t('feedback.messagePlaceholder')} required />
        </div>

        <button type="submit" className="btn btn-primary btn-lg full-width">📩 {t('feedback.submit')}</button>
      </form>
    </div>
  );
}
