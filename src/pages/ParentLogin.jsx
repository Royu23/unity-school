import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ParentLogin = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please enter your registered email/phone and password.');
      return;
    }

    // Save active parent session
    localStorage.setItem('currentUser', JSON.stringify({
      role: 'parent',
      email: identifier,
      name: 'Parent / Guardian'
    }));

    setSuccessMsg('Verification successful! Loading your ward dashboard...');
    setTimeout(() => {
      navigate('/login?role=parent');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-8 pt-8 pb-6 text-white text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-white p-1.5 shadow-md mb-3">
              <img 
                src="/school_logo.jpg" 
                alt="Emblem" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full bg-amber-600 text-white font-bold text-xl">UA</span>';
                }}
              />
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 uppercase tracking-wider">
              Family & Guardian Gateway
            </span>
            <h2 className="text-2xl font-bold mt-2">Parent Portal</h2>
            <p className="text-xs text-amber-100 mt-1">Track your child's attendance, grades, and fee records</p>
          </div>

          <div className="p-8">
            
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Guardian Email or Phone Number
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="parent@gmail.com or 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Access Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md shadow-amber-500/20 hover-lift transition-all"
              >
                Access Ward Records
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                Guardian contact details are registered during student admission. Contact the school administration desk if your contact number or email has changed.
              </p>
            </div>

          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <Link to="/" className="text-amber-700 font-semibold hover:underline">
              &larr; Back to Campus Homepage
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ParentLogin;