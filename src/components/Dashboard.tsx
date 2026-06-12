import React from 'react';
import { Plus, FileText, Calendar, Trash2, Copy, Eye, LogOut, Code, Award } from 'lucide-react';
import { Resume, TemplateId } from '../types';

interface DashboardProps {
  user: { username: string; id: string };
  resumes: Resume[];
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  onOpenGuide: () => void;
}

export default function Dashboard({
  user,
  resumes,
  onCreateNew,
  onEdit,
  onDuplicate,
  onDelete,
  onLogout,
  onOpenGuide,
}: DashboardProps) {
  const getTemplateName = (id: TemplateId) => {
    switch (id) {
      case 'creative':
        return 'Creative Columnist';
      case 'modern':
        return 'Modern Executive';
      case 'classic':
        return 'Classic Corporate';
      case 'professional':
        return 'Professional Slate';
      case 'ats_friendly':
        return 'ATS Optimized';
      case 'minimal':
        return 'Ultra Minimalist';
      default:
        return 'Standard Layout';
    }
  };

  const formattedDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 no-print" id="dashboard-root">
      {/* Header Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6" id="dash-header-card">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-2 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold border border-emerald-100 rounded">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ACTIVE SESSION
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            Welcome to JobSpark, <span className="text-cyan-600 capitalize">{user.username}</span>!
          </h2>
          <p className="text-sm text-slate-500">
            Design personal templates for different targeted roles. Everything is auto-saved.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap gap-2 shrink-0 w-full md:w-auto" id="dash-toolbar">
          {/* <button
            onClick={onOpenGuide}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 font-semibold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Code className="h-4 w-4" />
            <span>Developer Reference Spec</span>
          </button>
           */}
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <LogOut className="h-4 w-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Analytics stats banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="stats-banner">
        <div className="bg-slate-50/65 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 text-left">
          <div className="h-10 w-10.5 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">TOTAL RESUMES</div>
            <div className="text-lg font-extrabold text-slate-800">{resumes.length} Document{resumes.length === 1 ? '' : 's'}</div>
          </div>
        </div>

        <div className="bg-slate-50/65 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 text-left">
          <div className="h-10 w-10.5 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">LAST RE-EDITED</div>
            <div className="text-xs font-bold text-slate-800">
              {resumes.length > 0
                ? formattedDate(Math.max(...resumes.map(r => r.updatedAt)))
                : 'No documents yet'}
            </div>
          </div>
        </div>

        <div className="bg-slate-50/65 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 text-left">
          <div className="h-10 w-10.5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">PDF FORMAT COMPLIANCE</div>
            <div className="text-sm font-bold text-slate-800">A4 Pixel-Precise Vector Format</div>
          </div>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="space-y-4" id="resume-grid-container">
        <div className="flex items-center justify-between" id="resume-section-bar">
          <h3 className="font-extrabold text-slate-800 text-lg">Your Resume Portfolio</h3>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center gap-1 cursor-pointer transition-all"
            id="btn-create-top"
          >
            <Plus className="h-4 w-4" />
            <span>Create Blank Resume</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-items-grid">
          {/* Card: Add Resume Trigger */}
          <div
            onClick={onCreateNew}
            className="border-2 border-dashed border-slate-200 hover:border-cyan-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer text-center bg-slate-50/20 hover:bg-cyan-50/15 group transition duration-150 h-64"
            id="card-add-new-resume"
          >
            <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-cyan-100 text-slate-500 group-hover:text-cyan-600 flex items-center justify-center transition duration-150">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-700 text-sm block">Create New Resume Document</span>
              <span className="text-[11px] text-slate-400 mt-1 block max-w-[200px]">
                Build a tailored layout from scratch and download sharp PDFs
              </span>
            </div>
          </div>

          {/* Active saved items */}
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-150 flex flex-col justify-between text-left h-64"
              id={`resume-card-${resume.id}`}
            >
              {/* Card Meta details */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-100">
                    {getTemplateName(resume.templateId)}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 line-clamp-1 text-sm">
                    {resume.title}
                  </h4>
                  <p className="text-xs text-slate-400 block truncate">
                    Candidate: {resume.data.fullName || '(No name set yet)'}
                  </p>
                </div>
              </div>

              {/* Edit Details */}
              <div className="border-t border-slate-50 pt-4 space-y-4">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Edited {formattedDate(resume.updatedAt)}</span>
                </div>

                {/* Dashboard Operations */}
                <div className="grid grid-cols-3 gap-1.5" id={`card-actions-${resume.id}`}>
                  <button
                    onClick={() => onEdit(resume.id)}
                    title="Edit Resume content"
                    className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDuplicate(resume.id)}
                    title="Clone duplicate layout"
                    className="py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Clone</span>
                  </button>

                  <button
                    onClick={() => onDelete(resume.id)}
                    title="Permanently remove"
                    className="py-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
