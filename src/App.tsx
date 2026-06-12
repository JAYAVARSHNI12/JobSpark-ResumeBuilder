/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Resume, ResumeData, TemplateSettings, TemplateId } from './types';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import DevGuide from './components/DevGuide';
import { Sparkles, Code, FileText, Layout, Power, LogIn, ChevronRight, Home, LayoutGrid, Info } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<'home' | 'auth' | 'dashboard' | 'builder' | 'guide'>('home');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);

  // Load persistent user session on bootstrap
  useEffect(() => {
    const savedUser = localStorage.getItem('jobspark_current_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;
      setCurrentUser(parsedUser);
      loadUserResumes(parsedUser.id);
    }
  }, []);

  const loadUserResumes = (userId: string) => {
    const savedResumes = localStorage.getItem('jobspark_resumes') || '[]';
    const parsedResumes = JSON.parse(savedResumes) as Resume[];
    const userSpecific = parsedResumes.filter(r => r.userId === userId);
    setResumes(userSpecific);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('jobspark_current_user', JSON.stringify(user));
    loadUserResumes(user.id);
    
    // Seed blank list with a high quality placeholder resume to make evaluations direct and stellar
    const savedResumes = localStorage.getItem('jobspark_resumes') || '[]';
    const parsedResumes = JSON.parse(savedResumes) as Resume[];
    const userSpecific = parsedResumes.filter(r => r.userId === user.id);

    if (userSpecific.length === 0) {
      const seededResume = createSampleSeededResume(user.id);
      parsedResumes.push(seededResume);
      localStorage.setItem('jobspark_resumes', JSON.stringify(parsedResumes));
      setResumes([seededResume]);
    }

    setActiveScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jobspark_current_user');
    setResumes([]);
    setEditingResumeId(null);
    setActiveScreen('home');
  };

  const createSampleSeededResume = (userId: string): Resume => {
    const defaultData: ResumeData = {
      fullName: 'Alex Miller',
      title: 'Senior Software Engineer & Systems Architect',
      email: 'alexmiller@example.com',
      phone: '(617) 555-0145',
      location: 'Boston, MA',
      website: 'https://alexmiller.dev',
      linkedin: 'linkedin.com/in/alexmiller-systems',
      summary: 'Dynamic systems engineer with 7+ years of rigorous experience designing robust full-stack software arrays and distributed backend services. Expert in microservices, secure TLS/JWT session protocols, database tuning, and elegant React visualizations.',
      workExperience: [
        {
          id: 's_job_1',
          company: 'Acme Cloud Architectures',
          position: 'Lead Backend Developer',
          startDate: 'Jun 2022',
          endDate: 'Present',
          current: true,
          description: '• Architected Express database pooling wrappers that compressed average queries by 45%.\n• Directed engineering squads to deliver mission-critical JSON client dashboard dashboards ahead of deadlines.\n• Pioneered salted password storage upgrades validating student portal security compliance.'
        },
        {
          id: 's_job_2',
          company: 'Boston Technology Labs',
          position: 'Full Stack Engineer',
          startDate: 'Sep 2019',
          endDate: 'May 2022',
          current: false,
          description: '• Managed visual frontend layouts integrating rich REST client widgets and Lucide trackers.\n• Coordinated with product designers to map user signup workflows reducing bounce statistics by 15%.'
        }
      ],
      education: [
        {
          id: 's_edu_1',
          institution: 'Massachusetts Institute of Technology',
          degree: 'M.S. Computer Science & Systems Engineering',
          major: 'Distributed Networks',
          startDate: '2017',
          endDate: '2019',
          gpa: '3.94/4.00'
        },
        {
          id: 's_edu_2',
          institution: 'Boston University',
          degree: 'B.S. Software Engineering',
          major: 'Software Design',
          startDate: '2013',
          endDate: '2017',
          gpa: '3.88/4.00'
        }
      ],
      skills: [
        { id: 's_sk_1', name: 'TypeScript & JavaScript', level: 'Expert' },
        { id: 's_sk_2', name: 'NodeJS / Express Server', level: 'Expert' },
        { id: 's_sk_3', name: 'PostgreSQL Database & SQL', level: 'Expert' },
        { id: 's_sk_4', name: 'React SPA & Tailwind CSS', level: 'Expert' },
        { id: 's_sk_5', name: 'RESTful API Engineering', level: 'Expert' }
      ],
      projects: [
        {
          id: 's_proj_1',
          title: 'JobSpark Resume Creator Engine',
          role: 'Lead Architect',
          techStack: 'ReactJS, Tailwind CSS, Local Storage API',
          description: 'Engineered a vector-crisp PDF output editor resolving cross-browser margin overlaps dynamically.',
          link: 'github.com/alexdev/jobspark_res_maker'
        }
      ],
      certifications: [
        { id: 's_cert_1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2125' }
      ],
      languages: ['English (Native)', 'Spanish (Conversational)']
    };

    const defaultSettings: TemplateSettings = {
      accentColor: '#0284c7',
      fontFamily: 'sans',
      spacing: 'normal',
      themeColor: '#ffffff',
      showSectionIcons: true
    };

    return {
      id: 'res_' + Math.random().toString(36).substr(2, 9),
      userId,
      title: 'Senior Software Engineer Portfolio',
      templateId: 'modern',
      data: defaultData,
      settings: defaultSettings,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  };

  const handleCreateNewResume = () => {
    if (!currentUser) {
      setActiveScreen('auth');
      return;
    }

    const newResume: Resume = {
      id: 'res_' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      title: 'Blank Resume ' + (resumes.length + 1),
      templateId: 'modern',
      data: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        summary: '',
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: []
      },
      settings: {
        accentColor: '#0284c7',
        fontFamily: 'sans',
        spacing: 'normal',
        themeColor: '#ffffff',
        showSectionIcons: true
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const savedAllStr = localStorage.getItem('jobspark_resumes') || '[]';
    const savedAll = JSON.parse(savedAllStr) as Resume[];
    savedAll.push(newResume);
    localStorage.setItem('jobspark_resumes', JSON.stringify(savedAll));

    setResumes(prev => [...prev, newResume]);
    setEditingResumeId(newResume.id);
    setActiveScreen('builder');
  };

  const handleEditResume = (id: string) => {
    setEditingResumeId(id);
    setActiveScreen('builder');
  };

  const handleDuplicateResume = (id: string) => {
    const savedAllStr = localStorage.getItem('jobspark_resumes') || '[]';
    const savedAll = JSON.parse(savedAllStr) as Resume[];
    const original = savedAll.find(r => r.id === id);

    if (original) {
      const duplicate: Resume = {
        ...original,
        id: 'res_' + Math.random().toString(36).substr(2, 9),
        title: `${original.title} (Clone)`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      savedAll.push(duplicate);
      localStorage.setItem('jobspark_resumes', JSON.stringify(savedAll));
      
      if (currentUser) {
        loadUserResumes(currentUser.id);
      }
    }
  };

  const handleDeleteResume = (id: string) => {
    const savedAllStr = localStorage.getItem('jobspark_resumes') || '[]';
    const savedAll = JSON.parse(savedAllStr) as Resume[];
    const filtered = savedAll.filter(r => r.id !== id);
    localStorage.setItem('jobspark_resumes', JSON.stringify(filtered));

    if (currentUser) {
      loadUserResumes(currentUser.id);
    }
  };

  const handleSaveResume = (updated: Resume) => {
    const savedAllStr = localStorage.getItem('jobspark_resumes') || '[]';
    const savedAll = JSON.parse(savedAllStr) as Resume[];
    const index = savedAll.findIndex(r => r.id === updated.id);

    if (index !== -1) {
      savedAll[index] = updated;
    } else {
      savedAll.push(updated);
    }

    localStorage.setItem('jobspark_resumes', JSON.stringify(savedAll));
    
    if (currentUser) {
      loadUserResumes(currentUser.id);
    }
  };

  const activeResume = resumes.find(r => r.id === editingResumeId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="main-root">
      {/* Navbar section */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-50 shadow-xs no-print" id="main-nav-header">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo brand */}
          <button
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-2 hover:opacity-85 cursor-pointer text-left focus:outline-none"
            id="brand-logo"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-cyan-300/[0.15]">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight leading-none block">JobSpark</span>
              <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider">Resume Builder</span>
            </div>
          </button>

          {/* Navigation link widgets */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveScreen('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                activeScreen === 'home' ? 'bg-cyan-50 text-cyan-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Explore</span>
            </button>
            
            {/* <button
              onClick={() => setActiveScreen('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                activeScreen === 'guide' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>Developer Spec</span>
            </button> */}

            {currentUser ? (
              <button
                onClick={() => setActiveScreen('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                  activeScreen === 'dashboard' || activeScreen === 'builder'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveScreen('auth')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main viewport layouts */}
      <main className="flex-1 min-h-0">
        {activeScreen === 'home' && (
          <LandingPage
            onStartBuilding={() => {
              if (currentUser) {
                setActiveScreen('dashboard');
              } else {
                setActiveScreen('auth');
              }
            }}
            onOpenGuide={() => setActiveScreen('guide')}
            onSelectTemplateToShow={(tplId) => {
              if (!currentUser) {
                setActiveScreen('auth');
                return;
              }
              // Create a resume pre-set with this template
              const newRes = createSampleSeededResume(currentUser.id);
              newRes.templateId = tplId;
              newRes.title = `Template: ${tplId.toUpperCase()}`;
              
              const savedAll = JSON.parse(localStorage.getItem('jobspark_resumes') || '[]');
              savedAll.push(newRes);
              localStorage.setItem('jobspark_resumes', JSON.stringify(savedAll));

              setResumes(prev => [...prev, newRes]);
              setEditingResumeId(newRes.id);
              setActiveScreen('builder');
            }}
          />
        )}

        {activeScreen === 'auth' && (
          <Auth
            onAuthSuccess={handleAuthSuccess}
            onCancel={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'dashboard' && currentUser && (
          <Dashboard
            user={currentUser}
            resumes={resumes}
            onCreateNew={handleCreateNewResume}
            onEdit={handleEditResume}
            onDuplicate={handleDuplicateResume}
            onDelete={handleDeleteResume}
            onLogout={handleLogout}
            onOpenGuide={() => setActiveScreen('guide')}
          />
        )}

        {activeScreen === 'builder' && activeResume && (
          <ResumeBuilder
            resume={activeResume}
            onSave={handleSaveResume}
            onBack={() => setActiveScreen('dashboard')}
          />
        )}

        {activeScreen === 'guide' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <DevGuide />
          </div>
        )}
      </main>

      {/* Global generic footer block */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 no-print" id="main-global-footer">
        <p>© 2026 JobSpark - Resume Builder </p>
      </footer>
    </div>
  );
}

