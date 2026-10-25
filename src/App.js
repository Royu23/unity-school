import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Login from './pages/Login';
import ParentLogin from './pages/ParentLogin';
import AdminRoutes from './Routes/AdminRoutes';
import TeacherRoutes from './Routes/TeacherRoutes';
import StudentRoutes from './Routes/StudentRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            {/* Campus Homepage */}
            <Route path="/" element={<HomePage />} />
            
            {/* Unified Multi-Role Sign In */}
            <Route path="/login" element={<Login />} />
            
            {/* Dedicated Parent Portal */}
            <Route path="/parentLogin" element={<ParentLogin />} />
            
            {/* Administration Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            {/* Faculty & Staff Routes */}
            <Route path="/teacher/*" element={<TeacherRoutes />} />

            {/* Student Learning Portal Routes */}
            <Route path="/student/*" element={<StudentRoutes />} />
            
            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
