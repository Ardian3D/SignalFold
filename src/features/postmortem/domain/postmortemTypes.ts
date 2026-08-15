export const POSTMORTEM_STATUSES = ['draft', 'in_review', 'approved', 'published'] as const;
export const POSTMORTEM_PRIORITIES = ['high', 'medium', 'low'] as const;

export type PostmortemStatus = typeof POSTMORTEM_STATUSES[number];
export type PostmortemPriority = typeof POSTMORTEM_PRIORITIES[number];

export type PostmortemTimelineEntry = {
  at: string;
  event: string;
};

export type PostmortemPreventiveAction = {
  title: string;
  ownerRole: string;
  priority: PostmortemPriority;
  suggestedDueInDays: number;
};

export type PostmortemDocument = {
  executiveSummary: string;
  impact: string;
  detection: string;
  timelineSummary: PostmortemTimelineEntry[];
  rootCause: string;
  contributingFactors: string[];
  resolution: string;
  wentWell: string[];
  wentPoorly: string[];
  preventiveActions: PostmortemPreventiveAction[];
  unknowns: string[];
};

export type Postmortem = PostmortemDocument & {
  id: string;
  organizationId: string;
  incidentId: string;
  status: PostmortemStatus;
  generatedByAi: boolean;
  aiRunId?: string;
  version: number;
  approvedByUserId?: string;
  approvedAt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isDemo: boolean;
};

export type PostmortemReadModel = {
  postmortem: Postmortem | null;
  incidentStatus?: string;
  model?: string | null;
  promptVersion?: string | null;
  generatedAt?: string | null;
  canEdit?: boolean;
  canApprove?: boolean;
  approverName?: string | null;
};

export type PostmortemDraftInput = PostmortemDocument;

export type GeneratePostmortemInput = {
  organizationId: string;
  incidentId: string;
  requestId: string;
  forceRegenerate?: boolean;
  confirmRegenerate?: boolean;
};

export type GeneratePostmortemResult = {
  postmortem: Postmortem | null;
  model?: string;
  promptVersion?: string;
  cached?: boolean;
  repaired?: boolean;
  error?: string;
};

export type SavePostmortemDraftInput = {
  organizationId: string;
  incidentId: string;
  requestId: string;
  sections: PostmortemDraftInput;
};

export type SubmitPostmortemForReviewInput = {
  organizationId: string;
  incidentId: string;
  requestId: string;
};

export type ReturnPostmortemToDraftInput = {
  organizationId: string;
  incidentId: string;
  requestId: string;
};

export type ApprovePostmortemInput = {
  organizationId: string;
  incidentId: string;
  requestId: string;
};

export type CreatePostmortemDraftInput = {
  organizationId: string;
  incidentId: string;
  requestId: string;
};

export type PostmortemActionResult = {
  postmortem: Postmortem;
  reconciled?: boolean;
};
