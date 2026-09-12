import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  FileText, 
  FolderCheck, 
  GraduationCap, 
  HelpCircle, 
  LayoutDashboard, 
  MessageSquare, 
  Play, 
  Search, 
  ShieldCheck, 
  User, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

interface GreenRiverDecoyProps {
  onLaunchGame: () => void;
  onExitDecoy: () => void;
}

export const GreenRiverDecoy: React.FC<GreenRiverDecoyProps> = ({
  onLaunchGame,
  onExitDecoy
}) => {
  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#2d3b45] font-sans antialiased flex flex-col">
      {/* Top Clever & Canvas Global Header */}
      <header className="bg-[#1b2536] text-white px-4 py-2.5 flex items-center justify-between shadow-md border-b border-[#28374d]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#1366e2] flex items-center justify-center font-bold text-white text-xs shadow">
              C
            </div>
            <div className="w-8 h-8 rounded bg-[#0374b5] flex items-center justify-center font-bold text-white text-xs shadow">
              GRC
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight">Clever | Green River College</h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
                SSO Verified
              </span>
            </div>
            <p className="text-[11px] text-gray-300">Canvas Learning Management System &bull; Course EDU-1117</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:inline px-2.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-mono text-[11px]">
            Clever ID: #1117-ACTIVE
          </span>
          <div className="flex items-center gap-1.5 text-gray-300">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Student (Enrolled)</span>
          </div>

          <button
            onClick={onExitDecoy}
            className="px-2.5 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200 transition-colors cursor-pointer"
            title="Toggle to standard interface"
          >
            Interface Mode
          </button>
        </div>
      </header>

      {/* Main Course Shell */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="w-48 hidden md:block shrink-0 space-y-1 text-sm border-r border-gray-200 pr-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mb-2">
            Course Navigation
          </div>
          <a href="#home" className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#0374b5]/10 text-[#0374b5] font-semibold">
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </a>
          <a href="#modules" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">
            <BookOpen className="w-4 h-4" />
            <span>Modules</span>
          </a>
          <a href="#assignments" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">
            <FileText className="w-4 h-4" />
            <span>Assignments</span>
          </a>
          <a href="#grades" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Grades (96.4%)</span>
          </a>
          <a href="#syllabus" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">
            <Calendar className="w-4 h-4" />
            <span>Syllabus</span>
          </a>
          <a href="#discussions" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium">
            <MessageSquare className="w-4 h-4" />
            <span>Discussions</span>
          </a>
        </aside>

        {/* Center Content Body */}
        <div className="flex-1 space-y-6">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <span>Clever Portal</span>
            <span>/</span>
            <span>Green River College</span>
            <span>/</span>
            <span className="font-semibold text-gray-800">EDU-1117: Computer Science & Computational Logic</span>
          </div>

          {/* Course Banner */}
          <div className="bg-gradient-to-r from-[#14283d] to-[#0374b5] text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                  Course ID: 1117
                </span>
                <span className="text-xs text-blue-100">Green River College Academic Portal</span>
              </div>
              <h2 className="text-2xl font-bold">EDU-1117: Advanced Digital Architectures</h2>
              <p className="text-xs text-blue-100 mt-1">Instructor: Dr. E. Priest | Dept of Computer Science & Education</p>
            </div>

            {/* Discreet Game Launch Button disguised as lab portal */}
            <button
              onClick={onLaunchGame}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
              title="Launch course interactive workspace"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Interactive Simulation (Lab 1117)</span>
            </button>
          </div>

          {/* Course Announcements / Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Clever Verified Student Enrollment: Course Ref #1117
              </span>
              <span className="text-gray-400">Updated: Today, 8:00 AM</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Welcome to Course 1117. For Lab 4, students are using the networked spatial voxel simulator to explore peer-to-peer latency over WebSocket connections. Click "Launch Interactive Simulation" above to enter the lab.
            </p>
          </div>

          {/* Modules List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Learning Modules (Fall 2026)
            </h3>

            {/* Module 1 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderCheck className="w-4 h-4 text-[#0374b5]" />
                  <span className="text-xs font-bold text-gray-800">Unit 1: Introduction to Spatial World Systems</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Completed (100%)</span>
              </div>
              <div className="p-3 space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Lecture 1.1: 3D Coordinate Mapping & Voxel Matrix</span>
                  </span>
                  <span className="text-gray-400 text-[11px]">Score: 10/10</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Lab 1.2: Server Socket Handshake Protocol</span>
                  </span>
                  <span className="text-gray-400 text-[11px]">Score: 25/25</span>
                </div>
              </div>
            </div>

            {/* Module 2: Active */}
            <div className="bg-white border-2 border-[#0374b5] rounded-xl overflow-hidden shadow-sm">
              <div className="bg-blue-50/60 px-4 py-3 border-b border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0374b5]" />
                  <span className="text-xs font-bold text-[#0374b5]">Unit 2: Real-time Multi-client Interaction (In Progress)</span>
                </div>
                <span className="text-[11px] bg-blue-100 text-[#0374b5] px-2 py-0.5 rounded font-bold">
                  Due Sunday
                </span>
              </div>
              <div className="p-3 space-y-2 text-xs text-gray-700">
                <div 
                  onClick={onLaunchGame}
                  className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2 font-semibold text-emerald-800">
                    <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                    <span>Active Assignment: Lab 1117 Simulation Environment</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700 underline">Click to Launch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Decoy Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 px-6 text-center text-xs text-gray-500">
        Green River College &bull; Clever Single Sign-On Portal &bull; Academic Year 2026-2027 &bull; Press Alt+D to toggle view
      </footer>
    </div>
  );
};
