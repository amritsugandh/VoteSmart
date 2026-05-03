import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTextToSpeech } from '@/hooks/useSpeech';
import { motion } from 'framer-motion';
import './TutorialsPage.css';

const TUTORIALS = {
  registration: {
    steps: [
      { title: 'Step 1: Visit the official ECI portal', content: 'Go to voters.eci.gov.in on your phone or computer. Click on "New Voter Registration" or "Form 6".', icon: '🌐' },
      { title: 'Step 2: Fill the registration form', content: 'Enter your full name, date of birth, address, and father/mother name. Make sure all details match your ID.', icon: '📝' },
      { title: 'Step 3: Upload your documents', content: 'Take a clear photo of your Aadhaar card or any valid ID proof and address proof. Upload them.', icon: '📄' },
      { title: 'Step 4: Submit and note your reference number', content: 'After submitting, save the reference number. You can use it to track your application status.', icon: '✅' },
    ]
  },
  voting: {
    steps: [
      { title: 'Step 1: Find your polling booth', content: 'Visit electoralsearch.eci.gov.in or use the Voter Helpline app to find your assigned booth.', icon: '📍' },
      { title: 'Step 2: Check your name in the voter list', content: 'Search by your EPIC number or name on the ECI website. Make sure your details are correct.', icon: '🔍' },
      { title: 'Step 3: Carry your voter ID on election day', content: 'Take your EPIC card (Voter ID) or e-EPIC to the polling booth. Reach before the queue gets long.', icon: '🆔' },
      { title: 'Step 4: Cast your vote using EVM', content: 'Enter the booth, verify your identity, press the button next to your chosen candidate on the EVM machine. Then press NOTA if you want.', icon: '🗳️' },
    ]
  },
  evm: {
    steps: [
      { title: 'What is an EVM?', content: 'EVM stands for Electronic Voting Machine. It is used in Indian elections to record votes electronically.', icon: '🖥️' },
      { title: 'How does it work?', content: 'The ballot unit shows candidate names and symbols. You press the blue button next to your choice. A beep confirms your vote.', icon: '🔘' },
      { title: 'What is VVPAT?', content: 'VVPAT (Voter Verified Paper Audit Trail) prints a slip showing who you voted for. It is visible for 7 seconds through a window.', icon: '🧾' },
    ]
  }
};

export default function TutorialsPage() {
  const { t } = useTranslation();
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const { speak, isSpeaking, stop } = useTextToSpeech();

  const categories = [
    { key: 'registration', icon: '📝', label: t('tutorials.categories.registration') },
    { key: 'voting', icon: '🗳️', label: t('tutorials.categories.voting') },
    { key: 'evm', icon: '🖥️', label: t('tutorials.categories.evm') },
  ];

  const tutorial = activeTutorial ? TUTORIALS[activeTutorial] : null;
  const step = tutorial?.steps[activeStep];

  return (
    <div className="tutorials-page page-container">
      <h1 className="gradient-text">{t('tutorials.title')}</h1>
      <p className="page-subtitle">{t('tutorials.subtitle')}</p>

      {!activeTutorial ? (
        <div className="tutorial-grid">
          {categories.map((cat, i) => (
            <motion.div key={cat.key} className="tutorial-card glass-card" onClick={() => { setActiveTutorial(cat.key); setActiveStep(0); }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <span className="tutorial-icon">{cat.icon}</span>
              <h3>{cat.label}</h3>
              <p className="tutorial-count">{TUTORIALS[cat.key].steps.length} steps</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="tutorial-viewer glass-card">
          <div className="tutorial-nav-top">
            <button className="btn btn-ghost" onClick={() => setActiveTutorial(null)}>← {t('common.back')}</button>
            <span className="step-counter">{activeStep + 1} / {tutorial.steps.length}</span>
          </div>

          <motion.div className="step-content" key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="step-visual">{step.icon}</div>
            <h2>{step.title}</h2>
            <p className="step-description">{step.content}</p>
            <button className="btn btn-ghost read-aloud-btn" onClick={() => isSpeaking ? stop() : speak(step.title + '. ' + step.content)}>
              {isSpeaking ? '🔇 Stop' : `🔊 ${t('tutorials.readAloud')}`}
            </button>
          </motion.div>

          <div className="step-progress">
            {tutorial.steps.map((_, i) => (
              <div key={i} className={`progress-segment ${i <= activeStep ? 'filled' : ''}`} />
            ))}
          </div>

          <div className="step-nav">
            <button className="btn btn-secondary" disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)}>← {t('tutorials.prevStep')}</button>
            <button className="btn btn-primary" disabled={activeStep === tutorial.steps.length - 1} onClick={() => setActiveStep(activeStep + 1)}>{t('tutorials.nextStep')} →</button>
          </div>
        </div>
      )}
    </div>
  );
}
