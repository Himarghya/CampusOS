import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
  FileCheck,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  X,
  CloudUpload,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import clsx from 'clsx';

export const StudentAssignmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissionMode, setSubmissionMode] = useState<'FILE' | 'URL'>('FILE');
  const [fileUrl, setFileUrl] = useState('https://campusos.edu/submissions/demo-assignment-3.pdf');
  const [fileName, setFileName] = useState('Assignment_CSE201_JohnDoe.pdf');
  const [fileSize, setFileSize] = useState<number>(1024 * 512);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED'>('ALL');

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['myAssignments'],
    queryFn: async () => {
      const res = await api.get('/assignments');
      return res.data.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async ({
      id,
      fileUrl,
      fileName,
      fileSize,
    }: {
      id: string;
      fileUrl: string;
      fileName: string;
      fileSize: number;
    }) => {
      return api.post(`/assignments/${id}/submissions`, { fileUrl, fileName, fileSize });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
      setSelectedAssignment(null);
      setUploadedFile(null);
      setUploadProgress(0);
      setSubmitting(false);
    },
    onError: (err: any) => {
      setUploadError(err.response?.data?.error?.message || 'Submission failed');
      setSubmitting(false);
    },
  });

  const handleFileProcess = async (file: File) => {
    setUploadError(null);
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB limit');
      return;
    }

    setUploadedFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', 'SUBMISSION');

      const uploadRes = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      if (uploadRes.data.data?.fileUrl) {
        setFileUrl(uploadRes.data.data.fileUrl);
      }
      setUploadProgress(100);
    } catch {
      // Fallback local file URL for demo
      setFileUrl(`/uploads/${file.name}`);
      setUploadProgress(100);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileProcess(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    setUploadError(null);

    submitMutation.mutate({
      id: selectedAssignment.id,
      fileUrl: fileUrl || `https://campusos.edu/submissions/${fileName}`,
      fileName: fileName || 'Submission.pdf',
      fileSize,
    });
  };

  const openSubmitModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    setFileName(`Assignment_${assignment.course?.code || 'Course'}_JohnDoe.pdf`);
    setFileUrl('https://campusos.edu/submissions/demo-assignment-3.pdf');
    setFileSize(1024 * 512);
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setSubmissionMode('FILE');
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

        {/* Filter Tabs */}
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
                      {new Date(a.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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
                      <span>Uploaded ({submission.fileName})</span>
                    </span>
                    <button
                      onClick={() => openSubmitModal(a)}
                      className="text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Resubmit
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => openSubmitModal(a)}
                    size="sm"
                    className="w-full font-bold shadow-sm shadow-indigo-200"
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

      {/* Enhanced Drag-and-Drop Submission Modal */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title="Submit Assignment"
        subtitle={selectedAssignment?.title}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {uploadError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Mode Tabs (Drag & Drop File vs External URL) */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setSubmissionMode('FILE')}
              className={clsx(
                'flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer',
                submissionMode === 'FILE'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <CloudUpload className="w-4 h-4" />
              <span>Upload File (Drag & Drop)</span>
            </button>

            <button
              type="button"
              onClick={() => setSubmissionMode('URL')}
              className={clsx(
                'flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer',
                submissionMode === 'URL'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Document / URL Link</span>
            </button>
          </div>

          {submissionMode === 'FILE' ? (
            <div>
              {/* Drag and Drop Box */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.zip,.tar,.png,.jpg,.jpeg"
              />

              {!uploadedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={clsx(
                    'border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group',
                    isDragging
                      ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
                      : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30'
                  )}
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 transition-colors shadow-xs">
                    <CloudUpload className="w-7 h-7" />
                  </div>
                  <div className="text-sm font-bold text-slate-800 mb-1">
                    Drag and drop your assignment file here
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Supports PDF, DOCX, ZIP, or Image files up to 15MB
                  </p>
                  <span className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs shadow-indigo-200">
                    Browse Computer
                  </span>
                </div>
              ) : (
                /* Uploaded File Card */
                <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate max-w-xs">{fileName}</div>
                        <div className="text-[11px] text-slate-500">{formatFileSize(fileSize)}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        setUploadProgress(0);
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-700">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ready for submission</span>
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* URL Submission Mode */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  File / Document Title
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
            </div>
          )}

          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 font-medium">
            Ensure your submission file includes your roll number and student details on the first page.
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
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
              className="font-bold shadow-md shadow-indigo-200"
            >
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
