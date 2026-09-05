import { Router } from 'express';
import { db } from '../db';
import { getGemini, GEMINI_MODEL } from '../gemini';
import { Question, AssessmentResult } from '../../src/types';
import { Type } from '@google/genai';

const router = Router();

// Fallback question bank for official statistical competencies
const DEFAULT_ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 'q_stat_1',
    question: 'In large-scale sample surveys conducted by the National Sample Survey Office (NSSO), what is the first-stage unit (FSU) in the rural sector?',
    options: [
      'Census Village (or Panchayat Ward in Kerala)',
      'Hamlet-group',
      'Ultimate Household',
      'Individual Respondent',
    ],
    correctAnswer: 'Census Village (or Panchayat Ward in Kerala)',
    explanation: 'In NSS socio-economic rounds, the rural sample design utilizes 2011 Census villages (or Panchayat wards in Kerala) as the First-Stage Units (FSUs).',
    difficulty: 'Medium',
    topic: 'Sampling',
    category: 'Statistical Competencies',
    skillId: 'stat_sampling',
  },
  {
    id: 'q_tech_1',
    question: 'Which Python library is standard for high-performance tabular data manipulation, filtering, and aggregation in statistical workflows?',
    options: ['Pandas', 'Flask', 'Django', 'Tkinter'],
    correctAnswer: 'Pandas',
    explanation: 'Pandas is the defacto Python library providing DataFrame structures and optimized routines for manipulating structured data tables.',
    difficulty: 'Easy',
    topic: 'Python',
    category: 'Technical Competencies',
    skillId: 'tech_python',
  },
  {
    id: 'q_stat_2',
    question: 'Under the System of National Accounts (SNA 2008), what is the relationship between GDP at market prices and Gross Value Added (GVA) at basic prices?',
    options: [
      'GDP = GVA at basic prices + Product Taxes - Product Subsidies',
      'GDP = GVA at basic prices - Product Taxes + Product Subsidies',
      'GDP = GVA at factor cost + Net Capital Inflows',
      'GDP = GVA at market prices - Intermediate Consumption',
    ],
    correctAnswer: 'GDP = GVA at basic prices + Product Taxes - Product Subsidies',
    explanation: 'By standard SNA 2008 accounting identity: GDP at market prices equals Gross Value Added (GVA) at basic prices plus net product taxes (taxes less subsidies).',
    difficulty: 'Medium',
    topic: 'National Accounts',
    category: 'Statistical Competencies',
    skillId: 'stat_national_accounts',
  },
  {
    id: 'q_tech_2',
    question: 'Which SQL clause is used with aggregate functions to filter groups based on a condition rather than individual rows?',
    options: ['HAVING', 'WHERE', 'ORDER BY', 'GROUP BY'],
    correctAnswer: 'HAVING',
    explanation: 'The HAVING clause filters aggregated groups resulting from GROUP BY, whereas the WHERE clause filters individual rows prior to aggregation.',
    difficulty: 'Easy',
    topic: 'SQL',
    category: 'Technical Competencies',
    skillId: 'tech_sql',
  },
  {
    id: 'q_stat_3',
    question: 'Which index formula forms the foundation of the Consumer Price Index (CPI) compiled by MoSPI for measuring price inflation against a fixed base period?',
    options: ['Laspeyres Formula', 'Paasche Formula', 'Fisher Ideal Index', 'Marshall-Edgeworth Index'],
    correctAnswer: 'Laspeyres Formula',
    explanation: 'The All-India Consumer Price Index uses a base-weighted Laspeyres index methodology to measure cost of living changes of a fixed consumer basket.',
    difficulty: 'Medium',
    topic: 'Price Statistics',
    category: 'Statistical Competencies',
    skillId: 'stat_price_statistics',
  },
  {
    id: 'q_tech_3',
    question: 'In Machine Learning applications for official statistics, which technique is appropriate for grouping survey respondents with similar consumption profiles without prior labels?',
    options: [
      'Unsupervised Clustering (e.g., K-Means / Hierarchical)',
      'Linear Regression',
      'Binary Logistic Regression',
      'Convolutional Neural Network',
    ],
    correctAnswer: 'Unsupervised Clustering (e.g., K-Means / Hierarchical)',
    explanation: 'Unsupervised clustering identifies latent patterns and segments within unlabelled survey data based on distance metrics.',
    difficulty: 'Medium',
    topic: 'AI/ML',
    category: 'Technical Competencies',
    skillId: 'tech_ai_ml',
  },
  {
    id: 'q_gov_1',
    question: 'Under the Digital Personal Data Protection (DPDP) Act 2023, what obligation applies to statistical bodies handling identifiable personal information?',
    options: [
      'Anonymization and de-identification before public dissemination',
      'Selling microdata to third-party commercial brokers',
      'Retaining unencrypted identifiable records indefinitely without audit',
      'Waiving all security safeguards for rapid reporting',
    ],
    correctAnswer: 'Anonymization and de-identification before public dissemination',
    explanation: 'DPDP Act mandates strong privacy safeguards and data minimization; statistical releases must strictly strip personal identifiers.',
    difficulty: 'Easy',
    topic: 'Data Privacy',
    category: 'Digital Governance',
    skillId: 'gov_data_privacy',
  },
  {
    id: 'q_tech_4',
    question: 'In GIS software such as QGIS, what is the purpose of creating a spatial "buffer" around a sample enumeration cluster?',
    options: [
      'To define a zone of specified distance around the geographic feature to identify contiguous survey zones',
      'To compress vector files into raster rasters',
      'To calculate the standard deviation of census variables',
      'To export the layer into SQL table without geometry',
    ],
    correctAnswer: 'To define a zone of specified distance around the geographic feature to identify contiguous survey zones',
    explanation: 'A GIS buffer creates a geometric proximity boundary around a point, line, or polygon at a defined distance threshold.',
    difficulty: 'Medium',
    topic: 'GIS',
    category: 'Technical Competencies',
    skillId: 'tech_gis',
  },
];

router.get('/questions', async (req, res) => {
  const user = db.getCurrentUser();
  const count = parseInt(req.query.count as string) || 8;

  try {
    const ai = getGemini();
    const prompt = `You are the Lead Assessment Examiner for India's National Statistical Systems Training Academy (NSSTA), MoSPI.
Create an adaptive competency assessment with exactly ${count} multiple choice questions tailored to this official:
- Official Designation: ${user.designation}
- Department: ${user.department}
- Job Role: ${user.jobRoleTitle}
- Current Assignment: ${user.currentAssignment}

The questions must cover:
1. Core Statistical Competencies (Sampling, Survey Design, National Accounts, Price Statistics)
2. Technical Competencies (Python, SQL, AI/ML, GIS, Data Visualization)
3. Digital Governance (DPDP Act, Data Privacy)

Each question must be challenging, technically accurate according to Indian official statistical standards (MoSPI / NSSO / SNA 2008 / DPDP 2023), with 4 plausible options, exactly one unambiguous correct answer, and an educational explanation.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
              topic: { type: Type.STRING },
              category: { type: Type.STRING },
              skillId: { type: Type.STRING },
            },
            required: ['question', 'options', 'correctAnswer', 'explanation', 'difficulty', 'topic'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length >= 4) {
      // Ensure IDs and map skillIds
      const questionsWithIds = parsed.map((q: any, idx: number) => ({
        id: q.id || `gen_q_${Date.now()}_${idx}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty || 'Medium',
        topic: q.topic || 'Official Statistics',
        category: q.category || 'Statistical Competencies',
        skillId: q.skillId || 'tech_python',
      }));
      return res.json({ success: true, questions: questionsWithIds, source: 'ai_generated' });
    }
  } catch (err) {
    console.warn('Gemini assessment generation fallback:', err);
  }

  // Use high-quality default question bank
  res.json({
    success: true,
    questions: DEFAULT_ASSESSMENT_QUESTIONS.slice(0, count),
    source: 'standard_bank',
  });
});

router.post('/submit', (req, res) => {
  const { answers, questions } = req.body;
  const user = db.getCurrentUser();

  if (!answers || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ success: false, message: 'Invalid submission data' });
  }

  let totalScore = 0;
  const topicStats: Record<string, { correct: number; total: number; percentage: number }> = {};
  const skillPerformance: Record<string, { correct: number; total: number }> = {};

  const evaluatedQuestions = questions.map((q: Question) => {
    const selected = answers[q.id];
    const isCorrect = selected?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    if (isCorrect) totalScore++;

    const topic = q.topic || 'General';
    if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0, percentage: 0 };
    topicStats[topic].total++;
    if (isCorrect) topicStats[topic].correct++;

    const skillId = q.skillId;
    if (skillId) {
      if (!skillPerformance[skillId]) skillPerformance[skillId] = { correct: 0, total: 0 };
      skillPerformance[skillId].total++;
      if (isCorrect) skillPerformance[skillId].correct++;
    }

    return {
      questionId: q.id,
      question: q.question,
      selectedOption: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      topic,
    };
  });

  for (const topic in topicStats) {
    const t = topicStats[topic];
    t.percentage = Math.round((t.correct / t.total) * 100);
  }

  const percentage = Math.round((totalScore / questions.length) * 100);

  // Calculate updated competency levels for evaluated skills
  const evaluatedSkills: { skillId: string; newLevel: number; oldLevel: number }[] = [];

  for (const skillId in skillPerformance) {
    const sp = skillPerformance[skillId];
    const userCurrent = user.skills[skillId]?.currentLevel ?? 30;
    const testScore = Math.round((sp.correct / sp.total) * 100);
    
    // Weighted blend: 60% historical/benchmark + 40% current test outcome
    const newLevel = Math.round(userCurrent * 0.6 + testScore * 0.4);
    evaluatedSkills.push({
      skillId,
      oldLevel: userCurrent,
      newLevel,
    });
  }

  const assessmentResult: AssessmentResult = {
    id: `asmt_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    totalQuestions: questions.length,
    score: totalScore,
    percentage,
    topicBreakdown: topicStats,
    evaluatedSkills,
  };

  db.saveAssessmentResult(user.id, assessmentResult);

  res.json({
    success: true,
    result: assessmentResult,
    evaluatedQuestions,
    user: db.getCurrentUser(),
    message: `Assessment submitted successfully. Score: ${totalScore}/${questions.length} (${percentage}%). Competencies updated!`,
  });
});

export default router;
