import { Router } from 'express';
import { db } from '../db';
import { Recommendation } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  const user = db.getCurrentUser();
  const allCourses = db.getCourses();
  const allSkills = db.getSkills();
  const jobRoles = db.getJobRoles();
  const userRole = jobRoles.find(r => r.id === user.jobRoleId);

  const recommendations: Recommendation[] = [];

  // Match courses against user's skills with gaps
  for (const course of allCourses) {
    // Find corresponding skill
    const skillObj = allSkills.find(s => s.name.toLowerCase() === course.skill.toLowerCase());
    const skillId = skillObj?.id;

    let gap = 0;
    let required = 70;
    let current = 30;

    if (skillId) {
      const userSkill = user.skills[skillId];
      const roleReq = userRole?.requiredSkills.find(rs => rs.skillId === skillId);
      required = roleReq?.requiredLevel ?? skillObj?.benchmarkScore ?? 70;
      current = userSkill?.currentLevel ?? 25;
      gap = Math.max(0, required - current);
    }

    // Determine priority
    let priority: 'High' | 'Medium' | 'Low' = 'Medium';
    if (gap >= 30) {
      priority = 'High';
    } else if (gap >= 15) {
      priority = 'Medium';
    } else if (gap > 0) {
      priority = 'Low';
    } else {
      // If gap is 0, only recommend as refresher if it's advanced or high role priority
      priority = 'Low';
    }

    // Craft contextual reason
    let reason = '';
    if (gap >= 30) {
      reason = `Large ${course.skill} competency gap (${gap} pts) detected for your ${user.designation} role in ${user.department}.`;
    } else if (gap > 0) {
      reason = `Targeted upskilling in ${course.skill} recommended to achieve ${user.jobRoleTitle} benchmark standard (${required}%).`;
    } else {
      reason = `Advanced enrichment programme to deepen domain expertise in ${course.skill} for career progression.`;
    }

    recommendations.push({
      id: `rec_${course.id}`,
      courseId: course.id,
      courseTitle: course.title,
      skill: course.skill,
      level: course.level,
      duration: course.duration,
      source: course.source,
      provider: course.provider,
      priority,
      reason,
      gapSize: gap,
    });
  }

  // Sort by priority and gap size
  const priorityWeight = { High: 3, Medium: 2, Low: 1 };
  recommendations.sort((a, b) => {
    const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (pDiff !== 0) return pDiff;
    return b.gapSize - a.gapSize;
  });

  // Also construct structured Personalized Learning Pathway
  // 01 SQL -> 02 Python -> 03 Data Visualization -> 04 AI/ML
  const pathwaySteps = [
    {
      step: 1,
      skill: 'SQL & Database Architecture',
      code: '01 SQL',
      status: 'Prerequisite for Data Pipelines',
      courseTitle: 'SQL for Statistical Databases & Census Microdata',
      source: 'iGOT Karmayogi',
      duration: '10 hours',
      priority: 'High',
      completed: user.skills['tech_sql']?.currentLevel >= 70,
    },
    {
      step: 2,
      skill: 'Python Automation & Wrangling',
      code: '02 Python',
      status: 'Core Analytical Modernization',
      courseTitle: 'Python for Statistical Analysis & Official Data Wrangling',
      source: 'iGOT Karmayogi',
      duration: '8 hours',
      priority: 'High',
      completed: user.skills['tech_python']?.currentLevel >= 70,
    },
    {
      step: 3,
      skill: 'Data Visualization & Dashboarding',
      code: '03 Data Visualization',
      status: 'Policy Reporting Standard',
      courseTitle: 'Data Visualization & Dashboarding for Government Reports',
      source: 'iGOT Karmayogi',
      duration: '6 hours',
      priority: 'Medium',
      completed: user.skills['tech_data_visualization']?.currentLevel >= 70,
    },
    {
      step: 4,
      skill: 'AI/ML & Machine Learning Models',
      code: '04 AI/ML',
      status: 'Advanced Predictive Capability',
      courseTitle: 'AI/ML Fundamentals for Public Administration & Statistics',
      source: 'iGOT Karmayogi',
      duration: '12 hours',
      priority: 'High',
      completed: user.skills['tech_ai_ml']?.currentLevel >= 60,
    },
    {
      step: 5,
      skill: 'Advanced Domain Masterclass',
      code: '05 Residential Masterclass',
      status: 'Executive Capacity Building',
      courseTitle: 'Advanced Sampling Techniques & NSSO Survey Methodologies',
      source: 'NSSTA / TPAC',
      duration: '24 hours (5-Day Hybrid)',
      priority: 'High',
      completed: user.skills['stat_sampling']?.currentLevel >= 85,
    },
  ];

  res.json({
    success: true,
    recommendations,
    pathway: pathwaySteps,
    counts: {
      total: recommendations.length,
      igot: recommendations.filter(r => r.source === 'iGOT Karmayogi').length,
      nssta: recommendations.filter(r => r.source === 'NSSTA / TPAC').length,
    },
  });
});

export default router;
