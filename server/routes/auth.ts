import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/me', (req, res) => {
  const user = db.getCurrentUser();
  res.json({ success: true, user });
});

router.get('/users', (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    designation: u.designation,
    department: u.department,
    role: u.role,
    jobRoleTitle: u.jobRoleTitle,
    overallCompetency: u.overallCompetency,
    avatar: u.avatar,
  }));
  res.json({ success: true, users });
});

router.post('/login', (req, res) => {
  const { userId, role } = req.body;
  if (userId) {
    const success = db.setCurrentUserId(userId);
    if (success) {
      return res.json({ success: true, user: db.getCurrentUser() });
    }
  }

  // If role is admin and no userId, pick admin user
  if (role === 'admin') {
    db.setCurrentUserId('user_admin_head');
    return res.json({ success: true, user: db.getCurrentUser() });
  }

  // Default to Rajesh Sharma (ISS Director)
  db.setCurrentUserId('user_rajesh_sharma');
  res.json({ success: true, user: db.getCurrentUser() });
});

router.post('/switch-user', (req, res) => {
  const { userId } = req.body;
  if (!userId || !db.setCurrentUserId(userId)) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user: db.getCurrentUser() });
});

router.post('/update-profile', (req, res) => {
  const current = db.getCurrentUser();
  const updated = db.updateUserProfile(current.id, req.body);
  if (!updated) {
    return res.status(400).json({ success: false, message: 'Failed to update profile' });
  }
  res.json({ success: true, user: updated });
});

export default router;
