import {
  UserProfile,
  Skill,
  JobRole,
  Course,
  Recommendation,
  Question,
  AssessmentResult,
  QuizAttempt,
  PredictiveInsight,
} from '../types';

export const api = {
  // Auth & Profile
  async getMe(): Promise<UserProfile> {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    return data.user;
  },

  async getAllUsers(): Promise<any[]> {
    const res = await fetch('/api/auth/users');
    const data = await res.json();
    return data.users;
  },

  async login(userId?: string, role?: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    const data = await res.json();
    return data.user;
  },

  async switchUser(userId: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/switch-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data.user;
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    return data.user;
  },

  // Competencies
  async getCompetencies(): Promise<{ categories: string[]; skills: Skill[]; roles: JobRole[]; departments: string[] }> {
    const [catsRes, skillsRes, rolesRes] = await Promise.all([
      fetch('/api/competencies/categories'),
      fetch('/api/competencies/skills'),
      fetch('/api/competencies/roles'),
    ]);
    const [cats, skills, roles] = await Promise.all([catsRes.json(), skillsRes.json(), rolesRes.json()]);
    return {
      categories: cats.categories,
      skills: skills.skills,
      roles: roles.roles,
      departments: roles.departments,
    };
  },

  // Skill Gaps
  async getSkillGaps(criticalThreshold = 25, moderateThreshold = 0): Promise<any> {
    const res = await fetch(`/api/skill-gaps?criticalThreshold=${criticalThreshold}&moderateThreshold=${moderateThreshold}`);
    return res.json();
  },

  async explainSkillGap(skillName: string, currentLevel: number, requiredLevel: number, gap: number): Promise<string> {
    const res = await fetch('/api/skill-gaps/ai-explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillName, currentLevel, requiredLevel, gap }),
    });
    const data = await res.json();
    return data.explanation;
  },

  // Recommendations & Learning Path
  async getRecommendations(): Promise<{
    recommendations: Recommendation[];
    pathway: any[];
    counts: { total: number; igot: number; nssta: number };
  }> {
    const res = await fetch('/api/recommendations');
    return res.json();
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    const res = await fetch('/api/courses');
    const data = await res.json();
    return data.courses;
  },

  async enrollCourse(courseId: string): Promise<any> {
    const res = await fetch('/api/courses/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    return res.json();
  },

  async updateCourseProgress(courseId: string, progress: number): Promise<any> {
    const res = await fetch('/api/courses/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, progress }),
    });
    return res.json();
  },

  // Competency Assessment
  async getAssessmentQuestions(count = 8): Promise<{ questions: Question[]; source: string }> {
    const res = await fetch(`/api/assessment/questions?count=${count}`);
    return res.json();
  },

  async submitAssessment(answers: Record<string, string>, questions: Question[]): Promise<any> {
    const res = await fetch('/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, questions }),
    });
    return res.json();
  },

  // Quiz Generation & RAG
  async processDocument(text: string, filename?: string, fileType?: string): Promise<any> {
    const res = await fetch('/api/quiz/process-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, filename, fileType }),
    });
    return res.json();
  },

  async generateQuiz(payload: {
    documentText?: string;
    pdfBase64?: string;
    filename: string;
    questionCount: number;
    difficulty: string;
    questionType: string;
    selectedTopic: string;
  }): Promise<{ questions: Question[]; metadata: any }> {
    const res = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async submitQuiz(payload: {
    title: string;
    sourceDocumentName: string;
    difficulty: string;
    answers: Record<string, string>;
    questions: Question[];
  }): Promise<{ attempt: QuizAttempt; message: string }> {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getQuizHistory(): Promise<QuizAttempt[]> {
    const res = await fetch('/api/quiz/history');
    const data = await res.json();
    return data.history;
  },

  // Analytics & Admin
  async getAdminAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics/overview');
    return res.json();
  },

  async getPredictiveAnalytics(): Promise<{ insights: PredictiveInsight[]; notice: string }> {
    const res = await fetch('/api/analytics/predictive');
    return res.json();
  },

  async generateAIPrediction(department?: string, horizonYears = 2): Promise<{ forecast: string }> {
    const res = await fetch('/api/analytics/predictive-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department, horizonYears }),
    });
    return res.json();
  },

  // AI Assistant
  async chatAssistant(
    message: string,
    conversationHistory: { role: string; content: string }[],
    documentContext?: string
  ): Promise<string> {
    const res = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory, documentContext }),
    });
    const data = await res.json();
    return data.reply;
  },
};
