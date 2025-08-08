import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import './AuthModal.css';

const Login = ({ onClose, onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithGoogle, isLoaded } = useGoogleAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = async () => {
    if (!isLoaded) {
      setError('Google Sign-In is still loading. Please try again in a moment.');
      return;
    }

    setIsGoogleLoading(true);
    setError('');
    
    try {
      signInWithGoogle(async (googleUser) => {
        try {
          // Send Google credential to backend
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              credential: googleUser.credential
            }),
          });

          const data = await response.json();

          if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            onLogin(data.user);
          } else {
            setError(data.error || 'Google authentication failed');
          }
        } catch (error) {
          console.error('Google auth API error:', error);
          setError('Network error during Google authentication');
        } finally {
          setIsGoogleLoading(false);
        }
      });
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google authentication failed');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" style={{zIndex: 9999}}>
      <div className="auth-compact-modal">
        {/* Compact Header */}
        <div className="auth-compact-header">
          <button
            className="auth-compact-close"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="auth-compact-title">Welcome Back</h2>
          <p className="auth-compact-subtitle">Sign in to your account</p>
        </div>
        
        {/* Compact Form */}
        <div className="auth-compact-content">
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{marginBottom: '0.75rem'}}>
            <div style={{marginBottom: '0.75rem'}}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                disabled={isLoading}
                className="auth-compact-input"
              />
            </div>
            
            <div style={{marginBottom: '0.75rem'}}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                disabled={isLoading}
                className="auth-compact-input"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="auth-compact-button-primary"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
          
          {/* Compact Divider */}
          <div className="auth-compact-divider">
            <span className="auth-compact-divider-text">or</span>
          </div>
          
          {/* Google Button */}
          <button 
            className="auth-compact-button-outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || !isLoaded}
          >
            {isGoogleLoading ? (
              <>
                <div style={{
                  width: '1rem', 
                  height: '1rem', 
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid #3498db', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Signing in...
              </>
            ) : (
              <>
                <svg style={{width: '1rem', height: '1rem'}} viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>
          
          {/* Compact Footer */}
          <div className="auth-compact-footer">
            <p className="auth-compact-footer-text">
              Don't have an account?{' '}
              <button 
                className="auth-compact-footer-link"
                onClick={onSwitchToRegister}
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;