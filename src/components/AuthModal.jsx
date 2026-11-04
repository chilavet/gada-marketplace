import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight, KeyRound, Smartphone, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login', message = '' }) {
  const { login, requestOtp, verifyOtp, register, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'otp' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');

  // Sync mode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  // Form states
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!identifier.trim() || !password) {
        throw new Error('Please enter both your email/phone and password');
      }
      const isEmail = identifier.includes('@');
      const user = await login({
        email: isEmail ? identifier.trim() : undefined,
        phone: !isEmail ? identifier.trim() : undefined,
        password
      });
      if (onSuccess) onSuccess(user, `Welcome back, ${user.name}! 👋`);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!identifier.trim()) {
        throw new Error('Please enter your phone number or email to receive OTP');
      }
      const isEmail = identifier.includes('@');
      const res = await requestOtp({
        phone: !isEmail ? identifier.trim() : undefined,
        email: isEmail ? identifier.trim() : undefined
      });
      setOtpSent(true);
      setOtpNotice(res.message || 'OTP sent! Use demo code: 123456');
    } catch (err) {
      setError(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!otpCode.trim() || otpCode.length < 4) {
        throw new Error('Please enter the 6-digit verification code.');
      }
      const isEmail = identifier.includes('@');
      const user = await verifyOtp({
        phone: !isEmail ? identifier.trim() : undefined,
        email: isEmail ? identifier.trim() : undefined,
        otp: otpCode.trim()
      });
      if (onSuccess) onSuccess(user, `Verified successfully! Welcome, ${user.name}! 🚀`);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name.trim()) throw new Error('Please enter your full name');
      if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
      if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

      const user = await register({
        name,
        email,
        phone,
        password,
        address
      });
      if (onSuccess) onSuccess(user, `Account registered! Welcome to Gada, ${user.name}! 🎉`);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await loginWithGoogle({
        name: name.trim() || 'George Emmanuel',
        email: email.trim().includes('@') ? email.trim() : 'george.emmanuel@gmail.com',
        avatar: 'GE'
      });
      if (onSuccess) onSuccess(user, `Signed in with Google! Welcome to Gada, ${user.name}! 🚀`);
      onClose();
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await login({ email: 'george@gada.ng', password: 'password123' });
      if (onSuccess) onSuccess(user, `Logged in as Demo Customer (${user.name}) ✨`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '92%',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Modal Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B132B 0%, #0F172A 100%)',
            padding: '24px 28px',
            color: '#FFF',
            position: 'relative',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '20px',
              top: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🇳🇬</span>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
                {mode === 'login' && 'Sign In to Gada'}
                {mode === 'otp' && 'Fast OTP Verification'}
                {mode === 'register' && 'Create Customer Account'}
              </h2>
              <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
                Connected to Gada Mobile & Web Ecosystem
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '18px', background: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'register' ? '#FF6B00' : 'transparent',
                color: '#FFF',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'login' ? '#FF6B00' : 'transparent',
                color: '#FFF',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('otp'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'otp' ? '#FF6B00' : 'transparent',
                color: '#FFF',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Phone / OTP
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', maxHeight: '70vh', overflowY: 'auto' }}>
          {message && (
            <div
              style={{
                background: '#FFF4EC',
                border: '1px solid #FFD8BE',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '18px',
                fontSize: '13px',
                color: '#C2410C',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #F87171',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '18px',
                fontSize: '13px',
                color: '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Prominent Google Sign-In / Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 18px',
              borderRadius: '14px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#0F172A',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease',
              marginBottom: '18px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#F8FAFC'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#FFFFFF'; }}
          >
            <GoogleIcon />
            <span>{mode === 'register' ? 'Sign up with Google' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              {mode === 'register' ? 'Or register with email' : 'Or with email & password'}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          {/* 1. PASSWORD LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Email Address or Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. george@gada.ng or 08034567890"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '12px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 42px',
                      borderRadius: '12px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#FF6B00',
                  color: '#FFF',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(255, 107, 0, 0.3)'
                }}
              >
                {loading ? 'Signing In...' : 'Sign In with Password'}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* 2. PHONE / OTP LOGIN MODE */}
          {mode === 'otp' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                    Enter your phone number or email. We will send a 6-digit OTP code to instantly sign you in without needing a password.
                  </p>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Phone Number or Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Smartphone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. +234 803 456 7890 or user@gada.ng"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          borderRadius: '12px',
                          border: '1.5px solid #E2E8F0',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      border: 'none',
                      background: '#0B4FD8',
                      color: '#FFF',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {loading ? 'Sending OTP...' : 'Send 6-Digit OTP Code'}
                    <KeyRound size={18} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {otpNotice && (
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#1E40AF' }}>
                      {otpNotice}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: '2px solid #FF6B00',
                        fontSize: '22px',
                        fontWeight: '800',
                        letterSpacing: '8px',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block', textAlign: 'center' }}>
                      Default demo verification OTP is <strong>123456</strong>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      border: 'none',
                      background: '#FF6B00',
                      color: '#FFF',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {loading ? 'Verifying...' : 'Verify & Access Account'}
                    <CheckCircle2 size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}
                  >
                    Change phone number or resend OTP
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 3. REGISTER MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. George Emmanuel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="email"
                    required
                    placeholder="george@gada.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Create Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '11px 42px 11px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Default Delivery Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    placeholder="e.g. 14 Commercial Ave, Victoria Island or Ring Road"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#FF6B00',
                  color: '#FFF',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '8px'
                }}
              >
                {loading ? 'Creating Account...' : 'Sign Up with Email'}
              </button>
            </form>
          )}

          {/* Quick Demo Login Option */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
              Want to test without typing credentials?
            </p>
            <button
              onClick={handleQuickDemoLogin}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '12px',
                border: '1.5px dashed #0B4FD8',
                background: '#EFF6FF',
                color: '#0B4FD8',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              Quick One-Click Demo Customer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
