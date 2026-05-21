import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Plus, 
  HelpCircle, 
  LogOut,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'students' | 'evaluation';
  onViewChange: (view: 'dashboard' | 'students' | 'evaluation') => void;
  onNewEvaluation: () => void;
}

export default function Sidebar({ activeView, onViewChange, onNewEvaluation }: SidebarProps) {
  return (
    <aside className="flex flex-col h-screen sticky top-0 bg-[#f8f9ff] border-r border-[#c5c5d3] w-64 z-50 shrink-0">
      {/* Brand logo & title */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1e3a8a] text-white rounded flex items-center justify-center">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#00236f] tracking-tight leading-tight">Academic Portal</h2>
          <p className="text-xs text-[#444651] mt-0.5">Spring Semester 2024</p>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 mt-4">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => onViewChange('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-all duration-200 outline-none ${
                activeView === 'dashboard'
                  ? 'text-[#00236f] bg-[#eff4ff] border-r-4 border-[#00236f]'
                  : 'text-[#444651] hover:bg-[#d3e4fe] hover:text-[#0b1c30]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span>Dashboard</span>
            </button>
          </li>

          {/* Students */}
          <li>
            <button
              onClick={() => onViewChange('students')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-all duration-200 outline-none ${
                activeView === 'students'
                  ? 'text-[#00236f] bg-[#eff4ff] border-r-4 border-[#00236f]'
                  : 'text-[#444651] hover:bg-[#d3e4fe] hover:text-[#0b1c30]'
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>Students</span>
            </button>
          </li>

          {/* Evaluation Panel */}
          <li>
            <button
              onClick={() => onViewChange('evaluation')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-all duration-200 outline-none ${
                activeView === 'evaluation'
                  ? 'text-[#00236f] bg-[#eff4ff] border-r-4 border-[#00236f]'
                  : 'text-[#444651] hover:bg-[#d3e4fe] hover:text-[#0b1c30]'
              }`}
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              <span>Evaluations</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* New Evaluation Quick Launcher */}
      <div className="px-4 py-6">
        <button
          onClick={onNewEvaluation}
          className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#00236f] text-white font-semibold rounded text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Evaluation</span>
        </button>
      </div>

      {/* Secondary footer items */}
      <div className="p-4 border-t border-[#c5c5d3] mt-auto">
        <ul className="space-y-1">
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Refer to EduManage Help Center (docs.edu-manage.ac)."); }}
              className="flex items-center gap-3 px-4 py-2 rounded text-sm font-semibold text-[#444651] hover:bg-[#d3e4fe] transition-all"
            >
              <HelpCircle className="w-5 h-5 shrink-0" />
              <span>Support</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Successfully signed out of Academic Portal."); }}
              className="flex items-center gap-3 px-4 py-2 rounded text-sm font-semibold text-[#444651] hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Sign Out</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
