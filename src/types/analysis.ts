export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";

export type SuggestionCategory =
  | "formatting"
  | "keywords"
  | "experience"
  | "education"
  | "skills"
  | "general";

export type SuggestionPriority = "high" | "medium" | "low";

export interface AtsScore {
  overall: number; // 0–100
  formatting: number;
  keywords: number;
  experience: number;
  education: number;
}

export interface Suggestion {
  id: string;
  category: SuggestionCategory;
  priority: SuggestionPriority;
  title: string;
  description: string;
  example?: string;
}

export interface BulletPair {
  id: string;
  section: string; // e.g. "Work Experience — Acme Corp"
  original: string;
  improved: string;
  explanation: string;
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  techStack: string[];
  relevanceReason: string;
}

export interface PortfolioCriterion {
  name: string;
  score: number; // 0–10
  feedback: string;
}

export interface PortfolioCritique {
  overallScore: number; // 0–10
  summary: string;
  strengths: string[];
  weaknesses: string[];
  criteria: PortfolioCriterion[];
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  whyAsked: string;
  tipAnswer: string;
}

export interface Analysis {
  id: string;
  userId: string;
  status: AnalysisStatus;
  createdAt: string;
  updatedAt: string;
  resumeFilename?: string;
  portfolioUrl?: string;
  jobDescription?: string;
  atsScore?: AtsScore;
  suggestions?: Suggestion[];
  bulletPairs?: BulletPair[];
  projectSuggestions?: ProjectSuggestion[];
  portfolioCritique?: PortfolioCritique;
  interviewQuestions?: InterviewQuestion[];
}

export interface HistoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: AnalysisStatus;
}
