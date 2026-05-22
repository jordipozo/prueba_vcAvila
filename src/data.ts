import { Student } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '#STU-94021',
    name: 'Benjamin Foster',
    year: 'Senior Year',
    major: 'Computer Science',
    city: 'San Francisco, CA',
    email: 'b.foster@edu-manage.ac',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOKY4EQoN_3VoTsG7cYIRnIQkw2SnSDgw_6raO_X_1BZWYZMjM9Vm3wavpiUTIvOQWMlO49qXkUaIc1gBuk943DhA8ae5SHLQZ7FlxUKbHOBt9jqGSpvuQRdK1mO40-Q1MCGxosB7rH2qU3cC1LGiAyelV0gtiWIHqHk3f1e2ciOpn8MG7QWV2Kv6__-9-S6jkfuMAEIMi3x3DhkOtWJrzv3Va3CB0h00QtQK2cicq5sWHlV7WBrdJh2SD5AliUHu6SPKQBt2zF1E',
    averageGrade: '3.82',
    percentile: '98th Percentile',
    rankBadge: 'Top 5%',
    attendancePercent: 94,
    absencesCount: 2,
    lastActive: '2 hours ago',
    creditsCompleted: 112,
    creditsTotal: 120,
    professorNotes: 'Shows strong analytical skills in Data Structures. Needs to participate more in classroom discussions.',
    monthlyGpa: [3.90, 3.75, 3.90, 3.60, 3.80, 3.95],
    assignments: [
      {
        id: 'os-kernel-project',
        name: 'Operating Systems: Kernel Module Project',
        dueDate: 'Mar 12, 2024',
        status: 'Graded',
        score: 98,
        type: 'project',
        feedback: 'Superb implementation! The custom scheduler handles dynamic priority elevation elegantly. Memory bounds are strictly checked, preventing buffer overflows. Very solid kernel hacking.',
        rubricScores: {
          originality: true,
          rigor: true,
          citation: true,
          clarity: true,
          ethics: true
        },
        documentTitle: 'Implementing an IPC-Optimized Kernel Module for Low-Latency Message Queues',
        documentBody: `The core mechanism of IPC (Inter-Process Communication) within modern kernels relies heavily on efficient message queue structures. In this project, I present a custom Linux kernel module that implements a ring-buffered zero-copy messaging pipeline. 

By mapping buffer pages into the virtual memory spaces of both sender and receiver processes using custom mmap implementations, we completely isolate memory bandwidth as a bottleneck. Our performance benchmarks show a 42% reduction in transfer latency under maximum contention compared to standard local sockets.

Furthermore, we implement strict page-lock controls to prevent swapping, protecting sensitive IPC messages from side-channel page leakage in multi-tenant environments. Future work includes expanding CPU affinity pin settings.`
      },
      {
        id: 'sql-optimization-quiz',
        name: 'SQL Optimization & Indexing Quiz',
        dueDate: 'Mar 24, 2024',
        status: 'Submitted',
        score: null,
        type: 'quiz',
        feedback: '',
        rubricScores: {
          originality: false,
          rigor: false,
          citation: false,
          clarity: false,
          ethics: false
        },
        documentTitle: 'Benjamin Foster - SQL Performance Optimization Quiz Submission',
        documentBody: `Question 1: Explain the difference between Clustered and Non-Clustered Indexes.
Answer: A clustered index defines the physical order of data storage in a table. Because of this, a table can only have one clustered index. A non-clustered index, however, contains pointers to physical rows, storing index search values in a separate, structured block (B-Tree).

Question 2: Analyze query: SELECT * FROM users WHERE age > 21 UPDATE.
Answer: When executing this query on a table with 10M rows, a full table scan occurs unless there is an index on 'age'. Since we select all columns (*), even a non-clustered index might trigger heavily nested key lookups unless covered.`
      },
      {
        id: 'software-arch-group',
        name: 'Software Architecture: Group Project A',
        dueDate: 'Apr 05, 2024',
        status: 'Awaiting Submission',
        score: null,
        type: 'project',
        rubricScores: {},
        documentTitle: '',
        documentBody: ''
      },
      {
        id: 'discrete-math-midterm',
        name: 'Discrete Mathematics: Midterm Essay',
        dueDate: 'Feb 28, 2024',
        status: 'OVERDUE',
        score: 0,
        type: 'essay',
        feedback: 'Missed final submission window. Please contact me immediately to schedule a make-up or discuss options.',
        rubricScores: {
          originality: false,
          rigor: false,
          citation: false,
          clarity: false,
          ethics: false
        },
        documentTitle: 'Discrete Mathematics: Graph Theory Applications (Draft Missing)',
        documentBody: 'No document submitted yet. Submission is 83 days overdue.'
      }
    ],
    courseProgress: [
      { name: 'Computer Science', progress: 85 },
      { name: 'Advanced Calculus', progress: 70 },
      { name: 'Global History', progress: 62 }
    ]
  },
  {
    id: '#EDU-9842',
    name: 'Elena Rodriguez',
    year: 'Senior Year',
    major: 'Computer Science & Philosophy',
    city: 'Los Angeles, CA',
    email: 'e.rodriguez@edu-manage.ac',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    averageGrade: '3.91',
    percentile: '99th Percentile',
    rankBadge: 'Top 1%',
    attendancePercent: 98,
    absencesCount: 1,
    lastActive: '1 day ago',
    creditsCompleted: 116,
    creditsTotal: 120,
    professorNotes: 'Outstanding logical analysis. Extraordinary capability in writing thesis. Shows very clean presentation of complicated ethical inquiries.',
    monthlyGpa: [3.95, 3.90, 3.92, 3.88, 3.95, 3.96],
    assignments: [
      {
        id: 'ethics-thesis',
        name: 'Research Ethics: Final Thesis',
        dueDate: 'Mar 15, 2024',
        status: 'Graded',
        score: 88,
        type: 'thesis',
        feedback: `Excellent work on the Case Study section. The synthesis between the pedagogical framework and the data in Fig 1.1 is particularly compelling. However, I'd like to see a bit more depth in the "Ethical Compliance" chapter—specifically regarding the data ownership subsection.`,
        rubricScores: {
          originality: true,
          rigor: true,
          citation: true,
          clarity: true,
          ethics: false
        },
        documentTitle: 'An Ethical Framework for Autonomous Learning Systems',
        documentBody: `The integration of artificial intelligence in higher education has reached a critical juncture. While efficiency is often cited as the primary driver, we must examine the pedagogical implications of algorithmic decision-making on student autonomy.

Current frameworks often prioritize institutional metrics over individual cognitive development. This thesis proposes a "human-in-the-loop" approach that treats learning as a discursive process rather than a transactional one. By analyzing three distinct case studies from the 2022-2023 academic year, we can observe a distinct correlation between unmediated AI usage and a decrease in synthetic reasoning scores among undergraduates.

Furthermore, the ethical dimension extends to data privacy and the ownership of intellectual labor. If a student's creative output is used to train the very models that will eventually evaluate them, a recursive feedback loop is created that risks homogenizing academic discourse.

In conclusion, the path forward requires not a rejection of technology, but a more rigorous oversight mechanism. Academic institutions must develop internal rubrics that recognize the value of human intuition and critical inquiry—elements that current Large Language Models are structurally incapable of replicating with genuine intent.`
      }
    ],
    courseProgress: [
      { name: 'Computer Science', progress: 95 },
      { name: 'Philosophy Minor', progress: 100 },
      { name: 'Academic Writing', progress: 92 }
    ]
  },
  {
    id: '#STU-92841',
    name: 'Alex Johnson',
    year: 'Junior Year',
    major: 'Computer Science',
    city: 'Seattle, WA',
    email: 'a.johnson@edu-manage.ac',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUBTqjB0NGJhZDmHi1a0sKQV8aFwT1ZxCKlqkbjQDL9iMp0o56k4PG5YLPKlLWcX2LlIDsn1jWblMxdyaNCbS4afIwFWH84ZLz2_0GHqgg3ijJQy1uzuwtEp21SKccXL7H02Y8WwLm-zS4f7F57yMumfJj4574hN4X3auq1DRTNYlS_TEqYANwIA-KSKJW9eTPm5dyGmETZc2b7PNJXi4xAp-Ni-UsQXl6W25TGaxyCj5j87yRTxqqIdKRsEBMFS-krjaOWqQADgQ',
    averageGrade: '9.2',
    percentile: '95th Percentile',
    rankBadge: 'Top 5% of class',
    attendancePercent: 96,
    absencesCount: 1,
    lastActive: 'Just now',
    creditsCompleted: 98,
    creditsTotal: 120,
    professorNotes: 'Excellent attention to software pattern details. Solid grasp of data structures and optimization. Promising work in algorithmic computation.',
    monthlyGpa: [3.80, 3.85, 3.70, 3.90, 3.85, 3.90],
    assignments: [
      {
        id: 'calc-2-ps',
        name: 'Advanced Calculus II',
        dueDate: 'Due tomorrow, 11:59 PM',
        status: 'Awaiting Submission',
        score: null,
        type: 'project',
        documentTitle: 'Advanced Calculus II - Problem Set: Integration by Parts',
        documentBody: ''
      },
      {
        id: 'philosophy-essay',
        name: 'Modern Philosophy',
        dueDate: 'Due in 4 days (Oct 24)',
        status: 'Awaiting Submission',
        score: null,
        type: 'essay',
        documentTitle: 'Modern Philosophy - Essay: The Existentialism Movement',
        documentBody: ''
      },
      {
        id: 'intro-cs-quiz',
        name: 'Introduction to Computer Science',
        dueDate: 'Completed Oct 15',
        status: 'Graded',
        score: 95,
        type: 'quiz',
        feedback: 'Excellent understanding of binary trees. Your complexity analysis was spot on. Keep up the rigor!',
        documentTitle: 'Module 4 Quiz: Data Structures',
        documentBody: 'Submitted answer sheet. Scores: section A (50/50), section B (45/50).'
      },
      {
        id: 'global-trade-exam',
        name: 'History of Global Trade',
        dueDate: 'Completed Oct 10',
        status: 'Graded',
        score: 88,
        type: 'project',
        feedback: 'Good synthesis of regional trade patterns. Consider citing more primary sources for the final paper.',
        documentTitle: 'Midterm Examination',
        documentBody: 'Historically, the silk road laid down pathways that transcended simple trade exchange, fostering cultural assimilation...'
      }
    ],
    courseProgress: [
      { name: 'Computer Science', progress: 80 },
      { name: 'Advanced Calculus', progress: 65 },
      { name: 'Global History', progress: 92 }
    ]
  }
];

export function getStudents(): Student[] {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  const stored = localStorage.getItem('edumanage_students');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_STUDENTS;
    }
  }
  localStorage.setItem('edumanage_students', JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
}

export function saveStudents(students: Student[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('edumanage_students', JSON.stringify(students));
}
