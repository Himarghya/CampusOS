import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { User, Plus, Trash2, Code2, FolderGit2, FileText, CheckCircle2 } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const StudentResumePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [skillModal, setSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [projectModal, setProjectModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const res = await api.get('/resumes/profile');
      return res.data.data;
    },
  });

  const addSkillMutation = useMutation({
    mutationFn: async (name: string) => {
      return api.post('/resumes/skills', { name, category: 'TECHNICAL', proficiency: 'ADVANCED' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setSkillModal(false);
      setNewSkillName('');
    },
  });

  const removeSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/resumes/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/resumes/projects', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setProjectModal(false);
      setProjectTitle('');
      setProjectDesc('');
      setProjectTech('');
    },
  });

  if (isLoading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resume & Skill Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your professional technical portfolio and recruitment resume</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profile Completeness</div>
            <div className="text-sm font-black text-indigo-600">{profile?.completenessScore || 85}% Complete</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            {profile?.completenessScore || 85}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Technical Skills Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Technical Skills</h3>
            </div>
            <Button size="sm" onClick={() => setSkillModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Skill</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {profile?.skills?.map((s: any) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100"
              >
                <span>{s.name}</span>
                <button
                  onClick={() => removeSkillMutation.mutate(s.id)}
                  className="text-indigo-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Projects Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">Featured Projects</h3>
            </div>
            <Button size="sm" onClick={() => setProjectModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Project</span>
            </Button>
          </div>

          <div className="space-y-4">
            {profile?.projects?.map((p: any) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <h4 className="text-sm font-bold text-slate-900 mb-1">{p.title}</h4>
                <p className="text-xs text-slate-600 mb-2">{p.description}</p>
                <div className="text-[11px] font-semibold text-indigo-600">
                  Tech Stack: {p.technologies}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal isOpen={skillModal} onClose={() => setSkillModal(false)} title="Add New Skill">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newSkillName) addSkillMutation.mutate(newSkillName);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Skill Name
            </label>
            <input
              type="text"
              required
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Next.js, Docker, Kubernetes"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setSkillModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Project Modal */}
      <Modal isOpen={projectModal} onClose={() => setProjectModal(false)} title="Add Featured Project">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProjectMutation.mutate({
              title: projectTitle,
              description: projectDesc,
              technologies: projectTech,
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Project Title
            </label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Technologies (Comma separated)
            </label>
            <input
              type="text"
              required
              value={projectTech}
              onChange={(e) => setProjectTech(e.target.value)}
              placeholder="React, TypeScript, Tailwind, Node.js"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setProjectModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
