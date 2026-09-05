import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/auth';
import competenciesRoutes from './server/routes/competencies';
import skillGapsRoutes from './server/routes/skillGaps';
import recommendationsRoutes from './server/routes/recommendations';
import coursesRoutes from './server/routes/courses';
import assessmentRoutes from './server/routes/assessments';
import quizRoutes from './server/routes/quizzes';
import analyticsRoutes from './server/routes/analytics';
import assistantRoutes from './server/routes/assistant';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with generous limit for document/PDF uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'StatLearn AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/competencies', competenciesRoutes);
app.use('/api/skill-gaps', skillGapsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/assistant', assistantRoutes);

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StatLearn AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
