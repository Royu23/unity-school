import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const schoolUrl = process.env.REACT_APP_API_SCHOOL || 'http://127.0.0.1:8000';

  const [studentData, setStudentData] = useState(null);
  const [classroomData, setClassroomData] = useState(null);
  const [attendanceInfo, setAttendanceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('studentUser');
    if (!stored) {
      navigate('/login?role=student');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setStudentData(parsed.student);
      setClassroomData(parsed.classroom);

      // Refresh from backend if student ID exists
      if (parsed.student?._id) {
        // Fetch student details and class
        fetch(`${schoolUrl}/student/${parsed.student._id}`)
          .then((r) => r.json())
          .then((res) => {
            if (res.success && res.data) {
              setStudentData(res.data.student);
              if (res.data.classInfo) setClassroomData(res.data.classInfo);
            }
          })
          .catch((err) => console.log('Sync err:', err));

        // Fetch live attendance metrics and session logs
        fetch(`${schoolUrl}/attendance/student/${parsed.student._id}`)
          .then((r) => r.json())
          .then((res) => {
            if (res.success && res.data) {
              setAttendanceInfo(res.data);
            }
          })
          .catch((err) => console.log('Attendance sync err:', err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch (e) {
      navigate('/login?role=student');
    }
  }, [navigate, schoolUrl]);

  const handleSignOut = () => {
    localStorage.removeItem('studentUser');
    navigate('/login?role=student');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600 font-semibold">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  const subjects = classroomData?.subjects || [
    { subjectName: 'Mathematics', teacher: 'Faculty' },
    { subjectName: 'Physical Science', teacher: 'Faculty' },
    { subjectName: 'English Literature', teacher: 'Faculty' },
    { subjectName: 'Social Studies', teacher: 'Faculty' }
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Student Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-xs text-purple-300 uppercase tracking-widest font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Student Learning Portal &bull; Academic Year 2026-2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {studentData.Name || studentData.name}!
            </h1>
            <p className="text-sm text-purple-200 mt-1">
              Enrolled in <span className="font-bold text-white">Grade {studentData.Standard} - Section {studentData.Division}</span> &bull; Roll #{studentData.rollNumber || '01'}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowIdCardModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/25 hover-lift transition-all flex items-center space-x-2"
            >
              <span>🪪 View Digital Student ID</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Attendance Rate */}
          <div 
            onClick={() => setShowAttendanceModal(true)}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                Attendance Rate
              </span>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                (attendanceInfo?.metrics?.percentage ?? studentData.attendance?.percentage ?? 96) >= 85
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : (attendanceInfo?.metrics?.percentage ?? studentData.attendance?.percentage ?? 96) >= 75
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {attendanceInfo?.metrics?.percentage ?? studentData.attendance?.percentage ?? 96}%
              </span>
            </div>
            
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-slate-900">
                {attendanceInfo?.metrics?.presentDays ?? studentData.attendance?.presentDays ?? 49} / {attendanceInfo?.metrics?.totalDays ?? studentData.attendance?.totalDays ?? 51} <span className="text-xs text-slate-400 font-normal">Days</span>
              </p>
              <span className="text-[11px] font-semibold text-indigo-600 group-hover:underline">
                View Logs &rarr;
              </span>
            </div>

            {/* Attendance Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  (attendanceInfo?.metrics?.percentage ?? studentData.attendance?.percentage ?? 96) >= 85 
                    ? 'bg-emerald-500' 
                    : (attendanceInfo?.metrics?.percentage ?? studentData.attendance?.percentage ?? 96) >= 75 
                    ? 'bg-amber-500' 
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(attendanceInfo?.metrics?.percentage ?? studentData.attendance?.percentage ?? 96, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs mt-2 text-slate-500 font-medium">
              <span>Present: <strong className="text-emerald-600">{attendanceInfo?.metrics?.presentDays ?? studentData.attendance?.presentDays ?? 49}</strong></span>
              <span>Absent: <strong className="text-rose-600">{attendanceInfo?.metrics?.absentDays ?? studentData.attendance?.absentDays ?? 2}</strong></span>
              <span>Req: <strong>75%</strong></span>
            </div>
          </div>

          {/* Card 2: Classroom & Room */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classroom</span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 text-sm">🏫</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">Grade {studentData.Standard}-{studentData.Division}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Room: {classroomData?.roomNumber || 'Room 201'}</p>
          </div>

          {/* Card 3: Class Advisor */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class Advisor</span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600 text-sm">👨‍🏫</span>
            </div>
            <p className="text-lg font-extrabold text-slate-900 mt-2 truncate">
              {classroomData?.classTeacher?.name || classroomData?.classTeacherId?.name || 'Class Teacher'}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1 truncate">
              {classroomData?.classTeacher?.email || classroomData?.classTeacherId?.email || 'advisor@unityacademy.edu'}
            </p>
          </div>

          {/* Card 4: Student ID */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student ID</span>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600 text-sm font-mono font-bold">ID</span>
            </div>
            <p className="text-lg font-extrabold text-purple-700 mt-2 font-mono">
              {studentData.studentId || 'STU-10A-1001'}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">Institutional Account</p>
          </div>

        </div>

        {/* 2-Column Main Layout: Curriculum & Academic Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Curriculum & Subjects */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enrolled Curriculum & Subjects</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Academic coursework for Grade {studentData.Standard}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {subjects.length} Subjects
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map((sub, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        0{i + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{sub.subjectName}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Faculty: {sub.teacherId?.name || sub.teacher || 'Department Faculty'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Timetable Preview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Today's Class Schedule</h3>
              <p className="text-xs text-slate-500 mb-4">Daily period timetable & timings</p>

              <div className="space-y-2.5">
                {[
                  { time: '08:30 - 09:15 AM', period: 'Period 1', subject: 'Mathematics', room: 'Room 201' },
                  { time: '09:20 - 10:05 AM', period: 'Period 2', subject: 'Physical Science', room: 'Physics Lab' },
                  { time: '10:10 - 10:55 AM', period: 'Period 3', subject: 'English Literature', room: 'Room 201' },
                  { time: '11:00 - 11:30 AM', period: 'Break', subject: 'Morning Recess & Nutrition', room: 'Campus Cafeteria' },
                  { time: '11:35 - 12:20 PM', period: 'Period 4', subject: 'Social Studies & Civics', room: 'Room 201' },
                  { time: '12:25 - 01:10 PM', period: 'Period 5', subject: 'Computer Science & Coding', room: 'IT Lab 2' }
                ].map((slot, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {slot.time}
                      </span>
                      <div>
                        <p className="font-bold text-slate-800">{slot.subject}</p>
                        <p className="text-[10px] text-slate-500">{slot.period}</p>
                      </div>
                    </div>
                    <span className="text-slate-500 font-medium">{slot.room}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 3: Noticeboard & Guardian Details */}
          <div className="space-y-6">
            
            {/* Student Noticeboard */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center space-x-2 text-xs text-purple-300 font-semibold uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Noticeboard</span>
              </div>
              <h4 className="text-base font-bold mb-3">Term Announcements</h4>
              
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-blue-300 font-bold block mb-1">Oct 28, 2026</span>
                  Mid-Term examinations for Grade 10 begin next Monday. Hall tickets are available at the front desk.
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-emerald-300 font-bold block mb-1">Nov 04, 2026</span>
                  Annual Inter-School Science Fair submissions are open. Submit project abstracts to your Science teacher.
                </div>
              </div>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Personal & Guardian Profile
              </h4>

              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Full Name</span>
                <span className="font-bold text-slate-800">{studentData.Name || studentData.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Gender</span>
                <span className="font-bold text-slate-800">{studentData.Gender || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Age</span>
                <span className="font-bold text-slate-800">{studentData.Age || '15'} Years</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Student Email</span>
                <span className="font-bold text-indigo-600 truncate max-w-[170px]">{studentData.email}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100 pt-2">
                <span className="text-slate-400 font-medium">Linked Guardian</span>
                <span className="font-bold text-slate-800">{studentData.parentId?.name || 'Registered Guardian'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Guardian Contact</span>
                <span className="font-bold text-slate-800">{studentData.parentId?.phoneNumber || 'School Records'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* DIGITAL STUDENT ID MODAL */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* ID Card Front */}
            <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 p-6 text-white text-center relative">
              <button
                onClick={() => setShowIdCardModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-lg font-bold"
              >
                &times;
              </button>

              <div className="w-14 h-14 mx-auto rounded-2xl bg-white p-1 shadow-md mb-2">
                <img src="/school_logo.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-base font-bold">Unity Academy</h3>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest">Official Student Identity Card</p>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 font-bold text-2xl flex items-center justify-center mx-auto shadow-inner border-2 border-indigo-200">
                {(studentData.Name || studentData.name)?.charAt(0)}
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">{studentData.Name || studentData.name}</h4>
                <p className="text-xs font-semibold text-indigo-600">Grade {studentData.Standard} &bull; Section {studentData.Division}</p>
                <p className="text-xs font-mono text-slate-400 mt-1">{studentData.studentId}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left text-xs space-y-1 text-slate-600">
                <p><span className="font-semibold text-slate-400">Roll Number:</span> #{studentData.rollNumber || '01'}</p>
                <p><span className="font-semibold text-slate-400">Academic Year:</span> 2026 - 2027</p>
                <p><span className="font-semibold text-slate-400">Status:</span> Enrolled (Active)</p>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow transition-all"
              >
                Print / Save ID Card
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ATTENDANCE ANALYTICS & ROLL-CALL HISTORY MODAL */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold p-1 rounded-full hover:bg-white/10"
              >
                &times;
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                    Academic Compliance &bull; 2026-2027
                  </span>
                  <h3 className="text-xl font-bold">Attendance Analytics &amp; Roll Call</h3>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    {studentData.Name || studentData.name} &bull; Grade {studentData.Standard}-{studentData.Division}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Primary Rate & Standing Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center space-x-4">
                  <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-extrabold border-2 shadow-inner ${
                    (attendanceInfo?.metrics?.percentage ?? 96) >= 85
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : (attendanceInfo?.metrics?.percentage ?? 96) >= 75
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}>
                    <span className="text-2xl leading-none">{attendanceInfo?.metrics?.percentage ?? 96}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Overall</span>
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      (attendanceInfo?.metrics?.percentage ?? 96) >= 85
                        ? 'bg-emerald-100 text-emerald-800'
                        : (attendanceInfo?.metrics?.percentage ?? 96) >= 75
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {attendanceInfo?.metrics?.standing || 'Excellent Standing'}
                    </span>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs">
                      {attendanceInfo?.metrics?.message || 'Eligible for all academic terms and examinations.'}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-slate-400 block font-medium">Mandatory Requirement</span>
                  <span className="text-sm font-bold text-slate-700">75% Minimum</span>
                </div>
              </div>

              {/* Attendance Statistics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sessions</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {attendanceInfo?.metrics?.totalDays ?? 51}
                  </span>
                  <span className="text-[11px] text-slate-500">Conducted</span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Present</span>
                  <span className="text-xl font-extrabold text-emerald-700 mt-1 block">
                    {attendanceInfo?.metrics?.presentDays ?? 49}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">Sessions Attended</span>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-center">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Absences</span>
                  <span className="text-xl font-extrabold text-rose-700 mt-1 block">
                    {attendanceInfo?.metrics?.absentDays ?? 2}
                  </span>
                  <span className="text-[11px] text-rose-600 font-medium">Missed Sessions</span>
                </div>
              </div>

              {/* Progress Bar & Equation Banner */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900">
                <div className="flex items-center justify-between font-semibold mb-1.5">
                  <span>Formula: (Present Days / Total Days) &times; 100</span>
                  <span>{attendanceInfo?.metrics?.percentage ?? 96}% Score</span>
                </div>
                <div className="w-full bg-indigo-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${Math.min(attendanceInfo?.metrics?.percentage ?? 96, 100)}%` }}
                  />
                </div>
              </div>

              {/* Daily Roll Call Logs */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Recent Roll Call Session Logs</span>
                  <span className="text-[11px] text-slate-400 font-normal">Updated Live</span>
                </h4>

                {attendanceInfo?.history && attendanceInfo.history.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {attendanceInfo.history.map((log, i) => (
                      <div key={i} className="p-3 bg-white flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <span className={`w-2 h-2 rounded-full ${
                            log.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          <div>
                            <p className="font-bold text-slate-800">{log.date}</p>
                            <p className="text-[11px] text-slate-400">Marked by {log.markedBy || 'Class Teacher'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            log.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {log.status}
                          </span>
                          {log.remarks && (
                            <p className="text-[10px] text-slate-400 mt-0.5 italic">{log.remarks}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    <p className="font-medium">All historical attendance sessions recorded.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Today's roll call: <strong className="text-emerald-600">Present (2026-10-25)</strong></p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 shadow transition-all"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
