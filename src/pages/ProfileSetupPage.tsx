import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { JOB_ROLES, DEPARTMENTS } from '../data/jobRoles';
import { SKILLS_DATA } from '../data/competencies';
import { UserCircle, Save, CheckCircle2, BookOpen, Award, Shield, Sparkles } from 'lucide-react';

const DESIGNATIONS = [
  'Director General (DG)',
  'Additional Director General (ADG)',
  'Deputy Director General (DDG)',
  'Director',
  'Joint Director',
  'Deputy Director',
  'Assistant Director',
  'Senior Statistical Officer (SSO)',
  'Junior Statistical Officer (JSO)',
];

export const ProfileSetupPage: React.FC = () => {
  const { currentUser, updateProfile, showToast } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    jobRoleId: '',
    yearsOfExperience: 0,
    educationalBackground: '',
    currentAssignment: '',
    previousTrainingAttended: [] as string[],
    existingTechnicalSkills: [] as string[],
  });

  const [selectedSkillToUpdate, setSelectedSkillToUpdate] = useState<string>('tech_python');
  const [updatedSkillScore, setUpdatedSkillScore] = useState<number>(50);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        designation: currentUser.designation || DESIGNATIONS[3],
        department: currentUser.department || DEPARTMENTS[0],
        jobRoleId: currentUser.jobRoleId || JOB_ROLES[0].id,
        yearsOfExperience: currentUser.yearsOfExperience || 5,
        educationalBackground: currentUser.educationalBackground || '',
        currentAssignment: currentUser.currentAssignment || '',
        previousTrainingAttended: currentUser.previousTrainingAttended || [],
        existingTechnicalSkills: currentUser.existingTechnicalSkills || [],
      });
      if (currentUser.skills[selectedSkillToUpdate]) {
        setUpdatedSkillScore(currentUser.skills[selectedSkillToUpdate].currentLevel);
      }
    }
  }, [currentUser]);

  const handleSkillChange = (skillId: string) => {
    setSelectedSkillToUpdate(skillId);
    if (currentUser && currentUser.skills[skillId]) {
      setUpdatedSkillScore(currentUser.skills[skillId].currentLevel);
    } else {
      setUpdatedSkillScore(40);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const matchedRole = JOB_ROLES.find(r => r.id === formData.jobRoleId);

    // Apply the skill update if modified
    const currentSkills = { ...currentUser.skills };
    if (selectedSkillToUpdate) {
      const skillObj = SKILLS_DATA.find(s => s.id === selectedSkillToUpdate);
      if (skillObj) {
        currentSkills[selectedSkillToUpdate] = {
          skillId: selectedSkillToUpdate,
          skillName: skillObj.name,
          category: skillObj.category,
          currentLevel: updatedSkillScore,
          requiredLevel: skillObj.benchmarkScore,
          gap: Math.max(0, skillObj.benchmarkScore - updatedSkillScore),
          priority: 'Medium',
          classification:
            skillObj.benchmarkScore - updatedSkillScore > 25
              ? 'Critical Gap'
              : skillObj.benchmarkScore - updatedSkillScore > 0
              ? 'Moderate Gap'
              : 'Strong Competency',
          lastAssessed: new Date().toISOString().split('T')[0],
        };
      }
    }

    await updateProfile({
      ...formData,
      jobRoleTitle: matchedRole?.title || currentUser.jobRoleTitle,
      skills: currentSkills,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <UserCircle className="w-4 h-4" />
            <span>Official Cadre Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Statistical Officer Profile & Competency Calibration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure your designation, department, statistical division, and self-evaluated technical skills.
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="text-xs">
              <div className="font-bold text-white">{currentUser.name}</div>
              <div className="text-amber-400">{currentUser.designation}</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Official Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
            <span>1. Official Identity & Placement</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Designation</label>
              <select
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {DESIGNATIONS.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department / Division</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Statistical Job Role</label>
              <select
                value={formData.jobRoleId}
                onChange={e => setFormData({ ...formData, jobRoleId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {JOB_ROLES.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.title} ({role.cadre})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Years of Statistical Service</label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.yearsOfExperience}
                onChange={e => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Educational Background</label>
              <input
                type="text"
                value={formData.educationalBackground}
                onChange={e => setFormData({ ...formData, educationalBackground: e.target.value })}
                placeholder="e.g., M.Stat (ISI Kolkata), Ph.D. Econometrics"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Statistical Assignment</label>
            <textarea
              rows={2}
              value={formData.currentAssignment}
              onChange={e => setFormData({ ...formData, currentAssignment: e.target.value })}
              placeholder="e.g., Supervising quarterly National Accounts GDP basic price aggregation..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Previous Training Attended */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>2. Previous Institutional Training Attended</span>
            <span className="text-[11px] text-amber-400 font-normal">iGOT Karmayogi & NSSTA History</span>
          </h2>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {formData.previousTrainingAttended.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-slate-950 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-lg flex items-center space-x-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        previousTrainingAttended: formData.previousTrainingAttended.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-slate-500 hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                id="newTrainingInput"
                placeholder="Add completed workshop (e.g., NSSTA Sample Design Round 79)"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) {
                      setFormData({
                        ...formData,
                        previousTrainingAttended: [...formData.previousTrainingAttended, val],
                      });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('newTrainingInput') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    setFormData({
                      ...formData,
                      previousTrainingAttended: [...formData.previousTrainingAttended, input.value.trim()],
                    });
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Existing Technical Skills Self-Evaluation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>3. Technical Skill Self-Evaluation & Calibration</span>
            <span className="text-[11px] text-emerald-400 font-normal">Direct Competency Update</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Competency to Update</label>
              <select
                value={selectedSkillToUpdate}
                onChange={e => handleSkillChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {SKILLS_DATA.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} ({skill.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Self-Assessed Score</label>
                <span className="text-sm font-bold text-amber-400">{updatedSkillScore}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={updatedSkillScore}
                onChange={e => setUpdatedSkillScore(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Beginner (10-30%)</span>
                <span>Operational (31-65%)</span>
                <span>Advanced/Expert (66-95%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Save */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg inline-flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate Competencies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
