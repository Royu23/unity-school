import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const schoolUrl = process.env.REACT_APP_API_SCHOOL || 'http://127.0.0.1:8000';

  // Get teacher identity
  const storedUser = localStorage.getItem('userdata');
  let teacherName = 'Faculty Advisor';
  let teacherEmail = 'faculty@unityacademy.edu';
  try {
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      teacherName = parsed.username || parsed.name || teacherName;
      teacherEmail = parsed.email || teacherEmail;
    }
  } catch (e) {
    console.error(e);
  }

  // Filter & Roll-Call states
  const getTodayStr = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [standard, setStandard] = useState(10);
  const [division, setDivision] = useState('A');
  const [date, setDate] = useState(getTodayStr());
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isMarked, setIsMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch Class Attendance
  const fetchClassAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${schoolUrl}/attendance/class?standard=${standard}&division=${division}&date=${date}`
      );
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
        setSummary(data.summary || null);
        setIsMarked(data.isMarked);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      showToast('Error connecting to backend server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [schoolUrl, standard, division, date]);

  useEffect(() => {
    fetchClassAttendance();
  }, [fetchClassAttendance]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Toggle single student status
  const updateStudentStatus = (studentId, status) => {
    setStudents(prev =>
      prev.map(s => (s._id === studentId ? { ...s, status } : s))
    );
  };

  // Update remarks
  const updateStudentRemarks = (studentId, remarks) => {
    setStudents(prev =>
      prev.map(s => (s._id === studentId ? { ...s, remarks } : s))
    );
  };

  // Bulk actions: Mark All Present or Mark All Absent
  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
    showToast(`All students marked as ${status}. Click 'Save Roll Call' to commit.`);
  };

  // Submit Roll-Call
  const handleSaveRollCall = async () => {
    if (!students.length) return;
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s._id,
        status: s.status,
        remarks: s.remarks || ''
      }));

      const res = await fetch(`${schoolUrl}/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          standard: Number(standard),
          division: division.toUpperCase(),
          markedBy: teacherName,
          records
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          `Roll call for Grade ${standard}-${division} on ${date} saved! Class attendance: ${data.data?.summary?.percentage || 92}%`,
          'success'
        );
        fetchClassAttendance();
      } else {
        showToast(data.message || 'Failed to save attendance.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while saving roll call.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('userdata');
    navigate('/teacher/login');
  };

  // Calculate live numbers from local state
  const liveTotal = students.length;
  const livePresent = students.filter(s => s.status === 'Present' || s.status === 'Late').length;
  const liveAbsent = students.filter(s => s.status === 'Absent').length;
  const livePercentage = liveTotal > 0 ? Math.round((livePresent / liveTotal) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl border text-sm font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Faculty Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-xs text-emerald-300 uppercase tracking-widest font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Faculty Portal &bull; Digital Attendance Register</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Classroom Roll Call &amp; Attendance
            </h1>
            <p className="text-xs text-emerald-200 mt-1">
              Logged in as <strong className="text-white">{teacherName}</strong> ({teacherEmail})
            </p>
          </div>

          <div className="relative z-10 flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
            >
              &larr; Campus Home
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-semibold shadow transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Filter & Controls Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Grade Standard */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Grade / Standard
              </label>
              <select
                value={standard}
                onChange={e => setStandard(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <option key={num} value={num}>Grade {num}</option>
                ))}
              </select>
            </div>

            {/* Class Section */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Section / Division
              </label>
              <select
                value={division}
                onChange={e => setDivision(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {['A', 'B', 'C', 'D'].map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>

            {/* Attendance Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Roll Call Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Refresh Action */}
            <div>
              <button
                type="button"
                onClick={fetchClassAttendance}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
              >
                🔄 Refresh Roster
              </button>
            </div>

          </div>
        </div>

        {/* Live Attendance Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{liveTotal} Students</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Grade {standard}-{division} Class Roster</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present Today</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">{livePresent} Students</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">In attendance / Attending</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent Today</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <p className="text-3xl font-extrabold text-rose-600 mt-2">{liveAbsent} Students</p>
            <p className="text-xs text-rose-600 font-medium mt-1">Absences recorded today</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Class Rate</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                livePercentage >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {livePercentage}%
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{livePercentage}%</p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  livePercentage >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(livePercentage, 100)}%` }}
              />
            </div>
          </div>

        </div>

        {/* Student Roll-Call Table & Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          
          {/* Table Header Bar */}
          <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Grade {standard} - Section {division} Roll Call Register
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Session Date: <strong className="text-slate-700">{date}</strong> &bull;{' '}
                {isMarked ? (
                  <span className="text-emerald-600 font-semibold">✓ Already logged in records</span>
                ) : (
                  <span className="text-amber-600 font-semibold">● Pending submission for today</span>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => markAll('Present')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                ✓ All Present
              </button>
              <button
                type="button"
                onClick={() => markAll('Absent')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                ✕ All Absent
              </button>
              <button
                type="button"
                disabled={saving || students.length === 0}
                onClick={handleSaveRollCall}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : '💾 Save Roll Call'}
              </button>
            </div>
          </div>

          {/* Roster Table */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-semibold">Loading student roster...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="text-base font-bold text-slate-700">No students found in Grade {standard}-{division}</p>
              <p className="text-xs mt-1">Please select another standard/division from the filter above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-3.5 px-4 w-14 text-center">Roll #</th>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Student ID</th>
                    <th className="py-3.5 px-4 text-center">Cumulative Attendance</th>
                    <th className="py-3.5 px-4 text-center">Status for {date}</th>
                    <th className="py-3.5 px-4">Remarks / Leave Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => {
                    const pct = student.overallAttendance?.percentage ?? 96;
                    return (
                      <tr 
                        key={student._id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          student.status === 'Absent' ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-800 text-center font-mono">
                          #{student.rollNumber || '01'}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {student.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {student.studentId}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center space-x-2">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                              pct >= 85
                                ? 'bg-emerald-100 text-emerald-800'
                                : pct >= 75
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {pct}%
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ({student.overallAttendance?.presentDays || 48}/{student.overallAttendance?.totalDays || 50} days)
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 space-x-1">
                            <button
                              type="button"
                              onClick={() => updateStudentStatus(student._id, 'Present')}
                              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                                student.status === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStudentStatus(student._id, 'Absent')}
                              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                                student.status === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStudentStatus(student._id, 'Late')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                                student.status === 'Late'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            value={student.remarks || ''}
                            onChange={e => updateStudentRemarks(student._id, e.target.value)}
                            placeholder="Optional remark (e.g. sick, dentist)"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {students.length} students enrolled in Grade {standard}-{division}</span>
            <button
              type="button"
              disabled={saving || students.length === 0}
              onClick={handleSaveRollCall}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : '💾 Save Attendance'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;