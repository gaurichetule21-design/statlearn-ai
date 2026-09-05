import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { EmployeeDashboardPage } from './pages/EmployeeDashboardPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningPathPage } from './pages/LearningPathPage';
import { CoursesPage } from './pages/CoursesPage';
import { QuizGeneratorPage } from './pages/QuizGeneratorPage';
import { QuizHistoryPage } from './pages/QuizHistoryPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing & Login */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Application Layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<EmployeeDashboardPage />} />
            <Route path="/profile" element={<ProfileSetupPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/skill-gaps" element={<SkillGapPage />} />
            <Route path="/learning-path" element={<LearningPathPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/quiz-generator" element={<QuizGeneratorPage />} />
            <Route path="/quiz-history" element={<QuizHistoryPage />} />
            <Route path="/assistant" element={<AIAssistantPage />} />
            <Route path="/admin" element={<AdminAnalyticsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
