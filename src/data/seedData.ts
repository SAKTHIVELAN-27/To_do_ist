import { Subject, Module, Topic, Exam, StudyTask, DailyHabit } from '../types';
import { format, addDays, parseISO, startOfDay, differenceInCalendarDays } from 'date-fns';

const today = startOfDay(new Date()); // Dynamic current date (study starts from today!)
const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'BACSE106',
    color: '#3b82f6', // blue
    bgLight: '#eff6ff',
    icon: 'Cpu',
  },
  {
    id: 'sub-moc',
    name: 'Models of Computation',
    code: 'BACSE201',
    color: '#8b5cf6', // purple
    bgLight: '#f5f3ff',
    icon: 'Network',
  },
  {
    id: 'sub-dbms',
    name: 'Database Systems',
    code: 'BACSE202',
    color: '#10b981', // emerald
    bgLight: '#ecfdf5',
    icon: 'Database',
  },
  {
    id: 'sub-cloud',
    name: 'Cloud Infrastructure & Architecture',
    code: 'BACSE344',
    color: '#f59e0b', // amber
    bgLight: '#fffbeb',
    icon: 'Cloud',
  },
];

export const INITIAL_MODULES: Module[] = [
  // BACSE106: Operating Systems
  { id: 'mod-os-1', subjectId: 'sub-os', title: 'Module 1: Operating Systems and Structure (6 hrs)', order: 1 },
  { id: 'mod-os-2', subjectId: 'sub-os', title: 'Module 2: Process, Scheduling, Threads and Deadlocks (10 hrs)', order: 2 },
  { id: 'mod-os-3', subjectId: 'sub-os', title: 'Module 3: Process Synchronization (9 hrs)', order: 3 },
  { id: 'mod-os-4', subjectId: 'sub-os', title: 'Module 4: Memory and File Management (10 hrs)', order: 4 },
  { id: 'mod-os-5', subjectId: 'sub-os', title: 'Module 5: Managing Devices, Security, Protection & Virtualization (8 hrs)', order: 5 },
  { id: 'mod-os-6', subjectId: 'sub-os', title: 'Module 6: Contemporary Issues (2 hrs)', order: 6 },

  // BACSE201: Models of Computation
  { id: 'mod-moc-1', subjectId: 'sub-moc', title: 'Module 1: Foundations of Formal Languages and Proof Techniques (5 hrs)', order: 1 },
  { id: 'mod-moc-2', subjectId: 'sub-moc', title: 'Module 2: Finite Automata and Regular Languages (9 hrs)', order: 2 },
  { id: 'mod-moc-3', subjectId: 'sub-moc', title: 'Module 3: Context Free Grammars and Languages (9 hrs)', order: 3 },
  { id: 'mod-moc-4', subjectId: 'sub-moc', title: 'Module 4: Parsing and Pushdown Automata (11 hrs)', order: 4 },
  { id: 'mod-moc-5', subjectId: 'sub-moc', title: 'Module 5: Turing Machines and Undecidability (9 hrs)', order: 5 },
  { id: 'mod-moc-6', subjectId: 'sub-moc', title: 'Module 6: Contemporary Issues (2 hrs)', order: 6 },

  // BACSE202: Database Systems
  { id: 'mod-dbms-1', subjectId: 'sub-dbms', title: 'Module 1: Database Systems and Data Models (7 hrs)', order: 1 },
  { id: 'mod-dbms-2', subjectId: 'sub-dbms', title: 'Module 2: ER Modeling and Relational Database Design (10 hrs)', order: 2 },
  { id: 'mod-dbms-3', subjectId: 'sub-dbms', title: 'Module 3: Physical Database Design and Query Processing (9 hrs)', order: 3 },
  { id: 'mod-dbms-4', subjectId: 'sub-dbms', title: 'Module 4: Transaction Processing, Concurrency Control & Recovery (10 hrs)', order: 4 },
  { id: 'mod-dbms-5', subjectId: 'sub-dbms', title: 'Module 5: Distributed and NoSQL Databases (7 hrs)', order: 5 },
  { id: 'mod-dbms-6', subjectId: 'sub-dbms', title: 'Module 6: Contemporary Issues (2 hrs)', order: 6 },

  // BACSE344: Cloud Infrastructure and Architecture
  { id: 'mod-cloud-1', subjectId: 'sub-cloud', title: 'Module 1: Fundamentals of Cloud Architecture (8 hrs)', order: 1 },
  { id: 'mod-cloud-2', subjectId: 'sub-cloud', title: 'Module 2: Virtualization and Cloud Infrastructure (9 hrs)', order: 2 },
  { id: 'mod-cloud-3', subjectId: 'sub-cloud', title: 'Module 3: Containerization and Orchestration (9 hrs)', order: 3 },
  { id: 'mod-cloud-4', subjectId: 'sub-cloud', title: 'Module 4: Architectural Design, Patterns and Composition (9 hrs)', order: 4 },
  { id: 'mod-cloud-5', subjectId: 'sub-cloud', title: 'Module 5: Cloud Security and Management (8 hrs)', order: 5 },
  { id: 'mod-cloud-6', subjectId: 'sub-cloud', title: 'Module 6: Contemporary Issues (2 hrs)', order: 6 },
];

// All topics initialized from zero
export const INITIAL_TOPICS: Topic[] = [
  // ==========================================
  // BACSE106: OPERATING SYSTEMS (32 topics)
  // ==========================================
  { id: 'top-os-1', moduleId: 'mod-os-1', subjectId: 'sub-os', title: 'OS Basics & Evolution History', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 1 },
  { id: 'top-os-2', moduleId: 'mod-os-1', subjectId: 'sub-os', title: 'OS Structures: Monolithic, Layered, Microkernel, Modular', difficulty: 'medium', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 2 },
  { id: 'top-os-3', moduleId: 'mod-os-1', subjectId: 'sub-os', title: 'OS Services & System Calls (Types & Mechanics)', difficulty: 'medium', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 3 },
  { id: 'top-os-4', moduleId: 'mod-os-1', subjectId: 'sub-os', title: 'Interrupts & OS Design Issues', difficulty: 'medium', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 4 },
  { id: 'top-os-5', moduleId: 'mod-os-1', subjectId: 'sub-os', title: 'Building and Booting an OS (Bootloader Concept)', difficulty: 'medium', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 5 },

  { id: 'top-os-6', moduleId: 'mod-os-2', subjectId: 'sub-os', title: 'Process Concepts, States & PCB', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 6 },
  { id: 'top-os-7', moduleId: 'mod-os-2', subjectId: 'sub-os', title: 'Process Operations: Creation (fork), Orphan & Zombie Processes', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 7 },
  { id: 'top-os-8', moduleId: 'mod-os-2', subjectId: 'sub-os', title: 'Threads & Multithreading Models (User vs Kernel)', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 8 },
  { id: 'top-os-9', moduleId: 'mod-os-2', subjectId: 'sub-os', title: 'Scheduling Criteria & Non-preemptive (FCFS, SJF, Priority)', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 9 },
  { id: 'top-os-10', moduleId: 'mod-os-2', subjectId: 'sub-os', title: 'Preemptive Scheduling (Round Robin, SRTF, Preemptive Priority)', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 10 },
  { id: 'top-os-11', moduleId: 'mod-os-2', subjectId: 'sub-os', title: 'Multi-level Queue & Multi-level Feedback Queue Scheduling', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 11 },
  { id: 'top-os-12', moduleId: 'mod-os-2', subjectId: 'sub-os', title: 'Deadlock Characterization & Resource Allocation Graphs (RAG)', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 12 },
  { id: 'top-os-13', moduleId: 'mod-os-2', subjectId: 'sub-os', title: 'Deadlock Handling: Banker’s Algorithm for Deadlock Avoidance', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 13 },

  { id: 'top-os-14', moduleId: 'mod-os-3', subjectId: 'sub-os', title: 'IPC: Shared Memory, Message Passing & Race Condition', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 14 },
  { id: 'top-os-15', moduleId: 'mod-os-3', subjectId: 'sub-os', title: 'Critical Section Problem, Peterson’s Solution & Bakery Algorithm', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 15 },
  { id: 'top-os-16', moduleId: 'mod-os-3', subjectId: 'sub-os', title: 'Hardware Synchronization: Test-and-Set & Swap', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 16 },
  { id: 'top-os-17', moduleId: 'mod-os-3', subjectId: 'sub-os', title: 'Mutex Locks & Counting / Binary Semaphores', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 17 },
  { id: 'top-os-18', moduleId: 'mod-os-3', subjectId: 'sub-os', title: 'Classical Synchronization: Bounded Buffer & Readers-Writers', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 18 },
  { id: 'top-os-19', moduleId: 'mod-os-3', subjectId: 'sub-os', title: 'Dining Philosophers Problem & Monitors', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 19 },

  { id: 'top-os-20', moduleId: 'mod-os-4', subjectId: 'sub-os', title: 'Address Binding & Logical vs Physical Address Space', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 20 },
  { id: 'top-os-21', moduleId: 'mod-os-4', subjectId: 'sub-os', title: 'Contiguous Allocation & Placement: First Fit, Best Fit, Worst Fit', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 21 },
  { id: 'top-os-22', moduleId: 'mod-os-4', subjectId: 'sub-os', title: 'Paging Architecture: Structure with TLB', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 22 },
  { id: 'top-os-23', moduleId: 'mod-os-4', subjectId: 'sub-os', title: 'Segmentation & Virtual Memory Demand Paging', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 23 },
  { id: 'top-os-24', moduleId: 'mod-os-4', subjectId: 'sub-os', title: 'Page Replacement Algorithms: FIFO, Optimal & LRU', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 24 },
  { id: 'top-os-25', moduleId: 'mod-os-4', subjectId: 'sub-os', title: 'Thrashing, Working Set Model & Page Fault Frequency', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 25 },
  { id: 'top-os-26', moduleId: 'mod-os-4', subjectId: 'sub-os', title: 'File Access Methods, Directory Structures & Allocation Methods', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 26 },

  { id: 'top-os-27', moduleId: 'mod-os-5', subjectId: 'sub-os', title: 'I/O Device Management Basics & RAID Structure (0, 1, 5, 6, 10)', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 27 },
  { id: 'top-os-28', moduleId: 'mod-os-5', subjectId: 'sub-os', title: 'Disk Scheduling: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 28 },
  { id: 'top-os-29', moduleId: 'mod-os-5', subjectId: 'sub-os', title: 'Security: Threats, Cryptography & Access Matrix', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 29 },
  { id: 'top-os-30', moduleId: 'mod-os-5', subjectId: 'sub-os', title: 'Virtualization: Hypervisors, Para vs Full Virtualization', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 30 },
  { id: 'top-os-31', moduleId: 'mod-os-5', subjectId: 'sub-os', title: 'OS-Level Virtualization: Containers, Docker Basics & Containers vs VMs', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 31 },

  { id: 'top-os-32', moduleId: 'mod-os-6', subjectId: 'sub-os', title: 'Contemporary Issues in Modern Operating Systems', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 32 },

  // ==========================================
  // BACSE201: MODELS OF COMPUTATION (30 topics)
  // ==========================================
  { id: 'top-moc-1', moduleId: 'mod-moc-1', subjectId: 'sub-moc', title: 'Proof Techniques: Induction, Contradiction, Contrapositive', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 1 },
  { id: 'top-moc-2', moduleId: 'mod-moc-1', subjectId: 'sub-moc', title: 'Formal Languages & Operations (Alphabet, Strings, Languages)', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 2 },
  { id: 'top-moc-3', moduleId: 'mod-moc-1', subjectId: 'sub-moc', title: 'Types of Grammars, Chomsky Hierarchy & Automata Overview', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 3 },

  { id: 'top-moc-4', moduleId: 'mod-moc-2', subjectId: 'sub-moc', title: 'Deterministic Finite Automata (DFA) Construction', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 4 },
  { id: 'top-moc-5', moduleId: 'mod-moc-2', subjectId: 'sub-moc', title: 'Non-Deterministic Finite Automata (NFA) & Îµ-moves in NFA', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 5 },
  { id: 'top-moc-6', moduleId: 'mod-moc-2', subjectId: 'sub-moc', title: 'NFA to DFA Conversion (Subset Construction Algorithm)', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 6 },
  { id: 'top-moc-7', moduleId: 'mod-moc-2', subjectId: 'sub-moc', title: 'Minimization of DFA (Table Filling / Myhill-Nerode Method)', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 7 },
  { id: 'top-moc-8', moduleId: 'mod-moc-2', subjectId: 'sub-moc', title: 'Regular Expressions & Equivalence with Finite Automata', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 8 },
  { id: 'top-moc-9', moduleId: 'mod-moc-2', subjectId: 'sub-moc', title: 'Lexical Analysis using FA & Program Constructs with RE', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 9 },
  { id: 'top-moc-10', moduleId: 'mod-moc-2', subjectId: 'sub-moc', title: 'Pumping Lemma for Regular Languages & Non-regularity Proofs', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 10 },

  { id: 'top-moc-11', moduleId: 'mod-moc-3', subjectId: 'sub-moc', title: 'Context-Free Grammars (CFG) & Context-Free Languages', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 11 },
  { id: 'top-moc-12', moduleId: 'mod-moc-3', subjectId: 'sub-moc', title: 'Derivations (Leftmost & Rightmost) and Parse Trees', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 12 },
  { id: 'top-moc-13', moduleId: 'mod-moc-3', subjectId: 'sub-moc', title: 'Ambiguous and Unambiguous Grammars', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 13 },
  { id: 'top-moc-14', moduleId: 'mod-moc-3', subjectId: 'sub-moc', title: 'First and Follow Sets Computation', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 14 },
  { id: 'top-moc-15', moduleId: 'mod-moc-3', subjectId: 'sub-moc', title: 'Left Recursion Elimination and Left Factoring', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 15 },
  { id: 'top-moc-16', moduleId: 'mod-moc-3', subjectId: 'sub-moc', title: 'Simplification of CFG: Chomsky Normal Form (CNF) & GNF', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 16 },
  { id: 'top-moc-17', moduleId: 'mod-moc-3', subjectId: 'sub-moc', title: 'CYK Algorithm for CFG Membership Determination', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 17 },

  { id: 'top-moc-18', moduleId: 'mod-moc-4', subjectId: 'sub-moc', title: 'Introduction to Parsing: Top-Down and Bottom-Up Strategies', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 18 },
  { id: 'top-moc-19', moduleId: 'mod-moc-4', subjectId: 'sub-moc', title: 'LL(1) Parsing Table Construction & String Verification', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 19 },
  { id: 'top-moc-20', moduleId: 'mod-moc-4', subjectId: 'sub-moc', title: 'SLR Parsing Table Construction & Shift-Reduce Conflicts', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 20 },
  { id: 'top-moc-21', moduleId: 'mod-moc-4', subjectId: 'sub-moc', title: 'Pushdown Automata (PDA): Formal Tuple & Transitions', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 21 },
  { id: 'top-moc-22', moduleId: 'mod-moc-4', subjectId: 'sub-moc', title: 'Deterministic vs Non-Deterministic PDA (DPDA vs NPDA)', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 22 },
  { id: 'top-moc-23', moduleId: 'mod-moc-4', subjectId: 'sub-moc', title: 'Interpretation of Syntactic Statements using PDA', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 23 },

  { id: 'top-moc-24', moduleId: 'mod-moc-5', subjectId: 'sub-moc', title: 'Turing Machines: Transition Functions, Acceptors & Transducers', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 24 },
  { id: 'top-moc-25', moduleId: 'mod-moc-5', subjectId: 'sub-moc', title: 'Universal Turing Machine (UTM) and Encoding Schemes', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 25 },
  { id: 'top-moc-26', moduleId: 'mod-moc-5', subjectId: 'sub-moc', title: 'Church-Turing Thesis, Recursive & Recursively Enumerable Languages', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 26 },
  { id: 'top-moc-27', moduleId: 'mod-moc-5', subjectId: 'sub-moc', title: 'Non-Recursive Languages, Reducibility & Halting Problem Proof', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 27 },
  { id: 'top-moc-28', moduleId: 'mod-moc-5', subjectId: 'sub-moc', title: 'Post Correspondence Problem (PCP)', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 28 },
  { id: 'top-moc-29', moduleId: 'mod-moc-5', subjectId: 'sub-moc', title: 'Automata Theory Tools: JFLAP, REGEX, LEX, YACC', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 29 },

  { id: 'top-moc-30', moduleId: 'mod-moc-6', subjectId: 'sub-moc', title: 'Contemporary Issues in Models of Computation', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 30 },

  // ==========================================
  // BACSE202: DATABASE SYSTEMS (33 topics)
  // ==========================================
  { id: 'top-dbms-1', moduleId: 'mod-dbms-1', subjectId: 'sub-dbms', title: 'Introduction to DBMS & Characteristics of Database Approach', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 1 },
  { id: 'top-dbms-2', moduleId: 'mod-dbms-1', subjectId: 'sub-dbms', title: 'Actors on the Scene, Classification of DBMS & Data Models', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 2 },
  { id: 'top-dbms-3', moduleId: 'mod-dbms-1', subjectId: 'sub-dbms', title: 'Schemas, Instances, Three-Schema Architecture & DBMS Environment', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 3 },
  { id: 'top-dbms-4', moduleId: 'mod-dbms-1', subjectId: 'sub-dbms', title: 'Relational, Graph, Vector, Time-Series & Distributed Databases', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 4 },
  { id: 'top-dbms-5', moduleId: 'mod-dbms-1', subjectId: 'sub-dbms', title: 'Relational Model Concepts: Characteristics & Domain Constraints', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 5 },
  { id: 'top-dbms-6', moduleId: 'mod-dbms-1', subjectId: 'sub-dbms', title: 'Key Constraints, Entity Integrity, Referential Integrity (Foreign Keys)', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 6 },

  { id: 'top-dbms-7', moduleId: 'mod-dbms-2', subjectId: 'sub-dbms', title: 'ER Model: Attributes, Relationship Types, Roles, Weak Entities', difficulty: 'medium', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 7 },
  { id: 'top-dbms-8', moduleId: 'mod-dbms-2', subjectId: 'sub-dbms', title: 'Mapping ER Model to Relational Schema', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 8 },
  { id: 'top-dbms-9', moduleId: 'mod-dbms-2', subjectId: 'sub-dbms', title: 'Extended ER (EER): Generalization, Specialization & Aggregation', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 9 },
  { id: 'top-dbms-10', moduleId: 'mod-dbms-2', subjectId: 'sub-dbms', title: 'Functional Dependencies: Inference Rules, Equivalence & Minimal Cover', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 10 },
  { id: 'top-dbms-11', moduleId: 'mod-dbms-2', subjectId: 'sub-dbms', title: 'Normalization: First Normal Form (1NF), 2NF & 3NF Decompositions', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 11 },
  { id: 'top-dbms-12', moduleId: 'mod-dbms-2', subjectId: 'sub-dbms', title: 'Boyce-Codd Normal Form (BCNF), Multi-Valued Dependency & 4NF', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 12 },
  { id: 'top-dbms-13', moduleId: 'mod-dbms-2', subjectId: 'sub-dbms', title: 'Join Dependency and Fifth Normal Form (5NF)', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 13 },

  { id: 'top-dbms-14', moduleId: 'mod-dbms-3', subjectId: 'sub-dbms', title: 'File Structures: Unordered vs Ordered Records & File Operations', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 14 },
  { id: 'top-dbms-15', moduleId: 'mod-dbms-3', subjectId: 'sub-dbms', title: 'Hashing Techniques: Static and Dynamic Hashing', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 15 },
  { id: 'top-dbms-16', moduleId: 'mod-dbms-3', subjectId: 'sub-dbms', title: 'Indexing: Single Level Indexing & Multi-Level Indexing', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 16 },
  { id: 'top-dbms-17', moduleId: 'mod-dbms-3', subjectId: 'sub-dbms', title: 'Dynamic Multilevel Indexing: B+ Tree Indexing & LSM Trees', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 17 },
  { id: 'top-dbms-18', moduleId: 'mod-dbms-3', subjectId: 'sub-dbms', title: 'Relational Algebra: Core Operators & Translating SQL Queries', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 18 },
  { id: 'top-dbms-19', moduleId: 'mod-dbms-3', subjectId: 'sub-dbms', title: 'Tuple Relational Calculus (TRC)', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 19 },
  { id: 'top-dbms-20', moduleId: 'mod-dbms-3', subjectId: 'sub-dbms', title: 'Query Optimization: Query Trees & Heuristic Optimization', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 20 },

  { id: 'top-dbms-21', moduleId: 'mod-dbms-4', subjectId: 'sub-dbms', title: 'Transaction Processing Concepts & ACID Properties', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 21 },
  { id: 'top-dbms-22', moduleId: 'mod-dbms-4', subjectId: 'sub-dbms', title: 'Transaction States & Schedules: Serial vs Conflict Serializable', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 22 },
  { id: 'top-dbms-23', moduleId: 'mod-dbms-4', subjectId: 'sub-dbms', title: 'Recoverability: Recoverable, Cascadeless & Strict Schedules', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 23 },
  { id: 'top-dbms-24', moduleId: 'mod-dbms-4', subjectId: 'sub-dbms', title: 'Concurrency Control: Two-Phase Locking (2PL) Techniques', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 24 },
  { id: 'top-dbms-25', moduleId: 'mod-dbms-4', subjectId: 'sub-dbms', title: 'Dealing with Deadlock and Starvation in DBMS', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 25 },
  { id: 'top-dbms-26', moduleId: 'mod-dbms-4', subjectId: 'sub-dbms', title: 'Concurrency Control based on Timestamp Ordering & Lock Granularity', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 26 },
  { id: 'top-dbms-27', moduleId: 'mod-dbms-4', subjectId: 'sub-dbms', title: 'Recovery Concepts: Deferred vs Immediate Update & ARIES', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 27 },

  { id: 'top-dbms-28', moduleId: 'mod-dbms-5', subjectId: 'sub-dbms', title: 'Distributed Database: Fragmentation, Replication & Allocation', difficulty: 'medium', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 28 },
  { id: 'top-dbms-29', moduleId: 'mod-dbms-5', subjectId: 'sub-dbms', title: 'Distributed Transactions, Concurrency Control & Query Optimization', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 29 },
  { id: 'top-dbms-30', moduleId: 'mod-dbms-5', subjectId: 'sub-dbms', title: 'NoSQL Databases: Characteristics, CAP Theorem, ACID vs BASE', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 30 },
  { id: 'top-dbms-31', moduleId: 'mod-dbms-5', subjectId: 'sub-dbms', title: 'NoSQL Modeling Techniques: Aggregate Models & MapReduce', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 31 },
  { id: 'top-dbms-32', moduleId: 'mod-dbms-5', subjectId: 'sub-dbms', title: 'NoSQL Types: Key-Value, Document, Column-Based & Graph DBs', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 32 },

  { id: 'top-dbms-33', moduleId: 'mod-dbms-6', subjectId: 'sub-dbms', title: 'Contemporary Issues in Modern Database Architectures', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 33 },

  // ==========================================
  // BACSE344: CLOUD INFRASTRUCTURE (28 topics)
  // ==========================================
  { id: 'top-cloud-1', moduleId: 'mod-cloud-1', subjectId: 'sub-cloud', title: 'Business Drivers & Technology Innovations: Grid & Serverless', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 1 },
  { id: 'top-cloud-2', moduleId: 'mod-cloud-1', subjectId: 'sub-cloud', title: 'Roles and Boundaries, Goals, Benefits & Cloud Characteristics', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 2 },
  { id: 'top-cloud-3', moduleId: 'mod-cloud-1', subjectId: 'sub-cloud', title: 'Cloud Service Models: IaaS, PaaS, SaaS Architectures', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 3 },
  { id: 'top-cloud-4', moduleId: 'mod-cloud-1', subjectId: 'sub-cloud', title: 'Cloud Deployment Models: Public, Private, Hybrid & Community', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 4 },
  { id: 'top-cloud-5', moduleId: 'mod-cloud-1', subjectId: 'sub-cloud', title: 'NIST Reference Architecture, Web Services, REST & APIs', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 5 },

  { id: 'top-cloud-6', moduleId: 'mod-cloud-2', subjectId: 'sub-cloud', title: 'Data Center Technology, Service Agents & Middleware', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 6 },
  { id: 'top-cloud-7', moduleId: 'mod-cloud-2', subjectId: 'sub-cloud', title: 'Logical Network Perimeter Mechanism & Virtualization Basics', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 7 },
  { id: 'top-cloud-8', moduleId: 'mod-cloud-2', subjectId: 'sub-cloud', title: 'Virtualization: Virtual Servers & Hypervisors (Type 1 & 2)', difficulty: 'medium', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 8 },
  { id: 'top-cloud-9', moduleId: 'mod-cloud-2', subjectId: 'sub-cloud', title: 'Cloud Storage Devices (Block, Object, File Storage)', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 9 },
  { id: 'top-cloud-10', moduleId: 'mod-cloud-2', subjectId: 'sub-cloud', title: 'Cloud Usage Monitor: CloudWatch & Resource Replication', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 10 },

  { id: 'top-cloud-11', moduleId: 'mod-cloud-3', subjectId: 'sub-cloud', title: 'Automated Scaling Listener, Load Balancers & Failovers', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 11 },
  { id: 'top-cloud-12', moduleId: 'mod-cloud-3', subjectId: 'sub-cloud', title: 'Resource Cluster & High Availability Systems', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 12 },
  { id: 'top-cloud-13', moduleId: 'mod-cloud-3', subjectId: 'sub-cloud', title: 'Containerization: Containers vs Virtual Machines', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 13 },
  { id: 'top-cloud-14', moduleId: 'mod-cloud-3', subjectId: 'sub-cloud', title: 'Docker Server: Daemon, Images, Containers & Registries', difficulty: 'medium', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 14 },
  { id: 'top-cloud-15', moduleId: 'mod-cloud-3', subjectId: 'sub-cloud', title: 'Kubernetes Architecture: Nodes, Pods, Kubelet & Control Plane', difficulty: 'hard', estimatedHours: 3.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 15 },

  { id: 'top-cloud-16', moduleId: 'mod-cloud-4', subjectId: 'sub-cloud', title: 'Workload Distribution Architecture & Resource Pooling Patterns', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 16 },
  { id: 'top-cloud-17', moduleId: 'mod-cloud-4', subjectId: 'sub-cloud', title: 'Dynamic Scalability, Elastic Capacity & Cloud Bursting', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 17 },
  { id: 'top-cloud-18', moduleId: 'mod-cloud-4', subjectId: 'sub-cloud', title: 'Service Load Balancing & Load-Balanced Virtual Servers', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 18 },
  { id: 'top-cloud-19', moduleId: 'mod-cloud-4', subjectId: 'sub-cloud', title: 'Zero Downtime and Non-Disruptive Relocation Patterns', difficulty: 'hard', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 19 },
  { id: 'top-cloud-20', moduleId: 'mod-cloud-4', subjectId: 'sub-cloud', title: 'Virtual Private Cloud (VPC), Subnets & Multi Cloud Architectures', difficulty: 'hard', estimatedHours: 2.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 20 },
  { id: 'top-cloud-21', moduleId: 'mod-cloud-4', subjectId: 'sub-cloud', title: 'Specialized Cloud Architectures: Edge and Fog Computing', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 21 },

  { id: 'top-cloud-22', moduleId: 'mod-cloud-5', subjectId: 'sub-cloud', title: 'Cloud Threat Agents & Common Security Threats', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 22 },
  { id: 'top-cloud-23', moduleId: 'mod-cloud-5', subjectId: 'sub-cloud', title: 'Hashing, Single Sign On (SSO) & Multi-Factor Authentication', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 23 },
  { id: 'top-cloud-24', moduleId: 'mod-cloud-5', subjectId: 'sub-cloud', title: 'Hardened Images and Trusted Platform Module (TPM)', difficulty: 'medium', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 24 },
  { id: 'top-cloud-25', moduleId: 'mod-cloud-5', subjectId: 'sub-cloud', title: 'Cloud Management: Remote Administration & Resource Management', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 25 },
  { id: 'top-cloud-26', moduleId: 'mod-cloud-5', subjectId: 'sub-cloud', title: 'SLA Management System & Cloud Billing Management', difficulty: 'medium', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 26 },
  { id: 'top-cloud-27', moduleId: 'mod-cloud-5', subjectId: 'sub-cloud', title: 'Compliance & Regulatory Standards: HIPAA and GDPR in Cloud', difficulty: 'medium', estimatedHours: 2.0, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 27 },

  { id: 'top-cloud-28', moduleId: 'mod-cloud-6', subjectId: 'sub-cloud', title: 'Contemporary Issues in Cloud Infrastructure & Cloud Native Systems', difficulty: 'easy', estimatedHours: 1.5, actualHoursSpent: 0, studyStatus: 'not_started', revision1: false, revision2: false, practiceDone: false, order: 28 },
];

// Target Exam schedule starting November 16, 2026
export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-os',
    subjectId: 'sub-os',
    title: 'Operating Systems (BACSE106)',
    examDate: '2026-11-16', // November 16
    targetFinishDate: '2026-11-13', // Finished 3 days prior for mock drill
    revisionDaysBuffer: 3,
    priority: 'high',
  },
  {
    id: 'exam-moc',
    subjectId: 'sub-moc',
    title: 'Models of Computation (BACSE201)',
    examDate: '2026-11-18', // November 18
    targetFinishDate: '2026-11-14',
    revisionDaysBuffer: 4,
    priority: 'high',
  },
  {
    id: 'exam-dbms',
    subjectId: 'sub-dbms',
    title: 'Database Systems (BACSE202)',
    examDate: '2026-11-21', // November 21
    targetFinishDate: '2026-11-15',
    revisionDaysBuffer: 6,
    priority: 'high',
  },
  {
    id: 'exam-cloud',
    subjectId: 'sub-cloud',
    title: 'Cloud Infrastructure (BACSE344)',
    examDate: '2026-11-24', // November 24
    targetFinishDate: '2026-11-15',
    revisionDaysBuffer: 9,
    priority: 'high',
  },
];

// Generate structured day-by-day plan starting TODAY until Nov 13, covering 100% of syllabus
export const generateDailyStudyTasks = (): StudyTask[] => {
  const tasks: StudyTask[] = [];

  const osTopics = INITIAL_TOPICS.filter((t) => t.subjectId === 'sub-os');
  const mocTopics = INITIAL_TOPICS.filter((t) => t.subjectId === 'sub-moc');
  const dbmsTopics = INITIAL_TOPICS.filter((t) => t.subjectId === 'sub-dbms');
  const cloudTopics = INITIAL_TOPICS.filter((t) => t.subjectId === 'sub-cloud');

  // Days available for core topics: from today until Nov 13, 2026
  const targetEndDate = parseISO('2026-11-13');
  const daysAvailable = Math.max(1, differenceInCalendarDays(targetEndDate, today) + 1);

  const distribute = (
    topicList: Topic[],
    subjectPrefix: string,
    baseHour: number,
    baseMinute: number,
    durationMinutes: number
  ) => {
    const total = topicList.length;
    topicList.forEach((topic, idx) => {
      const dayOffset = Math.min(daysAvailable - 1, Math.floor((idx * daysAvailable) / total));
      const taskDate = addDays(today, dayOffset);
      const dateStr = fmt(taskDate);

      const existingOnDay = tasks.filter((t) => t.date === dateStr && t.subjectId === topic.subjectId).length;
      const startMinTotal = baseHour * 60 + baseMinute + existingOnDay * (durationMinutes + 10);
      const sH = Math.floor(startMinTotal / 60);
      const sM = startMinTotal % 60;
      const startTime = `${String(sH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`;

      tasks.push({
        id: `plan-${topic.id}`,
        subjectId: topic.subjectId,
        topicId: topic.id,
        title: `${subjectPrefix}: ${topic.title}`,
        date: dateStr,
        startTime,
        durationMinutes,
        type: 'study',
        completed: false,
        notes: `Topic ${idx + 1} of ${total}: Focus on syllabus concepts & exam questions`,
      });
    });
  };

  // 1. Morning Deep Work: Operating Systems (BACSE106) @ 09:00 AM
  distribute(osTopics, 'OS', 9, 0, 50);

  // 2. Midday Deep Work: Models of Computation (BACSE201) @ 11:30 AM
  distribute(mocTopics, 'MOC', 11, 30, 55);

  // 3. Afternoon Deep Work: Database Systems (BACSE202) @ 02:30 PM (14:30)
  distribute(dbmsTopics, 'DBMS', 14, 30, 50);

  // 4. Evening Deep Work: Cloud Infrastructure (BACSE344) @ 05:00 PM (17:00)
  distribute(cloudTopics, 'Cloud', 17, 0, 45);

  // Days 14 & 15 (Nov 14 & Nov 15): Final comprehensive revision drills before exams
  tasks.push(
    {
      id: 'rev-day-1-os',
      subjectId: 'sub-os',
      title: 'OS Final Revision & Previous Year Question Paper Drill',
      date: '2026-11-14',
      startTime: '09:00',
      durationMinutes: 120,
      type: 'revision',
      completed: false,
      notes: 'Formulas, CPU scheduling Gantt charts, Banker’s algorithm, Paging math',
    },
    {
      id: 'rev-day-1-moc',
      subjectId: 'sub-moc',
      title: 'MOC Final Revision & Proofs Quick Recall',
      date: '2026-11-14',
      startTime: '14:00',
      durationMinutes: 120,
      type: 'revision',
      completed: false,
      notes: 'Pumping lemma proofs, LL(1) parse tables, Turing machines',
    },
    {
      id: 'rev-day-2-dbms',
      subjectId: 'sub-dbms',
      title: 'DBMS Final Normalization & SQL / Concurrency Mock Drill',
      date: '2026-11-15',
      startTime: '09:00',
      durationMinutes: 120,
      type: 'practice',
      completed: false,
      notes: '1NF to BCNF decompositions, Conflict serializability graphs, ACID recovery',
    },
    {
      id: 'rev-day-2-cloud',
      subjectId: 'sub-cloud',
      title: 'Cloud Final Architecture & Docker / K8s Review',
      date: '2026-11-15',
      startTime: '14:00',
      durationMinutes: 120,
      type: 'revision',
      completed: false,
      notes: 'Service models, VPC architecture, Docker/K8s control plane, security models',
    }
  );

  return tasks;
};

export const INITIAL_TASKS: StudyTask[] = generateDailyStudyTasks();

// Daily Habits & Routine (Gym, 5 AM wakeup, LeetCode, etc.) - Fresh start from today
export const INITIAL_HABITS: DailyHabit[] = [
  {
    id: 'habit-wakeup',
    title: 'Wake up at 5:00 AM',
    category: 'wakeup',
    time: '05:00 AM',
    icon: 'AlarmClock',
    streak: 0,
    completedDates: [],
    details: 'Hydrate immediately with water, morning stretches & no phone distraction',
  },
  {
    id: 'habit-gym',
    title: 'Gym & Physical Workout',
    category: 'gym',
    time: '06:00 AM',
    icon: 'Dumbbell',
    streak: 0,
    completedDates: [],
    details: 'Strength training / Cardio session (75 mins) to energize the mind',
  },
  {
    id: 'habit-leetcode',
    title: 'LeetCode Daily Problem',
    category: 'leetcode',
    time: '07:30 AM',
    icon: 'Code2',
    streak: 0,
    completedDates: [],
    details: 'Daily algorithm problem (Array, Two Pointers, Linked List)',
    difficulty: 'Medium',
    problemLink: 'https://leetcode.com/problemset/all/',
  },
  {
    id: 'habit-study-am',
    title: 'Morning Deep Work: OS & MOC',
    category: 'custom',
    time: '09:00 AM',
    icon: 'BookOpen',
    streak: 0,
    completedDates: [],
    details: 'Unbroken focus block for Operating Systems & Theory of Computation',
  },
  {
    id: 'habit-study-pm',
    title: 'Afternoon Deep Work: DBMS & Cloud',
    category: 'custom',
    time: '02:30 PM',
    icon: 'Layers',
    streak: 0,
    completedDates: [],
    details: 'Database design, query trees & Cloud architectures',
  },
  {
    id: 'habit-water',
    title: 'Hydration Target: 3+ Litres',
    category: 'custom',
    time: 'All Day',
    icon: 'Droplet',
    streak: 0,
    completedDates: [],
    details: 'Stay hydrated to maintain cognitive performance during study hours',
  },
  {
    id: 'habit-sleep',
    title: 'Wind Down & Sleep by 10:30 PM',
    category: 'custom',
    time: '10:30 PM',
    icon: 'Moon',
    streak: 0,
    completedDates: [],
    details: 'Ensure 6.5 - 7 hours of restorative sleep to easily wake up at 5:00 AM',
  },
];
