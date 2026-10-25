import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const adminEmailSaved = (process.env.REACT_APP_API_ADMIN_EMAILS || 'chaithanya@gmail.com,principal@gmail.com').split(',');
  const adminPasswordSaved = (process.env.REACT_APP_API_ADMIN_PASSWORDS || '12345,23456').split(',');

  const checkValidAdmin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const emailTrim = adminEmail.trim();
    const passTrim = adminPassword.trim();
    const emailIndex = adminEmailSaved.indexOf(emailTrim);

    if (emailIndex !== -1 && adminPasswordSaved[emailIndex] === passTrim) {
      localStorage.setItem('currentUser', JSON.stringify({
        role: 'admin',
        email: emailTrim,
        name: emailTrim.includes('principal') ? 'Principal Office' : 'System Administrator'
      }));
      navigate('/admin/dashboard');
    } else {
      setErrorMessage('Invalid administrative credentials. Please verify your email and password.');
    }
  };

  const handleQuickFill = (email, pass) => {
    setAdminEmail(email);
    setAdminPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl p-8 sm:p-10 text-white">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-white p-1.5 shadow-lg mb-4">
              <img 
                src="/school_logo.jpg" 
                alt="Emblem" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full bg-blue-900 text-white font-bold text-xl">UA</span>';
                }}
              />
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
              Leadership Desk
            </span>
            <h2 className="text-2xl font-bold mt-3">Administrative Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Authorized personnel and management sign-in</p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
              <svg className="w-4 h-4 flex-shrink-0 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={checkValidAdmin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="principal@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-200 font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all hover-lift"
            >
              Sign In to Management Console
            </button>
          </form>

          {/* Demo Quick-Fill */}
          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <p className="text-xs font-medium text-slate-400 mb-2 text-center">Quick-Fill Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('chaithanya@gmail.com', '12345')}
                className="text-xs py-2 px-3 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-medium transition-colors text-center truncate"
              >
                chaithanya
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('principal@gmail.com', '23456')}
                className="text-xs py-2 px-3 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-medium transition-colors text-center truncate"
              >
                principal
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              &larr; Back to Campus Homepage
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLogin;