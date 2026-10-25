import React, { useState, useEffect } from 'react';

const ClassManagement = () => {
  const schoolUrl = process.env.REACT_APP_API_SCHOOL || 'http://127.0.0.1:8000';

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Filter
  const [selectedStandardFilter, setSelectedStandardFilter] = useState('ALL');

  // Create Form State
  const [formData, setFormData] = useState({
    standard: '10',
    section: 'A',
    classTeacherId: '',
    roomNumber: 'Room 101',
    capacity: 40,
    academicYear: '2026-2027'
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    standard: '',
    section: '',
    classTeacherId: '',
    roomNumber: '',
    capacity: 40,
    academicYear: ''
  });

  // Subject Form State
  const [subjectForm, setSubjectForm] = useState({
    subjectName: '',
    teacherId: ''
  });

  // Fetch Classes and Teachers
  const fetchClassesAndTeachers = async () => {
    try {
      setLoading(true);
      const [classRes, teacherRes] = await Promise.all([
        fetch(`${schoolUrl}/class`),
        fetch(`${schoolUrl}/teacher`)
      ]);

      const classData = await classRes.json();
      const teacherData = await teacherRes.json();

      if (classData.success && classData.data) {
        setClasses(classData.data);
      }
      if (teacherData.data) {
        setTeachers(teacherData.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load class and teacher records from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndTeachers();
  }, []);

  // Handle Create Class
  const handleCreateClass = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${schoolUrl}/class`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standard: Number(formData.standard),
          section: formData.section.trim().toUpperCase(),
          classTeacherId: formData.classTeacherId || null,
          roomNumber: formData.roomNumber.trim(),
          capacity: Number(formData.capacity),
          academicYear: formData.academicYear.trim()
        })
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMsg(`Class ${result.data?.className || 'Class'} successfully created!`);
        setShowCreateModal(false);
        fetchClassesAndTeachers();
        setFormData({
          standard: '10',
          section: 'A',
          classTeacherId: '',
          roomNumber: 'Room 101',
          capacity: 40,
          academicYear: '2026-2027'
        });
      } else {
        setErrorMsg(result.message || 'Error creating class');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to backend server.');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (cls) => {
    setSelectedClass(cls);
    setEditFormData({
      standard: String(cls.standard),
      section: cls.section || '',
      classTeacherId: cls.classTeacherId?._id || '',
      roomNumber: cls.roomNumber || '',
      capacity: cls.capacity || 40,
      academicYear: cls.academicYear || '2026-2027'
    });
    setShowEditModal(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Handle Edit Submit
  const handleUpdateClass = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${schoolUrl}/class/${selectedClass._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standard: Number(editFormData.standard),
          section: editFormData.section.trim().toUpperCase(),
          classTeacherId: editFormData.classTeacherId || null,
          roomNumber: editFormData.roomNumber.trim(),
          capacity: Number(editFormData.capacity),
          academicYear: editFormData.academicYear.trim()
        })
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMsg(`Class ${result.data?.className} updated successfully!`);
        setShowEditModal(false);
        fetchClassesAndTeachers();
      } else {
        setErrorMsg(result.message || 'Failed to update class details.');
      }
    } catch (err) {
      setErrorMsg('Connection error while updating class.');
    }
  };

  // Handle Delete Class
  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Are you sure you want to delete ${className}?`)) return;

    try {
      const res = await fetch(`${schoolUrl}/class/${classId}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMsg('Class deleted successfully.');
        fetchClassesAndTeachers();
      } else {
        setErrorMsg(result.message || 'Failed to delete class.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to backend.');
    }
  };

  // Open Subject Modal
  const handleOpenSubjectModal = (cls) => {
    setSelectedClass(cls);
    setSubjectForm({ subjectName: '', teacherId: '' });
    setShowSubjectModal(true);
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!selectedClass || !subjectForm.subjectName) return;

    try {
      const res = await fetch(`${schoolUrl}/class/${selectedClass._id}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subjectForm.subjectName.trim(),
          teacherId: subjectForm.teacherId || null
        })
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMsg(`Subject assigned successfully to ${selectedClass.className}`);
        fetchClassesAndTeachers();
        setShowSubjectModal(false);
      } else {
        setErrorMsg(result.message || 'Failed to add subject.');
      }
    } catch (err) {
      setErrorMsg('Server error while assigning subject.');
    }
  };

  // Filtered classes
  const filteredClasses = selectedStandardFilter === 'ALL'
    ? classes
    : classes.filter((c) => String(c.standard) === selectedStandardFilter);

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Classrooms & Grade Roster</h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign class advisors, configure room capacities, and allocate academic subjects.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Grade Filter */}
          <select
            value={selectedStandardFilter}
            onChange={(e) => setSelectedStandardFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Grades (1 - 12)</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Grade {i + 1}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover-lift transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Class</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="font-bold text-rose-500">&times;</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold text-emerald-500">&times;</button>
        </div>
      )}

      {/* Class Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Loading classrooms and academic rosters...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🏫
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Classrooms Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Get started by creating your first grade section (e.g. Grade 10 - Section A) and assigning a class advisor.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            + Create First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const enrolled = cls.enrolledStudents || 0;
            const capacity = cls.capacity || 40;
            const percentFilled = Math.min(100, Math.round((enrolled / capacity) * 100));

            return (
              <div
                key={cls._id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between transition-all"
              >
                <div>
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Grade {cls.standard} &bull; Section {cls.section}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {cls.roomNumber || 'Room TBD'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {cls.className || `Grade ${cls.standard} - Section ${cls.section}`}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Academic Year: {cls.academicYear || '2026-2027'}</p>

                  {/* Class Teacher Indicator */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Class Advisor (Teacher)
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(cls)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {cls.classTeacherId ? 'Change Advisor' : '+ Assign'}
                      </button>
                    </div>

                    {cls.classTeacherId ? (
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {cls.classTeacherId?.name?.charAt(0) || 'T'}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 truncate">{cls.classTeacherId?.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {cls.classTeacherId?.subject || 'Faculty'} &bull; {cls.classTeacherId?.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-600 font-medium flex items-center justify-between">
                        <span>No advisor assigned</span>
                      </div>
                    )}
                  </div>

                  {/* Capacity Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                      <span>Enrollment</span>
                      <span>{enrolled} / {capacity} Students ({percentFilled}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentFilled > 90 ? 'bg-rose-500' : percentFilled > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>

                  {/* Subjects count tag */}
                  {cls.subjects && cls.subjects.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Assigned Subjects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cls.subjects.map((sub, i) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {sub.subjectName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleOpenEditModal(cls)}
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center space-x-1"
                    >
                      <span>✏️ Edit Class</span>
                    </button>
                    <button
                      onClick={() => handleOpenSubjectModal(cls)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      + Subjects
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteClass(cls._id, cls.className)}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* EDIT CLASS MODAL */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Edit Classroom Details</h3>
                <p className="text-xs text-blue-100 mt-1">Reassign class advisor, room, or capacity</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateClass} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Standard / Grade
                  </label>
                  <select
                    value={editFormData.standard}
                    onChange={(e) => setEditFormData({ ...editFormData, standard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-semibold"
                    required
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        Grade {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Section / Division
                  </label>
                  <input
                    type="text"
                    value={editFormData.section}
                    onChange={(e) => setEditFormData({ ...editFormData, section: e.target.value })}
                    placeholder="A, B, C..."
                    maxLength="3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 uppercase font-semibold text-center"
                    required
                  />
                </div>
              </div>

              {/* Class Teacher Allocation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Designated Class Teacher (Advisor)
                </label>
                <select
                  value={editFormData.classTeacherId}
                  onChange={(e) => setEditFormData({ ...editFormData, classTeacherId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="">-- No Class Advisor (Unassigned) --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.subject || 'Faculty'}) - {t.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.roomNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, roomNumber: e.target.value })}
                    placeholder="e.g. Room 204"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editFormData.capacity}
                    onChange={(e) => setEditFormData({ ...editFormData, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={editFormData.academicYear}
                  onChange={(e) => setEditFormData({ ...editFormData, academicYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CREATE CLASS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Create New Classroom</h3>
                <p className="text-xs text-blue-100 mt-1">Configure standard grade level and section division</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Standard / Grade
                  </label>
                  <select
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 font-semibold"
                    required
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        Grade {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Section / Division
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="A, B, C..."
                    maxLength="3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 uppercase font-semibold text-center"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Designated Class Teacher (Advisor)
                </label>
                <select
                  value={formData.classTeacherId}
                  onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Class Advisor (Optional) --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.subject || 'Faculty'}) - {t.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g. Room 204"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
                >
                  Save Classroom
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ASSIGN SUBJECT MODAL */}
      {showSubjectModal && selectedClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Assign Subject Teacher</h3>
                <p className="text-xs text-indigo-100 mt-1">
                  Allocating curriculum for {selectedClass.className}
                </p>
              </div>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={subjectForm.subjectName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subjectName: e.target.value })}
                  placeholder="e.g. Mathematics, Science, English"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Teacher
                </label>
                <select
                  value={subjectForm.teacherId}
                  onChange={(e) => setSubjectForm({ ...subjectForm, teacherId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose Subject Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.subject || 'Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                >
                  Assign Subject
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ClassManagement;
