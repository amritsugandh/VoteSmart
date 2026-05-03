import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="app-footer" role="contentinfo">
      <p>
        {t('footer.text')}{' '}
        <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer">{t('footer.link')}</a>
      </p>
      <div className="footer-links">
        <Link to="/feedback">💬 {t('nav.feedback')}</Link>
        <span className="footer-sep">•</span>
        <Link to="/admin" className="admin-link">🛡️ Admin Portal</Link>
        <span className="footer-sep">•</span>
        <span>{t('footer.copyright')}</span>
      </div>
    </footer>
  );
}
