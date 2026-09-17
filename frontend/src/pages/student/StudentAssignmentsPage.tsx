import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { FileCheck, Upload, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const StudentAssignmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [fileUrl, setFileUrl] = useState('https://campusos.edu/submissions/demo-assignment-3.pdf');
  const [fileName, setFileName] = useState('Assignment_CSE201_JohnDoe.pdf');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED'>('ALL');

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['myAssignments'],
    queryFn: async () => {
      const res = await api.get('/assignments');
      return res.data.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async ({ id, fileUrl, fileName }: { id: string; fileUrl: string; fileName: string }) => {
      return api.post(`/assignments/${id}/submissions`, { fileUrl, fileName, fileSize: 1024 * 512 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
      setSelectedAssignment(null);
      setSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    submitMutation.mutate({
      id: selectedAssignment.id,
      fileUrl,
      fileName,
    });
  };

  if (isLoading) return <LoadingSkeleton rows={5} />;

  const filteredAssignments = assignments?.filter((a: any) => {
    const isSubmitted = a.submissions && a.submissions.length > 0;
    if (filter === 'PENDING') return !isSubmitted;
    if (filter === 'SUBMITTED') return isSubmitted;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assignments & Submissions</h1>
          <p className="text-xs text-slate-500 mt-1">Course homework, practical projects, and evaluator feedback</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {(['ALL', 'PENDING', 'SUBMITTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === tab ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments?.map((a: any) => {
          const submission = a.submissions?.[0];
          const isSubmitted = !!submission;
          const isEvaluated = submission?.status === 'EVALUATED';

          return (
            <div
              key={a.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-600">{a.course?.code}</span>
                  <Badge variant={isEvaluated ? 'success' : isSubmitted ? 'purple' : 'warning'}>
                    {isEvaluated ? `Graded (${submission.obtainedMarks}/${a.maxMarks})` : isSubmitted ? 'Submitted' : 'Pending'}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{a.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{a.description}</p>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due Date:</span>
                    </span>
                    <strong className="text-slate-800">
                      {new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>Max Marks:</span>
                    <strong className="text-slate-800">{a.maxMarks} pts</strong>
                  </div>
                </div>

                {isEvaluated && submission.feedback && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 mb-4">
                    <span className="font-bold block mb-0.5">Faculty Feedback:</span>
                    <span className="italic">{submission.feedback}</span>
                  </div>
                )}
              </div>

              <div>
                {isSubmitted ? (
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Uploaded</span>
                    </span>
                    <button
                      onClick={() => setSelectedAssignment(a)}
                      className="text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Resubmit
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setSelectedAssignment(a)}
                    size="sm"
                    className="w-full font-bold"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    <span>Submit Assignment</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title="Submit Assignment"
        subtitle={selectedAssignment?.title}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              File Name / Assignment Title
            </label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Document / Submission URL
            </label>
            <input
              type="url"
              required
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://cloud-storage.edu/student-docs/file.pdf"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
            Ensure your submission file includes your roll number and full name on the title page.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedAssignment(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={submitting}
              className="font-bold"
            >
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
