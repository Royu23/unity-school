import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ViewTeacherDetails from '../pages/ViewTeacherDetails';
import TeacherLogin from '../pages/TeacherLogin';
import TeachersDashboard from '../pages/TeacherDashboard';
import { useSelector } from 'react-redux';

const TeacherRoutes = () => {
  const loginInfo = useSelector((state) => state.teacher.loggedin);
  const storedUser = localStorage.getItem("userdata");
  const isAuthenticated = loginInfo || Boolean(storedUser);

  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<TeacherLogin />} />
        <Route path="/login" element={<TeacherLogin />} />
        
        {/* Protected Faculty Routes */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <TeachersDashboard /> : <Navigate to="/teacher/login" replace />} 
        />
        <Route 
          path="/attendance" 
          element={isAuthenticated ? <TeachersDashboard /> : <Navigate to="/teacher/login" replace />} 
        />
        <Route 
          path="/profile/:loggedteacherId" 
          element={isAuthenticated ? <TeachersDashboard /> : <Navigate to="/teacher/login" replace />} 
        />
        <Route 
          path="/details/:teacherid" 
          element={isAuthenticated ? <ViewTeacherDetails /> : <Navigate to="/teacher/login" replace />} 
        />
      </Routes>
    </div>
  );
};

export default TeacherRoutes;