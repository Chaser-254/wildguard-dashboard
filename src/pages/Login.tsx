import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { ShieldAlert, Mail, CheckCircle, ArrowRight } from 'lucide-react';
export function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const {
    login,
    verifyMagicLink,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', {
        replace: true
      });
    }
  }, [isAuthenticated, navigate]);
  // Handle magic link verification
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleVerifyMagicLink(token);
    }
  }, [searchParams]);
  const handleVerifyMagicLink = async (token: string) => {
    setVerifying(true);
    try {
      await verifyMagicLink(token);
      navigate('/', {
        replace: true
      });
    } catch (err) {
      setError('Invalid or expired magic link. Please try again.');
      setVerifying(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email);
      setLinkSent(true);
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Demo: Auto-login for testing
  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setIsLoading(true);
    try {
      await login(demoEmail);
      // Simulate clicking the magic link immediately
      const token = sessionStorage.getItem('pending_magic_link');
      if (token) {
        await verifyMagicLink(token);
        navigate('/', {
          replace: true
        });
      }
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };
  if (verifying) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying magic link...</p>
        </div>
      </div>;
  }
  if (linkSent) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Check your email
          </h2>
          <p className="text-slate-600 mb-6">
            We've sent a magic link to{' '}
            <span className="font-semibold text-slate-900">{email}</span>
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              Click the link in your email to sign in. The link will expire in
              15 minutes.
            </p>
          </div>
          <button onClick={() => setLinkSent(false)} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Use a different email
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-xl mb-4">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            WildGuard Plus
          </h1>
          <p className="text-slate-600">
            Wildlife monitoring & response system
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ranger@kws.go.ke" required className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" />
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>}

          <Button type="submit" isLoading={isLoading} className="w-full justify-center py-3">
            {isLoading ? 'Sending magic link...' : 'Send magic link'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center mb-3">
            Demo accounts (click to login):
          </p>
          <div className="space-y-2">
            {[{
            email: 'admin@wildguard.org',
            role: 'Admin',
            org: 'WildGuard Plus'
          }, {
            email: 'ranger@kws.go.ke',
            role: 'Ranger',
            org: 'KWS'
          }, {
            email: 'observer@krcs.org',
            role: 'Observer',
            org: 'KRCS'
          }, {
            email: 'community@mtakuja.org',
            role: 'Community',
            org: 'Mtakuja'
          }].map(account => <button key={account.email} onClick={() => handleDemoLogin(account.email)} className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-xs">
                <span className="font-medium text-slate-900">
                  {account.role}
                </span>
                <span className="text-slate-500"> • {account.org}</span>
              </button>)}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            No password required. We'll send you a secure link to sign in.
          </p>
        </div>
      </div>
    </div>;
}