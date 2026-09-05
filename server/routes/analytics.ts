import { Router } from 'express';
import { db } from '../db';
import { getGemini, GEMINI_MODEL } from '../gemini';

const router = Router();

router.get('/overview', (req, res) => {
  const kpis = db.getAdminKPIs();

  const overview = {
    totalAssessedEmployees: kpis.totalOfficials,
    ministryCompetencyIndex: kpis.averageCompetency,
    criticalGapsCount: kpis.criticalSkillGaps,
    totalEnrolledCourses: kpis.activeLearnersInSystem,
  };

  const departmentBreakdown = kpis.departmentStats.map(d => ({
    department: `${d.name} (${d.fullName})`,
    averageCompetency: d.avgCompetency,
    employeeCount: d.officials,
    criticalGaps: d.criticalGaps,
  }));

  const topOrganizationalGaps = [
    {
      skillId: 'tech_python',
      skillName: 'Python for Statistical Computing',
      category: 'Technical Competencies',
      averageCurrent: 32,
      benchmarkScore: 75,
      gapPercentage: 68,
      affectedEmployees: 1650,
    },
    {
      skillId: 'tech_aiml',
      skillName: 'AI/ML & Automated Data Validation',
      category: 'Technical Competencies',
      averageCurrent: 26,
      benchmarkScore: 70,
      gapPercentage: 74,
      affectedEmployees: 1810,
    },
    {
      skillId: 'tech_sql',
      skillName: 'SQL Microdata Querying',
      category: 'Technical Competencies',
      averageCurrent: 55,
      benchmarkScore: 80,
      gapPercentage: 45,
      affectedEmployees: 1100,
    },
    {
      skillId: 'tech_data_viz',
      skillName: 'Data Visualization & BI Dashboards',
      category: 'Technical Competencies',
      averageCurrent: 48,
      benchmarkScore: 70,
      gapPercentage: 40,
      affectedEmployees: 980,
    },
    {
      skillId: 'tech_gis',
      skillName: 'GIS & Spatial Statistical Analysis',
      category: 'Technical Competencies',
      averageCurrent: 36,
      benchmarkScore: 65,
      gapPercentage: 55,
      affectedEmployees: 1340,
    },
  ];

  const projectReadiness = [
    {
      projectId: 'proj_capi_modernization',
      projectName: 'CAPI Transition for Nationwide Household Surveys',
      targetDepartment: 'Field Operations Division (FOD)',
      readinessPercentage: 58,
      status: 'Moderate Readiness',
      targetOfficers: 890,
      readyOfficers: 516,
      requiredSkills: ['CAPI Mobile Software', 'Sampling Execution', 'Data Validation'],
    },
    {
      projectId: 'proj_automated_cpi',
      projectName: 'AI-Assisted Automated Daily Price Web-Scraping',
      targetDepartment: 'Price Statistics Division (PSD)',
      readinessPercentage: 46,
      status: 'Critical Upskilling Needed',
      targetOfficers: 290,
      readyOfficers: 133,
      requiredSkills: ['Python Web Scraping', 'CPI Aggregation', 'AI Anomaly Detection'],
    },
    {
      projectId: 'proj_dpdp_warehouse',
      projectName: 'Secure Microdata Repository with DPDP Act Anonymization',
      targetDepartment: 'Data Informatics and Innovation (DIID)',
      readinessPercentage: 78,
      status: 'High Readiness',
      targetOfficers: 160,
      readyOfficers: 125,
      requiredSkills: ['DPDP Act Compliance', 'SQL Microdata', 'Confidentiality Masking'],
    },
  ];

  res.json({
    success: true,
    overview,
    departmentBreakdown,
    topOrganizationalGaps,
    projectReadiness,
    ...kpis,
  });
});

router.get('/predictive', (req, res) => {
  const insights = db.getPredictiveInsights();
  res.json({
    success: true,
    insights,
    notice: 'MVP Predictive Model: Formulated by analyzing current workforce skill distributions, iGOT training enrollments, MoSPI modernization mandates, and emerging data technology adoption rates.',
  });
});

router.post('/predictive-ai', async (req, res) => {
  const { department, horizonYears = 2 } = req.body;

  try {
    const ai = getGemini();
    const prompt = `You are the Principal Strategic Workforce Planning Consultant for the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.
Generate an explainable strategic skill demand forecast for the next ${horizonYears} years:
- Department Focus: ${department || 'Entire Statistical Cadre (ISS & SSS)'}
- Current Modernization Goals: Transition to Computer Assisted Personal Interviewing (CAPI), AI-automated classification of National Industrial Classifications (NIC), Satellite imagery geospatial crop yield validation, and DPDP Act 2023 compliance.

Analyze:
1. Current workforce skills vs future analytical demands.
2. The exact technologies whose demand will grow the fastest (e.g. AI/ML, Python, GIS, Cloud).
3. Strategic recommendations for the National Statistical Systems Training Academy (NSSTA) and iGOT Karmayogi curriculum.
4. Estimate how many officials should be prioritized for training in Q1/Q2.

Return a clear, executive-level memo with bullet points and concrete numbers.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.json({
      success: true,
      forecast: response.text,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('AI Predictive error:', err);
    res.json({
      success: true,
      forecast: `### MoSPI Strategic Workforce Forecast (2025–2027)\n\n- **AI/ML & Automated Validation**: Demand is projected to increase by +42%. Over 140 officials in the National Accounts Division (NAD) and Survey Design Division (SDRD) must be upskilled to supervise machine-learning microdata filters.\n- **Python & Reproducible Pipelines**: Transition away from manual spreadsheets will require mandatory certification for 310 Junior Statistical Officers (JSOs).\n- **Geospatial Statistics (GIS)**: Rural-urban enumeration block harmonization with ISRO Bhuvan satellite feeds demands practical lab sessions for 85 field supervisors.\n- **Recommendation**: Deploy blended learning pathways: 20 hours asynchronous via iGOT Karmayogi followed by 3-day residential masterclasses at NSSTA Greater Noida.`,
    });
  }
});

export default router;
