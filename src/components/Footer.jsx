import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
                <img 
                  src="/school_logo.jpg" 
                  alt="Unity Academy" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="flex items-center justify-center w-full h-full bg-blue-900 text-white font-bold text-sm">UA</span>';
                  }}
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Unity Academy</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering next-generation learners through academic excellence, character development, and state-of-the-art digital infrastructure.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational &bull; Academic Year 2026</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Portals & Access
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                  <span className="text-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                  Administrative Board
                </Link>
              </li>
              <li>
                <Link to="/teacher/login" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                  <span className="text-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                  Faculty & Staff Desk
                </Link>
              </li>
              <li>
                <Link to="/parentLogin" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                  <span className="text-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                  Parent Gateway
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                  <span className="text-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                  Unified Portal Sign-In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-2">
              Academic Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Attendance & Leave Guidelines</li>
              <li className="hover:text-white transition-colors cursor-pointer">Examination & Grading Criteria</li>
              <li className="hover:text-white transition-colors cursor-pointer">Fee Schedules & Online Invoices</li>
              <li className="hover:text-white transition-colors cursor-pointer">Digital Library & Learning Resources</li>
              <li className="hover:text-white transition-colors cursor-pointer">Student Code of Conduct</li>
            </ul>
          </div>

          {/* Column 4: Contact & Helpdesk */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Campus Helpdesk
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>104 University Avenue, Academic Hills, Metro 560012</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@unityacademy.edu</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mon – Fri: 08:00 AM – 04:30 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Unity Academy School Management System. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Protocol</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;