import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import {
  compactNeutralActionButton,
  limeActionButton,
  neutralActionButton,
  primaryActionButton,
  secondaryActionButton,
  selectControl,
  textInputControl,
  warningActionButton,
} from '@/components/ui/operationalActions';
import { useOrganization } from '@/features/organization/OrganizationProvider';
import { canRole } from '@/features/organization/domain/capabilities';
import { getOperationalGateway } from '@/features/operations/operationalGateway';
import { postmortemQueryKeys } from '@/features/postmortem/queryKeys';
import type { Postmortem, PostmortemDocument, PostmortemReadModel, PostmortemTimelineEntry } from '@/features/postmortem/domain/postmortemTypes';
import { POSTMORTEM_PRIORITIES } from '@/features/postmortem/domain/postmortemTypes';

const mode = 'base44';
const id = () => crypto.randomUUID().replaceAll('-', '_');

const emptyDocument = (): PostmortemDocument => ({
  executiveSummary: '',
  impact: '',
  detection: '',
  timelineSummary: [],
  rootCause: '',
  contributingFactors: [],
  resolution: '',
  wentWell: [],
  wentPoorly: [],
  preventiveActions: [],
  unknowns: [],
});

const Panel = ({ children, title, right }: { children: React.ReactNode; title: string; right?: React.ReactNode }) => (
  <section className="border border-[#242522] bg-[#0A0A0A] rounded-[2px]">
    <div className="border-b border-[#242522] bg-[#0F100D] px-4 py-3 flex items-center justify-between gap-3">
      <h3 className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>{title}</h3>
      {right}
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </section>
);

const Field = ({ label, value, onChange, textarea, maxLength, disabled }: { label: string; value: string; onChange?: (next: string) => void; textarea?: boolean; maxLength?: number; disabled?: boolean }) => (
  <label className="block text-xs text-[#A8AAA3]">
    {label}
    {textarea ? (
      <textarea value={value} maxLength={maxLength} disabled={disabled} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className={`mt-2 w-full min-h-24 ${textInputControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} />
    ) : (
      <input value={value} maxLength={maxLength} disabled={disabled} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className={`mt-2 w-full ${textInputControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} />
    )}
  </label>
);

const StringListField = ({ label, value, onChange, disabled }: { label: string; value: string[]; onChange?: (next: string[]) => void; disabled?: boolean }) => (
  <div>
    <p className="text-xs text-[#A8AAA3]">{label}</p>
    <div className="mt-2 space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input value={item} disabled={disabled} onChange={onChange ? (event) => onChange(value.map((v, i) => (i === index ? event.target.value : v))) : undefined} className={`flex-1 ${textInputControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} />
          {onChange && !disabled && <button type="button" className={compactNeutralActionButton} onClick={() => onChange(value.filter((_, i) => i !== index))}>REMOVE</button>}
        </div>
      ))}
      {onChange && !disabled && <button type="button" className={limeActionButton} onClick={() => onChange([...value, ''])}>ADD {label}</button>}
    </div>
  </div>
);

const TimelineField = ({ value, onChange, disabled }: { value: PostmortemTimelineEntry[]; onChange?: (next: PostmortemTimelineEntry[]) => void; disabled?: boolean }) => (
  <div>
    <p className="text-xs text-[#A8AAA3]">TIMELINE SUMMARY</p>
    <div className="mt-2 space-y-2">
      {value.map((entry, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2">
          <input aria-label={`Timeline time ${index + 1}`} value={entry.at} disabled={disabled} onChange={onChange ? (event) => onChange(value.map((v, i) => (i === index ? { ...v, at: event.target.value } : v))) : undefined} className={`sm:w-40 ${textInputControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="Time" />
          <input aria-label={`Timeline event ${index + 1}`} value={entry.event} disabled={disabled} onChange={onChange ? (event) => onChange(value.map((v, i) => (i === index ? { ...v, event: event.target.value } : v))) : undefined} className={`flex-1 ${textInputControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="Event" />
          {onChange && !disabled && <button type="button" className={compactNeutralActionButton} onClick={() => onChange(value.filter((_, i) => i !== index))}>REMOVE</button>}
        </div>
      ))}
      {onChange && !disabled && <button type="button" className={limeActionButton} onClick={() => onChange([...value, { at: '', event: '' }])}>ADD EVENT</button>}
    </div>
  </div>
);

const PreventiveActionsField = ({ value, onChange, disabled }: { value: PostmortemDocument['preventiveActions']; onChange?: (next: PostmortemDocument['preventiveActions']) => void; disabled?: boolean }) => (
  <div>
    <p className="text-xs text-[#A8AAA3]">PREVENTIVE ACTIONS (RECOMMENDATIONS ONLY — NOT AUTOMATIC TASKS)</p>
    <div className="mt-2 space-y-3">
      {value.map((action, index) => (
        <div key={index} className="space-y-2 border border-[#242522] bg-[#141513]/40 p-3 rounded-[1px]">
          <div className="flex gap-2">
            <input aria-label={`Preventive action title ${index + 1}`} value={action.title} disabled={disabled} onChange={onChange ? (event) => onChange(value.map((v, i) => (i === index ? { ...v, title: event.target.value } : v))) : undefined} className={`flex-1 ${textInputControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="Title" />
            {onChange && !disabled && <button type="button" className={compactNeutralActionButton} onClick={() => onChange(value.filter((_, i) => i !== index))}>REMOVE</button>}
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
            <input aria-label={`Preventive action owner role ${index + 1}`} value={action.ownerRole} disabled={disabled} onChange={onChange ? (event) => onChange(value.map((v, i) => (i === index ? { ...v, ownerRole: event.target.value } : v))) : undefined} className={`${textInputControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="Owner role" />
            <select aria-label={`Preventive action priority ${index + 1}`} value={action.priority} disabled={disabled} onChange={onChange ? (event) => onChange(value.map((v, i) => (i === index ? { ...v, priority: event.target.value as PostmortemDocument['preventiveActions'][number]['priority'] } : v))) : undefined} className={`${selectControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>{POSTMORTEM_PRIORITIES.map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select>
            <input aria-label={`Preventive action due days ${index + 1}`} type="number" min={0} max={365} value={action.suggestedDueInDays} disabled={disabled} onChange={onChange ? (event) => onChange(value.map((v, i) => (i === index ? { ...v, suggestedDueInDays: Math.max(0, Math.min(365, Number(event.target.value) || 0)) } : v))) : undefined} className={`${textInputControl} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="Due in days" />
          </div>
        </div>
      ))}
      {onChange && !disabled && <button type="button" className={limeActionButton} onClick={() => onChange([...value, { title: '', ownerRole: '', priority: 'medium', suggestedDueInDays: 30 }])}>ADD ACTION</button>}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    draft: 'border-[#A8AAA3]/40 text-[#A8AAA3]',
    in_review: 'border-amber-500/40 text-amber-400',
    approved: 'border-emerald-500/40 text-emerald-400',
    published: 'border-[#D6FF3F]/40 text-[#D6FF3F]',
  };
  return <span className={`px-2 py-0.5 border rounded-[1px] text-[10px] font-mono font-bold tracking-widest uppercase ${colors[status] ?? 'border-[#242522] text-[#A8AAA3]'}`}>{status.replaceAll('_', ' ').toUpperCase()}</span>;
};

export function PostmortemPage() {
  const { context } = useOrganization();
  const org = context!.organization;
  const role = context!.membership.role;
  const gateway = useMemo(getOperationalGateway, []);
  const qc = useQueryClient();
  const { incidentId } = useParams();
  const [draft, setDraft] = useState<PostmortemDocument>(emptyDocument);
  const [loadedKey, setLoadedKey] = useState('');
  const [savedNotice, setSavedNotice] = useState('');
  const [error, setError] = useState('');
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const request = useRef(id());

  const canAuthor = canRole(role, 'GENERATE_POSTMORTEM') && canRole(role, 'APPROVE_POSTMORTEM');

  const query = useQuery({
    queryKey: postmortemQueryKeys.read(mode, org.id, incidentId ?? ''),
    queryFn: () => gateway.getPostmortem(org.id, incidentId!),
    enabled: Boolean(incidentId),
  });

  const data: PostmortemReadModel | undefined = query.data;
  const postmortem: Postmortem | null = data?.postmortem ?? null;
  const incidentStatus = data?.incidentStatus ?? '';
  const eligible = incidentStatus === 'resolved' || incidentStatus === 'closed';
  const aiProvenance = postmortem?.generatedByAi ? { model: data?.model, promptVersion: data?.promptVersion, generatedAt: data?.generatedAt } : null;

  useEffect(() => {
    if (postmortem && loadedKey !== postmortem.id) {
      setDraft({
        executiveSummary: postmortem.executiveSummary,
        impact: postmortem.impact,
        detection: postmortem.detection,
        timelineSummary: postmortem.timelineSummary,
        rootCause: postmortem.rootCause,
        contributingFactors: postmortem.contributingFactors,
        resolution: postmortem.resolution,
        wentWell: postmortem.wentWell,
        wentPoorly: postmortem.wentPoorly,
        preventiveActions: postmortem.preventiveActions,
        unknowns: postmortem.unknowns,
      });
      setLoadedKey(postmortem.id);
      setSavedNotice('');
      setError('');
    }
  }, [postmortem, loadedKey]);

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: postmortemQueryKeys.read(mode, org.id, incidentId ?? '') });
  };

  const generate = useMutation({
    mutationFn: () => gateway.generatePostmortem({ organizationId: org.id, incidentId: incidentId!, requestId: request.current, forceRegenerate: confirmRegenerate ? true : undefined, confirmRegenerate: confirmRegenerate ? true : undefined }),
    onSuccess: async (result) => {
      request.current = id();
      setConfirmRegenerate(false);
      if (result.error) { setError('AI POSTMORTEM GENERATION COULD NOT BE COMPLETED. YOU CAN RETRY OR CREATE A MANUAL DRAFT.'); return; }
      await invalidate();
      setSavedNotice('DRAFT GENERATED');
    },
    onError: async () => {
      request.current = id();
      setConfirmRegenerate(false);
      setError('AI POSTMORTEM GENERATION COULD NOT BE COMPLETED. YOU CAN RETRY OR CREATE A MANUAL DRAFT.');
      await invalidate();
    },
  });

  const createManual = useMutation({
    mutationFn: () => gateway.createPostmortemDraft({ organizationId: org.id, incidentId: incidentId!, requestId: request.current }),
    onSuccess: async () => { request.current = id(); await invalidate(); setSavedNotice('MANUAL DRAFT CREATED'); },
    onError: () => setError('MANUAL DRAFT COULD NOT BE CREATED.'),
  });

  const save = useMutation({
    mutationFn: () => gateway.savePostmortemDraft({ organizationId: org.id, incidentId: incidentId!, requestId: request.current, sections: draft }),
    onSuccess: async () => { request.current = id(); await invalidate(); setSavedNotice('DRAFT SAVED'); setError(''); },
    onError: () => setError('DRAFT COULD NOT BE SAVED. REVIEW THE SECTIONS.'),
  });

  const submit = useMutation({
    mutationFn: () => gateway.submitPostmortemForReview({ organizationId: org.id, incidentId: incidentId!, requestId: request.current }),
    onSuccess: async () => { request.current = id(); await invalidate(); setSavedNotice('SUBMITTED FOR REVIEW'); },
    onError: async () => { setError('COULD NOT SUBMIT FOR REVIEW. COMPLETE THE REQUIRED SECTIONS.'); await invalidate(); },
  });

  const returnToDraft = useMutation({
    mutationFn: () => gateway.returnPostmortemToDraft({ organizationId: org.id, incidentId: incidentId!, requestId: request.current }),
    onSuccess: async () => { request.current = id(); await invalidate(); setSavedNotice('RETURNED TO DRAFT'); },
    onError: () => setError('COULD NOT RETURN THE POSTMORTEM TO DRAFT.'),
  });

  const approve = useMutation({
    mutationFn: () => gateway.approvePostmortem({ organizationId: org.id, incidentId: incidentId!, requestId: request.current }),
    onSuccess: async () => { request.current = id(); await invalidate(); setSavedNotice('APPROVED'); },
    onError: () => setError('APPROVAL FAILED. THE POSTMORTEM MUST BE IN REVIEW WITH COMPLETE CONTENT.'),
  });

  const copy = async () => {
    const text = [
      `POSTMORTEM / ${postmortem?.version ?? 1}`,
      `Status: ${postmortem?.status ?? ''}`,
      '',
      `Executive Summary: ${draft.executiveSummary}`,
      `Impact: ${draft.impact}`,
      `Detection: ${draft.detection}`,
      `Root Cause: ${draft.rootCause}`,
      `Resolution: ${draft.resolution}`,
      '',
      'Timeline:',
      ...draft.timelineSummary.map(entry => `- ${entry.at}: ${entry.event}`),
      '',
      'Contributing Factors:',
      ...draft.contributingFactors.map(item => `- ${item}`),
      '',
      'What Went Well:',
      ...draft.wentWell.map(item => `- ${item}`),
      '',
      'What Went Poorly:',
      ...draft.wentPoorly.map(item => `- ${item}`),
      '',
      'Preventive Actions:',
      ...draft.preventiveActions.map(action => `- ${action.title} [${action.priority.toUpperCase()}] / ${action.ownerRole} / due ${action.suggestedDueInDays} days`),
      '',
      'Unknowns:',
      ...draft.unknowns.map(item => `- ${item}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setSavedNotice('COPIED');
    } catch {
      setError('COPY FAILED. CLIPBOARD UNAVAILABLE.');
    }
  };

  if (query.isPending) return <div className="space-y-6"><Panel title="POSTMORTEM">LOADING POSTMORTEM...</Panel></div>;
  if (query.isError) return <div className="space-y-6"><Panel title="POSTMORTEM">POSTMORTEM DATA IS TEMPORARILY UNAVAILABLE. <button type="button" className={neutralActionButton} onClick={() => void query.refetch()}>RETRY</button></Panel></div>;

  const readOnly = postmortem?.status === 'approved' || postmortem?.status === 'published';
  const editing = postmortem?.status === 'draft' && canAuthor;
  const reviewing = postmortem?.status === 'in_review';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-left pb-16">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono tracking-wider text-[#5C5E58] uppercase">
        <Link to="/app" className="hover:text-[#D6FF3F] transition-colors">DASHBOARD</Link>
        <span aria-hidden="true">/</span>
        <Link to="/app/incidents" className="hover:text-[#D6FF3F] transition-colors">INCIDENTS</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/app/incidents/${incidentId}`} className="hover:text-[#D6FF3F] transition-colors">INCIDENT ROOM</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#A8AAA3]">POSTMORTEM</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-[#242522]">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            {aiProvenance ? 'AI-GENERATED DRAFT' : postmortem ? 'POSTMORTEM RECORD' : 'POSTMORTEM WORKSPACE'}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F3F1EA] uppercase" style={{ fontFamily: 'var(--font-display)' }}>POSTMORTEM</h2>
            {postmortem && <StatusBadge status={postmortem.status} />}
            {postmortem && <span className="text-xs font-mono text-[#5C5E58]">VERSION {postmortem.version}</span>}
          </div>
          {aiProvenance && (
            <div className="text-[10px] font-mono text-[#5C5E58] space-y-0.5">
              {aiProvenance.model && <p>MODEL · {aiProvenance.model}</p>}
              {aiProvenance.promptVersion && <p>PROMPT · {aiProvenance.promptVersion}</p>}
              {aiProvenance.generatedAt && <p>GENERATED · {new Date(aiProvenance.generatedAt).toLocaleString()}</p>}
            </div>
          )}
          {postmortem?.approvedAt && (
            <div className="text-[10px] font-mono text-emerald-400 space-y-0.5">
              <p>APPROVED AT · {new Date(postmortem.approvedAt).toLocaleString()}</p>
              {data?.approverName && <p>APPROVED BY · {data.approverName}</p>}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start">
          <Link to={`/app/incidents/${incidentId}`} className={neutralActionButton}>BACK TO INCIDENT</Link>
          {postmortem && !readOnly && <button type="button" className={compactNeutralActionButton} onClick={() => void copy()}>COPY POSTMORTEM</button>}
          {readOnly && <button type="button" className={compactNeutralActionButton} onClick={() => void copy()}>COPY POSTMORTEM</button>}
        </div>
      </div>

      {error && <p aria-live="polite" className="border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs font-mono text-amber-400">{error}</p>}
      {savedNotice && <p aria-live="polite" className="border border-[#D6FF3F]/30 bg-[#D6FF3F]/5 px-3 py-2 text-xs font-mono text-[#D6FF3F]">{savedNotice}</p>}

      {!eligible && !postmortem && (
        <Panel title="POSTMORTEM ELIGIBILITY">
          <p className="text-sm text-[#A8AAA3]">A postmortem can only be generated once the incident is RESOLVED or CLOSED. Current status: {incidentStatus.toUpperCase() || 'UNKNOWN'}.</p>
        </Panel>
      )}

      {!postmortem && eligible && (
        <Panel title="POSTMORTEM">
          {generate.isPending ? (
            <p className="text-sm text-[#A8AAA3]">GENERATING POSTMORTEM WITH AI...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#A8AAA3]">Generate a structured postmortem draft from the authoritative incident record. The AI draft requires human review and approval.</p>
              <div className="flex flex-wrap gap-2">
                {canAuthor && <button type="button" className={primaryActionButton} onClick={() => generate.mutate()}>GENERATE POSTMORTEM</button>}
                {canAuthor && <button type="button" className={limeActionButton} disabled={createManual.isPending} onClick={() => createManual.mutate()}>{createManual.isPending ? 'CREATING...' : 'CREATE MANUAL DRAFT'}</button>}
              </div>
            </div>
          )}
        </Panel>
      )}

      {postmortem && (
        <div className="space-y-6">
          {confirmRegenerate && postmortem.status === 'draft' && (
            <Panel title="REGENERATION CONFIRMATION">
              <p className="text-sm text-[#A8AAA3]">Regeneration may replace the current draft content. Any unsaved local edits must be saved or discarded first. The version will increment, and the prior AiRun remains in history. An approved postmortem can never be regenerated.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className={warningActionButton} disabled={generate.isPending} onClick={() => generate.mutate()}>{generate.isPending ? 'GENERATING...' : 'CONFIRM REGENERATE'}</button>
                <button type="button" className={neutralActionButton} onClick={() => setConfirmRegenerate(false)}>CANCEL</button>
              </div>
            </Panel>
          )}

          <div className="space-y-6">
            <Panel title="01 / EXECUTIVE SUMMARY">
              <Field label="EXECUTIVE SUMMARY" textarea maxLength={4000} value={draft.executiveSummary} onChange={(next) => setDraft({ ...draft, executiveSummary: next })} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="02 / CUSTOMER & BUSINESS IMPACT">
              <Field label="IMPACT" textarea maxLength={4000} value={draft.impact} onChange={(next) => setDraft({ ...draft, impact: next })} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="03 / DETECTION">
              <Field label="DETECTION" textarea maxLength={2000} value={draft.detection} onChange={(next) => setDraft({ ...draft, detection: next })} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="04 / TIMELINE SUMMARY">
              <TimelineField value={draft.timelineSummary} onChange={editing && !readOnly ? (next) => setDraft({ ...draft, timelineSummary: next }) : undefined} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="05 / ROOT CAUSE">
              <Field label="ROOT CAUSE (MAY STATE UNKNOWN)" textarea maxLength={4000} value={draft.rootCause} onChange={(next) => setDraft({ ...draft, rootCause: next })} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="06 / CONTRIBUTING FACTORS">
              <StringListField label="CONTRIBUTING FACTORS" value={draft.contributingFactors} onChange={editing && !readOnly ? (next) => setDraft({ ...draft, contributingFactors: next }) : undefined} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="07 / RESOLUTION">
              <Field label="RESOLUTION" textarea maxLength={4000} value={draft.resolution} onChange={(next) => setDraft({ ...draft, resolution: next })} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="08 / WHAT WENT WELL">
              <StringListField label="WHAT WENT WELL" value={draft.wentWell} onChange={editing && !readOnly ? (next) => setDraft({ ...draft, wentWell: next }) : undefined} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="09 / WHAT WENT POORLY">
              <StringListField label="WHAT WENT POORLY" value={draft.wentPoorly} onChange={editing && !readOnly ? (next) => setDraft({ ...draft, wentPoorly: next }) : undefined} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="10 / PREVENTIVE ACTIONS">
              <PreventiveActionsField value={draft.preventiveActions} onChange={editing && !readOnly ? (next) => setDraft({ ...draft, preventiveActions: next }) : undefined} disabled={!editing || readOnly} />
            </Panel>
            <Panel title="11 / UNKNOWNS">
              <StringListField label="UNKNOWNS" value={draft.unknowns} onChange={editing && !readOnly ? (next) => setDraft({ ...draft, unknowns: next }) : undefined} disabled={!editing || readOnly} />
            </Panel>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#242522]">
            {editing && !readOnly && (
              <>
                <button type="button" disabled={save.isPending} className={primaryActionButton} onClick={() => save.mutate()}>{save.isPending ? 'SAVING...' : 'SAVE DRAFT'}</button>
                <button type="button" disabled={submit.isPending} className={secondaryActionButton} onClick={() => submit.mutate()}>{submit.isPending ? 'SUBMITTING...' : 'SUBMIT FOR REVIEW'}</button>
                <button type="button" className={neutralActionButton} onClick={() => setConfirmRegenerate(value => !value)}>REGENERATE</button>
              </>
            )}
            {reviewing && canAuthor && (
              <>
                <button type="button" disabled={approve.isPending} className={primaryActionButton} onClick={() => approve.mutate()}>{approve.isPending ? 'APPROVING...' : 'APPROVE POSTMORTEM'}</button>
                <button type="button" disabled={returnToDraft.isPending} className={neutralActionButton} onClick={() => returnToDraft.mutate()}>{returnToDraft.isPending ? 'RETURNING...' : 'RETURN TO DRAFT'}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
