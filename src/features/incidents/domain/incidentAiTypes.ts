import type { IncidentSeverity } from './incidentTypes';

export const AI_CATEGORIES = ['availability', 'performance', 'payments', 'security', 'data', 'integration', 'deployment', 'support', 'unknown'] as const;
export const AI_RISK_FLAGS = ['security', 'data_loss', 'payment_failure', 'safety', 'compliance', 'unknown_scope'] as const;
export const AI_TASK_PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;

export type AiCategory = typeof AI_CATEGORIES[number];
export type AiRiskFlag = typeof AI_RISK_FLAGS[number];

export type AiRecommendedTask = {
  title: string;
  description: string;
  priority: (typeof AI_TASK_PRIORITIES)[number];
};

export type IncidentAnalysisResult = {
  summary: string;
  severitySuggestion: IncidentSeverity;
  category: AiCategory;
  impact: string;
  confidence: number;
  riskFlags: AiRiskFlag[];
  clarifyingQuestions: string[];
  recommendedTasks: AiRecommendedTask[];
  immediateNextAction: string;
};

export type AiReviewState = {
  status: 'pending' | 'applied';
  reviewedAt?: string;
  wasEdited?: boolean;
  appliedTaskCount?: number;
  severityChanged?: boolean;
  statusChanged?: boolean;
};

export type AiSuggestion = {
  aiRunId: string;
  analysis: IncidentAnalysisResult;
  review: AiReviewState;
  model: string;
  promptVersion: string;
  generatedAt: string;
  confidence: number;
};

export type AnalyzeIncidentInput = {
  organizationId: string;
  incidentId: string;
  requestId: string;
  forceRegenerate?: boolean;
  confirmRegenerate?: boolean;
};

export type AnalyzeIncidentResult = {
  suggestion: IncidentAnalysisResult | null;
  cached: boolean;
  model: string;
  promptVersion: string;
  reviewStatus: 'pending' | 'applied';
  repaired?: boolean;
  error?: string;
};

export type ApplyIncidentAnalysisInput = {
  organizationId: string;
  incidentId: string;
  aiRunId: string;
  requestId: string;
  analysis: IncidentAnalysisResult;
  applySeverity: boolean;
  originalAiSeverity?: IncidentSeverity;
  severityReason?: string;
  applyStatus: boolean;
  targetStatus?: string;
  selectedTasks: AiRecommendedTask[];
  wasEdited: boolean;
};

export type ApplyIncidentAnalysisResult = {
  review: AiReviewState;
  createdTasks: Array<{ id: string; title: string; priority: string; source: string }>;
  severityChanged: boolean;
  statusChanged: boolean;
};
