import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Shield, User, Smartphone, Key, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { 
    signUp, 
    signIn, 
    theme 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  
  // Registration Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sign In Flow
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Email and password are required');
      return;
    }
    
    setSubmitting(true);

    try {
      await signIn(email, password);
      onNavigate('home');
    } catch (err) {
      console.error(err);
      alert('Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sign Up Register Flow
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !userName) {
      alert('All fields are required');
      return;
    }

    setSubmitting(true);

    try {
      await signUp(email, userName, userPhone, password);
      onNavigate('home');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="auth-view-wrapper" className="py-12 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        
        <div className={`p-8 rounded-lg border ${
          theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-900/40 border-neutral-850'
        }`}>
          
          {/* Form Headers */}
          <div className="text-center mb-6">
            <div className="h-10 w-10 mx-auto rounded bg-cyan-950/50 flex items-center justify-center border border-cyan-900/35 max-w-sm shrink-0 mb-3">
              <Lock className="h-5 w-5 text-cyan-400" />
            </div>
            {mode === 'signin' && (
              <>
                <h3 className="font-sans font-black text-md text-neutral-100 uppercase tracking-tight">SECURE DATABASE SIGN IN</h3>
                <p className="text-[10px] text-neutral-500 mt-1">Access previous purchases with encrypted database identities.</p>
              </>
            )}
            {mode === 'register' && (
              <>
                <h3 className="font-sans font-black text-md text-neutral-100 uppercase tracking-tight">CREATE SECURE IDENTITY</h3>
                <p className="text-[10px] text-neutral-500 mt-1">Register directly in LightHubUsers table for guaranteed vehicle fitment.</p>
              </>
            )}
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 font-mono text-xs">
              
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">Email Username</label>
                <div className="relative">
                  <input
                    id="signin-email-field"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. dallaherick0@gmail.com"
                    className="w-full py-1.5 pl-10 pr-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <Mail className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-600" />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">Account Secret Password</label>
                <div className="relative">
                  <input
                    id="signin-password-field"
                    type="password"
                    required
                    onChange={() => {}}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full py-1.5 pl-10 pr-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <Key className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-600" />
                </div>
              </div>

              <button
                id="signin-submit-cta"
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-sans font-black text-xs rounded uppercase shadow transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                {submitting ? 'Connecting...' : 'Secure Authorization'} <ArrowRight className="h-4 w-4" />
              </button>

              {/* Toggle option links */}
              <div className="flex justify-between items-center text-[10px] pt-4 border-t border-neutral-900 leading-none">
                <button
                  id="signin-link-to-register"
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-cyan-400 hover:underline"
                >
                  Create secure database account
                </button>
                <button
                  id="signin-autofill-admin"
                  type="button"
                  onClick={() => {
                    setEmail('dallaherick0@gmail.com');
                  }}
                  className="text-amber-500 font-bold hover:underline"
                >
                  Autofill Default User
                </button>
              </div>

            </form>
          )}

          {/* REGISTER ACCOUNT FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 font-mono text-xs">
              
              <div>
                <label className="block text-[8px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">Customer Name</label>
                <div className="relative">
                  <input
                    id="register-name-field"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Erick Dallah"
                    className="w-full py-1.5 pl-10 pr-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <User className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-600" />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">Email Address</label>
                <div className="relative">
                   <input
                     id="register-email-field"
                     type="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="email@example.com"
                     className="w-full py-1.5 pl-10 pr-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                   />
                  <Mail className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-600" />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">Mobile Phone (optional)</label>
                <div className="relative">
                  <input
                    id="register-phone-field"
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g. +254 712 345 678"
                    className="w-full py-1.5 pl-10 pr-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                  />
                  <Smartphone className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-600" />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-wider text-neutral-500 mb-1.5 font-bold">Choose Password</label>
                <div className="relative">
                  <input
                    id="register-password-field"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose Secure Password"
                    className="w-full py-1.5 pl-10 pr-3 bg-neutral-950 text-neutral-200 border border-neutral-800 rounded focus:outline-none"
                  />
                  <Key className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-600" />
                </div>
              </div>

              <button
                id="register-submit-cta"
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-sans font-black text-xs rounded uppercase shadow transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                {submitting ? 'Creating Register...' : 'Register Identity'}
              </button>

              <div className="flex justify-center items-center text-[10px] pt-4 border-t border-neutral-900 leading-none">
                <button
                  id="register-link-back-to-signin"
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-cyan-400 hover:underline"
                >
                  Already have an account? Sign In
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
