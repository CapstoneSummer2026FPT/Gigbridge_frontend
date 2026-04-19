import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, Code, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../../../app/providers/AppProvider';
import '../styles/role-selection-screen.css';

export default function RoleSelectionScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<0 | 1 | null>(null);

  // Safely get app context
  let appContext;
  try {
    appContext = useApp();
  } catch (e) {
    appContext = null;
  }

  const setRole = appContext?.setRole || (() => {});

  const handleContinue = () => {
    if (selected === null) return;
    setRole(selected);
    navigate('/onboarding/profile-setup');
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-content">
        {/* Header */}
        <div className="role-selection-header">
          <div className="role-selection-logo">
            <Sparkles size={24} />
          </div>
          <h1 className="role-selection-title">Join GigBridge</h1>
          <p className="role-selection-subtitle">
            Choose how you want to get started
          </p>
        </div>

        {/* Role Cards */}
        <div className="role-selection-cards">
          {/* Client Card */}
          <button
            onClick={() => setSelected(0)}
            className={`role-card ${selected === 0 ? 'role-card-selected' : ''}`}
          >
            <div className="role-card-icon-wrapper">
              <Briefcase size={32} />
            </div>
            <h2 className="role-card-title">I'm a Client</h2>
            <p className="role-card-description">
              Hire talented freelancers for your projects
            </p>
            <ul className="role-card-features">
              <li>Post unlimited job listings</li>
              <li>AI-powered talent matching</li>
              <li>Secure payment protection</li>
              <li>24/7 project management tools</li>
            </ul>
            {selected === 0 && (
              <div className="role-card-selected-indicator">
                <ChevronRight size={16} />
              </div>
            )}
          </button>

          {/* Freelancer Card */}
          <button
            onClick={() => setSelected(1)}
            className={`role-card ${selected === 1 ? 'role-card-selected' : ''}`}
          >
            <div className="role-card-icon-wrapper">
              <Code size={32} />
            </div>
            <h2 className="role-card-title">I'm a Freelancer</h2>
            <p className="role-card-description">
              Find projects that match your expertise
            </p>
            <ul className="role-card-features">
              <li>Browse thousands of jobs</li>
              <li>AI interview preparation</li>
              <li>Get paid securely & on time</li>
              <li>Build your reputation</li>
            </ul>
            {selected === 1 && (
              <div className="role-card-selected-indicator">
                <ChevronRight size={16} />
              </div>
            )}
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={selected === null}
          className={`role-selection-continue ${selected !== null ? 'role-selection-continue-active' : ''}`}
        >
          Continue
          <ChevronRight size={18} />
        </button>

        {/* Footer */}
        <p className="role-selection-footer">
          Already have an account?{' '}
          <button onClick={() => navigate('/auth')} className="role-selection-footer-link">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}