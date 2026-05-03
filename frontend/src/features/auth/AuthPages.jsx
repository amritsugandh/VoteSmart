import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import './AuthPages.css';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('auth.loginSuccess') || 'Logged in successfully!');
      navigate('/');
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (detail || 'Login failed');
      toast.error(message);
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      await googleLogin(credentialResponse.credential);
      toast.success(t('auth.loginSuccess') || 'Logged in securely with Google!');
      navigate('/');
    } catch (err) {
      toast.error('Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-header">
          <span className="auth-icon">🗳️</span>
          <h1>{t('auth.loginTitle')}</h1>
          <p>{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label className="form-label">{t('auth.email')}</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">{t('auth.password')}</label><input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <button className="btn btn-primary full-width" type="submit" disabled={loading}>{loading ? '...' : t('auth.login')}</button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="google-auth-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Login Failed')}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        <Link to="/" className="btn btn-ghost full-width guest-btn">👤 {t('auth.guestMode')}</Link>

        <p className="auth-footer-text">
          {t('auth.noAccount')} <Link to="/signup">{t('auth.signUp')}</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function SignupPage() {
  const { t } = useTranslation();
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { 
        toast.error('Passwords do not match'); 
        return; 
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (detail || 'Registration failed');
      toast.error(message);
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      await googleLogin(credentialResponse.credential);
      toast.success('Signed up securely with Google!');
      navigate('/');
    } catch (err) {
      toast.error('Google Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-header">
          <span className="auth-icon">🗳️</span>
          <h1>{t('auth.registerTitle')}</h1>
          <p>{t('auth.registerSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label className="form-label">{t('auth.name')}</label><input className="input" value={form.name} onChange={e => update('name', e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">{t('auth.email')}</label><input className="input" type="email" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">{t('auth.password')}</label><input className="input" type="password" value={form.password} onChange={e => update('password', e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">{t('auth.confirmPassword')}</label><input className="input" type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required /></div>
          <button className="btn btn-primary full-width" type="submit" disabled={loading}>{loading ? '...' : t('auth.register')}</button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="google-auth-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Signup Failed')}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
          />
        </div>

        <p className="auth-footer-text">
          {t('auth.hasAccount')} <Link to="/login">{t('auth.logIn')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
