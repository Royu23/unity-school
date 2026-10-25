import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StudentLogin = () => {
  const navigate = useNavigate();
  const schoolUrl = process.env.REACT_APP_API_SCHOOL || 'http://127.0.0.1:8000';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please enter your Student ID or Email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${schoolUrl}/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (data.success && data.data) {
        localStorage.setItem('studentUser', JSON.stringify({
          student: data.data.student,
          classroom: data.data.classroom,
          token: data.data.accessToken?.token
        }));
        navigate('/student/dashboard');
      } else {
        setErrorMsg(data.message || 'Invalid Student ID or password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Cannot connect to school backend server. Please verify port 8000 is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (id, pass) => {
    setIdentifier(id);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 px-8 pt-8 pb-6 text-white text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-white p-1.5 shadow-md mb-3">
              <img 
                src="/school_logo.jpg" 
                alt="Emblem" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full bg-purple-900 text-white font-bold text-xl">UA</span>';
                }}
              />
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 uppercase tracking-wider">
              Student Hub &bull; Portal
            </span>
            <h2 className="text-2xl font-bold mt-2">Student Sign In</h2>
            <p className="text-xs text-purple-200 mt-1">Access schedules, homework, and term reports</p>
          </div>

          <div className="p-8">
            
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student ID or Institutional Email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. STU-10A-9415 or student@unityacademy.edu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all pr-12"
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
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 shadow-md shadow-purple-500/20 hover-lift transition-all disabled:opacity-60"
              >
                {loading ? 'Verifying Student Credentials...' : 'Sign In as Student'}
              </button>
            </form>

            {/* Demo Student Quick Fill */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 text-center">Demo Student Quick-Fill:</p>
              <button
                type="button"
                onClick={() => handleQuickFill('STU-10A-9415', '12345')}
                className="w-full text-xs py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-medium transition-colors border border-purple-200 text-center"
              >
                🎓 Enrolled Student: Rohan Sharma (ID: STU-10A-9415 / 12345)
              </button>
            </div>

          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <Link to="/" className="text-purple-700 font-semibold hover:underline">
              &larr; Back to Campus Homepage
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentLogin;
