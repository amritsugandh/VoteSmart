import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './VoterRegistration.css';

export default function VoterRegistration() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', fatherName: '', dob: '', gender: '', email: '', phone: '', state: '', district: '', pincode: '', address: '', idType: '', idNumber: '' });
  const [submitted, setSubmitted] = useState(false);

  const states = t('states', { returnObjects: true }) || [];
  const steps = [t('registration.step1'), t('registration.step2'), t('registration.step3'), t('registration.step4')];

  const update = (key, val) => setForm({ ...form, [key]: val });

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/registration/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // Offline: save locally
      const drafts = JSON.parse(localStorage.getItem('votesmart_drafts') || '[]');
      drafts.push({ ...form, savedAt: new Date().toISOString() });
      localStorage.setItem('votesmart_drafts', JSON.stringify(drafts));
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="reg-page page-container">
        <motion.div className="glass-card reg-success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="success-icon">🎉</span>
          <h2>{t('registration.success')}</h2>
          <p>{t('registration.successDesc')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="reg-page page-container">
      <h1 className="gradient-text">{t('registration.title')}</h1>
      <p className="page-subtitle">{t('registration.subtitle')}</p>

      {/* Progress */}
      <div className="reg-progress">
        {steps.map((s, i) => (
          <div key={i} className={`reg-step-indicator ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="reg-step-num">{i < step ? '✓' : i + 1}</div>
            <span className="reg-step-label">{s}</span>
          </div>
        ))}
      </div>

      <div className="glass-card reg-form">
        {step === 0 && (
          <motion.div className="form-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="form-group"><label className="form-label">{t('registration.name')}</label><input className="input" value={form.name} onChange={e => update('name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">{t('registration.fatherName')}</label><input className="input" value={form.fatherName} onChange={e => update('fatherName', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">{t('registration.dob')}</label><input className="input" type="date" value={form.dob} onChange={e => update('dob', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">{t('registration.gender')}</label>
              <select className="select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="">--</option>
                <option value="male">{t('registration.male')}</option>
                <option value="female">{t('registration.female')}</option>
                <option value="other">{t('registration.other')}</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">{t('registration.email')}</label><input className="input" type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">{t('registration.phone')}</label><input className="input" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div className="form-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="form-group"><label className="form-label">{t('registration.state')}</label>
              <select className="select" value={form.state} onChange={e => update('state', e.target.value)}>
                <option value="">--</option>
                {states.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">{t('registration.district')}</label><input className="input" value={form.district} onChange={e => update('district', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">{t('registration.pincode')}</label><input className="input" value={form.pincode} onChange={e => update('pincode', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">{t('registration.address')}</label><textarea className="textarea" rows={3} value={form.address} onChange={e => update('address', e.target.value)} /></div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div className="form-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="form-group"><label className="form-label">{t('registration.idType')}</label>
              <select className="select" value={form.idType} onChange={e => update('idType', e.target.value)}>
                <option value="">--</option>
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="driving">Driving License</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">{t('registration.idNumber')}</label><input className="input" value={form.idNumber} onChange={e => update('idNumber', e.target.value)} /></div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div className="form-section review-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>📋 Review Your Details</h3>
            <div className="review-grid">
              {Object.entries(form).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="review-item"><span className="review-key">{k}</span><span className="review-val">{v}</span></div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="form-actions">
          {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>← {t('registration.previous')}</button>}
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>{t('registration.next')} →</button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit}>✅ {t('registration.submit')}</button>
          )}
        </div>
      </div>
    </div>
  );
}
