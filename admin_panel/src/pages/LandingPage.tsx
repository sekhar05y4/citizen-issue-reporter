import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Trash2, 
  Droplets, 
  Lightbulb, 
  Activity, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone,
  BarChart3,
  Clock,
  ChevronRight
} from 'lucide-react';
import type { UserRole } from '../types';

interface LandingPageProps {
  onNavigateLogin: (role?: UserRole) => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                Citizen Issue Reporter
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Municipal 360°
                </span>
              </span>
              <p className="text-xs text-slate-400 hidden sm:block">Civic Grievance & Smart Redressal Infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateLogin('CITIZEN')}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Citizen Access
            </button>
            <button
              onClick={() => onNavigateLogin('OFFICER')}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Officer Portal
            </button>
            <button
              onClick={() => onNavigateLogin('ADMIN')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Sign In / Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
          {/* Ambient background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 mb-8 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Next-Gen Municipal Governance Platform
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
              Empowering Citizens,{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Accelerating Civic Action.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Report potholes, sanitation hazards, water leakages, and broken streetlights in real-time. 
              Track municipal resolution with transparent SLA workflows and GPS-verified dispatch.
            </p>

            {/* Role Selection Cards */}
            <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Citizen Card */}
              <div 
                onClick={() => onNavigateLogin('CITIZEN')}
                className="group relative p-7 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Citizen Portal</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">Public Access</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Submit new complaints with live photo & GPS tagging, track grievance status, and rate redressal quality.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Citizen Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Department Officer Card */}
              <div 
                onClick={() => onNavigateLogin('OFFICER')}
                className="group relative p-7 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-teal-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">Officer Portal</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300">Field Redressal</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Review assigned departmental tickets, execute on-ground repairs, upload proof of work, and close complaints.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Officer Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Municipal Admin Card */}
              <div 
                onClick={() => onNavigateLogin('ADMIN')}
                className="group relative p-7 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">Admin Command Center</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300">Full Authority</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Live city-wide GIS heatmap, automated department routing, SLA compliance tracking, and staff management.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Command Center</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Civic Categories Covered */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Issue Coverage</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Full Spectrum Municipal Redressal</h3>
              <p className="text-xs text-slate-400 mt-2">Structured triage across all core civic infrastructure departments</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: AlertTriangle, title: 'Roads & Potholes', desc: 'Cracks, craters, asphalt damage', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { icon: Trash2, title: 'Garbage & Waste', desc: 'Overflowing bins, illegal dumping', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                { icon: Droplets, title: 'Water Leakage', desc: 'Burst pipelines, supply failure', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                { icon: Lightbulb, title: 'Street Lights', desc: 'Dark corridors, damaged poles', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                { icon: Activity, title: 'Drainage & Sewers', desc: 'Waterlogging, blocked manholes', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                { icon: Building2, title: 'Encroachments', desc: 'Footpath blocks, illegal boards', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center hover:border-slate-700 transition-colors">
                  <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-3 border ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Geotagged OpenStreetMap Tracking</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Accurate GPS coordinates pinpoint every incident on interactive municipal maps, avoiding duplicate reports and ensuring swift on-site dispatch.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Audited SLA Timelines & Statuses</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every grievance transitions with immutable timestamps from Submitted → Under Review → Assigned → In Progress → Resolved with citizen feedback.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Proof of Work Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Field officers upload real resolution photos before marking tickets resolved, ensuring accountability and measurable governance impact.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-400">Citizen Issue Reporter</span>
            <span>— Smart Municipal Governance</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigateLogin('CITIZEN')} className="hover:text-slate-300">Citizen Portal</button>
            <button onClick={() => onNavigateLogin('OFFICER')} className="hover:text-slate-300">Officer Login</button>
            <button onClick={() => onNavigateLogin('ADMIN')} className="hover:text-slate-300">Admin Command</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
