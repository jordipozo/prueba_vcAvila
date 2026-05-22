import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import StudentProfileView from './components/StudentProfileView';
import EvaluationPanel from './components/EvaluationPanel';
import { getStudents, saveStudents } from './data';
import { Student, Assignment } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'evaluation'>('students');
  const [students, setStudents] = useState<Student[]>(() => getStudents());

  // Selected contexts for evaluation panel
  const [activeEvaluationStudentId, setActiveEvaluationStudentId] = useState<string | null>(null);
  const [activeEvaluationAssignmentId, setActiveEvaluationAssignmentId] = useState<string | null>(null);

  // Update professor notes for a student
  const handleUpdateProfessorNotes = (studentId: string, notes: string) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        return { ...s, professorNotes: notes };
      }
      return s;
    });
    setStudents(updated);
    saveStudents(updated);
  };

  // Update a student's assignment attributes (grade score, checklist, comments feedback)
  const handleUpdateAssignment = (
    studentId: string, 
    assignmentId: string, 
    updatedFields: Partial<Assignment>
  ) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        const updatedAssignments = s.assignments.map(a => {
          if (a.id === assignmentId) {
            return { 
              ...a, 
              ...updatedFields,
              // Recalculate score if score was updated or defaults to original
              score: updatedFields.score !== undefined ? updatedFields.score : a.score
            };
          }
          return a;
        });

        // Recalculate overall average grade if scores changed
        const gradedScores = updatedAssignments
          .filter(a => a.status === 'Graded' && a.score !== null)
          .map(a => a.score as number);

        let newAverage = s.averageGrade;
        if (gradedScores.length > 0) {
          const sum = gradedScores.reduce((acc, current) => acc + current, 0);
          const computedAvg = sum / gradedScores.length;
          
          // Format based on student GPA format
          if (s.averageGrade.includes('.')) {
            // Benjamin/Elena: convert from 100 base to 4.0 scale roughly (e.g. 98/100 -> 3.92)
            const gpaScale = (computedAvg / 100) * 4.0;
            // Cap at 4.0
            newAverage = Math.min(4.0, gpaScale).toFixed(2);
          } else {
            // Alex: format base 10 (e.g. 9.2)
            newAverage = (computedAvg / 10).toFixed(1);
          }
        }

        return { 
          ...s, 
          assignments: updatedAssignments,
          averageGrade: newAverage
        };
      }
      return s;
    });

    setStudents(updated);
    saveStudents(updated);
  };

  // Handler for student adding custom text file submissions (from Student Dashboard)
  const handleAddSubmission = (
    studentId: string, 
    assignmentId: string, 
    submissionText: string, 
    documentTitle: string
  ) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        const updatedAssignments = s.assignments.map(a => {
          if (a.id === assignmentId) {
            return {
              ...a,
              status: 'Submitted' as const,
              documentTitle,
              documentBody: submissionText,
              score: null // resets/clears previous score if any
            };
          }
          return a;
        });
        return { ...s, assignments: updatedAssignments };
      }
      return s;
    });

    setStudents(updated);
    saveStudents(updated);
  };

  // Switch tabs to Evaluation directly loading a specific student & assignment context
  const handleOpenEvaluationDirectly = (studentId: string, assignmentId: string) => {
    setActiveEvaluationStudentId(studentId);
    setActiveEvaluationAssignmentId(assignmentId);
    setActiveView('evaluation');
  };

  const handleLaunchNewVacantEvaluation = () => {
    setActiveEvaluationStudentId(null);
    setActiveEvaluationAssignmentId(null);
    setActiveView('evaluation');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page">
      {/* SideNavBar (Shared navigation bar) */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        onNewEvaluation={handleLaunchNewVacantEvaluation}
      />

      {/* Main interactive window panels container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'dashboard' && students.length > 0 && (
          <DashboardView 
            students={students}
            onAddSubmission={handleAddSubmission}
            onViewChange={setActiveView}
            onSelectStudent={setActiveEvaluationStudentId}
          />
        )}

        {activeView === 'students' && students.length > 0 && (
          <StudentProfileView 
            students={students}
            initialStudentId={activeEvaluationStudentId}
            onOpenEvaluation={handleOpenEvaluationDirectly}
            onUpdateProfessorNotes={handleUpdateProfessorNotes}
          />
        )}

        {activeView === 'evaluation' && students.length > 0 && (
          <EvaluationPanel 
            students={students}
            initialStudentId={activeEvaluationStudentId}
            initialAssignmentId={activeEvaluationAssignmentId}
            onUpdateAssignment={handleUpdateAssignment}
            onViewChange={setActiveView}
          />
        )}
      </div>
    </div>
  );
}
