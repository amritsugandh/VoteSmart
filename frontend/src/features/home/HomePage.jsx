import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

export default function HomePage() {
  const { t } = useTranslation();



  return (
    <div className="home-page">
      <section className="hero-section">
        <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="hero-title gradient-text">{t('home.heroTitle')}</h1>
          <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
          <div className="hero-actions">
            <Link to="/assistant" className="btn btn-primary btn-lg btn-glow">
              🤖 {t('home.talkToAssistant')}
            </Link>
            <Link to="/journey" className="btn btn-outline btn-lg">
              📋 {t('home.getStarted')}
            </Link>
          </div>
        </motion.div>

        <motion.div className="stats-bar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper">👥</div>
            <div className="stat-content">
              <span className="stat-value gradient-text">{t('home.stats.voters')}</span>
              <span className="stat-label">{t('home.stats.votersLabel')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">📍</div>
            <div className="stat-content">
              <span className="stat-value gradient-text">{t('home.stats.stations')}</span>
              <span className="stat-label">{t('home.stats.stationsLabel')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">🆔</div>
            <div className="stat-content">
              <span className="stat-value gradient-text">{t('home.stats.age')}</span>
              <span className="stat-label">{t('home.stats.ageLabel')}</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="feature-card glass-card informative-card">
              <span className="feature-icon">🗳️</span>
              <h3>{t('home.cards.evm.title')}</h3>
              <p>{t('home.cards.evm.desc')}</p>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="feature-card glass-card informative-card">
              <span className="feature-icon">🔍</span>
              <h3>{t('home.cards.vvpat.title')}</h3>
              <p>{t('home.cards.vvpat.desc')}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className="feature-card glass-card informative-card">
              <span className="feature-icon">📜</span>
              <h3>{t('home.cards.mcc.title')}</h3>
              <p>{t('home.cards.mcc.desc')}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <div className="feature-card glass-card informative-card">
              <span className="feature-icon">🏛️</span>
              <h3>{t('home.cards.eci.title')}</h3>
              <p>{t('home.cards.eci.desc')}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
