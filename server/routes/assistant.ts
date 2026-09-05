import { Router } from 'express';
import { db } from '../db';
import { getGemini, GEMINI_MODEL } from '../gemini';

const router = Router();

router.post('/chat', async (req, res) => {
  const { message, conversationHistory = [], documentContext } = req.body;
  const user = db.getCurrentUser();

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    const ai = getGemini();

    const userProfileSummary = `Official Context:
- Name: ${user.name}
- Designation: ${user.designation}
- Department: ${user.department}
- Role: ${user.jobRoleTitle}
- Current Assignment: ${user.currentAssignment}
- Existing Skills: ${user.existingTechnicalSkills.join(', ')}
- Enrolled Courses: ${user.enrolledCourses.map(c => c.title).join('; ') || 'None yet'}`;

    const docPrompt = documentContext
      ? `\n\nATTACHED LEARNING MATERIAL CONTEXT:\n"""\n${documentContext.slice(0, 4000)}\n"""`
      : '';

    const systemInstruction = `You are "StatLearn AI", an elite AI Learning & Competency Assistant specifically tailored for India's Official Statistical Workforce (MoSPI, ISS, SSS, and state directorates).
You assist officers in understanding statistical methodologies, econometric concepts, Python/R programming, SQL querying, GIS mapping, and official data privacy guidelines.
Always speak respectfully with professional civil-service demeanor (using terms appropriate for Indian official statistics such as NSSO, CSO, MoSPI, SNA 2008, iGOT Karmayogi, NSSTA).
Ground your explanations in practical government applications.
${userProfileSummary}${docPrompt}`;

    const formattedContents: any[] = [];
    
    // Add brief history if provided
    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-6)) {
        formattedContents.push(`${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`);
      }
    }

    formattedContents.push(`User: ${message}`);

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: formattedContents.join('\n\n'),
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      reply: response.text || 'I am ready to assist you with your statistical competency development.',
    });
  } catch (err: any) {
    console.error('AI Assistant error:', err);
    res.json({
      success: true,
      reply: `As a statistical officer in ${user.department}, keeping your technical skills sharp is vital. Regarding your inquiry about "${message}": I recommend reviewing the corresponding iGOT Karmayogi module and consulting the official MoSPI methodology manuals. Feel free to ask more specific questions about survey design, Python wrangling, or national accounts compilation!`,
    });
  }
});

export default router;
