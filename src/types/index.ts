export type CompetencyCategory =
  | 'Statistical Competencies'
  | 'Technical Competencies'
  | 'Digital Governance'
  | 'Behavioural & Managerial Competencies';

export type GapClassification = 'Critical Gap' | 'Moderate Gap' | 'Strong Competency';

export interface Skill {
  id: string;
  name: string;
  category: CompetencyCategory;
  description: string;
  benchmarkScore: number; // Default required level 0-100
  importance?: string;
}

export interface UserSkillProficiency {
  skillId: string;
  skillName: string;
  category: CompetencyCategory;
  currentLevel: number; // 0-100
  requiredLevel: number; // 0-100
  gap: number; // max(0, requiredLevel - currentLevel)
  priority: 'High' | 'Medium' | 'Low';
  classification: GapClassification;
  lastAssessed?: string;
}

export type UserSkillGap = UserSkillProficiency;
export type SkillGap = UserSkillProficiency;

export interface JobRole {
  id: string;
  title: string;
  cadre?: string;
  department: string;
  description: string;
  requiredSkills: {
    skillId: string;
    requiredLevel: number;
    priority: 'High' | 'Medium' | 'Low';
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  jobRoleId: string;
  jobRoleTitle: string;
  experienceYears?: number;
  yearsOfExperience?: number;
  education?: string;
  educationalBackground?: string;
  currentAssignment: string;
  previousTraining?: string[];
  previousTrainingAttended?: string[];
  existingTechnicalSkills: string[];
  role: 'employee' | 'admin';
  avatar?: string;
  overallCompetency: number; // 0-100
  skills: Record<string, UserSkillProficiency>; // skillId -> proficiency
  enrolledCourses: EnrolledCourse[];
  assessmentHistory: AssessmentResult[];
  quizHistory: QuizAttempt[];
  createdAt: string;
}

export interface EnrolledCourse {
  courseId: string;
  title: string;
  provider: 'iGOT Karmayogi' | 'NSSTA / TPAC';
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number; // 0-100%
  status: 'Not Started' | 'In Progress' | 'Completed';
  enrolledAt: string;
  completedAt?: string;
}

export interface Course {
  id: string;
  course_id: string;
  title: string;
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  provider: string; // e.g. "iGOT", "NSSTA", "MoSPI-TPAC"
  source: 'iGOT Karmayogi' | 'NSSTA / TPAC';
  domain: string;
  description: string;
  modulesCount: number;
  rating: number;
  enrolledCount: number;
  syllabus: string[];
  url?: string;
}

export interface Recommendation {
  id: string;
  courseId: string;
  courseTitle: string;
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  source: 'iGOT Karmayogi' | 'NSSTA / TPAC';
  provider: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  gapSize: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  category?: CompetencyCategory;
  skillId?: string;
}

export interface AssessmentResult {
  id: string;
  date: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  topicBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  evaluatedSkills: { skillId: string; newLevel: number; oldLevel: number }[];
}

export interface QuizAttempt {
  id: string;
  title: string;
  sourceDocumentName?: string;
  date: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  strengths: string[];
  areasToImprove: string[];
  recommendedCourses: Recommendation[];
  answers: {
    questionId: string;
    question: string;
    selectedOption: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    topic: string;
  }[];
}

export interface UploadedLearningMaterial {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  extractedText: string;
  chunksCount: number;
  detectedTopics: string[];
  summary: string;
}

export interface PredictiveInsight {
  id: string;
  skill: string;
  predictedDemandChange: string; // e.g. "+35% over next 2 years"
  trend: 'increasing' | 'stable' | 'emerging';
  reasoning: string;
  recommendedAction: string;
  impactedOfficialsCount: number;
  priorityDepartments: string[];
}
