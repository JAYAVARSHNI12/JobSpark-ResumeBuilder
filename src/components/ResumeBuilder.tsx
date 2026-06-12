import React, { useState } from 'react';
import { Resume, ResumeData, TemplateSettings, TemplateId, WorkExperience, Education, Skill, Project, Certification } from '../types';
import ResumeRenderer from './ResumeRenderer';
import {
  Save, ArrowLeft, Plus, Trash2, Settings, User, Briefcase, GraduationCap, Code, FolderGit, FileText, Check, Layout, AlertCircle,
  HelpCircle, Wand2, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';

interface ResumeBuilderProps {
  resume: Resume;
  onSave: (resume: Resume) => void;
  onBack: () => void;
}

export default function ResumeBuilder({ resume, onSave, onBack }: ResumeBuilderProps) {
  const [activeTab, setActiveTab] = useState<'contact' | 'experience' | 'education' | 'skills' | 'projects' | 'settings'>('contact');
  const [title, setTitle] = useState(resume.title);
  const [data, setData] = useState<ResumeData>({ ...resume.data });
  const [settings, setSettings] = useState<TemplateSettings>({ ...resume.settings });
  const [templateId, setTemplateId] = useState<TemplateId>(resume.templateId);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Spark AI assist state
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
  const [bulletTopic, setBulletTopic] = useState<'software' | 'design' | 'sales' | 'finance'>('software');

  const updateData = (field: keyof ResumeData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    const updatedResume: Resume = {
      ...resume,
      title,
      templateId,
      data,
      settings,
      updatedAt: Date.now(),
    };

    setTimeout(() => {
      onSave(updatedResume);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  // Trigger browser-native vector PDF generation
  const handleDownloadPDF = () => {
    // Quick tip: update document title to resume's name so output filename matched title when saving
    const originalTitle = document.title;
    document.title = `${title.replace(/\s+/g, '_')}_Resume`;
    window.print();
    document.title = originalTitle;
  };

  // Preset job templates for local simulation
  const applyAIPolishedBullets = (index: number) => {
    const aiBullets = {
      software: '• Architected scale backends using TypeScript and NodeJS, boosting throughput by 42%.\n• Pioneered automated CI/CD deployment channels reducing regression defects by nearly 30%.\n• Refactored relational indexes and database locks to slash average query times from 800ms down to 120ms.',
      design: '• Created high-fidelity user workflows for SaaS dashboards, boosting user onboarding by 25%.\n• Defined comprehensive brand style design components to accelerate developer delivery rate by 3x.\n• Led strategic stakeholder feedback analysis to redesign visual layouts across mobile viewports.',
      sales: '• Surpassed regional sales quotas consistently by over 135% through high-value portfolio management.\n• Streamlined outbound pipeline funnels to compress typical customer acquisition cycles from 12 weeks to 8.\n• Keynoted target executive negotiations to successfully close accounts valued at $450K+ yearly.',
      finance: '• Engineered core analytical reports tracking regional P&L structures, identifying $80K annual leakage.\n• Managed compliance audit preparations with zero exceptions reported across multiple fiscal cycles.\n• Built forecasting dashboards to trace market fluctuation, increasing risk mitigation accuracy by 18%.'
    };

    const targetJobs = [...data.workExperience];
    if (targetJobs[index]) {
      targetJobs[index].description = aiBullets[bulletTopic];
      updateData('workExperience', targetJobs);
    }
    setSelectedJobIndex(null);
  };

  // Helper functions for dynamic array modifiers
  const handleAddExperience = () => {
    const newJob: WorkExperience = {
      id: 'job_' + Date.now(),
      company: 'Innovate Solutions Inc.',
      position: 'Staff Developer',
      startDate: 'Jan 2024',
      endDate: 'Present',
      current: true,
      description: '• Developed high-speed user interfaces following strict responsive guidelines.\n• Collaborated closely with executive team to design product strategies.'
    };
    updateData('workExperience', [...data.workExperience, newJob]);
  };

  const handleRemoveExperience = (id: string) => {
    updateData('workExperience', data.workExperience.filter(j => j.id !== id));
  };

  const handleJobChange = (index: number, key: keyof WorkExperience, value: any) => {
    const updated = [...data.workExperience];
    updated[index] = { ...updated[index], [key]: value };
    updateData('workExperience', updated);
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: 'edu_' + Date.now(),
      institution: 'State Technical University',
      degree: 'B.S. Computer Science',
      major: 'Systems Engineering',
      startDate: '2019',
      endDate: '2023',
      gpa: '3.85/4.00'
    };
    updateData('education', [...data.education, newEdu]);
  };

  const handleRemoveEducation = (id: string) => {
    updateData('education', data.education.filter(e => e.id !== id));
  };

  const handleEduChange = (index: number, key: keyof Education, value: any) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [key]: value };
    updateData('education', updated);
  };

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: 'skill_' + Date.now(),
      name: 'TypeScript',
      level: 'Expert'
    };
    updateData('skills', [...data.skills, newSkill]);
  };

  const handleRemoveSkill = (id: string) => {
    updateData('skills', data.skills.filter(s => s.id !== id));
  };

  const handleSkillChange = (index: number, key: keyof Skill, value: any) => {
    const updated = [...data.skills];
    updated[index] = { ...updated[index], [key]: value };
    updateData('skills', updated);
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: 'proj_' + Date.now(),
      title: 'JobSpark Resume Portal',
      role: 'Lead Developer',
      techStack: 'React, Node, PostgreSQL',
      description: 'Created a highly responsive local visual CV editor featuring print style triggers and dashboard lists.',
      link: 'github.com/alex-dev/jobspark'
    };
    updateData('projects', [...data.projects, newProj]);
  };

  const handleRemoveProject = (id: string) => {
    updateData('projects', data.projects.filter(p => p.id !== id));
  };

  const handleProjChange = (index: number, key: keyof Project, value: any) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [key]: value };
    updateData('projects', updated);
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]" id="builder-main-frame">
      {/* Top action bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-5 flex flex-wrap gap-4 items-center justify-between shadow-sm no-print" id="builder-nav-toolbar">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-slate-500"
            title="Return to Dashboard"
            id="builder-btn-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex flex-col text-left">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume Title... (e.g., Alex Principal Engineer)"
              className="text-base font-extrabold text-slate-800 bg-transparent hover:bg-slate-50/70 border-b border-transparent focus:border-cyan-500 pb-0.5 focus:outline-none w-64 px-1"
              id="builder-doc-title"
            />
            <span className="text-[10px] text-slate-400 font-mono px-1">Editable Document Name</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2" id="builder-action-btns">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            id="btn-print-download"
          >
            <FileText className="h-4 w-4" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`px-4 py-2.5 rounded-xl hover:opacity-90 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 text-white ${
              saveStatus === 'saved'
                ? 'bg-emerald-600'
                : 'bg-gradient-to-r from-cyan-600 to-indigo-600'
            }`}
            id="btn-save-doc"
          >
            {saveStatus === 'saving' ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <span>Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved Succesfully!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save to Dashboard</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split visual viewport */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0" id="builder-split">
        {/* Form panel inputs accordion (Left column: 5/12 size) */}
        <div className="lg:col-span-5 bg-white border border-slate-150 rounded-2xl flex flex-col min-h-0 shadow-sm no-print" id="builder-left-pane">
          {/* Sub Navigation Bar - Form Tabs */}
          <div className="bg-slate-50 border-b border-slate-100 p-2 flex overflow-x-auto gap-0.5" id="form-tab-nav">
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all uppercase tracking-wide shrink-0 ${
                activeTab === 'contact' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="h-3.5 w-3.5 text-sky-500" />
              <span>Contact</span>
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all uppercase tracking-wide shrink-0 ${
                activeTab === 'experience' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
              <span>Jobs</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all uppercase tracking-wide shrink-0 ${
                activeTab === 'education' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
              <span>Education</span>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all uppercase tracking-wide shrink-0 ${
                activeTab === 'skills' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Code className="h-3.5 w-3.5 text-amber-500" />
              <span>Skills</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all uppercase tracking-wide shrink-0 ${
                activeTab === 'projects' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FolderGit className="h-3.5 w-3.5 text-pink-500" />
              <span>Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer transition-all uppercase tracking-wide shrink-0 ${
                activeTab === 'settings' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Settings className="h-3.5 w-3.5 text-purple-500" />
              <span>Tuning</span>
            </button>
          </div>

          {/* Tab content area */}
          <div className="flex-1 overflow-y-auto p-5 text-left text-xs text-slate-700" id="form-inputs-container">
            {activeTab === 'contact' && (
              <div className="space-y-4" id="inputs-contact">
                <div className="border-l-2 border-sky-400 pl-3">
                  <h4 className="font-bold text-slate-800 text-sm">Primary Contact Information</h4>
                  <p className="text-slate-400 text-[10px]">Populates the primary header element across all layout templates</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 font-medium rounded-lg"
                      value={data.fullName}
                      onChange={(e) => updateData('fullName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Professional Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 font-medium rounded-lg"
                      value={data.title}
                      onChange={(e) => updateData('title', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 rounded-lg"
                        value={data.email}
                        onChange={(e) => updateData('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 rounded-lg"
                        value={data.phone}
                        onChange={(e) => updateData('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Location (City, State / Country)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 rounded-lg"
                        value={data.location}
                        onChange={(e) => updateData('location', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Personal Website URL</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 rounded-lg"
                        value={data.website}
                        onChange={(e) => updateData('website', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 rounded-lg"
                      value={data.linkedin}
                      onChange={(e) => updateData('linkedin', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Professional objective profile summary</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-cyan-500 text-slate-800 rounded-lg leading-relaxed text-xs"
                      value={data.summary}
                      onChange={(e) => updateData('summary', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4" id="inputs-experience">
                <div className="flex items-center justify-between border-l-2 border-indigo-400 pl-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Professional Work History</h4>
                    <p className="text-slate-400 text-[10px]">Add previous employment segments to catalog career tracks</p>
                  </div>
                  <button
                    onClick={handleAddExperience}
                    className="p-1 px-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded cursor-pointer"
                  >
                    + Add Job
                  </button>
                </div>

                <div className="space-y-5 pt-2">
                  {data.workExperience.map((job, idx) => (
                    <div key={job.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 text-left relative group">
                      <button
                        onClick={() => handleRemoveExperience(job.id)}
                        className="absolute right-3 top-3 p-1.5 rounded-lg text-slate-400 hover:text-red-500 bg-white border border-slate-100 shadow-xs cursor-pointer transition opacity-0 group-hover:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">POSITION SECTION #{idx + 1}</span>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Company Name</label>
                          <input
                            type="text"
                            value={job.company}
                            onChange={(e) => handleJobChange(idx, 'company', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Job Title Position</label>
                          <input
                            type="text"
                            value={job.position}
                            onChange={(e) => handleJobChange(idx, 'position', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Start Date</label>
                          <input
                            type="text"
                            value={job.startDate}
                            onChange={(e) => handleJobChange(idx, 'startDate', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">End Date</label>
                          <input
                            type="text"
                            disabled={job.current}
                            value={job.current ? 'Present' : job.endDate}
                            onChange={(e) => handleJobChange(idx, 'endDate', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id={`cur-${job.id}`}
                          checked={job.current}
                          onChange={(e) => handleJobChange(idx, 'current', e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                        />
                        <label htmlFor={`cur-${job.id}`} className="font-medium text-slate-600 cursor-pointer text-[10px]">I currently work here</label>
                      </div>

                      {/* AI Bullets polisher helper section */}
                      <div className="space-y-1 pt-1.5">
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-semibold text-slate-600 flex items-center gap-1">
                            <span>Job Description / Achievements (bullets)</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setSelectedJobIndex(idx)}
                            className="px-2 py-1 rounded bg-cyan-50 hover:bg-cyan-100 border border-cyan-150 text-cyan-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
                          >
                            <Wand2 className="h-3 w-3" />
                            <span>Spark AI Bullets</span>
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          value={job.description}
                          onChange={(e) => handleJobChange(idx, 'description', e.target.value)}
                          placeholder="List key duties, tools and tangible metric achievements..."
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md font-mono text-[10px] leading-relaxed focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* AI Bullet Selection Modal overlay inside the card for simplicity */}
                      {selectedJobIndex === idx && (
                        <div className="p-3 bg-cyan-950 border border-cyan-800 rounded-xl text-white mt-2 space-y-3 block animate-fade-in text-left">
                          <h5 className="font-bold text-[10px] text-cyan-300 uppercase tracking-widest flex items-center gap-1">
                            <Wand2 className="h-3.5 w-3.5 text-cyan-400" /> Choose Professional Sector Suggester
                          </h5>
                          <p className="text-[10.5px] text-cyan-200">
                            Our local student AI suggests industry-formatted metrics. Pick your field to load pre-formatted Bullet Points:
                          </p>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => { setBulletTopic('software'); applyAIPolishedBullets(idx); }}
                              className="px-2 py-1 bg-cyan-900 border border-cyan-700 text-[10px] rounded hover:bg-cyan-800 font-bold cursor-pointer"
                            >
                              🖥 Software Dev
                            </button>
                            <button
                              onClick={() => { setBulletTopic('design'); applyAIPolishedBullets(idx); }}
                              className="px-2 py-1 bg-cyan-900 border border-cyan-700 text-[10px] rounded hover:bg-cyan-800 font-bold cursor-pointer"
                            >
                              🎨 UI/UX Design
                            </button>
                            <button
                              onClick={() => { setBulletTopic('sales'); applyAIPolishedBullets(idx); }}
                              className="px-2 py-1 bg-cyan-900 border border-cyan-700 text-[10px] rounded hover:bg-cyan-800 font-bold cursor-pointer"
                            >
                              💼 Sales Executive
                            </button>
                            <button
                              onClick={() => { setBulletTopic('finance'); applyAIPolishedBullets(idx); }}
                              className="px-2 py-1 bg-cyan-900 border border-cyan-700 text-[10px] rounded hover:bg-cyan-800 font-bold cursor-pointer"
                            >
                              📈 Financial Analyst
                            </button>
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => setSelectedJobIndex(null)}
                              className="text-[10px] text-slate-300 underline font-semibold cursor-pointer py-1"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4" id="inputs-education">
                <div className="flex items-center justify-between border-l-2 border-emerald-400 pl-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Academic Education history</h4>
                    <p className="text-slate-400 text-[10px]">Add degrees, GPAs, and high school or university achievements</p>
                  </div>
                  <button
                    onClick={handleAddEducation}
                    className="p-1 px-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded cursor-pointer"
                  >
                    + Add Academic
                  </button>
                </div>

                <div className="space-y-5 pt-2">
                  {data.education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 relative group text-left">
                      <button
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="absolute right-3 top-3 p-1.5 rounded-lg text-slate-400 hover:text-red-500 bg-white border border-slate-100 shadow-xs cursor-pointer transition opacity-0 group-hover:opacity-100"
                        title="Delete academic record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">ACADEMIC CREDENTIAL #{idx + 1}</span>

                      <div className="space-y-1 pt-1">
                        <label className="font-semibold text-slate-600">Institution / University</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleEduChange(idx, 'institution', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none focus:border-emerald-505"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Degree (e.g. B.S., M.S., High School)</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Major / Area of Focus</label>
                          <input
                            type="text"
                            value={edu.major}
                            onChange={(e) => handleEduChange(idx, 'major', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1 col-span-1">
                          <label className="font-semibold text-slate-600">Grad. Year/Start</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => handleEduChange(idx, 'startDate', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1 col-span-1">
                          <label className="font-semibold text-slate-600">End Year</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => handleEduChange(idx, 'endDate', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1 col-span-1">
                          <label className="font-semibold text-slate-600">GPA Score</label>
                          <input
                            type="text"
                            value={edu.gpa || ''}
                            onChange={(e) => handleEduChange(idx, 'gpa', e.target.value)}
                            placeholder="e.g. 3.9/4.0"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4" id="inputs-skills">
                <div className="flex items-center justify-between border-l-2 border-amber-400 pl-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Key Professional Capabilities</h4>
                    <p className="text-slate-400 text-[10px]">Provide tools, softwares, frameworks, and expert coordinates</p>
                  </div>
                  <button
                    onClick={handleAddSkill}
                    className="p-1 px-2 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded cursor-pointer"
                  >
                    + Add Tech Tag
                  </button>
                </div>

                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3" id="skills-list-grid">
                  {data.skills.map((sk, idx) => (
                    <div key={sk.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 relative text-left group">
                      <button
                        onClick={() => handleRemoveSkill(sk.id)}
                        className="absolute right-2 top-2 p-1.5 rounded-md text-slate-400 hover:text-red-500 bg-white border border-slate-100 shadow-xs cursor-pointer transition opacity-0 group-hover:opacity-100"
                        title="Remove Tag"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500">Skill Target Name</label>
                        <input
                          type="text"
                          value={sk.name}
                          onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                          placeholder="e.g. TypeScript"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-md focus:outline-none text-xs font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500">Classification Level</label>
                        <select
                          value={sk.level}
                          onChange={(e) => handleSkillChange(idx, 'level', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded-md focus:outline-none text-xs"
                        >
                          <option value="Expert">Expert / Proficient</option>
                          <option value="Advanced">Advanced Operator</option>
                          <option value="Intermediate">Intermediate User</option>
                          <option value="Beginner">Familiar / Beginner</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4" id="inputs-projects">
                <div className="flex items-center justify-between border-l-2 border-pink-400 pl-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Portfolio Projects Showcase</h4>
                    <p className="text-slate-400 text-[10px]">Highlight real architectural contributions and repositories</p>
                  </div>
                  <button
                    onClick={handleAddProject}
                    className="p-1 px-2 text-[10px] font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded cursor-pointer"
                  >
                    + Add Project
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  {data.projects.map((proj, idx) => (
                    <div key={proj.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 relative group text-left">
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="absolute right-3 top-3 p-1.5 rounded-lg text-slate-400 hover:text-red-500 bg-white border border-slate-100 shadow-xs cursor-pointer transition opacity-0 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">PROJECT INSTANCE #{idx + 1}</span>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleProjChange(idx, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Your Role</label>
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) => handleProjChange(idx, 'role', e.target.value)}
                            placeholder="e.g. Lead Designer"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1 col-span-1">
                          <label className="font-semibold text-slate-600">Tech Stack Used</label>
                          <input
                            type="text"
                            value={proj.techStack}
                            onChange={(e) => handleProjChange(idx, 'techStack', e.target.value)}
                            placeholder="React, CSS, Vite"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1 col-span-1">
                          <label className="font-semibold text-slate-600">Reference URL/Link</label>
                          <input
                            type="text"
                            value={proj.link || ''}
                            onChange={(e) => handleProjChange(idx, 'link', e.target.value)}
                            placeholder="github.com/project"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-600">Project Summary Description</label>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => handleProjChange(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-250 text-slate-800 rounded-md text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-5" id="inputs-settings">
                <div className="border-l-2 border-purple-400 pl-3">
                  <h4 className="font-bold text-slate-800 text-sm">Theme Tuning & Layout Config</h4>
                  <p className="text-slate-400 text-[10px]">Alter template styling, margin spacing coordinates and layout fonts</p>
                </div>

                {/* Color accents */}
                <div className="space-y-2 bg-slate-50 p-4 border border-slate-100 rounded-xl text-left">
                  <h5 className="font-bold text-slate-800 text-xs text-left">Accent Paint Scheme</h5>
                  <p className="text-[10px] text-slate-400">Choose primary highlight hue reflecting corporate domains:</p>
                  
                  <div className="grid grid-cols-6 gap-2 pt-1">
                    {[
                      { hex: '#0284c7', label: 'Sky' },
                      { hex: '#4f46e5', label: 'Indigo' },
                      { hex: '#059669', label: 'Emerald' },
                      { hex: '#db2777', label: 'Rose' },
                      { hex: '#d97706', label: 'Amber' },
                      { hex: '#7c3aed', label: 'Violet' }
                    ].map((col) => (
                      <button
                        key={col.hex}
                        onClick={() => setSettings({ ...settings, accentColor: col.hex })}
                        style={{ backgroundColor: col.hex }}
                        className={`h-7.5 rounded-lg border-2 cursor-pointer relative shadow-xs flex items-center justify-center transition-all ${
                          settings.accentColor === col.hex ? 'border-slate-900 scale-105' : 'border-transparent'
                        }`}
                        title={col.label}
                      >
                        {settings.accentColor === col.hex && (
                          <Check className="h-3.5 w-3.5 text-white stroke-[4px]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-medium text-slate-600 shrink-0">Custom Hex Color Picker:</span>
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="h-6 w-12 border rounded cursor-pointer bg-white"
                    />
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 rounded px-1.5 py-0.5">{settings.accentColor}</span>
                  </div>
                </div>

                {/* Font families selection */}
                <div className="space-y-2 bg-slate-50 p-4 border border-slate-100 rounded-xl text-left">
                  <h5 className="font-bold text-slate-800 text-xs">Standard Heading Typeface Pairing</h5>
                  <p className="text-[10px] text-slate-400">Controls letter weights and standard alignment layout look:</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1" id="font-family-selectors">
                    {[
                      { code: 'sans', name: 'Inter (Clean Sans)', style: 'font-sans' },
                      { code: 'serif', name: 'Playfair (Elegant Serif)', style: 'font-serif' },
                      { code: 'grotesk', name: 'Space Grotesk (Tech Heading)', style: 'font-grotesk' },
                      { code: 'mono', name: 'JetBrains (Monospace Data)', style: 'font-mono' }
                    ].map((f) => (
                      <button
                        key={f.code}
                        onClick={() => setSettings({ ...settings, fontFamily: f.code as any })}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${f.style} ${
                          settings.fontFamily === f.code
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight">{f.name}</div>
                        <div className="text-[8px] opacity-70 mt-1">Lorem Ipsum dolor sit amet</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing lines density padding */}
                <div className="space-y-2 bg-slate-50 p-4 border border-slate-100 rounded-xl text-left">
                  <h5 className="font-bold text-slate-800 text-xs">Margin Padding Density Sparing</h5>
                  <p className="text-[10px] text-slate-400">Fits multiple pages onto one cohesive layout sheet:</p>
                  
                  <div className="grid grid-cols-3 gap-2 pt-1" id="line-spacing-selectors">
                    {[
                      { code: 'compact', label: 'Compact Spacing', desc: 'Fits maximum data' },
                      { code: 'normal', label: 'Regular Slate', desc: 'Standard margins' },
                      { code: 'relaxed', label: 'Spacious Flow', desc: 'Comfortable gaps' },
                    ].map((sp) => (
                      <button
                        key={sp.code}
                        onClick={() => setSettings({ ...settings, spacing: sp.code as any })}
                        className={`p-2 rounded-lg border text-center cursor-pointer transition ${
                          settings.spacing === sp.code
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold">{sp.label}</div>
                        <div className="text-[9px] opacity-60 mt-0.5">{sp.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live preview section canvas rendering (Right column: 7/12 size) */}
        <div className="lg:col-span-7 flex flex-col min-h-0 relative" id="builder-right-pane">
          {/* Layout Template swap controls */}
          <div className="bg-slate-900 text-white rounded-xl p-3 mb-3 flex items-center justify-between shadow-md no-print" id="template-swap-nav">
            <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400 pl-1">Selected Active Template style</span>
            <div className="flex gap-1" id="template-quick-buttons">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value as TemplateId)}
                className="bg-slate-800 text-white text-[11px] font-bold border border-slate-700 px-3 py-1 rounded-lg focus:outline-none cursor-pointer"
                id="select-template-widget"
              >
                <option value="modern">Modern Executive</option>
                <option value="creative">Creative Developer</option>
                <option value="classic">Classic Corporate</option>
                <option value="professional">Professional Slate</option>
                <option value="ats_friendly">ATS-Friendly Clean</option>
                <option value="minimal">Ultra Minimalist</option>
              </select>
            </div>
          </div>

          {/* Interactive render canvas container wrapper with paper effect */}
          <div className="flex-1 bg-slate-100 border border-slate-150 rounded-2xl overflow-y-auto p-4 flex justify-center items-start border-dashed min-h-0 relative group" id="canvas-scrollable">
            {/* Guide floating trigger panel at top right of viewport preview */}
            <div className="absolute top-2.5 right-2 px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl shadow-md text-[10px] space-y-1 block max-w-sm text-left pointer-events-none opacity-85 group-hover:opacity-100 transition no-print">
              <div className="font-bold text-white flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-emerald-400" />
                <span>PDF Download Export Tip:</span>
              </div>
              <ul className="list-disc pl-3 text-[9px] text-slate-300 space-y-0.5">
                <li>Choose Destination: <strong>Save as PDF</strong></li>
                <li>Set Paper Size: <strong>A4</strong></li>
                <li>Enable: <strong>Background graphics</strong></li>
                <li>Set Margins: <strong>None</strong></li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-xl border w-full max-w-[210mm] shrink-0" id="live-target-canvas">
              <ResumeRenderer data={data} settings={settings} templateId={templateId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
