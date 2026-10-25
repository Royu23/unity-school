import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassManagement from '../components/ClassManagement';
import TeacherForm from '../components/TeacherForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const schoolUrl = process.env.REACT_APP_API_SCHOOL || 'http://127.0.0.1:8000';

  const [activeTab, setActiveTab] = useState('classes');
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Teacher Modals & Search
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherSearch, setTeacherSearch] = useState('');

  // Student Modals & Search
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('ALL');

  // Edit Teacher Form State
  const [editTeacherData, setEditTeacherData] = useState({
    name: '',
    email: '',
    subject: '',
    phoneNumber: '',
    standard: '',
    city: '',
    pin: ''
  });

  // Enroll Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '',
    standard: '10',
    division: 'A',
    rollNumber: '',
    gender: 'Male',
    age: '15',
    password: '12345',
    address: '',
    pincode: ''
  });

  // Fetch summary data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tRes, cRes, sRes] = await Promise.all([
        fetch(`${schoolUrl}/teacher`),
        fetch(`${schoolUrl}/class`),
        fetch(`${schoolUrl}/student`)
      ]);

      const tData = await tRes.json();
      const cData = await cRes.json();
      const sData = await sRes.json();

      if (tData.data) setTeachers(tData.data);
      if (cData.data) setClasses(cData.data);
      if (sData.data) setStudents(sData.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Delete Teacher
  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from faculty records?`)) return;

    try {
      const res = await fetch(`${schoolUrl}/teacher/${id}`, { method: 'DELETE' });
      const data = await res.json();
      alert(data.message || 'Teacher removed');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete teacher');
    }
  };

  // Open Edit Teacher Modal
  const handleOpenEditTeacher = (t) => {
    setSelectedTeacher(t);
    setEditTeacherData({
      name: t.name || '',
      email: t.email || '',
      subject: t.subject || '',
      phoneNumber: t.phoneNumber ? String(t.phoneNumber) : '',
      standard: t.standard ? String(t.standard) : '10',
      city: t.city || '',
      pin: t.pin || ''
    });
    setShowEditTeacherModal(true);
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    try {
      const res = await fetch(`${schoolUrl}/teacher/${selectedTeacher._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTeacherData)
      });
      const data = await res.json();
      alert(data.message || 'Teacher details updated!');
      setShowEditTeacherModal(false);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update teacher');
    }
  };

  // Create / Enroll Student
  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.standard || !studentForm.division) {
      alert('Please fill out student name, standard, and division.');
      return;
    }

    try {
      const res = await fetch(`${schoolUrl}/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentForm.name.trim(),
          standard: Number(studentForm.standard),
          division: studentForm.division.trim().toUpperCase(),
          rollNumber: studentForm.rollNumber || undefined,
          gender: studentForm.gender,
          age: studentForm.age,
          password: studentForm.password || '12345',
          address: studentForm.address,
          pincode: studentForm.pincode
        })
      });

      const result = await res.json();
      if (result.success) {
        alert(`Student enrolled successfully!\nStudent ID: ${result.data?.studentId}\nPasscode: ${result.data?.password}`);
        setShowStudentModal(false);
        fetchDashboardData();
        setStudentForm({
          name: '',
          standard: '10',
          division: 'A',
          rollNumber: '',
          gender: 'Male',
          age: '15',
          password: '12345',
          address: '',
          pincode: ''
        });
      } else {
        alert(result.message || 'Error enrolling student');
      }
    } catch (err) {
      alert('Failed to connect to backend server');
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to unenroll student ${name}?`)) return;

    try {
      const res = await fetch(`${schoolUrl}/student/${id}`, { method: 'DELETE' });
      const data = await res.json();
      alert(data.message || 'Student unenrolled.');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  // Filter teachers
  const filteredTeachers = teachers.filter((t) =>
    t.name?.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.subject?.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.email?.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      (s.Name || s.name)?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase());

    const matchesGrade =
      studentGradeFilter === 'ALL' || String(s.Standard) === studentGradeFilter;

    return matchesSearch && matchesGrade;
  });

  return (
    <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Console Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-400 uppercase tracking-widest font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Academic Year 2026-2027 &bull; Central Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Institutional Administration</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Oversee grade classrooms, faculty course allocations, and enrolled students roster.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                localStorage.removeItem('currentUser');
                navigate('/admin');
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Classrooms & Sections</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{classes.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Active grade divisions</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              🏫
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Teaching Faculty</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{teachers.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Assigned educators</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              👨‍🏫
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Students</p>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">{students.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Active student accounts</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
              👨‍🎓
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 rounded-t-2xl pt-3 space-x-6">
          <button
            onClick={() => setActiveTab('classes')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'classes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🏫 Classrooms & Divisions ({classes.length})
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'teachers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            👨‍🏫 Faculty & Staff ({teachers.length})
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'students' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            👨‍🎓 Student Admissions ({students.length})
          </button>
        </div>

        {/* Tab Content 1: Classrooms */}
        {activeTab === 'classes' && (
          <div>
            <ClassManagement />
          </div>
        )}

        {/* Tab Content 2: Teachers Management */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Faculty Roster</h2>
                <p className="text-xs text-slate-500 mt-1">Manage teaching staff profiles, assigned subjects, and credentials.</p>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <button
                  onClick={() => setShowTeacherForm(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 hover-lift transition-all flex items-center space-x-2"
                >
                  <span>+ Add New Faculty</span>
                </button>
              </div>
            </div>

            {/* Teacher Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                        {item.name?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {item.subject || 'Faculty'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p><span className="font-semibold text-slate-400">Email:</span> {item.email}</p>
                      <p><span className="font-semibold text-slate-400">Phone:</span> {item.phoneNumber || 'Not provided'}</p>
                      <p><span className="font-semibold text-slate-400">Assigned Standard:</span> Grade {item.standard || 'All'}</p>
                      <p><span className="font-semibold text-slate-400">Location:</span> {item.city || 'Campus'}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditTeacher(item)}
                      className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center space-x-1"
                    >
                      <span>✏️ Edit Profile</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTeacher(item._id, item.name)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for adding teacher */}
            {showTeacherForm && (
              <TeacherForm
                OnAddTeacherClick={() => {
                  setShowTeacherForm(false);
                  fetchDashboardData();
                }}
              />
            )}

            {/* Modal for EDITING teacher */}
            {showEditTeacherModal && selectedTeacher && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  
                  <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Edit Faculty Member</h3>
                      <p className="text-xs text-emerald-100 mt-1">Updating profile for {selectedTeacher.name}</p>
                    </div>
                    <button
                      onClick={() => setShowEditTeacherModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleUpdateTeacher} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={editTeacherData.name}
                          onChange={(e) => setEditTeacherData({ ...editTeacherData, name: e.target.value })}
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
                          value={editTeacherData.email}
                          onChange={(e) => setEditTeacherData({ ...editTeacherData, email: e.target.value })}
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
                          value={editTeacherData.subject}
                          onChange={(e) => setEditTeacherData({ ...editTeacherData, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={editTeacherData.phoneNumber}
                          onChange={(e) => setEditTeacherData({ ...editTeacherData, phoneNumber: e.target.value })}
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
                          value={editTeacherData.city}
                          onChange={(e) => setEditTeacherData({ ...editTeacherData, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={editTeacherData.pin}
                          onChange={(e) => setEditTeacherData({ ...editTeacherData, pin: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Standard
                        </label>
                        <input
                          type="number"
                          value={editTeacherData.standard}
                          onChange={(e) => setEditTeacherData({ ...editTeacherData, standard: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowEditTeacherModal(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                      >
                        Save Profile Changes
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab Content 3: Student Admissions & Roster */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            
            {/* Student Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Student Admissions Roster</h2>
                <p className="text-xs text-slate-500 mt-1">Enroll students, view institutional IDs, and passcodes for student login.</p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Grade Filter */}
                <select
                  value={studentGradeFilter}
                  onChange={(e) => setStudentGradeFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">All Grades (1 - 12)</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>Grade {i + 1}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  onClick={() => setShowStudentModal(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 hover-lift transition-all flex items-center space-x-2"
                >
                  <span>+ Enroll Student</span>
                </button>
              </div>
            </div>

            {/* Students Table / Cards */}
            {filteredStudents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  👨‍🎓
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">No Students Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Enroll your first student into a classroom to generate their login credentials.
                </p>
                <button
                  onClick={() => setShowStudentModal(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
                >
                  + Enroll First Student
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                        <th className="py-3.5 px-4">Student Details</th>
                        <th className="py-3.5 px-4">Student ID (Login)</th>
                        <th className="py-3.5 px-4">Grade & Section</th>
                        <th className="py-3.5 px-4">Roll No</th>
                        <th className="py-3.5 px-4 text-center">Attendance %</th>
                        <th className="py-3.5 px-4">Login Passcode</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((s) => (
                        <tr key={s._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                {(s.Name || s.name)?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{s.Name || s.name}</p>
                                <p className="text-slate-400 text-[11px]">{s.email || 'No email'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                              {s.studentId}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-800">
                              Grade {s.Standard} - Section {s.Division}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            #{s.rollNumber || '01'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                              (s.attendance?.percentage ?? 96) >= 85
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : (s.attendance?.percentage ?? 96) >= 75
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {s.attendance?.percentage ?? 96}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                              {s.password || '12345'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteStudent(s._id, s.Name || s.name)}
                              className="text-xs font-bold text-rose-500 hover:text-rose-700"
                            >
                              Unenroll
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ENROLL STUDENT MODAL */}
            {showStudentModal && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  
                  <div className="bg-gradient-to-r from-indigo-800 to-purple-900 p-6 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Enroll New Student</h3>
                      <p className="text-xs text-indigo-100 mt-1">Generates unique Student ID and login passcode</p>
                    </div>
                    <button
                      onClick={() => setShowStudentModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleEnrollStudent} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        placeholder="e.g. Maya Patel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Standard / Grade *
                        </label>
                        <select
                          value={studentForm.standard}
                          onChange={(e) => setStudentForm({ ...studentForm, standard: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 font-semibold"
                          required
                        >
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={String(i + 1)}>Grade {i + 1}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Division / Section *
                        </label>
                        <input
                          type="text"
                          value={studentForm.division}
                          onChange={(e) => setStudentForm({ ...studentForm, division: e.target.value })}
                          placeholder="A, B, C..."
                          maxLength="3"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 uppercase font-semibold text-center"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          value={studentForm.rollNumber}
                          onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                          placeholder="e.g. 102"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Login Passcode
                        </label>
                        <input
                          type="text"
                          value={studentForm.password}
                          onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                          placeholder="12345"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Gender
                        </label>
                        <select
                          value={studentForm.gender}
                          onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={studentForm.age}
                          onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                          placeholder="15"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowStudentModal(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                      >
                        Enroll Student
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;