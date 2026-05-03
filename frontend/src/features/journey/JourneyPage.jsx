import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import EligibilityChecker from './EligibilityChecker';
import './JourneyPage.css';

export default function JourneyPage() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(-1);
  const steps = t('journey.steps', { returnObjects: true }) || [];
  const nextActions = t('journey.nextActions', { returnObjects: true });

  return (
    <div className="journey-page">
      {/* Timeline */}
      <section className="glass-card timeline-section">
        <h2 className="gradient-text section-title">{t('journey.title')}</h2>
        <div className="timeline-track">
          {steps.map((step, i) => (
            <motion.div
              key={i} className={`timeline-step ${activeStep === i ? 'active' : ''}`}
              onClick={() => setActiveStep(activeStep === i ? -1 : i)}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
            >
              <div className="step-icon-wrap"><span className="step-icon">{step.icon}</span></div>
              <span className="step-label">{step.label}</span>
            </motion.div>
          ))}
        </div>
        {activeStep >= 0 && steps[activeStep] && (
          <motion.div className="step-details" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h3>{steps[activeStep].icon} {steps[activeStep].label}</h3>
            <ul>{steps[activeStep].details.map((d, i) => <li key={i}>→ {d}</li>)}</ul>
          </motion.div>
        )}
        <p className="click-hint">{t('journey.clickPrompt')}</p>
      </section>

      {/* Eligibility Checker */}
      <EligibilityChecker />

      {/* Next Actions */}
      {nextActions && (
        <section className="glass-card next-actions-section">
          <h3>{nextActions.title}</h3>
          <div className="actions-grid">
            {(nextActions.links || []).map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="action-card">
                <span className="action-icon">{link.icon}</span>
                <div className="action-text">
                  <span className="action-label">{link.label}</span>
                  <span className="action-desc">{link.desc}</span>
                </div>
                <span className="action-arrow">→</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
