import React, { useState, useMemo, useEffect } from 'react';
import { Student, Assignment } from '../types';
import { 
  ArrowLeft, 
  Mail, 
  Download, 
  MapPin, 
  AtSign, 
  TrendingUp, 
  Clock, 
  CreditCard, 
  Edit3, 
  FileText, 
  ChevronDown, 
  CheckCircle2, 
  Clock3, 
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentProfileViewProps {
  students: Student[];
  initialStudentId?: string | null;
  onOpenEvaluation: (studentId: string, assignmentId: string) => void;
  onUpdateProfessorNotes: (studentId: string, notes: string) => void;
}

export default function StudentProfileView({ 
  students, 
  initialStudentId,
  onOpenEvaluation, 
  onUpdateProfessorNotes 
}: StudentProfileViewProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(initialStudentId || students[0]?.id || null);
  const [semesterFilter, setSemesterFilter] = useState<string>('All Semesters');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
    }
  }, [initialStudentId]);
  
  // Note edit state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  // Contact modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');

  // Find active student
  const activeStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  // Filter student directory based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const lower = searchQuery.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(lower) || 
      s.major.toLowerCase().includes(lower) || 
      s.id.toLowerCase().includes(lower)
    );
  }, [students, searchQuery]);

  // Filter assignments based on semester filter
  const filteredAssignments = useMemo(() => {
    if (!activeStudent) return [];
    if (semesterFilter === 'All Semesters') return activeStudent.assignments;
    if (semesterFilter === 'Spring 2024') {
      return activeStudent.assignments.filter(a => a.dueDate.includes('2024') || a.dueDate.includes('tomorrow') || a.dueDate.includes('4 days'));
    }
    if (semesterFilter === 'Fall 2023') {
      return activeStudent.assignments.filter(a => a.dueDate.includes('2023') || a.dueDate.includes('Oct'));
    }
    return activeStudent.assignments;
  }, [activeStudent, semesterFilter]);

  const handleNotesEditClick = () => {
    if (activeStudent) {
      setTempNotes(activeStudent.professorNotes);
      setIsEditingNotes(true);
    }
  };

  const handleSaveNotes = () => {
    if (activeStudent) {
      onUpdateProfessorNotes(activeStudent.id, tempNotes);
      setIsEditingNotes(false);
    }
  };

  const triggerExportReport = () => {
    if (!activeStudent) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeStudent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", `report_${activeStudent.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert(`Academic Summary Report for ${activeStudent.name} exported successfully as JSON.`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Notification sent to ${activeStudent?.email}:\nSubject: ${contactSubject}\nMessage: ${contactMessage}`);
    setIsContactModalOpen(false);
    setContactMessage('');
    setContactSubject('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      {/* Search and Selection Header Directory */}
      <header className="flex justify-between items-center w-full px-10 z-30 h-16 bg-white border-b border-[#c5c5d3] shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-[#00236f]">Academic Directory</h1>
        </div>
        
        {/* Quick selector/stats header item */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold text-[#444651]">Total Academic Roster:</span>
          <span className="px-3 py-1 bg-[#1E3A8A] text-white rounded-full text-xs font-bold font-mono">
            {students.length} Enrolled
          </span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: GORGEOUS INTERACTIVE CLASS ROSTER DIRECTORY LIST */}
        <aside className="w-80 bg-white border-r border-[#c5c5d3] flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-[#c5c5d3] bg-[#f8f9ff] space-y-3 shrink-0">
            <h2 className="text-xs font-bold text-[#444651] uppercase tracking-wider">Class List</h2>
            
            {/* Search Input enclosed in sidebar listing */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651] w-4 h-4" />
              <input 
                type="text"
                placeholder="Search name, major, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-full bg-white border border-[#c5c5d3] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#00236f]"
              />
            </div>
          </div>

          {/* Student List View Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#eff4ff]">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => {
                const isSelected = s.id === selectedStudentId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-all outline-none border-l-4 ${
                      isSelected 
                        ? 'bg-[#eff4ff] border-[#00236f]' 
                        : 'hover:bg-[#f8f9ff]/60 border-transparent hover:border-l-[#eff4ff]'
                    }`}
                  >
                    <img 
                      src={s.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
                      alt={s.name} 
                      className="w-10 h-10 rounded-full object-cover border border-[#c5c5d3] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-xs font-bold text-[#0b1c30] truncate">{s.name}</span>
                        <span className="text-[10px] font-bold text-[#00236f] bg-blue-50 px-1.5 py-0.5 rounded shrink-0 font-mono">
                          {s.averageGrade}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#444651] font-semibold truncate mt-0.5">{s.major}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[9px] text-[#757682] font-mono">{s.id}</span>
                        <span className="text-[8px] font-bold px-1 rounded text-[#14B8A6] bg-[#14B8A6]/10 shrink-0">
                          {s.attendancePercent}% Att.
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#757682] font-semibold animate-pulse">
                No students match search.
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: DETAILED SCROLLABLE STUDENT PROFILE DOSSIER */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9ff]">
          <main className="p-8 space-y-6 max-w-[1100px] mx-auto w-full">
        {/* Breadcrumb & Actions */}
        <div className="flex justify-between items-center">
          <nav className="flex items-center gap-1.5 text-[#444651] text-xs font-semibold">
            <span className="hover:text-[#00236f] cursor-pointer" onClick={() => setSelectedStudentId(students[0]?.id || null)}>Students</span>
            <ChevronDown className="w-4 h-4 -rotate-90 text-[#757682]" />
            <span className="text-[#0b1c30] font-bold">{activeStudent?.name || 'Loading profile...'}</span>
          </nav>
          
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setContactSubject(`Inquiry regarding assignments`);
                setIsContactModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-[#14B8A6] text-[#14B8A6] rounded text-xs font-bold hover:bg-[#14B8A6]/10 transition-colors cursor-pointer outline-none active:scale-95 duration-200"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Student</span>
            </button>
            <button 
              onClick={triggerExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded text-xs font-bold hover:bg-[#00236f] transition-all cursor-pointer outline-none active:scale-95 duration-200 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {activeStudent && (
          <>
            {/* Profile Header Card */}
            <section className="bg-white border border-[#c5c5d3] rounded shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <img 
                  alt="Student Profile Photo" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#eff4ff] shadow-sm shrink-0" 
                  src={activeStudent.photoUrl} 
                />
                
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">{activeStudent.name}</h2>
                    <p className="text-[#444651] text-sm font-medium mt-0.5">
                      ID: {activeStudent.id} • {activeStudent.year} • {activeStudent.major}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-1.5 text-[#444651]">
                      <MapPin className="w-4 h-4 text-[#757682]" />
                      <span className="text-xs font-semibold">{activeStudent.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#444651]">
                      <AtSign className="w-4 h-4 text-[#757682]" />
                      <span className="text-xs font-semibold">{activeStudent.email}</span>
                    </div>
                  </div>
                </div>

                {/* Avg Score Box */}
                <div className="w-full md:w-auto flex md:flex-col items-center justify-between gap-4 p-5 bg-[#eff4ff] rounded-lg">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#444651] tracking-wider uppercase">Overall Average</p>
                    <p className="text-4xl font-extrabold text-[#00236f] mt-1">{activeStudent.averageGrade}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end md:items-center">
                    <span className="px-3 py-1 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-xs font-bold">
                      {activeStudent.rankBadge}
                    </span>
                    <span className="text-[10px] font-bold text-[#444651]">{activeStudent.percentile}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bento Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Academic Trend Bar Chart Card */}
              <div className="lg:col-span-2 bg-white border border-[#c5c5d3] rounded shadow-sm flex flex-col">
                <div className="p-4 border-b border-[#c5c5d3] flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#0b1c30]">Academic Trend (Current Year)</h3>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#444651]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]"></span> Grade
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#444651]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]"></span> Avg.
                    </span>
                  </div>
                </div>
                
                {/* Simulated Chart View */}
                <div className="p-6 flex-1">
                  <div className="relative w-full h-48 border-b border-[#c5c5d3] flex items-end justify-between px-6 pb-2">
                    {/* Horizontal guidance lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-t border-[#757682] w-full"></div>
                      <div className="border-t border-[#757682] w-full"></div>
                      <div className="border-t border-[#757682] w-full"></div>
                      <div className="border-t border-[#757682] w-full"></div>
                    </div>

                    {/* Background watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                      <span className="text-7xl font-extrabold text-[#00236f]">{activeStudent.averageGrade} GPA</span>
                    </div>

                    {/* Month columns */}
                    {['Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => {
                      const gpaVal = activeStudent.monthlyGpa[idx] || 3.0;
                      // Max GPA is 4.0, calculate percentage height
                      const heightPercent = `${(gpaVal / 4.0) * 85}%`;

                      return (
                        <div key={month} className="group relative w-12 flex flex-col items-center">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: heightPercent }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="w-full bg-[#00236f]/80 group-hover:bg-[#00236f] rounded-t transition-all cursor-pointer relative"
                          >
                            {/* Accent indicator line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#14B8A6]"></div>
                          </motion.div>
                          
                          <span className="text-[10px] font-bold text-[#444651] mt-2 block">{month}</span>
                          
                          {/* Tooltip on Hover */}
                          <div className="absolute -top-8 bg-[#0b1c30] text-white px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md z-10 whitespace-nowrap">
                            GPA: {gpaVal.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}

                    {/* Average Horizontal Indicator Line */}
                    <div className="absolute left-6 right-6 h-[2px] bg-[#14B8A6] opacity-75 pointer-events-none" style={{ bottom: '81%' }}>
                      <div className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-[#14B8A6] rounded-full border border-white"></div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-[#eff4ff] rounded-lg flex gap-8">
                    <div>
                      <p className="text-xs font-medium text-[#444651]">Consistency Score</p>
                      <p className="text-2xl font-bold text-[#0b1c30]">A+</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#444651]">Progress Trend</p>
                      <p className="text-2xl font-bold text-[#14B8A6] flex items-center gap-1 font-mono">
                        <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
                        <span>+4.2%</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance and Notes column */}
              <div className="space-y-6">
                {/* Attendance rate box */}
                <div className="bg-white border border-[#c5c5d3] rounded shadow-sm p-6">
                  <h3 className="text-xs font-bold text-[#444651] uppercase tracking-wider mb-4">Attendance Rate</h3>
                  
                  <div className="relative h-2 w-full bg-[#eff4ff] rounded-full overflow-hidden mb-2">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#14B8A6] rounded-full" 
                      style={{ width: `${activeStudent.attendancePercent}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base font-bold text-[#0b1c30]">{activeStudent.attendancePercent}%</span>
                    <span className="text-xs font-medium text-[#444651]">{activeStudent.absencesCount} Absences this year</span>
                  </div>

                  <div className="space-y-2 border-t border-[#eff4ff] pt-3">
                    <div className="flex justify-between text-xs text-[#444651]">
                      <span>Last Active</span>
                      <span className="font-bold text-[#0b1c30]">{activeStudent.lastActive}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#444651]">
                      <span>Class Credits</span>
                      <span className="font-bold text-[#0b1c30]">
                        {activeStudent.creditsCompleted} / {activeStudent.creditsTotal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Professor Notes */}
                <div className="bg-[#1e3a8a] text-white p-6 rounded shadow-sm relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="text-sm font-bold mb-2">Professor Notes</h4>
                    <p className="text-sm opacity-90 italic">
                      "{activeStudent.professorNotes}"
                    </p>
                    <button 
                      onClick={handleNotesEditClick}
                      className="mt-4 text-xs font-bold flex items-center gap-1.5 hover:underline text-[#14B8A6] outline-none cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" /> 
                      <span>Edit Note</span>
                    </button>
                  </div>
                  <div className="absolute right-[-10px] bottom-[-20px] opacity-10 select-none pointer-events-none group-hover:scale-110 transition-transform">
                    <FileText className="w-32 h-32" />
                  </div>
                </div>

              </div>
            </div>

            {/* Coursework & Assignments Table */}
            <section className="bg-white border border-[#c5c5d3] rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#c5c5d3] flex justify-between items-center bg-[#eff4ff]/30">
                <h3 className="text-sm font-bold text-[#0b1c30]">Coursework &amp; Assignments</h3>
                <div className="flex gap-2">
                  <select 
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                    className="bg-white border border-[#c5c5d3] rounded px-3 py-1 text-xs font-semibold text-[#444651] focus:outline-none focus:ring-1 focus:ring-[#00236f]"
                  >
                    <option>All Semesters</option>
                    <option>Spring 2024</option>
                    <option>Fall 2023</option>
                  </select>
                  <button className="p-1 px-2 hover:bg-[#d3e4fe] rounded text-[#444651] transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#c5c5d3] text-xs font-bold text-[#444651] bg-[#eff4ff]/10">
                      <th className="px-6 py-3 uppercase tracking-wider">Assignment Name</th>
                      <th className="px-6 py-3 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-[#0b1c30] divide-y divide-[#eff4ff]">
                    {filteredAssignments.map((assignment) => {
                      // Map status pill styles
                      const isGraded = assignment.status === 'Graded';
                      const isSubmitted = assignment.status === 'Submitted';
                      const isAwaiting = assignment.status === 'Awaiting Submission';
                      const isOverdue = assignment.status === 'OVERDUE';

                      let badgeClass = '';
                      if (isGraded) badgeClass = 'bg-[#eff4ff] text-[#1E3A8A] border border-[#d3e4fe]';
                      else if (isSubmitted) badgeClass = 'bg-teal-50 text-teal-700 border border-teal-200';
                      else if (isAwaiting) badgeClass = 'bg-amber-50 text-amber-700 border border-amber-200';
                      else if (isOverdue) badgeClass = 'bg-red-50 text-red-700 border border-red-200 uppercase tracking-tight';

                      return (
                        <tr key={assignment.id} className="hover:bg-[#eff4ff]/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="p-1.5 rounded bg-[#eff4ff] text-[#1E3A8A]">
                                <FileText className="w-4 h-4" />
                              </span>
                              <span className="font-bold">{assignment.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#444651]">{assignment.dueDate}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeClass}`}>
                              {assignment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-sm">
                            {assignment.score !== null ? (
                              <span className={assignment.score < 50 ? 'text-red-600 font-bold' : 'text-[#00236f]'}>
                                {assignment.score}
                                <span className="text-[#444651] text-xs font-normal">/100</span>
                              </span>
                            ) : (
                              <span className="text-[#757682]">Pending</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isGraded ? (
                              <button 
                                onClick={() => onOpenEvaluation(activeStudent.id, assignment.id)}
                                className="text-[#14B8A6] hover:text-[#006b5f] font-bold hover:underline outline-none cursor-pointer"
                              >
                                View Evaluation
                              </button>
                            ) : isSubmitted ? (
                              <button 
                                onClick={() => onOpenEvaluation(activeStudent.id, assignment.id)}
                                className="text-[#1E3A8A] hover:text-[#00236f] font-bold hover:underline outline-none cursor-pointer"
                              >
                                Grade Now
                              </button>
                            ) : isOverdue ? (
                              <button 
                                onClick={() => {
                                  setContactSubject(`Urgent: Overdue Assignment - ${assignment.name}`);
                                  setIsContactModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800 font-bold hover:underline outline-none cursor-pointer"
                              >
                                Contact Student
                              </button>
                            ) : (
                              <button 
                                onClick={() => onOpenEvaluation(activeStudent.id, assignment.id)}
                                className="text-[#444651] hover:text-[#0b1c30] font-bold hover:underline outline-none cursor-pointer"
                              >
                                Edit Task
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-[#eff4ff]/10 border-t border-[#c5c5d3] flex justify-center">
                <button 
                  onClick={() => alert("Showing all historical assignments.")}
                  className="text-[#1E3A8A] font-bold hover:text-[#00236f] transition-all flex items-center gap-1 text-[11px] outline-none cursor-pointer"
                >
                  <span>View other historical recordings</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>
          </>
        )}
      </main>
        </div>
      </div>

      {/* Slide-In Modal to Edit Professor Notes */}
      <AnimatePresence>
        {isEditingNotes && (
          <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-[#c5c5d3]"
            >
              <div className="p-4 bg-[#1E3A8A] text-white">
                <h3 className="font-bold text-base">Edit Notes for {activeStudent?.name}</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-[#444651]">These notes will update the student's profile dossier.</p>
                <textarea 
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  className="w-full text-sm border border-[#757682] rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#00236f]"
                  placeholder="Type notes here..."
                />
              </div>
              <div className="p-4 bg-[#eff4ff] flex justify-end gap-2 border-t border-[#c5c5d3]">
                <button 
                  onClick={() => setIsEditingNotes(false)}
                  className="px-4 py-1.5 border border-[#757682] text-[#444651] rounded text-xs font-semibold hover:bg-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 bg-[#1E3A8A] text-white rounded text-xs font-bold hover:bg-[#00236f] transition-all cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Student Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-[#c5c5d3]"
            >
              <form onSubmit={handleContactSubmit}>
                <div className="p-4 bg-[#14B8A6] text-white flex justify-between items-center">
                  <h3 className="font-bold text-base">Contact {activeStudent?.name}</h3>
                  <span className="text-xs font-mono">{activeStudent?.email}</span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#444651] mb-1">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full border border-[#757682] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                      placeholder="e.g. Missing Assignment"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#444651] mb-1">Message Content</label>
                    <textarea 
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full border border-[#757682] rounded-lg p-3 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                      placeholder="Write your email here..."
                    />
                  </div>
                </div>
                <div className="p-4 bg-[#eff4ff] flex justify-end gap-2 border-t border-[#c5c5d3]">
                  <button 
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-1.5 border border-[#757682] text-[#444651] rounded text-xs font-semibold hover:bg-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-[#14B8A6] text-white rounded text-xs font-bold hover:bg-[#006b5f] transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
