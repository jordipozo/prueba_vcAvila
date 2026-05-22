import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { 
  Search, 
  Clock, 
  UploadCloud, 
  BookOpen, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardViewProps {
  students: Student[];
  onAddSubmission: (studentId: string, assignmentId: string, submissionText: string, documentTitle: string) => void;
  onViewChange: (view: 'dashboard' | 'students' | 'evaluation') => void;
  onSelectStudent: (studentId: string) => void;
}

export default function DashboardView({ 
  students, 
  onAddSubmission, 
  onViewChange,
  onSelectStudent
}: DashboardViewProps) {
  // Let's assume the dashboard represents "Alex Johnson" by default (Image 3)
  const defaultAlex = students.find(s => s.name.includes("Alex")) || students[0];
  const [activeStudentId, setActiveStudentId] = useState<string>(defaultAlex?.id || '');

  // File submit modal state
  const [chosenAssignmentId, setChosenAssignmentId] = useState<string>('');
  const [submissionDocumentText, setSubmissionDocumentText] = useState<string>('');
  const [submissionDocumentTitle, setSubmissionDocumentTitle] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeStudent = useMemo(() => {
    return students.find(s => s.id === activeStudentId) || defaultAlex || students[0];
  }, [students, activeStudentId, defaultAlex]);

  // Extract pending assignments
  const pendingAssignments = useMemo(() => {
    if (!activeStudent) return [];
    return activeStudent.assignments.filter(a => a.status === 'Awaiting Submission' || a.status === 'OVERDUE');
  }, [activeStudent]);

  // Extract recently graded assignments
  const gradedAssignments = useMemo(() => {
    if (!activeStudent) return [];
    return activeStudent.assignments.filter(a => a.status === 'Graded');
  }, [activeStudent]);

  // Drag and drop simulator highlight state
  const [isDragging, setIsDragging] = useState(false);

  const handleOpenSubmitModal = (assignmentId: string) => {
    setChosenAssignmentId(assignmentId);
    setSubmissionDocumentTitle('');
    setSubmissionDocumentText('');
    setIsSubmitModalOpen(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDropSimulation = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileLoadSimulation(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileLoadSimulation(files[0]);
    }
  };

  const handleFileLoadSimulation = (file: File) => {
    setSubmissionDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
    setSubmissionDocumentText(`[Uploaded File: ${file.name}]\n\nSubmitted content for processing. This analysis represents standard computational variables, structural charts, and data layouts aligned with curriculum criteria.\n\nAuthor: ${activeStudent?.name}\nDate: ${new Date().toLocaleDateString()}`);
    
    // Auto-select assignment if only one available
    if (pendingAssignments.length > 0 && !chosenAssignmentId) {
      setChosenAssignmentId(pendingAssignments[0].id);
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignmentIdToSubmit = chosenAssignmentId || (pendingAssignments[0]?.id);
    
    if (!assignmentIdToSubmit) {
      alert("Please select a pending assignment or upload a correct file draft.");
      return;
    }

    if (!submissionDocumentText) {
      alert("Please enter submission text or drag and drop a document file.");
      return;
    }

    // Process submission
    onAddSubmission(
      activeStudent.id, 
      assignmentIdToSubmit, 
      submissionDocumentText, 
      submissionDocumentTitle || "Untitled Document Solution"
    );

    alert(`Successfully uploaded submission for "${activeStudent.assignments.find(a => a.id === assignmentIdToSubmit)?.name}"! It is now pending grading inside the Evaluations tab.`);
    setIsSubmitModalOpen(false);
    setSubmissionDocumentText('');
    setSubmissionDocumentTitle('');
    setChosenAssignmentId('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="bg-white border-b border-border flex justify-between items-center w-full px-10 h-16 sticky top-0 z-40">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search courses, grades, or materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-light border-none rounded-full py-1.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Student Account Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-muted">View Student:</span>
            <select
              value={activeStudentId}
              onChange={(e) => setActiveStudentId(e.target.value)}
              className="bg-white border border-border rounded px-2.5 py-1 text-xs font-bold text-primary-light"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>

          <div className="h-8 w-px bg-border"></div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary-light hidden md:block">{activeStudent?.name}</span>
            <img 
              alt="User profile photo" 
              className="w-8 h-8 rounded-full object-cover border border-border" 
              src={activeStudent?.photoUrl} 
            />
          </div>
        </div>
      </header>

      {/* Main Canvas Dashboard */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* Welcome and Avg Overall KPI */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Welcome Card Box */}
          <div className="md:col-span-2 relative overflow-hidden bg-primary p-8 rounded-xl text-white shadow-sm group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {activeStudent?.name}! 👋</h1>
                <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-lg">
                  You've completed {activeStudent?.id === '#STU-92841' ? '85%' : '75%'} of your assignments this week. Keep up the great work and stay focused on your upcoming exams!
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => alert("Calendar scheduler is locked to Spring 2024 syllabus.")}
                  className="bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer outline-none shadow"
                >
                  View Calendar
                </button>
                <button 
                  onClick={() => {
                    onSelectStudent(activeStudent.id);
                    onViewChange('students');
                  }}
                  className="bg-white/10 border border-white/20 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-white/25 transition-all cursor-pointer outline-none"
                >
                  My Profile
                </button>
              </div>
            </div>
            
            {/* Background design ornaments */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 blur-2xl"></div>
          </div>

          {/* KPI Overall average circular progress bar */}
          <div className="bg-white border border-border p-8 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Current GPA / Average</span>
            
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-light" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-accent" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" stroke-dasharray="301.6" stroke-dashoffset={activeStudent?.id === '#STU-92841' ? "30.1" : "55.2"} strokeWidth="8" strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }}></circle>
              </svg>
              <span className="absolute font-bold text-3xl text-primary">{activeStudent?.averageGrade}</span>
            </div>
            
            <p className="text-xs text-accent font-extrabold">{activeStudent?.rankBadge}</p>
          </div>

        </section>

        {/* Detailed Dashboard columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Large Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Upcoming Pending Assignments */}
            <section className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border flex justify-between items-center bg-surface-light/30">
                <h3 className="text-sm font-bold text-primary">Upcoming Assignments</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-surface-light px-2 py-0.5 rounded">
                  {pendingAssignments.length} Pending
                </span>
              </div>

              <div className="divide-y divide-[#eff4ff]">
                {pendingAssignments.length > 0 ? (
                  pendingAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-page transition-colors">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-teal-50 text-accent rounded-lg flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-primary-dark">{assignment.name}</h4>
                          <p className="text-[11px] text-text-muted font-semibold mt-0.5">{assignment.documentTitle || 'Solution Submission required'}</p>
                          
                          <div className="flex items-center gap-1.5 mt-2 text-red-600 font-bold text-[10px]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{assignment.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleOpenSubmitModal(assignment.id)}
                        className="bg-primary-light text-white hover:bg-primary text-xs font-bold px-5 py-2.5 rounded-lg active:scale-95 duration-200 transition-all cursor-pointer outline-none"
                      >
                        Submit
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-text-muted font-semibold">
                    🎉 Excellent! All upcoming coursework has been successfully uploaded and grading is pending.
                  </div>
                )}
              </div>
            </section>

            {/* Recently Graded Review */}
            <section className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border">
                <h3 className="text-sm font-bold text-primary">Recent Grading Releases</h3>
              </div>
              
              <div className="p-5 space-y-4">
                {gradedAssignments.length > 0 ? (
                  gradedAssignments.map((assignment, idx) => (
                    <div 
                      key={assignment.id} 
                      className={`group relative bg-surface-light/30 rounded-lg p-5 border-l-4 ${
                        idx % 2 === 0 ? 'border-accent' : 'border-primary-light'
                      } hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded bg-surface-light text-primary-light text-[9px] font-bold uppercase tracking-wider mb-1">
                            Graded
                          </span>
                          <h4 className="text-xs font-bold text-primary-dark">{assignment.name}</h4>
                          <p className="text-[10px] font-bold text-text-muted">{assignment.documentTitle}</p>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">{assignment.score}%</span>
                          <span className="block text-[10px] font-bold text-accent">Letter: {assignment.score && assignment.score >= 90 ? 'A' : 'B+'}</span>
                        </div>
                      </div>

                      {assignment.feedback && (
                        <div className="bg-white/70 p-3 rounded border border-gray-100 text-xs text-text-muted italic leading-relaxed">
                          "{assignment.feedback}"
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-text-muted">
                    No graded assignments released in this view yet. Call the Evaluation helper!
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Right Smaller Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Submission drag and drop card area */}
            <section className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Quick Submission Portal</h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted block uppercase">Select Course Assignment</label>
                <select 
                  value={chosenAssignmentId}
                  onChange={(e) => setChosenAssignmentId(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded-lg text-xs font-bold px-3 py-2 text-primary-dark outline-none"
                >
                  <option value="">-- Choose Assignment --</option>
                  {pendingAssignments.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Zone Container */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropSimulation}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200 group text-center relative ${
                  isDragging 
                    ? 'border-primary bg-surface-light' 
                    : 'border-border hover:border-primary hover:bg-surface-page'
                }`}
              >
                <input 
                  type="file"
                  id="dash-file-picker"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                />
                
                {/* Simulated file selected indicator */}
                {submissionDocumentTitle ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-accent animate-bounce" />
                    <div>
                      <p className="text-xs font-bold text-primary-dark">{submissionDocumentTitle}.docx</p>
                      <p className="text-[10px] text-text-muted mt-0.5 font-bold">Successfully loaded file draft!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud onClick={() => document.getElementById('dash-file-picker')?.click()} className="w-10 h-10 text-text-dim group-hover:text-primary transition-colors" />
                    <div onClick={() => document.getElementById('dash-file-picker')?.click()}>
                      <p className="text-xs font-bold text-primary-dark">Click to upload or drag &amp; drop</p>
                      <span className="text-[10px] text-text-muted font-semibold mt-0.5 block">PDF, DOCX (Max 25MB)</span>
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={handleQuickSubmit}
                className="w-full bg-accent hover:bg-accent-dark text-white text-xs font-bold py-2.5 rounded-lg transition-transform active:scale-95 duration-200 outline-none shadow cursor-pointer"
              >
                Upload and Submit
              </button>
            </section>

            {/* Academic encouragement tip */}
            <section className="relative overflow-hidden bg-surface-light p-5 rounded-xl border border-surface-light-alt">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Academic Tip 💡</span>
              </h4>
              <p className="text-xs text-primary-dark leading-relaxed italic pr-6 relative z-10">
                "The beautiful thing about learning is that no one can take it away from you."
              </p>
              <p className="text-[10px] text-text-muted font-bold text-right mt-1.5">— B.B. King</p>
            </section>

            {/* Course progress bars list */}
            <section className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Course Progress</h3>
              <div className="space-y-4">
                {activeStudent?.courseProgress?.map((course) => (
                  <div key={course.name}>
                    <div className="flex justify-between text-[11px] font-bold text-text-muted mb-1.5">
                      <span>{course.name}</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-light rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>

      </main>

      {/* Manual submit modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-border"
            >
              <form onSubmit={handleQuickSubmit}>
                <div className="p-4 bg-primary text-white flex justify-between items-center">
                  <h3 className="font-bold text-sm">Submit New Assignment</h3>
                  <span className="text-xs opacity-75 font-mono">{activeStudent?.id}</span>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1">Document Title</label>
                    <input 
                      type="text" 
                      required
                      value={submissionDocumentTitle}
                      onChange={(e) => setSubmissionDocumentTitle(e.target.value)}
                      className="w-full border border-text-dim rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g. My Homework Chapter 1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1">Written Contents &amp; Code Solution</label>
                    <textarea 
                      required
                      value={submissionDocumentText}
                      onChange={(e) => setSubmissionDocumentText(e.target.value)}
                      className="w-full border border-text-dim rounded-lg p-3 text-xs h-32 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Type your thesis, solutions or essays here..."
                    />
                  </div>
                </div>

                <div className="p-4 bg-surface-light flex justify-end gap-2 border-t border-border">
                  <button 
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-1.5 border border-text-dim text-text-muted rounded text-xs font-semibold hover:bg-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-accent text-white rounded text-xs font-bold hover:bg-accent-dark transition-all cursor-pointer"
                  >
                    Submit Assignment Solution
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
