import React from 'react';
import { ResumeData, TemplateSettings, TemplateId } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Award, Briefcase, GraduationCap, Code, Flame } from 'lucide-react';

interface ResumeRendererProps {
  data: ResumeData;
  settings: TemplateSettings;
  templateId: TemplateId;
}

export default function ResumeRenderer({ data, settings, templateId }: ResumeRendererProps) {
  const {
    fullName = 'Alex Johnson',
    title = 'Principal Web Application Developer',
    email = 'alex.johnson@example.com',
    phone = '(555) 019-2834',
    location = 'Boston, MA',
    website = 'https://alexj.dev',
    linkedin = 'linkedin.com/in/alexjohnson',
    summary = 'Innovative full-stack software engineer with 6+ years of rigorous experience designing responsive web systems. Expert in TypeScript, high-performance database indexing, and interactive UI creation.',
    workExperience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = []
  } = data;

  // Spacing class resolve
  const getSpaceClass = (type: 'py' | 'my' | 'gap') => {
    if (settings.spacing === 'compact') {
      return type === 'py' ? 'py-0.5' : type === 'my' ? 'my-1' : 'gap-1.5';
    }
    if (settings.spacing === 'relaxed') {
      return type === 'py' ? 'py-3' : type === 'my' ? 'my-4' : 'gap-4';
    }
    // Normal defaults
    return type === 'py' ? 'py-1.5' : type === 'my' ? 'my-2.5' : 'gap-2.5';
  };

  // Font family loader
  const getFontFamilyClass = () => {
    switch (settings.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'grotesk':
        return 'font-grotesk';
      case 'mono':
        return 'font-mono text-xs';
      default:
        return 'font-sans';
    }
  };

  const accentColor = settings.accentColor || '#0284c7';

  // Helper template color elements
  const headingStyle = { color: accentColor };
  const borderStyle = { borderColor: accentColor };
  const badgeStyle = { backgroundColor: `${accentColor}12`, border: `1px solid ${accentColor}30`, color: accentColor };
  const activeDotStyle = { backgroundColor: accentColor };

  // Render individual sections based on template choices
  // --- TEMPLATE 1: MODERN ---
  const renderModern = () => (
    <div className="space-y-6">
      {/* Top Accent line */}
      <div className="h-2 rounded" style={activeDotStyle} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b pb-4 gap-4" style={borderStyle}>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight" style={headingStyle}>{fullName}</h1>
          <p className="text-sm font-semibold tracking-wide text-slate-700">{title}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-500 w-full md:w-auto">
          {email && (
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" style={headingStyle} /> {email}
            </span>
          )}
          {phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" style={headingStyle} /> {phone}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" style={headingStyle} /> {location}
            </span>
          )}
          {website && (
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" style={headingStyle} /> {website}
            </span>
          )}
          {linkedin && (
            <span className="flex items-center gap-1.5 sm:col-span-2">
              <Linkedin className="h-3.5 w-3.5" style={headingStyle} /> {linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className={getSpaceClass('my')}>
          <p className="text-xs italic text-slate-600 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column (2/3 size): Experience, Projects */}
        <div className="md:col-span-2 space-y-5">
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider pb-1 border-b" style={headingStyle}>
                Professional Experience
              </h3>
              <div className="space-y-4">
                {workExperience.map((job) => (
                  <div key={job.id} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-xs">{job.position}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {job.startDate} – {job.current ? 'Present' : job.endDate}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600">
                      {job.company}
                    </p>
                    <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed pl-1.5 border-l border-slate-100 mt-1">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider pb-1 border-b" style={headingStyle}>
                Targeted Projects
              </h3>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 text-xs">{proj.title} <span className="text-[10px] text-slate-400 font-normal">| {proj.role}</span></h4>
                      {proj.link && <span className="text-[10px] text-slate-500 font-mono">{proj.link}</span>}
                    </div>
                    <p className="text-[10px] font-semibold text-cyan-600 font-mono">Tech: {proj.techStack}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1/3 size): Education, Skills, Languages */}
        <div className="space-y-5">
          {/* Skills block */}
          {skills.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider pb-1 border-b" style={headingStyle}>
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((sk) => (
                  <span
                    key={sk.id}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded"
                    style={badgeStyle}
                  >
                    {sk.name} <span className="text-slate-400 font-normal">({sk.level})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider pb-1 border-b" style={headingStyle}>
                Education
              </h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-xs">{edu.degree}</h4>
                    <p className="text-[11px] text-slate-600">{edu.major}</p>
                    <p className="text-[10px] text-slate-500">{edu.institution}</p>
                    <p className="text-[10px] font-mono text-slate-400">{edu.startDate} – {edu.endDate}</p>
                    {edu.gpa && <p className="text-[10px] font-semibold text-slate-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider pb-1 border-b" style={headingStyle}>
                Certificates
              </h3>
              <div className="space-y-1.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <p className="font-semibold text-slate-800 text-xs">{cert.name}</p>
                    <p className="text-[10px] text-slate-500">{cert.issuer} ({cert.date})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="space-y-2 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider pb-1 border-b" style={headingStyle}>
                Languages
              </h3>
              <div className="flex flex-wrap gap-1">
                {languages.map((ln, idx) => (
                  <span key={idx} className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {ln}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- TEMPLATE 2: CREATIVE ---
  const renderCreative = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 min-h-96 text-left border rounded-xl overflow-hidden" style={borderStyle}>
      {/* Side Column: Accent Highlight Fill */}
      <div className="md:col-span-1 p-5 text-white flex flex-col justify-between space-y-6" style={{ backgroundColor: accentColor }}>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight leading-tight">{fullName}</h1>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-100 opacity-90">{title}</p>
          </div>

          <div className="space-y-2 text-xs">
            {email && <p className="truncate opacity-95">✉ {email}</p>}
            {phone && <p className="opacity-95">✆ {phone}</p>}
            {location && <p className="opacity-95">📍 {location}</p>}
            {website && <p className="truncate opacity-95">🌐 {website.replace('https://', '')}</p>}
            {linkedin && <p className="truncate opacity-95">👤 {linkedin}</p>}
          </div>

          {/* Skills block */}
          {skills.length > 0 && (
            <div className="space-y-3.5 pt-4">
              <h3 className="text-xs uppercase tracking-widest font-extrabold border-b border-white/20 pb-1">
                Capabilities
              </h3>
              <div className="flex flex-wrap gap-1">
                {skills.map((sk) => (
                  <span
                    key={sk.id}
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white font-semibold"
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-extrabold border-b border-white/20 pb-1">
                Languages
              </h3>
              <p className="text-[11px] font-semibold text-white/95">{languages.join(', ')}</p>
            </div>
          )}
        </div>

        <div className="text-[9px] font-mono text-white/60">
          JobSpark Creative Template
        </div>
      </div>

      {/* Main Column */}
      <div className="md:col-span-2 p-6 space-y-6 bg-white">
        {summary && (
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Professional Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Career History</h3>
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="relative pl-4 border-l-2" style={borderStyle}>
                  <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full" style={activeDotStyle} />
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="font-bold text-slate-800 text-xs">{job.position}</h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {job.startDate} – {job.current ? 'Present' : job.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600" style={headingStyle}>
                    {job.company}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education block */}
        {education.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Education Background</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">{edu.degree}</h4>
                  <p className="text-[10px] text-slate-600">{edu.major && `${edu.major}, `}{edu.institution}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{edu.startDate} – {edu.endDate}</p>
                  {edu.gpa && <p className="text-[10px] font-mono text-cyan-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // --- TEMPLATE 3: CLASSIC ---
  const renderClassic = () => (
    <div className="space-y-6 text-center">
      {/* Centered Name */}
      <div className="space-y-2 pb-3 border-b-2" style={borderStyle}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-serif" style={headingStyle}>{fullName}</h1>
        <p className="text-xs uppercase font-serif tracking-widest text-slate-600 font-medium">{title}</p>
        
        {/* Contact Links horizontal bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-500 font-serif mt-2">
          {email && <span>{email}</span>}
          {email && (phone || location || website || linkedin) && <span>•</span>}
          {phone && <span>{phone}</span>}
          {phone && (location || website || linkedin) && <span>•</span>}
          {location && <span>{location}</span>}
          {location && (website || linkedin) && <span>•</span>}
          {website && <span className="underline">{website.replace('https://', '')}</span>}
          {website && linkedin && <span>•</span>}
          {linkedin && <span className="underline">{linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="text-left py-1.5 px-4 bg-slate-50/50 border-l-4 rounded-r-lg italic text-xs text-slate-600 font-serif leading-relaxed" style={borderStyle}>
          {summary}
        </div>
      )}

      {/* Single column listings */}
      {workExperience.length > 0 && (
        <div className="space-y-3 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 font-serif" style={headingStyle}>
            Professional Record
          </h3>
          <div className="space-y-4">
            {workExperience.map((job) => (
              <div key={job.id} className="space-y-1 font-serif">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-800 text-sm">{job.position}</h4>
                  <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                    {job.startDate} – {job.current ? 'Present' : job.endDate}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 italic">
                  {job.company}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education block */}
      {education.length > 0 && (
        <div className="space-y-3 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 font-serif" style={headingStyle}>
            Academic Background
          </h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between font-serif">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">{edu.degree} — {edu.major}</h4>
                  <p className="text-[11px] text-slate-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-[10px] text-slate-400">Score criteria: GPA {edu.gpa}</p>}
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills list block */}
      {skills.length > 0 && (
        <div className="space-y-3 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-1 font-serif" style={headingStyle}>
            Areas of Expertise
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-serif">
            {skills.map(sk => `${sk.name} (${sk.level})`).join(', ')}
          </p>
        </div>
      )}
    </div>
  );

  // --- TEMPLATE 4: PROFESSIONAL SLA ---
  const renderProfessional = () => (
    <div className="space-y-6 text-left">
      {/* Top Banner accent block */}
      <div className="border-l-4 pl-4 space-y-1.5" style={borderStyle}>
        <h1 className="text-3xl font-black tracking-tight text-slate-800">{fullName}</h1>
        <p className="text-sm font-extrabold text-slate-500 tracking-wider uppercase">{title}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono">
          {email && <span>✉ {email}</span>}
          {phone && <span>✆ {phone}</span>}
          {location && <span>📍 {location}</span>}
          {website && <span className="underline">🌐 {website.replace('https://', '')}</span>}
        </div>
      </div>

      {summary && (
        <p className="text-xs text-slate-600 leading-relaxed border-b pb-4">
          {summary}
        </p>
      )}

      {/* Section Headings containing side borders */}
      {workExperience.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 shrink-0">
              Employment History
            </h3>
            <div className="flex-1 h-0.5 bg-slate-100" />
          </div>

          <div className="space-y-5">
            {workExperience.map((job) => (
              <div key={job.id} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <span className="text-[11px] font-mono text-slate-500 block">
                    {job.startDate} – {job.current ? 'Present' : job.endDate}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">
                    {job.company}
                  </span>
                </div>
                <div className="md:col-span-3 text-xs leading-relaxed space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-xs">{job.position}</h4>
                  <p className="text-slate-500 text-xs whitespace-pre-line">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 shrink-0">
              Selected Projects
            </h3>
            <div className="flex-1 h-0.5 bg-slate-100" />
          </div>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-800 text-xs">{proj.title} <span className="text-[10px] text-slate-400 font-normal">| {proj.role}</span></h4>
                  <span className="text-[10px] font-semibold font-mono" style={headingStyle}>{proj.link}</span>
                </div>
                <p className="text-xs text-slate-500">{proj.description}</p>
                <p className="text-[9px] font-mono font-semibold" style={headingStyle}>Technologies: {proj.techStack}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Credentials & Academic profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Academic credentials */}
        {education.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 shrink-0">
                Education
              </h3>
              <div className="flex-1 h-0.5 bg-slate-100" />
            </div>

            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5 text-xs">
                  <div className="flex justify-between">
                    <h4 className="font-extrabold text-slate-800 text-xs">{edu.degree}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{edu.institution}</p>
                  {edu.gpa && <p className="text-[10px] text-slate-400">Score: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical stack skills */}
        {skills.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 shrink-0">
                Languages & Tech
              </h3>
              <div className="flex-1 h-0.5 bg-slate-100" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {skills.map((sk) => (
                <span key={sk.id} className="text-[10px] font-mono font-bold px-2 py-0.5 border text-slate-600 rounded bg-slate-50">
                  {sk.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // --- TEMPLATE 5: ATS SCANNER FRIENDLY ---
  const renderAtsFriendly = () => (
    <div className="space-y-5 text-left text-black font-sans leading-normal">
      {/* Plain, simple Header. Standard alignment fits the scraper best */}
      <div className="text-center space-y-1 pb-2 border-b">
        <h1 className="text-2xl font-bold tracking-tight uppercase text-black">{fullName}</h1>
        <p className="text-sm font-semibold text-zinc-700">{title}</p>
        <p className="text-xs text-zinc-500">
          Email: {email} | Phone: {phone} | Location: {location}
          {website && ` | Web: ${website}`}
          {linkedin && ` | LinkedIn: ${linkedin}`}
        </p>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">Professional Summary</h3>
          <p className="text-xs text-black/85 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Work History */}
      {workExperience.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b">Professional Experience</h3>
          <div className="space-y-3">
            {workExperience.map((job) => (
              <div key={job.id} className="space-y-1">
                <div className="flex justify-between font-bold text-xs text-black">
                  <span>{job.position}</span>
                  <span className="font-normal font-mono text-[11px]">{job.startDate} – {job.current ? 'PRESENT' : job.endDate.toUpperCase()}</span>
                </div>
                <div className="text-[11px] font-semibold text-zinc-700">{job.company}</div>
                <p className="text-xs text-black/80 leading-relaxed whitespace-pre-line pl-1">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Block */}
      {education.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b">Education Background</h3>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between text-xs font-bold text-black">
                  <span>{edu.degree} — {edu.major}</span>
                  <span className="font-normal font-mono text-[11px]">{edu.startDate} – {edu.endDate}</span>
                </div>
                <p className="text-xs text-zinc-700">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills tags block */}
      {skills.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b">Technical Skills</h3>
          <p className="text-xs text-black leading-relaxed">
            <strong className="text-zinc-800">Technologies: </strong>
            {skills.map(sk => sk.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );

  // --- TEMPLATE 6: MINIMALIST ---
  const renderMinimalist = () => (
    <div className="space-y-5 text-left text-zinc-800">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">{fullName}</h1>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {location && <span>{location}</span>}
          {website && <span className="underline">{website.replace('https://', '')}</span>}
        </div>
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* Summary */}
      {summary && (
        <p className="text-xs leading-relaxed text-slate-500 italic max-w-2xl">
          {summary}
        </p>
      )}

      {/* Experiences */}
      {workExperience.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">Experience</span>
          <div className="space-y-4">
            {workExperience.map((job) => (
              <div key={job.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <h4 className="font-bold text-slate-800 text-xs">{job.position} at <span className="font-normal text-slate-500">{job.company}</span></h4>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {job.startDate} – {job.current ? 'Present' : job.endDate}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-3 border-l border-slate-150">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
        {/* Education block */}
        {education.length > 0 && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">Education</span>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-1 text-xs">
                  <h4 className="font-bold text-slate-800 text-xs">{edu.degree}</h4>
                  <p className="text-slate-500">{edu.institution}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical stack skills */}
        {skills.length > 0 && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">Core Skills</span>
            <div className="flex flex-wrap gap-1">
              {skills.map((sk) => (
                <span key={sk.id} className="text-xs font-semibold px-2 py-0.5 bg-slate-50 text-slate-500 rounded">
                  {sk.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const getTemplateRenderer = () => {
    switch (templateId) {
      case 'creative':
        return renderCreative();
      case 'classic':
        return renderClassic();
      case 'professional':
        return renderProfessional();
      case 'ats_friendly':
        return renderAtsFriendly();
      case 'minimal':
        return renderMinimalist();
      case 'modern':
      default:
        return renderModern();
    }
  };

  return (
    <div
      id="resume-print-area"
      className={`bg-white text-slate-800 p-8 shadow-md border border-slate-150 rounded-xl transition-all max-w-[210mm] mx-auto min-h-[297mm] h-full overflow-hidden ${getFontFamilyClass()}`}
    >
      {getTemplateRenderer()}
    </div>
  );
}
