import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (req, res) => {
  const courses = db.getCourses();
  const user = db.getCurrentUser();

  const enriched = courses.map(course => {
    const enrollment = user.enrolledCourses.find(ec => ec.courseId === course.id);
    return {
      ...course,
      isEnrolled: !!enrollment,
      progress: enrollment?.progress ?? 0,
      status: enrollment?.status ?? 'Not Enrolled',
    };
  });

  res.json({ success: true, courses: enriched });
});

router.post('/enroll', (req, res) => {
  const { courseId } = req.body;
  const user = db.getCurrentUser();
  if (!courseId) {
    return res.status(400).json({ success: false, message: 'courseId is required' });
  }

  const enrollment = db.enrollCourse(user.id, courseId);
  if (!enrollment) {
    return res.status(404).json({ success: false, message: 'Course or user not found' });
  }

  res.json({ success: true, enrollment, message: 'Enrolled successfully' });
});

router.post('/progress', (req, res) => {
  const { courseId, progress } = req.body;
  const user = db.getCurrentUser();
  if (!courseId || progress === undefined) {
    return res.status(400).json({ success: false, message: 'courseId and progress are required' });
  }

  const updated = db.updateCourseProgress(user.id, courseId, progress);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Enrollment not found' });
  }

  res.json({
    success: true,
    course: updated,
    user: db.getCurrentUser(),
    message: progress >= 100 ? 'Course completed! Competency score boosted.' : 'Progress updated.',
  });
});

export default router;
