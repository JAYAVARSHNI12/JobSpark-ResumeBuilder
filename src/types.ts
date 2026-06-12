export type TemplateId = 'creative' | 'modern' | 'classic' | 'professional' | 'ats_friendly' | 'minimal';

export interface User {
  username: string;
  id: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // e.g., 'Beginner', 'Intermediate', 'Expert', or a custom tag
}

export interface Project {
  id: string;
  title: string;
  role: string;
  techStack: string; // Comma separated or tags
  description: string;
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: string[];
}

export interface TemplateSettings {
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'mono' | 'grotesk';
  spacing: 'compact' | 'normal' | 'relaxed';
  themeColor: string; // secondary or background tone
  showSectionIcons: boolean;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: TemplateId;
  data: ResumeData;
  settings: TemplateSettings;
  createdAt: number;
  updatedAt: number;
}
