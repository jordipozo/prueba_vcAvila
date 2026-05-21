export interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  status: 'Graded' | 'Submitted' | 'Awaiting Submission' | 'OVERDUE';
  score: number | null; // out of 100
  type: 'project' | 'quiz' | 'essay' | 'thesis';
  feedback?: string;
  rubricScores?: {
    originality?: boolean;
    rigor?: boolean;
    citation?: boolean;
    clarity?: boolean;
    ethics?: boolean;
  };
  documentTitle?: string;
  documentBody?: string;
}

export interface Student {
  id: string; // STU-XXXXX or EDU-XXXX
  name: string;
  year: string;
  major: string;
  city: string;
  email: string;
  photoUrl: string;
  averageGrade: string; // e.g. "3.82" or "9.2"
  percentile: string;
  rankBadge: string;
  attendancePercent: number;
  absencesCount: number;
  lastActive: string;
  creditsCompleted: number;
  creditsTotal: number;
  professorNotes: string;
  monthlyGpa: number[]; // 6 months, Sept to Feb
  assignments: Assignment[];
  courseProgress?: {
    name: string;
    progress: number;
  }[];
}
