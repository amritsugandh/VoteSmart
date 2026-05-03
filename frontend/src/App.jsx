import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePage from '@/features/home/HomePage';
import ChatPanel from '@/features/chat/ChatPanel';
import JourneyPage from '@/features/journey/JourneyPage';

import VoterRegistration from '@/features/registration/VoterRegistration';
import FeedbackPage from '@/features/feedback/FeedbackPage';
import AdminDashboard from '@/features/admin/AdminDashboard';

function AppContent() {
  const { t } = useTranslation();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">{t('accessibility.skipToContent')}</a>
      {!isAdminPath && <Navbar />}
      <main className="main-content" id="main-content" role="main" style={{ paddingTop: isAdminPath ? 0 : 'var(--navbar-height)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<ChatPanel />} />
          <Route path="/journey" element={<JourneyPage />} />

          <Route path="/register-voter" element={<VoterRegistration />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      <Toaster position="bottom-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' } }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}
