import { Router } from 'express';
import { COMPETENCY_CATEGORIES, SKILLS_DATA } from '../../src/data/competencies';
import { JOB_ROLES, DEPARTMENTS } from '../../src/data/jobRoles';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    categories: COMPETENCY_CATEGORIES,
    skills: SKILLS_DATA,
    roles: JOB_ROLES,
    departments: DEPARTMENTS,
  });
});

router.get('/categories', (req, res) => {
  res.json({ success: true, categories: COMPETENCY_CATEGORIES });
});

router.get('/skills', (req, res) => {
  res.json({ success: true, skills: SKILLS_DATA });
});

router.get('/roles', (req, res) => {
  res.json({ success: true, roles: JOB_ROLES, departments: DEPARTMENTS });
});

export default router;
