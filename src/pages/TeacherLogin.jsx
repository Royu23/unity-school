import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { TeacherLoggedin } from '../Redux/Slices/TeacherSlice';

const TeacherLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const isLoggedin = useSelector((state) => state.teacher.loggedin);
  const schoolUrl = process.env.REACT_APP_API_SCHOOL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (isLoggedin) {
      navigate('/teacher/profile/active');
    }
  }, [isLoggedin, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setErrorMsg('Please provide both your registered faculty email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Direct call to teacher login endpoint
      const response = await fetch(`${schoolUrl}/teacher/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password.trim() })
      });
      const data = await response.json();

      if (data?.data?.accesstoken) {
        // Redux action sync
        dispatch(TeacherLoggedin(form));
        localStorage.setItem('userdata', JSON.stringify({
          username: data.data.name,
          accessToken: data.data.accesstoken.token,
          email: data.data.email
        }));
        navigate('/teacher/profile/active');
      } else {
        setErrorMsg(data?.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to the backend server. Please verify the API is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 px-8 pt-8 pb-6 text-white text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-white p-1.5 shadow-md mb-3">
              <img 
                src="/school_logo.jpg" 
                alt="Emblem" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full bg-emerald-800 text-white font-bold text-xl">UA</span>';
                }}
              />
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
              Faculty & Staff Desk
            </span>
            <h2 className="text-2xl font-bold mt-2">Teacher Portal Login</h2>
            <p className="text-xs text-emerald-200 mt-1">Access attendance records, syllabus, and marks</p>
          </div>

          {/* Form */}
          <div className="p-8">
            
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="teacher@unityacademy.edu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password / Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all pr-12"
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
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-500/20 hover-lift transition-all disabled:opacity-60"
              >
                {loading ? 'Verifying Faculty Credentials...' : 'Sign In as Faculty'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 text-center">Demo Faculty Quick-Fill:</p>
              <button
                type="button"
                onClick={() => setForm({ email: 'Hari@gmail.com', password: 'GNGwHNQS51' })}
                className="w-full text-xs py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium transition-colors border border-emerald-200 text-center"
              >
                👨‍🏫 Faculty Advisor: Hari (Hari@gmail.com / GNGwHNQS51)
              </button>
            </div>

          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <Link to="/" className="text-emerald-700 font-semibold hover:underline">
              &larr; Back to Campus Homepage
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherLogin;