import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';

import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import logo from '@/assets/logo.png';
import './Navbar.css';

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, cycleTheme, fontSize, setFontSize } = useTheme();

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);

  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🔲';

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: '🏠' },
    { to: '/assistant', label: t('nav.assistant'), icon: '🤖' },
    { to: '/journey', label: t('nav.journey'), icon: '📋' },

    { to: '/register-voter', label: t('nav.register'), icon: '📝' },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-left">
        <Link to="/" className="logo" aria-label={t('app.name')}>
          <img src={logo} alt="" className="logo-img" />
          <span className="logo-text">{t('app.name')}</span>
        </Link>
      </div>

      <div className={`nav-center ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="nav-right">
        <LanguageSwitcher />

        <div className="access-dropdown">
          <button className="btn-icon" onClick={() => setAccessOpen(!accessOpen)} title={t('accessibility.title')} aria-label={t('accessibility.title')}>
            ♿
          </button>
          {accessOpen && (
            <div className="dropdown-menu access-menu">
              <p className="dropdown-title">{t('accessibility.fontSize')}</p>
              <div className="font-controls">
                <button className={`font-btn ${fontSize === 'normal' ? 'active' : ''}`} onClick={() => setFontSize('normal')}>A</button>
                <button className={`font-btn ${fontSize === 'large' ? 'active' : ''}`} onClick={() => setFontSize('large')}>A+</button>
                <button className={`font-btn ${fontSize === 'x-large' ? 'active' : ''}`} onClick={() => setFontSize('x-large')}>A++</button>
              </div>
            </div>
          )}
        </div>

        <button className="btn-icon" onClick={cycleTheme} title={t(`theme.${theme}`)} aria-label="Toggle theme">
          <span>{themeIcon}</span>
        </button>



        <button
          className="hamburger btn-icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
