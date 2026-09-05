import { Router } from 'express';
import { db } from '../db';
import { getGemini, GEMINI_MODEL } from '../gemini';
import { COMPETENCY_CATEGORIES } from '../../src/data/competencies';
import { GapClassification } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  const user = db.getCurrentUser();
  const criticalThreshold = parseInt(req.query.criticalThreshold as string) || 25;
  const moderateThreshold = parseInt(req.query.moderateThreshold as string) || 0;

  const allSkills = db.getSkills();
  const jobRoles = db.getJobRoles();
  const userRole = jobRoles.find(r => r.id === user.jobRoleId);

  const calculatedSkills = allSkills.map(skill => {
    const userSkill = user.skills[skill.id];
    const roleReq = userRole?.requiredSkills.find(rs => rs.skillId === skill.id);

    const requiredLevel = roleReq ? roleReq.requiredLevel : skill.benchmarkScore;
    const currentLevel = userSkill ? userSkill.currentLevel : 20;
    const gap = Math.max(0, requiredLevel - currentLevel);
    const priority = roleReq ? roleReq.priority : (gap > 20 ? 'High' : 'Medium');

    let classification: GapClassification = 'Strong Competency';
    if (gap > criticalThreshold) {
      classification = 'Critical Gap';
    } else if (gap > moderateThreshold) {
      classification = 'Moderate Gap';
    }

    return {
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      currentLevel,
      requiredLevel,
      gap,
      priority,
      classification,
      isRoleRequired: !!roleReq,
    };
  });

  // Filter into categories
  const criticalGaps = calculatedSkills.filter(s => s.classification === 'Critical Gap');
  const moderateGaps = calculatedSkills.filter(s => s.classification === 'Moderate Gap');
  const strongCompetencies = calculatedSkills.filter(s => s.classification === 'Strong Competency');

  // Sorted priority areas (highest gap and high priority first)
  const priorityAreas = [...calculatedSkills]
    .filter(s => s.gap > 0)
    .sort((a, b) => {
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (b.priority === 'High' && a.priority !== 'High') return 1;
      return b.gap - a.gap;
    })
    .slice(0, 5);

  // Radar chart data grouped by major competencies
  const radarChartData = [
    {
      subject: 'Statistics',
      current: Math.round(
        calculatedSkills.filter(s => s.category === 'Statistical Competencies').reduce((a, b) => a + b.currentLevel, 0) / 10
      ),
      required: Math.round(
        calculatedSkills.filter(s => s.category === 'Statistical Competencies').reduce((a, b) => a + b.requiredLevel, 0) / 10
      ),
      fullMark: 100,
    },
    {
      subject: 'Python / Code',
      current: calculatedSkills.find(s => s.skillId === 'tech_python')?.currentLevel || 30,
      required: calculatedSkills.find(s => s.skillId === 'tech_python')?.requiredLevel || 70,
      fullMark: 100,
    },
    {
      subject: 'SQL / DB',
      current: calculatedSkills.find(s => s.skillId === 'tech_sql')?.currentLevel || 60,
      required: calculatedSkills.find(s => s.skillId === 'tech_sql')?.requiredLevel || 75,
      fullMark: 100,
    },
    {
      subject: 'AI/ML',
      current: calculatedSkills.find(s => s.skillId === 'tech_ai_ml')?.currentLevel || 20,
      required: calculatedSkills.find(s => s.skillId === 'tech_ai_ml')?.requiredLevel || 60,
      fullMark: 100,
    },
    {
      subject: 'Data Viz',
      current: calculatedSkills.find(s => s.skillId === 'tech_data_visualization')?.currentLevel || 45,
      required: calculatedSkills.find(s => s.skillId === 'tech_data_visualization')?.requiredLevel || 70,
      fullMark: 100,
    },
    {
      subject: 'GIS',
      current: calculatedSkills.find(s => s.skillId === 'tech_gis')?.currentLevel || 25,
      required: calculatedSkills.find(s => s.skillId === 'tech_gis')?.requiredLevel || 60,
      fullMark: 100,
    },
    {
      subject: 'Digital Gov',
      current: Math.round(
        calculatedSkills.filter(s => s.category === 'Digital Governance').reduce((a, b) => a + b.currentLevel, 0) / 5
      ),
      required: Math.round(
        calculatedSkills.filter(s => s.category === 'Digital Governance').reduce((a, b) => a + b.requiredLevel, 0) / 5
      ),
      fullMark: 100,
    },
    {
      subject: 'Management',
      current: Math.round(
        calculatedSkills.filter(s => s.category === 'Behavioural & Managerial Competencies').reduce((a, b) => a + b.currentLevel, 0) / 6
      ),
      required: Math.round(
        calculatedSkills.filter(s => s.category === 'Behavioural & Managerial Competencies').reduce((a, b) => a + b.requiredLevel, 0) / 6
      ),
      fullMark: 100,
    },
  ];

  // Category summary
  const categoryBreakdown = COMPETENCY_CATEGORIES.map(category => {
    const skillsInCategory = calculatedSkills.filter(s => s.category === category);
    const avgCurrent = Math.round(skillsInCategory.reduce((a, b) => a + b.currentLevel, 0) / (skillsInCategory.length || 1));
    const avgRequired = Math.round(skillsInCategory.reduce((a, b) => a + b.requiredLevel, 0) / (skillsInCategory.length || 1));
    const avgGap = Math.max(0, avgRequired - avgCurrent);

    return {
      category,
      avgCurrent,
      avgRequired,
      avgGap,
      skillsCount: skillsInCategory.length,
      criticalCount: skillsInCategory.filter(s => s.classification === 'Critical Gap').length,
      moderateCount: skillsInCategory.filter(s => s.classification === 'Moderate Gap').length,
      strongCount: skillsInCategory.filter(s => s.classification === 'Strong Competency').length,
    };
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      designation: user.designation,
      department: user.department,
      jobRoleTitle: user.jobRoleTitle,
      overallCompetency: user.overallCompetency,
    },
    thresholds: {
      criticalThreshold,
      moderateThreshold,
    },
    skills: calculatedSkills,
    criticalGaps,
    moderateGaps,
    strongCompetencies,
    priorityAreas,
    radarChartData,
    categoryBreakdown,
  });
});

router.post('/ai-explain', async (req, res) => {
  const { skillName, currentLevel, requiredLevel, gap } = req.body;
  const user = db.getCurrentUser();

  try {
    const ai = getGemini();
    const prompt = `You are the AI Skill Intelligence Advisor for the Ministry of Statistics and Programme Implementation (MoSPI), India.
Analyze the following skill gap for an officer:
Officer Name: ${user.name}
Designation: ${user.designation}
Department: ${user.department}
Current Assignment: ${user.currentAssignment}

Skill: ${skillName}
Current Assessed Level: ${currentLevel}/100
Required Role Benchmark: ${requiredLevel}/100
Calculated Competency Gap: ${gap} points

Provide a concise, professional, 3-paragraph explanation:
1. Why this skill is critical to the officer's specific role in India's official statistical system.
2. The operational risk or bottleneck caused by this competency gap (e.g. data processing delays, manual calculation errors, reliance on outdated tools).
3. Recommended actionable roadmap (specifically citing relevant iGOT Karmayogi online modules or NSSTA residential programmes).`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.json({
      success: true,
      explanation: response.text || 'Skill gap analysis generated successfully.',
    });
  } catch (error: any) {
    console.error('AI Explain error:', error);
    res.json({
      success: true,
      explanation: `For an officer serving as ${user.designation} in ${user.department}, mastering ${skillName} is essential to modernize data workflows and reduce dependency on legacy manual tabulation. The current gap of ${gap} points indicates an immediate need for structured capacity building through iGOT Karmayogi and NSSTA practical workshops to align with national digital statistical standards.`,
    });
  }
});

export default router;
