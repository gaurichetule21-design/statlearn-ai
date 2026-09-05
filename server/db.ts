import {
  UserProfile,
  Skill,
  JobRole,
  Course,
  AssessmentResult,
  QuizAttempt,
  PredictiveInsight,
  GapClassification,
} from '../src/types';
import { SKILLS_DATA } from '../src/data/competencies';
import { JOB_ROLES } from '../src/data/jobRoles';
import { COURSES_CATALOG } from '../src/data/courses';
import { DEMO_USERS } from '../src/data/demoUsers';

class DatabaseService {
  private users: Map<string, UserProfile> = new Map();
  private skills: Map<string, Skill> = new Map();
  private jobRoles: Map<string, JobRole> = new Map();
  private courses: Map<string, Course> = new Map();
  private currentUserId = 'user_rajesh_sharma';

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed skills
    for (const s of SKILLS_DATA) {
      this.skills.set(s.id, s);
    }

    // Seed job roles
    for (const r of JOB_ROLES) {
      this.jobRoles.set(r.id, r);
    }

    // Seed courses
    for (const c of COURSES_CATALOG) {
      this.courses.set(c.id, c);
    }

    // Seed users
    for (const u of DEMO_USERS) {
      this.users.set(u.id, JSON.parse(JSON.stringify(u)));
    }
  }

  public getUsers(): UserProfile[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): UserProfile | null {
    return this.users.get(id) || null;
  }

  public getCurrentUserId(): string {
    return this.currentUserId;
  }

  public setCurrentUserId(id: string): boolean {
    if (this.users.has(id)) {
      this.currentUserId = id;
      return true;
    }
    return false;
  }

  public getCurrentUser(): UserProfile {
    let user = this.users.get(this.currentUserId);
    if (!user) {
      user = this.users.get('user_rajesh_sharma') || Array.from(this.users.values())[0];
      this.currentUserId = user.id;
    }
    return user;
  }

  public updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const updated = {
      ...user,
      ...updates,
      skills: updates.skills ? { ...user.skills, ...updates.skills } : user.skills,
    };

    // If job role changed, recompute required levels
    if (updates.jobRoleId && updates.jobRoleId !== user.jobRoleId) {
      const role = this.jobRoles.get(updates.jobRoleId);
      if (role) {
        updated.jobRoleTitle = role.title;
        updated.department = role.department;
        for (const req of role.requiredSkills) {
          const current = updated.skills[req.skillId]?.currentLevel ?? 20;
          const gap = Math.max(0, req.requiredLevel - current);
          let classification: GapClassification = 'Strong Competency';
          if (gap > 25) classification = 'Critical Gap';
          else if (gap > 0) classification = 'Moderate Gap';

          const skillObj = this.skills.get(req.skillId);
          updated.skills[req.skillId] = {
            skillId: req.skillId,
            skillName: skillObj ? skillObj.name : req.skillId,
            category: skillObj ? skillObj.category : 'Technical Competencies',
            currentLevel: current,
            requiredLevel: req.requiredLevel,
            gap,
            priority: req.priority,
            classification,
          };
        }
      }
    }

    // Recalculate overall competency
    const skillList = Object.values(updated.skills);
    if (skillList.length > 0) {
      const sum = skillList.reduce((acc, s) => acc + s.currentLevel, 0);
      updated.overallCompetency = Math.round(sum / skillList.length);
    }

    this.users.set(userId, updated);
    return updated;
  }

  public updateUserSkill(userId: string, skillId: string, newLevel: number): UserProfile | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const skill = this.skills.get(skillId);
    if (!skill) return null;

    const existing = user.skills[skillId];
    const requiredLevel = existing?.requiredLevel ?? skill.benchmarkScore;
    const gap = Math.max(0, requiredLevel - newLevel);
    let classification: GapClassification = 'Strong Competency';
    if (gap > 25) classification = 'Critical Gap';
    else if (gap > 0) classification = 'Moderate Gap';

    user.skills[skillId] = {
      skillId,
      skillName: skill.name,
      category: skill.category,
      currentLevel: newLevel,
      requiredLevel,
      gap,
      priority: existing?.priority ?? 'Medium',
      classification,
      lastAssessed: new Date().toISOString().split('T')[0],
    };

    // Recompute overall competency
    const skillsArr = Object.values(user.skills);
    if (skillsArr.length > 0) {
      user.overallCompetency = Math.round(
        skillsArr.reduce((sum, s) => sum + s.currentLevel, 0) / skillsArr.length
      );
    }

    this.users.set(userId, user);
    return user;
  }

  public getSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  public getJobRoles(): JobRole[] {
    return Array.from(this.jobRoles.values());
  }

  public getCourses(): Course[] {
    return Array.from(this.courses.values());
  }

  public enrollCourse(userId: string, courseId: string) {
    const user = this.users.get(userId);
    const course = this.courses.get(courseId);
    if (!user || !course) return null;

    const existingIndex = user.enrolledCourses.findIndex(c => c.courseId === courseId);
    if (existingIndex >= 0) {
      return user.enrolledCourses[existingIndex];
    }

    const newEnrollment = {
      courseId: course.id,
      title: course.title,
      provider: course.source,
      skill: course.skill,
      level: course.level,
      duration: course.duration,
      progress: 0,
      status: 'Not Started' as const,
      enrolledAt: new Date().toISOString().split('T')[0],
    };

    user.enrolledCourses.unshift(newEnrollment);
    this.users.set(userId, user);
    return newEnrollment;
  }

  public updateCourseProgress(userId: string, courseId: string, progress: number) {
    const user = this.users.get(userId);
    if (!user) return null;

    const course = user.enrolledCourses.find(c => c.courseId === courseId);
    if (!course) return null;

    course.progress = Math.min(100, Math.max(0, progress));
    if (course.progress === 100) {
      course.status = 'Completed';
      course.completedAt = new Date().toISOString().split('T')[0];

      // Automatically improve the skill score by 15 points!
      const targetSkill = Array.from(this.skills.values()).find(
        s => s.name.toLowerCase() === course.skill.toLowerCase()
      );
      if (targetSkill) {
        const currentScore = user.skills[targetSkill.id]?.currentLevel ?? 30;
        this.updateUserSkill(userId, targetSkill.id, Math.min(95, currentScore + 15));
      }
    } else if (course.progress > 0) {
      course.status = 'In Progress';
    }

    this.users.set(userId, user);
    return course;
  }

  public saveAssessmentResult(userId: string, result: AssessmentResult) {
    const user = this.users.get(userId);
    if (!user) return null;

    user.assessmentHistory.unshift(result);
    // Apply evaluated skills updates
    for (const ev of result.evaluatedSkills) {
      this.updateUserSkill(userId, ev.skillId, ev.newLevel);
    }
    this.users.set(userId, user);
    return user;
  }

  public saveQuizAttempt(userId: string, attempt: QuizAttempt) {
    const user = this.users.get(userId);
    if (!user) return null;

    user.quizHistory.unshift(attempt);
    this.users.set(userId, user);
    return user;
  }

  public getPredictiveInsights(): PredictiveInsight[] {
    return [
      {
        id: 'pred_aiml',
        skill: 'AI/ML & Automated Data Validation',
        predictedDemandChange: '+42% demand increase over next 24 months',
        trend: 'increasing',
        reasoning: 'MoSPI modernization initiatives for auto-coding National Industrial Classifications (NIC) and machine learning anomaly detection in monthly surveys require advanced ML competencies.',
        recommendedAction: 'Prioritize AI/ML foundational and applied training for 126 officials in NAD and FOD.',
        impactedOfficialsCount: 126,
        priorityDepartments: ['National Accounts Division (NAD)', 'Field Operations Division (FOD)'],
      },
      {
        id: 'pred_python',
        skill: 'Python for Survey Data Pipelines',
        predictedDemandChange: '+38% workforce transition needed',
        trend: 'increasing',
        reasoning: 'Gradual phase-out of legacy proprietary tools in favor of open-source reproducible analytical pipelines (RAP) across all regional statistics offices.',
        recommendedAction: 'Mandate iGOT Python for Statistical Analysis certification for all Junior Statistical Officers (JSOs).',
        impactedOfficialsCount: 310,
        priorityDepartments: ['Survey Design and Research Division (SDRD)', 'Price Statistics Division (PSD)'],
      },
      {
        id: 'pred_gis',
        skill: 'GIS & Geospatial Statistical Mapping',
        predictedDemandChange: '+28% demand increase',
        trend: 'emerging',
        reasoning: 'Integration of Urban Frame Survey (UFS) digital block boundaries with satellite imagery requires field officers to interpret geospatial datasets.',
        recommendedAction: 'Schedule 3 residential hybrid workshops at NSSTA Greater Noida for 85 Field Supervisory Officers.',
        impactedOfficialsCount: 85,
        priorityDepartments: ['Field Operations Division (FOD)', 'Coordination and Publication Division (CAP)'],
      },
      {
        id: 'pred_dpdp',
        skill: 'Data Privacy & DPDP Act 2023 Compliance',
        predictedDemandChange: 'Statutory compliance mandatory for 100% of staff',
        trend: 'increasing',
        reasoning: 'Enactment of the Digital Personal Data Protection Act requires rigorous anonymization, audit logs, and confidential handling of microdata.',
        recommendedAction: 'Conduct department-wide awareness module on iGOT Karmayogi by end of Q2.',
        impactedOfficialsCount: 2450,
        priorityDepartments: ['All Statistical Divisions'],
      },
    ];
  }

  public getAdminKPIs() {
    const allUsers = this.getUsers();
    const employees = allUsers.filter(u => u.role === 'employee');
    
    // Total officials across the Indian Official Statistical System represented in platform
    const totalOfficialsCount = 2450; 
    const sampledCount = employees.length;

    const avgCompetency = Math.round(
      employees.reduce((acc, u) => acc + (u.overallCompetency || 65), 0) / (sampledCount || 1)
    );

    // Count critical skill gaps
    let criticalGapsCount = 0;
    let moderateGapsCount = 0;
    for (const u of employees) {
      for (const s of Object.values(u.skills)) {
        if (s.classification === 'Critical Gap') criticalGapsCount++;
        else if (s.classification === 'Moderate Gap') moderateGapsCount++;
      }
    }

    // Extrapolated critical gaps across full workforce
    const scaledCriticalGaps = Math.round((criticalGapsCount / (sampledCount || 1)) * 45) + 280;

    return {
      totalOfficials: totalOfficialsCount,
      activeLearnersInSystem: 1780,
      averageCompetency: avgCompetency,
      criticalSkillGaps: scaledCriticalGaps,
      trainingCompletionRate: 72,
      departmentStats: [
        { name: 'NAD', fullName: 'National Accounts Division', avgCompetency: 76, officials: 380, criticalGaps: 42 },
        { name: 'SDRD', fullName: 'Survey Design & Research Division', avgCompetency: 72, officials: 420, criticalGaps: 68 },
        { name: 'FOD', fullName: 'Field Operations Division', avgCompetency: 61, officials: 890, criticalGaps: 135 },
        { name: 'PSD', fullName: 'Price Statistics Division', avgCompetency: 70, officials: 290, criticalGaps: 38 },
        { name: 'ESD', fullName: 'Economic Statistics Division', avgCompetency: 68, officials: 310, criticalGaps: 44 },
        { name: 'DIID', fullName: 'Data Informatics & Innovation', avgCompetency: 81, officials: 160, criticalGaps: 12 },
      ],
      skillDistribution: [
        { skill: 'Statistics', avgLevel: 85, benchmark: 80, gapStatus: 'Strong' },
        { skill: 'SQL', avgLevel: 62, benchmark: 75, gapStatus: 'Moderate' },
        { skill: 'Data Viz', avgLevel: 55, benchmark: 70, gapStatus: 'Moderate' },
        { skill: 'Python', avgLevel: 36, benchmark: 70, gapStatus: 'Critical' },
        { skill: 'GIS', avgLevel: 32, benchmark: 60, gapStatus: 'Critical' },
        { skill: 'AI/ML', avgLevel: 28, benchmark: 60, gapStatus: 'Critical' },
        { skill: 'Cybersecurity', avgLevel: 58, benchmark: 65, gapStatus: 'Moderate' },
      ],
      emergingSkillsGrowth: [
        { skill: 'AI/ML', growth: 35, currentReadiness: 28 },
        { skill: 'Cloud Computing', growth: 28, currentReadiness: 45 },
        { skill: 'Data Science & Python', growth: 42, currentReadiness: 36 },
        { skill: 'GIS Spatial Mapping', growth: 18, currentReadiness: 32 },
        { skill: 'Cybersecurity & DPDP', growth: 31, currentReadiness: 58 },
      ],
    };
  }
}

export const db = new DatabaseService();
