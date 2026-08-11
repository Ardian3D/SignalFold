import { useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  limeActionButton,
  neutralActionButton,
  primaryActionButton,
  selectControl,
  textInputControl,
  compactNeutralActionButton,
  warningActionButton,
} from '@/components/ui/operationalActions';
import type { AiSuggestion, IncidentAnalysisResult, AiRecommendedTask } from '@/features/incidents/domain/incidentAiTypes';
import { AI_CATEGORIES } from '@/features/incidents/domain/incidentAiTypes';
import type { IncidentSeverity, IncidentStatus } from '@/features/incidents/domain/incidentTypes';

const mode = 'base44';
const uuid = () => crypto.randomUUID().replaceAll('-', '_');

type ReviewDraft = IncidentAnalysisResult;

export function AiTriagePanel({
  organizationId,
  incidentId,
  canRun,
  aiSuggestion,
  allowedTransitions,
  status,
  severity,
  onAnalyzed,
  onApplied,
  gateway,
}: {
  organizationId: string;
  incidentId: string;
  canRun: boolean;
  aiSuggestion?: AiSuggestion;
  allowedTransitions: IncidentStatus[];
  status: IncidentStatus;
  severity: IncidentSeverity;
  onAnalyzed: () => void;
  onApplied: () => void;
  gateway: {
    analyzeIncident(input: { organizationId: string; incidentId: string; requestId: string; forceRegenerate?: boolean; confirmRegenerate?: boolean }): Promise<{ suggestion: IncidentAnalysisResult | null; cached: boolean; model: string; promptVersion: string; reviewStatus: 'pending' | 'applied' }>;
    applyIncidentAnalysis(input: {
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
    }): Promise<unknown>;
  };
}) {
  const requestRef = useRef(uuid());
  const [aiError, setAiError] = useState('');
  const [editing, setEditing] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  const suggestion = aiSuggestion?.analysis ?? null;
  const reviewStatus = aiSuggestion?.review.status ?? null;
  const applied = reviewStatus === 'applied';
  const canReview = canRun && Boolean(suggestion) && !applied;

  const draft = useMemo<ReviewDraft>(() => suggestion ? structuredClone(suggestion) : {
    summary: '',
    severitySuggestion: 'SEV3',
    category: 'unknown',
    impact: '',
    confidence: 0,
    riskFlags: [],
    clarifyingQuestions: [],
    recommendedTasks: [],
    immediateNextAction: '',
  }, [suggestion]);
  const [form, setForm] = useState<ReviewDraft>(draft);
  const [selectedSeverityApply, setSelectedSeverityApply] = useState(false);
  const [severityReason, setSeverityReason] = useState('');
  const [selectedStatusApply, setSelectedStatusApply] = useState(false);
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>(allowedTransitions[0] ?? 'triaging');
  const [selectedTaskIndexes, setSelectedTaskIndexes] = useState<number[]>([]);

  const syncForm = () => {
    setForm(draft);
    setSelectedSeverityApply(false);
    setSelectedStatusApply(false);
    setTargetStatus(allowedTransitions[0] ?? 'triaging');
    setSelectedTaskIndexes(draft.recommendedTasks.map((_, index) => index));
    setConfirmRegenerate(false);
    setAiError('');
    setApplyError('');
    setEditing(false);
  };

  const analyze = useMutation({
    mutationFn: () => gateway.analyzeIncident({ organizationId, incidentId, requestId: requestRef.current, ...(confirmRegenerate ? { forceRegenerate: true, confirmRegenerate: true } : {}) }),
    onSuccess: async (result) => {
      requestRef.current = uuid();
      setConfirmRegenerate(false);
      if (result.suggestion) {
        setEditing(true);
      }
      onAnalyzed();
    },
    onError: async () => {
      setAiError('AI ANALYSIS COULD NOT BE COMPLETED. YOU CAN RETRY OR CONTINUE MANUALLY.');
      requestRef.current = uuid();
    },
  });

  const apply = useMutation({
    mutationFn: () => gateway.applyIncidentAnalysis({
      organizationId,
      incidentId,
      aiRunId: aiSuggestion?.aiRunId ?? '',
      requestId: requestRef.current,
      analysis: form,
      applySeverity: selectedSeverityApply,
      originalAiSeverity: aiSuggestion?.analysis.severitySuggestion,
      severityReason: selectedSeverityApply ? severityReason.trim() || 'Applied after human review of AI-assisted triage.' : undefined,
      applyStatus: selectedStatusApply,
      targetStatus: selectedStatusApply ? targetStatus : undefined,
      selectedTasks: selectedTaskIndexes.map(index => form.recommendedTasks[index]),
      wasEdited: editing,
    }),
    onSuccess: async () => {
      requestRef.current = uuid();
      setEditing(false);
      onApplied();
    },
    onError: async () => {
      setApplyError('SUGGESTIONS COULD NOT BE APPLIED. REVIEW REQUIRED FIELDS AND RETRY.');
      requestRef.current = uuid();
    },
  });

  const toggleTask = (index: number) => {
    setSelectedTaskIndexes(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  };

  const setField = <K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const pending = analyze.isPending || apply.isPending;

  if (!canRun && !aiSuggestion) return null;

  return (
    <section className="w-full min-w-0 border border-[#242522] bg-[#0E0F0D] rounded-[2px] p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-[#D6FF3F]">AI SUGGESTION</h3>
          {aiSuggestion && (
            <p className="text-[10px] font-mono text-[#5C5E58] mt-1">
              {aiSuggestion.model.toUpperCase()} · {new Date(aiSuggestion.generatedAt).toLocaleString()} · {(aiSuggestion.confidence * 100).toFixed(0)}% CONFIDENCE · REVIEW {reviewStatus?.toUpperCase() ?? 'REQUIRED'}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canRun && !suggestion && !pending && (
            <button type="button" className={limeActionButton} onClick={() => { setAiError(''); analyze.mutate(); }}>ANALYZE WITH AI</button>
          )}
          {canRun && suggestion && !applied && !pending && (
            <>
              {editing ? (
                <>
                  <button type="button" className={compactNeutralActionButton} onClick={syncForm}>RESET</button>
                  <button type="button" className={primaryActionButton} disabled={apply.isPending} onClick={() => { setApplyError(''); apply.mutate(); }}>APPLY REVIEWED SUGGESTIONS</button>
                </>
              ) : (
                <>
                  {confirmRegenerate ? (
                    <>
                      <button type="button" className={compactNeutralActionButton} onClick={() => setConfirmRegenerate(false)}>CANCEL</button>
                      <button type="button" className={warningActionButton} onClick={() => { setAiError(''); analyze.mutate(); }}>CONFIRM REGENERATE</button>
                    </>
                  ) : (
                    <button type="button" className={compactNeutralActionButton} onClick={() => setConfirmRegenerate(true)}>REGENERATE</button>
                  )}
                  <button type="button" className={limeActionButton} onClick={() => setEditing(true)}>REVIEW SUGGESTIONS</button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {pending && <p aria-live="polite" className="text-sm text-[#A8AAA3]">Analyzing with DeepSeek. The incident and manual workflows remain available.</p>}
      {aiError && <p aria-live="polite" className="text-sm text-amber-400">{aiError}</p>}
      {applyError && <p aria-live="polite" className="text-sm text-amber-400">{applyError}</p>}

      {!suggestion && !pending && (
        <p className="text-sm text-[#A8AAA3]">No AI analysis exists for this incident. Run an analysis to receive a structured suggestion that remains pending human review.</p>
      )}

      {suggestion && (
        <div className="space-y-3">
          <ReviewField label="SUMMARY" editing={editing && canReview}>
            <textarea aria-label="AI summary" value={form.summary} maxLength={2000} readOnly={!editing} onChange={event => setField('summary', event.target.value)} className={`w-full min-h-16 ${textInputControl} ${editing ? '' : 'readonly-surface'}`} />
          </ReviewField>
          <div className="grid sm:grid-cols-2 gap-3">
            <ReviewField label="SUGGESTED SEVERITY" editing={editing && canReview}>
              <select aria-label="AI severity suggestion" value={form.severitySuggestion} disabled={!editing} onChange={event => setField('severitySuggestion', event.target.value as IncidentSeverity)} className={`w-full ${selectControl}`}><option value="SEV1">SEV1</option><option value="SEV2">SEV2</option><option value="SEV3">SEV3</option><option value="SEV4">SEV4</option></select>
            </ReviewField>
            <ReviewField label="CATEGORY" editing={editing && canReview}>
              <select aria-label="AI category" value={form.category} disabled={!editing} onChange={event => setField('category', event.target.value as IncidentAnalysisResult['category'])} className={`w-full ${selectControl}`}>{AI_CATEGORIES.map(value => <option key={value}>{value}</option>)}</select>
            </ReviewField>
          </div>
          <ReviewField label="IMPACT" editing={editing && canReview}>
            <textarea aria-label="AI impact" value={form.impact} maxLength={1000} readOnly={!editing} onChange={event => setField('impact', event.target.value)} className={`w-full min-h-14 ${textInputControl} ${editing ? '' : 'readonly-surface'}`} />
          </ReviewField>
          <div>
            <p className="text-[10px] font-mono text-[#5C5E58] font-bold uppercase">RISK FLAGS</p>
            {form.riskFlags.length === 0 ? <p className="text-xs text-[#A8AAA3]">None identified.</p> : <div className="flex flex-wrap gap-2 mt-1">{form.riskFlags.map(flag => <span key={flag} className="text-[10px] font-mono uppercase border border-amber-500/30 bg-amber-500/5 text-amber-400 px-2 py-1">{flag}</span>)}</div>}
          </div>
          {form.clarifyingQuestions.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-[#5C5E58] font-bold uppercase">CLARIFYING QUESTIONS</p>
              <ul className="list-disc list-inside mt-1 space-y-1">{form.clarifyingQuestions.map((question, index) => <li key={index} className="text-xs text-[#A8AAA3]">{question}</li>)}</ul>
            </div>
          )}
          {form.recommendedTasks.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-[#5C5E58] font-bold uppercase">RECOMMENDED TASKS</p>
              <div className="space-y-2 mt-1">
                {form.recommendedTasks.map((task, index) => (
                  <div key={index} className="border border-[#242522] bg-[#141513]/40 p-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <input aria-label={`Task title ${index + 1}`} value={task.title} maxLength={160} readOnly={!editing} onChange={event => setForm(current => ({ ...current, recommendedTasks: current.recommendedTasks.map((item, i) => i === index ? { ...item, title: event.target.value } : item) }))} className={`w-full ${textInputControl} ${editing ? '' : 'readonly-surface'}`} />
                        <input aria-label={`Task description ${index + 1}`} value={task.description} maxLength={2000} readOnly={!editing} onChange={event => setForm(current => ({ ...current, recommendedTasks: current.recommendedTasks.map((item, i) => i === index ? { ...item, description: event.target.value } : item) }))} className={`w-full ${textInputControl} ${editing ? '' : 'readonly-surface'}`} placeholder="Optional description" />
                      </div>
                      <select aria-label={`Task priority ${index + 1}`} value={task.priority} disabled={!editing} onChange={event => setForm(current => ({ ...current, recommendedTasks: current.recommendedTasks.map((item, i) => i === index ? { ...item, priority: event.target.value as AiRecommendedTask['priority'] } : item) }))} className={selectControl}>{['critical', 'high', 'medium', 'low'].map(value => <option key={value}>{value}</option>)}</select>
                    </div>
                    {canReview && editing && (
                      <label className="flex items-center gap-2 text-xs text-[#A8AAA3]"><input type="checkbox" checked={selectedTaskIndexes.includes(index)} onChange={() => toggleTask(index)} />INCLUDE IN APPLY</label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <ReviewField label="IMMEDIATE NEXT ACTION" editing={editing && canReview}>
            <textarea aria-label="AI immediate next action" value={form.immediateNextAction} maxLength={1000} readOnly={!editing} onChange={event => setField('immediateNextAction', event.target.value)} className={`w-full min-h-12 ${textInputControl} ${editing ? '' : 'readonly-surface'}`} />
          </ReviewField>

          {canReview && editing && (
            <div className="space-y-3 border-t border-[#242522] pt-3">
              <label className="flex items-center gap-2 text-xs text-[#A8AAA3]">
                <input type="checkbox" checked={selectedSeverityApply} onChange={event => setSelectedSeverityApply(event.target.checked)} />
                APPLY SUGGESTED SEVERITY {form.severitySuggestion} (currently {severity}) — severity_source {form.severitySuggestion === severity ? 'unchanged' : form.severitySuggestion === aiSuggestion?.analysis.severitySuggestion ? 'ai_suggested' : 'human'}
              </label>
              {selectedSeverityApply && form.severitySuggestion !== severity && (
                <label className="block text-xs text-[#A8AAA3]">SEVERITY REASON *<input aria-label="AI severity apply reason" value={severityReason} onChange={event => setSeverityReason(event.target.value)} className={`mt-2 w-full ${textInputControl}`} placeholder="Applied after human review of AI-assisted triage." /></label>
              )}
              {allowedTransitions.length > 0 && (
                <label className="flex items-center gap-2 text-xs text-[#A8AAA3]">
                  <input type="checkbox" checked={selectedStatusApply} onChange={event => setSelectedStatusApply(event.target.checked)} />
                  ADVANCE STATUS TO
                  <select aria-label="AI review target status" value={targetStatus} disabled={!selectedStatusApply} onChange={event => setTargetStatus(event.target.value as IncidentStatus)} className={selectControl}>{allowedTransitions.map(value => <option key={value} value={value}>{value}</option>)}</select>
                </label>
              )}
              <div className="flex flex-wrap gap-2">
                <button type="button" className={primaryActionButton} disabled={apply.isPending} onClick={() => { setApplyError(''); apply.mutate(); }}>{apply.isPending ? 'APPLYING...' : 'APPLY REVIEWED SUGGESTIONS'}</button>
                <button type="button" className={neutralActionButton} onClick={syncForm}>RESET</button>
              </div>
            </div>
          )}

          {applied && (
            <p className="text-xs font-mono text-emerald-500 uppercase">AI SUGGESTION APPLIED · REVIEW COMPLETE</p>
          )}
        </div>
      )}
    </section>
  );
}

const ReviewField = ({ label, editing, children }: { label: string; editing: boolean; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-mono text-[#5C5E58] font-bold uppercase">{label}{editing && ' *'}</p>
    <div className="mt-1">{children}</div>
  </div>
);
