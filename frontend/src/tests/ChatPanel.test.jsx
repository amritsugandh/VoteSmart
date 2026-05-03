import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ChatPanel from '../features/chat/ChatPanel';
import { chatService } from '../services/api';

// Mock react-i18next with improved mock
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (key === 'states') return ['Delhi', 'Punjab', 'Haryana'];
      if (key === 'chat.quickActions') return [
        { label: 'Register', query: 'How to register?', icon: '📝' }
      ];
      return key;
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

// Mock hooks
vi.mock('@/hooks/useSpeech', () => ({
  useSpeechRecognition: () => ({
    isListening: false,
    transcript: '',
    startListening: vi.fn(),
    stopListening: vi.fn(),
    isSupported: true,
    setTranscript: vi.fn(),
  }),
  useTextToSpeech: () => ({
    isSpeaking: false,
    speak: vi.fn(),
    stop: vi.fn(),
    isSupported: true,
  }),
}));

// Mock api service
vi.mock('../services/api', () => ({
  chatService: {
    sendMessage: vi.fn(),
  },
}));

describe('ChatPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and shows intro message', () => {
    render(<ChatPanel />);
    expect(screen.getByText('chat.title')).toBeInTheDocument();
    expect(screen.getByText('chat.intro')).toBeInTheDocument();
  });

  it('handles user input and sends message', async () => {
    chatService.sendMessage.mockResolvedValue({ response: 'Mocked AI response' });
    
    render(<ChatPanel />);
    
    const textarea = screen.getByPlaceholderText('chat.placeholder');
    fireEvent.change(textarea, { target: { value: 'How do I register?' } });
    
    const sendBtn = screen.getByLabelText('chat.send');
    fireEvent.click(sendBtn);
    
    expect(chatService.sendMessage).toHaveBeenCalledWith('How do I register?', '', 'en');
    
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });
  });

  it('updates state and sends query when state is selected', async () => {
    chatService.sendMessage.mockResolvedValue({ response: 'State response' });
    
    render(<ChatPanel />);
    
    const select = screen.getByLabelText('chat.placeholder').closest('.chat-panel').querySelector('select');
    fireEvent.change(select, { target: { value: 'Delhi' } });
    
    expect(chatService.sendMessage).toHaveBeenCalled();
  });
});
