import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import VoterRegistration from '../features/registration/VoterRegistration';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      if (key === 'states') return ['Delhi', 'Punjab'];
      if (key === 'registration.step1') return 'Personal';
      if (key === 'registration.step2') return 'Address';
      if (key === 'registration.step3') return 'Identity';
      if (key === 'registration.step4') return 'Review';
      return key;
    },
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe('VoterRegistration Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and progresses through steps', async () => {
    render(<VoterRegistration />);
    
    // Step 0: Personal Details
    expect(screen.getByText('registration.name')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('registration.name'), { target: { value: 'Amrit' } });
    
    const nextBtn = screen.getByText('registration.next →');
    fireEvent.click(nextBtn);
    
    // Step 1: Address
    expect(screen.getByText('registration.state')).toBeInTheDocument();
    fireEvent.click(nextBtn);
    
    // Step 2: Identity
    expect(screen.getByText('registration.idType')).toBeInTheDocument();
    fireEvent.click(nextBtn);
    
    // Step 3: Review
    expect(screen.getByText('📋 Review Your Details')).toBeInTheDocument();
    expect(screen.getByText('Amrit')).toBeInTheDocument();
  });

  it('handles submission successfully', async () => {
    global.fetch.mockResolvedValue({ ok: true });
    
    render(<VoterRegistration />);
    
    // Skip to step 3
    const nextBtn = screen.getByText('registration.next →');
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    
    const submitBtn = screen.getByText('✅ registration.submit');
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText('registration.success')).toBeInTheDocument();
    });
  });
});
