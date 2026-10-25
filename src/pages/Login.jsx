import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TeacherLoggedin } from '../Redux/Slices/TeacherSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'admin';

  const [activeTab, setActiveTab] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials from env or fallback defaults
  const adminEmails = (process.env.REACT_APP_API_ADMIN_EMAILS || 'chaithanya@gmail.com,principal@gmail.com').split(',');
  const adminPasswords = (process.env.REACT_APP_API_ADMIN_PASSWORDS || '12345,23456').split(',');
  const schoolUrl = process.env.REACT_APP_API_SCHOOL || 'http://127.0.0.1:8000';

  const handleRoleChange = (role) => {
    setActiveTab(role);
    setErrorMsg('');
    setEmail('');
    setPassword('');
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg('Please enter both your identifier and password.');
      setIsLoading(false);
      return;
    }

    try {
      if (activeTab === 'admin') {
        const emailTrim = email.trim();
        const passTrim = password.trim();
        const emailIndex = adminEmails.indexOf(emailTrim);

        if (emailIndex !== -1 && adminPasswords[emailIndex] === passTrim) {
          localStorage.setItem('currentUser', JSON.stringify({ role: 'admin', email: emailTrim, name: 'School Administrator' }));
          navigate('/admin/dashboard');
        } else {
          setErrorMsg('Invalid Administrator credentials. Please verify your email and password.');
        }
      } else if (activeTab === 'teacher') {
        // Dispatch Teacher Login
        const result = await dispatch(TeacherLoggedin({ email: email.trim(), password: password.trim() }));
        // Also check direct backend response if token was saved
        const userdata = localStorage.getItem('userdata');
        if (userdata) {
          navigate('/teacher/profile/active');
        } else {
          // Direct fallback fetch in case Redux slice has differing field structure
          const res = await fetch(`${schoolUrl}/teacher/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), password: password.trim() })
          });
          const data = await res.json();
          if (data?.data?.accesstoken) {
            localStorage.setItem('userdata', JSON.stringify({
              username: data.data.name,
              accessToken: data.data.accesstoken.token,
              email: data.data.email
            }));
            navigate('/teacher/profile/active');
          } else {
            setErrorMsg(data?.message || 'Invalid Teacher credentials.');
          }
        }
      } else if (activeTab === 'parent') {
        // Direct parent verification or demo redirect
        localStorage.setItem('currentUser', JSON.stringify({ role: 'parent', email, name: 'Guardian' }));
      } else if (activeTab === 'student') {
        const res = await fetch(`${schoolUrl}/student/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: email.trim(), password: password.trim() })
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
      }
    } catch (err) {
      setErrorMsg('Connection error. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* Card Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          
          {/* Top Banner Branding */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 px-8 pt-8 pb-6 text-white text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-white p-1.5 shadow-md mb-3">
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
            <h2 className="text-2xl font-bold tracking-tight">Unity Academy</h2>
            <p className="text-xs text-blue-200 font-medium uppercase tracking-wider mt-1">Unified Portal Access</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 text-center text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-3 transition-colors ${
                activeTab === 'admin' 
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
                  : 'hover:text-slate-900'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`py-3 transition-colors ${
                activeTab === 'teacher' 
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
                  : 'hover:text-slate-900'
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('parent')}
              className={`py-3 transition-colors ${
                activeTab === 'parent' 
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
                  : 'hover:text-slate-900'
              }`}
            >
              Parent
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-3 transition-colors ${
                activeTab === 'student' 
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
                  : 'hover:text-slate-900'
              }`}
            >
              Student
            </button>
          </div>

          {/* Login Form Body */}
          <div className="p-8">
            
            {/* Context Badge */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 capitalize">
                  {activeTab} Sign In
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeTab === 'admin' && 'Enter your administrative credentials to manage campus.'}
                  {activeTab === 'teacher' && 'Access faculty gradebook, attendance & schedules.'}
                  {activeTab === 'parent' && 'Sign in using registered guardian contact info.'}
                  {activeTab === 'student' && 'View your academic progress and classes.'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {activeTab === 'student' ? 'Student ID / Roll No' : 'Email / User ID'}
                </label>
                <div className="relative">
                  <input
                    type={activeTab === 'student' ? 'text' : 'email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === 'admin' ? 'principal@gmail.com' :
                      activeTab === 'teacher' ? 'teacher@school.com' :
                      activeTab === 'parent' ? 'parent@gmail.com' : 'STU-2026-001'
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all pr-12"
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

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span>Remember me</span>
                </label>
                <span className="text-blue-600 hover:underline cursor-pointer">Forgot password?</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover-lift transition-all disabled:opacity-60"
              >
                {isLoading ? 'Signing In...' : `Sign In as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </button>
            </form>

            {/* Demo Quick-Fill Helper */}
            {activeTab === 'admin' && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2">Demo Quick-Fill:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('chaithanya@gmail.com', '12345')}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Admin: chaithanya@gmail.com
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('principal@gmail.com', '23456')}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    Admin: principal@gmail.com
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'teacher' && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-2 text-center">Demo Faculty Quick-Fill:</p>
                <button
                  type="button"
                  onClick={() => handleQuickFill('Hari@gmail.com', 'GNGwHNQS51')}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium transition-colors border border-emerald-200 text-center"
                >
                  👨‍🏫 Faculty Advisor: Hari (Hari@gmail.com / GNGwHNQS51)
                </button>
              </div>
            )}

            {activeTab === 'student' && (
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
            )}

          </div>

          {/* Card Footer */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Need assistance? </span>
            <Link to="/" className="text-blue-600 font-semibold hover:underline">
              Return to Campus Home
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;