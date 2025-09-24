export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
}

export interface Certification {
  name: string;
  issuer: string;
  period: string;
}

export interface ResumeData {
  name: string;
  summary: string;
  skills: string[];
  languages: string[];
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
}