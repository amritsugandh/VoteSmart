import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './NotFound.css';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="not-found-page page-container">
      <motion.div 
        className="glass-card not-found-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <span className="error-icon">🗳️</span>
        <h1 className="gradient-text">404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>It looks like this ballot box is empty. The page you're looking for doesn't exist.</p>
        
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">Go to Home</Link>
          <Link to="/assistant" className="btn btn-secondary">Talk to Kiran</Link>
        </div>
      </motion.div>
    </div>
  );
}
