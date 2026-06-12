import React from 'react';
import { Sparkles, FileText, Layout, ShieldCheck, Download, Code, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { TemplateId } from '../types';

interface LandingPageProps {
  onStartBuilding: () => void;
  onOpenGuide: () => void;
  onSelectTemplateToShow: (templateId: TemplateId) => void;
}

export default function LandingPage({ onStartBuilding, onOpenGuide, onSelectTemplateToShow }: LandingPageProps) {
  const showcaseTemplates: { id: TemplateId; name: string; desc: string; style: string; badge: string }[] = [
    {
      id: 'modern',
      name: 'Modern Executive',
      desc: 'Sleek two-column layout with clean margins and professional accent separators.',
      style: 'from-blue-600 to-indigo-600',
      badge: 'Popular'
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      desc: 'Bold left-hand feature sidebar with dynamic custom indicators.',
      style: 'from-pink-500 to-rose-600',
      badge: 'Highly Styled'
    },
    {
      id: 'classic',
      name: 'Classic Academic',
      desc: 'Perfect traditional centered structure with elegant serif fonts.',
      style: 'from-amber-600 to-yellow-600',
      badge: 'Formal'
    },
    {
      id: 'professional',
      name: 'Professional Slate',
      desc: 'Traditional layout with subtle vertical left accent bars for polished balance.',
      style: 'from-emerald-600 to-teal-600',
      badge: 'Recommended'
    },
    {
      id: 'ats_friendly',
      name: 'ATS Scanner Optimized',
      desc: 'Zero-clutter, single-column alignment ensuring 100% resume parser readability.',
      style: 'from-slate-600 to-zinc-700',
      badge: 'Highest Pass Rate'
    },
    {
      id: 'minimal',
      name: 'Ultra Minimalist',
      desc: 'Clean aesthetics with elegant spacing, perfect for designers and developers.',
      style: 'from-purple-600 to-indigo-500',
      badge: 'Editorial'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-20 no-print" id="landing-main">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto" id="hero-sec">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 text-xs font-semibold animate-fade-in" id="badge-spark">
          <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
          Spark Your Next Career Move
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight" id="main-h1">
          JobSpark <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600">Resume Builder</span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-600 leading-relaxed" id="hero-subtext">
          A beautifully intuitive, fully responsive workspace to build, manage, and print stunning resumes. Built as a showcase project with zero third-party tracking, live vector previews, and custom templates.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4" id="hero-actions">
          <button
            onClick={onStartBuilding}
            id="btn-hero-build"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Start Building (Accs & Dashboard)</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* <button
            onClick={onOpenGuide}
            id="btn-hero-guide"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-800"
          >
            <Code className="h-4 w-4 text-cyan-400" />
            <span>Read Student Developer Guide</span>
          </button> */}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="feature-grid">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 hover:translate-y-[-2px] transition duration-200" id="feat-auth">
          <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-800">Secure Sign-On</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Multi-user accounts backed by salted, secure local credentials. No invasive Google scripts, absolute profile privacy.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 hover:translate-y-[-2px] transition duration-200" id="feat-temps">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layout className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-800">Six Pro Layouts</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Choose between Creative, Classic, Modern, Minimal, Slate, or ATS Scanner templates instantly with a single click.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 hover:translate-y-[-2px] transition duration-200" id="feat-prev">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-800">Automatic Preview</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Changes translate in real-time, displaying custom fonts and exact formatting adjustments in a pixel-perfect viewport canvas.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 hover:translate-y-[-2px] transition duration-200" id="feat-pdf">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Download className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-800">Vector PDF Exports</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Leverage system print vectors. Save as high-definition, search-indexable direct PDFs without raster blur patterns.
          </p>
        </div>
      </div>

      {/* Template Showcase Section */}
      <div className="space-y-6" id="templates-showcase-section">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Curation of Six Exquisite Templates</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Switch template interfaces smoothly inside our workspace container. Designed meticulously with modular custom styling elements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="templates-grid">
          {showcaseTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplateToShow(tpl.id)}
              className="group border border-slate-100 hover:border-slate-200 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 cursor-pointer text-left space-y-4 relative flex flex-col justify-between"
              id={`showcase-tpl-${tpl.id}`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${tpl.style} text-white`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                    {tpl.badge}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-cyan-600 transition-colors">
                  {tpl.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                  {tpl.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs text-cyan-600 font-medium group-hover:gap-2.5 transition-all">
                <span>Try this template in workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Code / Project Showcase Callout */}
      {/* <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-3xl border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6" id="project-banner">
        <div className="space-y-3 max-w-xl text-left">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Code className="h-5 w-5 text-cyan-400 animate-pulse" />
            Designed as a Pure Client-Side Showcase
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            This workspace demonstrates complete multi-account flows, state persistence, layout management, and print styles. Open our <strong>Developer Reference Guide</strong> to read, analyze, and copy student-friendly database SQL formulas and Express server templates.
          </p>
        </div>
        {/* <button
          onClick={onOpenGuide}
          className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs transition duration-150 cursor-pointer shrink-0"
        >
          Explore System Code & DDLs
        </button> 
      </div> */}
    </div>
  );
}
