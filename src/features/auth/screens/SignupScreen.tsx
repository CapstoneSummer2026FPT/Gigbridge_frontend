import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap, Bot, Star, CheckCircle, Briefcase, Code, ChevronRight } from 'lucide-react';
import { useApp } from '../../../app/providers/AppProvider';
import { UserRole } from '../../../types/models/User';
import '../styles/auth-screen.css';

type SignupStep = 'role' | 'form';

export default function SignupScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '',
  });

  let appContext;
  try {
    appContext = useApp();
  } catch (e) {
    appContext = null;
  }

  const signup = appContext?.signup || (async () => {});

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (selectedRole === null) {
        setError('Please select a role');
        setIsLoading(false);
        return;
      }

      await signup(formData.email, formData.password, formData.firstName, formData.lastName, selectedRole);
      navigate('/onboarding/profile-setup');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex auth-container">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden p-10 auth-left-panel">
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full opacity-10 animate-float auth-orb-cyan" />
        <div className="absolute bottom-40 right-10 w-60 h-60 rounded-full opacity-10 animate-float auth-orb-purple" />

        <div className="flex items-center gap-3 mb-auto">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center auth-logo-bg">
            <Zap size={22} className="auth-logo-icon" />
          </div>
          <span className="text-primary text-xl font-black">GigBridge</span>
          <span className="badge-cyan">AI</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center animate-orb auth-ai-avatar">
              <Bot size={56} className="auth-ai-avatar-icon" />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center auth-orb-green">
              <CheckCircle size={14} className="auth-orb-green-icon" />
            </div>
            <div className="absolute -bottom-2 -left-4 w-8 h-8 rounded-full flex items-center justify-center auth-orb-amber">
              <Star size={14} fill="#F59E0B" className="auth-orb-amber-icon" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-primary mb-4">Your AI Career Partner</h2>
          <p className="text-base max-w-sm auth-description">
            Join the intelligent marketplace that connects world-class talent with ambitious companies.
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {['AI Job Matching', 'Smart Proposals', 'AI Interviews', 'Instant Pay'].map(f => (
              <span key={f} className="badge-cyan">{f}</span>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {['jordan', 'alex', 'sarah', 'marcus'].map(seed => (
                <img key={seed} src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                  className="w-8 h-8 rounded-full border-2 auth-avatar-border" alt="" />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} fill="#F59E0B" className="auth-star-icon" />
                ))}
              </div>
              <p className="text-xs auth-description">52K+ members trust us</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center mt-auto auth-footer-text">
          © 2026 GigBridge AI · Privacy · Terms
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center auth-logo-bg">
              <Zap size={16} className="auth-logo-icon" />
            </div>
            <span className="text-primary font-bold">GigBridge</span>
          </div>

          {step === 'role' ? (
            <>
              <h1 className="text-3xl font-black text-primary mb-2">Get started today</h1>
              <p className="mb-8 auth-subtitle">Choose how you want to get started</p>

              <div className="space-y-3 mb-8">
                {/* Client Card */}
                <button
                  onClick={() => handleRoleSelect(UserRole.Client)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedRole === UserRole.Client
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Briefcase size={24} className="text-cyan-500 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">I'm a Client</h3>
                      <p className="text-sm text-secondary">Hire talented freelancers for your projects</p>
                    </div>
                    {selectedRole === UserRole.Client && <ChevronRight size={20} className="text-cyan-500" />}
                  </div>
                </button>

                {/* Freelancer Card */}
                <button
                  onClick={() => handleRoleSelect(UserRole.Freelancer)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedRole === UserRole.Freelancer
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Code size={24} className="text-purple-500 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">I'm a Freelancer</h3>
                      <p className="text-sm text-secondary">Find projects that match your expertise</p>
                    </div>
                    {selectedRole === UserRole.Freelancer && <ChevronRight size={20} className="text-purple-500" />}
                  </div>
                </button>
              </div>

              <button
                onClick={() => setStep('form')}
                disabled={selectedRole === null}
                className="btn-cyan w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight size={18} />
              </button>

              <p className="text-center mt-6 text-sm auth-switch-text">
                Already have an account?{' '}
                <button className="font-semibold auth-link-cyan"
                  onClick={() => navigate('/auth/login')}>
                  Log In
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-black text-primary mb-2">Create your account</h1>
              <p className="mb-8 auth-subtitle">Fill in your details to get started</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444' }}>
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 auth-input-icon" />
                    <input type="text" placeholder="First Name" value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      className="input-gb w-full py-3 auth-input-with-icon" />
                  </div>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 auth-input-icon" />
                    <input type="text" placeholder="Last Name" value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="input-gb w-full py-3 auth-input-with-icon" />
                  </div>
                </div>

                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 auth-input-icon" />
                  <input type="email" placeholder="Email address" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="input-gb w-full py-3 auth-input-with-icon" />
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 auth-input-icon" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="input-gb w-full py-3 auth-input-with-icon auth-input-with-icon-both" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 auth-input-icon">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button type="submit" disabled={isLoading}
                  className="btn-cyan w-full py-3 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#0A0F1C] border-t-transparent animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <button
                onClick={() => setStep('role')}
                className="w-full mt-4 py-2 text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                ← Back to role selection
              </button>

              <p className="text-center mt-6 text-sm auth-switch-text">
                Already have an account?{' '}
                <button className="font-semibold auth-link-cyan"
                  onClick={() => navigate('/auth/login')}>
                  Log In
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
