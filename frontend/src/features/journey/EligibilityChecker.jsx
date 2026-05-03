import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './EligibilityChecker.css';

export default function EligibilityChecker() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    { key: 'citizen', text: t('eligibility.q1'), icon: '🇮🇳' },
    { key: 'age', text: t('eligibility.q2'), icon: '🎂' },
    { key: 'address', text: t('eligibility.q3'), icon: '🏠' },
  ];

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [questions[step].key]: answer };
    setAnswers(newAnswers);

    if (!answer) {
      setStep(4); // show result immediately on "No"
    } else if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(4); // show result
    }
  };

  const allYes = answers.citizen && answers.age && answers.address;
  const getFailReason = () => {
    if (!answers.citizen) return t('eligibility.notEligibleCitizen');
    if (!answers.age) return t('eligibility.notEligibleAge');
    if (!answers.address) return t('eligibility.notEligibleAddress');
    return '';
  };

  const reset = () => { setStep(0); setAnswers({}); };

  return (
    <section className="glass-card eligibility-section">
      <h3 className="gradient-text">{t('eligibility.title')}</h3>
      <p className="eligibility-subtitle">{t('eligibility.subtitle')}</p>

      <AnimatePresence mode="wait">
        {step < questions.length && step < 4 && (
          <motion.div key={step} className="question-card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <div className="question-icon">{questions[step].icon}</div>
            <p className="question-text">{questions[step].text}</p>
            <div className="answer-btns">
              <button className="btn btn-primary" onClick={() => handleAnswer(true)}>{t('eligibility.yes')} ✅</button>
              <button className="btn btn-outline" onClick={() => handleAnswer(false)}>{t('eligibility.no')} ❌</button>
            </div>
            <div className="progress-dots">
              {questions.map((_, i) => <span key={i} className={`dot ${i <= step ? 'active' : ''}`} />)}
            </div>
          </motion.div>
        )}

        {step >= 4 && (
          <motion.div className="result-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            {allYes ? (
              <div className="result-success">
                <p className="result-title">{t('eligibility.eligible')}</p>
                <p>{t('eligibility.eligibleDesc')}</p>
                <Link to="/register-voter" className="btn btn-primary">{t('eligibility.registerNow')}</Link>
              </div>
            ) : (
              <div className="result-fail">
                <p className="result-title">{t('eligibility.notEligible')}</p>
                <p>{getFailReason()}</p>
              </div>
            )}
            <button className="btn btn-ghost" onClick={reset}>{t('eligibility.checkAgain')}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
