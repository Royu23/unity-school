import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard';
import AdminProfile from '../pages/AdminProfile';
import ViewTeacherDetails from '../pages/ViewTeacherDetails';

const AdminRoutes = () => {
  return (
    <div>
        <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path='/profile' element={<AdminProfile />}/>
        <Route path="/:teacherid" element={<ViewTeacherDetails />}/>
        </Routes>
    </div>
  )
}

export default AdminRoutes