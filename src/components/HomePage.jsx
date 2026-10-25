import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const roles = [
    {
      title: "Administration",
      badge: "Full Control",
      desc: "Manage faculty profiles, student admissions, fees, classrooms, and school policies.",
      link: "/admin",
      accent: "from-blue-600 to-indigo-700",
      buttonText: "Admin Desk",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Faculty & Teachers",
      badge: "Academic Portal",
      desc: "Mark attendance, record examination marks, oversee class divisions, and track student growth.",
      link: "/teacher/login",
      accent: "from-emerald-600 to-teal-700",
      buttonText: "Teacher Portal",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Parents & Guardians",
      badge: "Family Gateway",
      desc: "Monitor your ward's daily attendance, academic scores, fee dues, and teacher announcements.",
      link: "/parentLogin",
      accent: "from-amber-500 to-orange-600",
      buttonText: "Parent Gateway",
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Student Hub",
      badge: "Learning Zone",
      desc: "Access daily schedules, curriculum materials, upcoming tests, and download term reports.",
      link: "/student/login",
      accent: "from-purple-600 to-indigo-700",
      buttonText: "Student Access",
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  const features = [
    {
      title: "Digital Attendance Tracking",
      desc: "One-click daily classroom attendance with automated absence alerts sent directly to registered parents.",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "Class & Subject Roster",
      desc: "Structured grade standards, divisions (A/B/C), and subject allocations with designated class advisors.",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      title: "Exam & Report Card Engine",
      desc: "Automated grade calculations, percentage summaries, and printable term report cards.",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    {
      title: "Fee Management & Receipts",
      desc: "Transparent term fee schedules, pending balance tracking, and instant digital payment receipts.",
      color: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
      title: "Real-time Notice Board",
      desc: "School-wide circulars, sports schedules, and emergency notices with instant digital delivery.",
      color: "bg-rose-50 text-rose-700 border-rose-200"
    },
    {
      title: "Secure Role-Based Access",
      desc: "Dedicated authentication tiers ensuring strict privacy and data isolation across stakeholders.",
      color: "bg-teal-50 text-teal-700 border-teal-200"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/campus_hero.jpg" 
            alt="Unity Academy Campus" 
            className="w-full h-full object-cover object-center opacity-30 scale-105 transform hover:scale-100 transition-transform duration-1000"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-950/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 lg:pt-32 lg:pb-36">
          <div className="max-w-3xl">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <span>Next-Gen Smart Campus ERP &bull; 2026 Academic Year</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Empowering Education Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Intelligent Governance</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 font-normal">
              A unified digital ecosystem linking institutional leadership, dedicated educators, students, and parents with real-time academic records, automated attendance, and seamless communication.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link 
                to="/login"
                className="px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 hover-lift transition-all flex items-center space-x-2"
              >
                <span>Access Portal Hub</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                to="/admin"
                className="px-6 py-3.5 rounded-xl text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 backdrop-blur-md hover-lift transition-all"
              >
                Admin Desk
              </Link>
            </div>

            {/* Quick Stat Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 pt-8 border-t border-slate-800/80 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-serif">2,400+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Enrolled Students</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-400 font-serif">120+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Faculty Members</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-serif">99.4%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Pass Rate</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400 font-serif">100%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Cloud Integrated</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Role Access Cards Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Tailored Portals</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dedicated Access for Every Stakeholder</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover-lift flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                    {role.icon}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {role.badge}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{role.desc}</p>
              </div>

              <Link
                to={role.link}
                className="w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <span>{role.buttonText}</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features Overview */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Core Architecture</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Integrated School ERP Capabilities</h3>
            <p className="text-slate-600 text-sm mt-3">
              Built to eliminate paperwork and ensure accurate, real-time collaboration between administrative leadership and teaching faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className={`w-fit px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border ${feat.color}`}>
                  Feature 0{idx + 1}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Notice Board Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            <div className="max-w-xl">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                Digital Noticeboard
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mt-4 mb-3">Academic Term Updates & Notices</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Stay updated with term examinations, faculty assignments, and upcoming school events.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 font-mono font-bold">OCT 28</span>
                  <span>Mid-Term Examination Schedules published for Standard 6 to 12.</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-mono font-bold">NOV 05</span>
                  <span>Annual Inter-School STEM Exhibition & Science Projects.</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-center flex flex-col items-center justify-center min-w-[280px]">
              <span className="text-3xl mb-2">🎓</span>
              <h4 className="text-lg font-bold text-white mb-1">Unity Academy</h4>
              <p className="text-xs text-slate-300 mb-5">Access your personalized portal dashboard</p>
              <Link
                to="/login"
                className="w-full py-3 px-6 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md"
              >
                Sign In Now
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;