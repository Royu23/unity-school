import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import StudentLogin from '../pages/StudentLogin';
import StudentDashboard from '../pages/StudentDashboard';

const StudentRoutes = () => {
  const isStudentLoggedIn = Boolean(localStorage.getItem('studentUser'));

  return (
    <Routes>
      <Route path="/" element={<StudentLogin />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route
        path="/dashboard"
        element={isStudentLoggedIn ? <StudentDashboard /> : <Navigate to="/student/login" replace />}
      />
    </Routes>
  );
};

export default StudentRoutes;
