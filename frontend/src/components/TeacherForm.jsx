import React, { useState } from 'react';
import axios from 'axios';

const TeacherForm = ({ OnAddTeacherClick }) => {
  const SchoolUrl = process.env.REACT_APP_API_SCHOOL || 'http://127.0.0.1:8000';
  const [data, setData] = useState({
    name: '',
    email: '',
    city: '',
    pin: '',
    subject: '',
    phoneNumber: '',
    standard: '10'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewTeacher = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email) {
      setErrorMsg('Please provide both the teacher name and email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post(`${SchoolUrl}/teacher`, data);
      if (res.data) {
        alert(`Teacher ${data.name} added successfully! Passcode: ${res.data?.data?.password || 'auto-generated'}`);
        OnAddTeacherClick();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to register teacher. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Register New Faculty Member</h3>
            <p className="text-xs text-emerald-100 mt-1">Credentials will be generated automatically</p>
          </div>
          <button
            onClick={OnAddTeacherClick}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleAddNewTeacher} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Dr. Alan Turing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="alan@unityacademy.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Subject
              </label>
              <input
                type="text"
                name="subject"
                value={data.subject}
                onChange={handleChange}
                placeholder="e.g. Mathematics"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={data.phoneNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={data.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pin"
                value={data.pin}
                onChange={handleChange}
                placeholder="560001"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Standard
              </label>
              <input
                type="number"
                name="standard"
                value={data.standard}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={OnAddTeacherClick}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register Teacher'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TeacherForm;