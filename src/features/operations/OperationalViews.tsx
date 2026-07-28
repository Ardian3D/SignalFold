import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  compactNeutralActionButton,
  interactiveNavRow,
  limeActionButton,
  neutralActionButton,
  primaryActionButton,
  selectControl,
  tabButton,
  tabButtonActive,
  tabButtonInactive,
  textInputControl,
  warningActionButton,
} from '@/components/ui/operationalActions';
import { useOrganization } from '@/features/organization/OrganizationProvider';
import { canRole } from '@/features/organization/domain/capabilities';
import { getOperationalGateway } from './operationalGateway';
import { operationalQueryKeys } from './queryKeys';
import { taskQueryKeys } from '@/features/tasks/queryKeys';
import { timelineQueryKeys } from '@/features/timeline/queryKeys';
import type { IncidentSeverity, IncidentStatus } from '@/features/incidents/domain/incidentTypes';
import { getTaskActionVisibility, type IncidentTask } from '@/features/tasks/domain/taskTypes';
import type { SafeOrganizationMember } from '@/features/organization/domain/organizationTypes';

const mode = 'base44';
const emptySummary = { total: 0, todo: 0, inProgress: 0, blocked: 0, done: 0, cancelled: 0, criticalOpen: 0, overdue: 0, unassigned: 0 };
const id = () => crypto.randomUUID().replaceAll('-', '_');
const Panel = ({ children }: { children: React.ReactNode }) => <section className="w-full min-w-0 border border-[#242522] bg-[#0A0A0A] rounded-[2px] p-4 sm:p-6">{children}</section>;
const State = ({ children, retry }: { children: React.ReactNode; retry?: () => void }) => <Panel><div className="w-full min-w-0 text-center py-10 space-y-4"><p className="text-sm text-[#A8AAA3]">{children}</p>{retry && <button type="button" className={neutralActionButton} onClick={retry}>RETRY</button>}</div></Panel>;
const memberName = (members: SafeOrganizationMember[], userId?: string) => members.find(member => member.userId === userId)?.displayName ?? members.find(member => member.userId === userId)?.email ?? userId ?? 'UNASSIGNED';
const statusLabel = (value: string) => value.replaceAll('_', ' ').toUpperCase();

export function LiveDashboard() {
  const { context, selectActiveOrganization } = useOrganization();
  const org = context!.organization;
  const role = context!.membership.role;
  const gateway = useMemo(getOperationalGateway, []);
  const qc = useQueryClient();
  const query = useQuery({ queryKey: operationalQueryKeys.dashboard(mode, org.id), queryFn: () => gateway.getDashboardOverview(org.id) });
  const seed = useMutation({ mutationFn: () => gateway.seedDemoData(org.id, id()), onSuccess: async result => { await selectActiveOrganization(result.organizationId); await qc.invalidateQueries({ queryKey: ['operations'] }); } });

  if (query.isPending) return <State>LOADING OPERATIONAL OVERVIEW...</State>;
  if (query.isError) return <State retry={() => void query.refetch()}>DASHBOARD DATA IS TEMPORARILY UNAVAILABLE.</State>;
  const d = query.data;
  const taskSummary = d.taskSummary ?? emptySummary;
  const openTasks = d.openTasks ?? taskSummary.todo + taskSummary.inProgress + taskSummary.blocked;

  if (d.recentIncidents.length === 0) {
    return <div className="w-full min-w-0 flex justify-center"><Panel><div data-testid="dashboard-empty-text-stack" className="space-y-4" style={{ display: 'block', width: '100%', minWidth: 0, textAlign: 'center', writingMode: 'horizontal-tb' }}><h2 className="text-2xl font-bold text-[#F3F1EA]">NO INCIDENT RECORDS YET</h2><p data-testid="dashboard-empty-description" className="text-[#A8AAA3]" style={{ display: 'block', width: '100%', maxWidth: '36rem', minWidth: 0, marginInline: 'auto', whiteSpace: 'normal', wordBreak: 'normal', overflowWrap: 'normal', writingMode: 'horizontal-tb' }}>Create the first incident for this workspace or load the canonical demo workspace.</p><div className="flex flex-wrap justify-center gap-3"><Link to="/app/incidents/new" className={primaryActionButton}>CREATE FIRST INCIDENT</Link>{role === 'admin' && <button type="button" disabled={seed.isPending} onClick={() => seed.mutate()} className={limeActionButton}>{seed.isPending ? 'LOADING...' : 'LOAD DEMO WORKSPACE'}</button>}</div></div></Panel></div>;
  }

  return <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        ['ACTIVE', d.activeIncidentsCount],
        ['SEV1 / SEV2', d.sev1Sev2Active],
        ['RESOLVED THIS WEEK', d.resolvedThisWeek],
        ['OPEN TASKS', openTasks],
      ].map(([label, value]) => <Panel key={label}><p className="text-[10px] font-mono text-[#5C5E58]">{label}</p><p className="text-2xl text-[#F3F1EA]">{value}</p></Panel>)}
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <Panel>
        <h2 className="font-bold text-[#F3F1EA] mb-4">ACTIVE INCIDENTS</h2>
        {d.activeIncidents.length === 0 ? <p className="text-sm text-[#A8AAA3]">No active incidents.</p> : d.activeIncidents.map(incident => <Link key={incident.id} to={`/app/incidents/${incident.id}`} className={`block ${interactiveNavRow}`}>{incident.code} · {incident.title}</Link>)}
        <div className="mt-4 border-t border-[#242522] pt-4 space-y-1 text-xs font-mono text-[#A8AAA3]">
          <p>NEEDS ATTENTION · {d.needsAttention.length} INCIDENTS</p>
          <p>TEAM LOAD · {d.teamLoad.filter(member => member.total > 0).length} ACTIVE MEMBERS</p>
        </div>
      </Panel>
      <Panel>
        <h2 className="font-bold text-[#F3F1EA] mb-4">RECENT ACTIVITY</h2>
        {d.recentActivity.length === 0 ? <p className="text-sm text-[#A8AAA3]">No timeline activity yet.</p> : d.recentActivity.map(update => <p key={update.id} className="border-t border-[#242522] py-3 text-sm text-[#A8AAA3]">{update.message}</p>)}
      </Panel>
    </div>
  </div>;
}

export function LiveServices() {
  const { context, members, refreshMembers } = useOrganization();
  const org = context!.organization;
  const role = context!.membership.role;
  const gateway = useMemo(getOperationalGateway, []);
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', description: '', criticality: 'medium' as const, operationalStatus: 'operational' as const, ownerUserId: '', tags: '' });
  const [formError, setFormError] = useState('');
  const request = useRef(id());
  useEffect(() => { if (role === 'admin' && members.length === 0) void refreshMembers(); }, [role, members.length, refreshMembers]);
  const query = useQuery({ queryKey: operationalQueryKeys.services(mode, org.id), queryFn: () => gateway.listServices(org.id, true) });
  const create = useMutation({ mutationFn: () => gateway.createService(org.id, { name: form.name.trim(), description: form.description.trim() || undefined, criticality: form.criticality, operationalStatus: form.operationalStatus, ownerUserId: form.ownerUserId || undefined, tags: [...new Set(form.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 12), requestId: request.current }), onSuccess: async () => { setForm({ name: '', description: '', criticality: 'medium', operationalStatus: 'operational', ownerUserId: '', tags: '' }); request.current = id(); await Promise.all([qc.invalidateQueries({ queryKey: operationalQueryKeys.services(mode, org.id) }), qc.invalidateQueries({ queryKey: operationalQueryKeys.incidentServiceOptions(mode, org.id) }), qc.invalidateQueries({ queryKey: operationalQueryKeys.dashboard(mode, org.id) })]); }, onError: () => setFormError('SERVICE CREATION FAILED. REVIEW THE VALUES AND TRY AGAIN.') });
  if (query.isPending) return <State>LOADING SERVICES...</State>;
  if (query.isError) return <State retry={() => void query.refetch()}>SERVICE CATALOG IS TEMPORARILY UNAVAILABLE.</State>;
  return <div className="space-y-6"><div><h2 className="text-3xl font-bold text-[#F3F1EA]">SERVICES</h2><p className="text-sm text-[#A8AAA3]">Authoritative services for {org.name}.</p></div>{canRole(role, 'MANAGE_SERVICES') && <Panel><form className="grid md:grid-cols-2 gap-4" onSubmit={event => { event.preventDefault(); setFormError(''); if (form.name.trim().length < 2) { setFormError('SERVICE NAME MUST CONTAIN AT LEAST 2 CHARACTERS.'); return; } if (!create.isPending) create.mutate(); }}><label className="text-xs text-[#A8AAA3]">NAME *<input aria-label="Service name" value={form.name} maxLength={100} onChange={event => setForm({ ...form, name: event.target.value })} className={`mt-2 w-full ${textInputControl}`} /></label><label className="text-xs text-[#A8AAA3]">DESCRIPTION<textarea aria-label="Service description" value={form.description} maxLength={1000} onChange={event => setForm({ ...form, description: event.target.value })} className={`mt-2 w-full ${textInputControl}`} /></label><label className="text-xs text-[#A8AAA3]">CRITICALITY<select aria-label="Service criticality" value={form.criticality} onChange={event => setForm({ ...form, criticality: event.target.value as typeof form.criticality })} className={`mt-2 w-full ${selectControl}`}>{['low', 'medium', 'high', 'critical'].map(value => <option key={value}>{value}</option>)}</select></label><label className="text-xs text-[#A8AAA3]">OPERATIONAL STATUS<select aria-label="Service operational status" value={form.operationalStatus} onChange={event => setForm({ ...form, operationalStatus: event.target.value as typeof form.operationalStatus })} className={`mt-2 w-full ${selectControl}`}>{['operational', 'degraded', 'outage', 'maintenance'].map(value => <option key={value}>{value}</option>)}</select></label><label className="text-xs text-[#A8AAA3]">OWNER<select aria-label="Service owner" value={form.ownerUserId} onChange={event => setForm({ ...form, ownerUserId: event.target.value })} className={`mt-2 w-full ${selectControl}`}><option value="">UNASSIGNED</option>{members.filter(member => member.status === 'active').map(member => <option key={member.membershipId} value={member.userId}>{member.displayName || member.email || 'ACTIVE MEMBER'}</option>)}</select></label><label className="text-xs text-[#A8AAA3]">TAGS<input aria-label="Service tags" value={form.tags} onChange={event => setForm({ ...form, tags: event.target.value })} className={`mt-2 w-full ${textInputControl}`} placeholder="payments, customer-facing" /></label><p aria-live="polite" className="md:col-span-2 text-sm text-amber-400">{formError}</p><button type="submit" disabled={create.isPending} className={`md:col-span-2 ${primaryActionButton}`}>{create.isPending ? 'CREATING...' : 'ADD SERVICE'}</button></form></Panel>}<div className="grid md:grid-cols-2 gap-4">{query.data.map(service => <Panel key={service.id}><h3 className="font-bold text-[#F3F1EA]">{service.name}</h3><p className="text-sm text-[#A8AAA3]">{service.description || 'No description provided.'}</p><p className="mt-3 text-xs font-mono text-[#D6FF3F]">{service.criticality.toUpperCase()} · {service.operationalStatus.toUpperCase()}</p></Panel>)}</div>{query.data.length === 0 && <State>NO SERVICES HAVE BEEN CREATED.</State>}</div>;
}

export function LiveIncidents() {
  const { context } = useOrganization();
  const org = context!.organization;
  const gateway = useMemo(getOperationalGateway, []);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const severity = searchParams.get('severity') as IncidentSeverity | null;
  const status = searchParams.get('status') as IncidentStatus | null;
  const filters = { search, severity: severity ? [severity] : undefined, status: status ? [status] : undefined, sort: 'reported_desc' as const };
  const query = useQuery({ queryKey: operationalQueryKeys.incidents(mode, org.id, filters), queryFn: () => gateway.listIncidents(org.id, filters) });
  return <div className="space-y-6"><div className="flex justify-between"><h2 className="text-3xl font-bold text-[#F3F1EA]">INCIDENTS</h2><Link to="/app/incidents/new" className={primaryActionButton}>NEW INCIDENT</Link></div><Panel><input aria-label="Search incidents" value={search} onChange={event => { const next = new URLSearchParams(searchParams); event.target.value ? next.set('q', event.target.value) : next.delete('q'); setSearchParams(next); }} className={`w-full ${textInputControl}`} placeholder="Search code, title, or description" /></Panel>{query.isPending ? <State>LOADING INCIDENTS...</State> : query.isError ? <State retry={() => void query.refetch()}>INCIDENTS ARE TEMPORARILY UNAVAILABLE.</State> : query.data.incidents.length === 0 ? <State>NO INCIDENTS MATCH THIS VIEW.</State> : <Panel>{query.data.incidents.map(incident => <Link key={incident.id} to={`/app/incidents/${incident.id}`} className={`grid sm:grid-cols-[10rem_1fr_6rem] gap-2 py-4 ${interactiveNavRow}`}><span className="font-mono text-[#D6FF3F]">{incident.code}</span><span className="text-[#F3F1EA]">{incident.title}</span><span className="text-xs text-[#A8AAA3]">{incident.severity}</span></Link>)}</Panel>}</div>;
}

export function LiveCreateIncident() {
  const { context } = useOrganization();
  const org = context!.organization;
  const gateway = useMemo(getOperationalGateway, []);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [observedStartAt, setObservedStartAt] = useState('');
  const [impactHint, setImpactHint] = useState('');
  const [error, setError] = useState('');
  const request = useRef(id());
  const services = useQuery({ queryKey: operationalQueryKeys.incidentServiceOptions(mode, org.id), queryFn: () => gateway.listServices(org.id, false) });
  const mutation = useMutation({ mutationFn: () => gateway.createIncident(org.id, { title: title.trim(), description: description.trim(), serviceId: serviceId || undefined, observedStartAt: observedStartAt ? new Date(observedStartAt).toISOString() : undefined, impactHint: impactHint.trim() || undefined, requestId: request.current }), onSuccess: async incident => { request.current = id(); await qc.invalidateQueries({ queryKey: operationalQueryKeys.dashboard(mode, org.id) }); await qc.invalidateQueries({ queryKey: ['operations', mode, org.id, 'incidents'] }); navigate(`/app/incidents/${incident.id}`); }, onError: () => setError('INCIDENT CREATION FAILED. YOUR INPUT HAS BEEN PRESERVED.') });
  return <div className="space-y-6"><h2 className="text-3xl font-bold text-[#F3F1EA]">REPORT AN INCIDENT.</h2><Panel><form className="space-y-5" onSubmit={event => { event.preventDefault(); setError(''); if (title.trim().length < 5 || description.trim().length < 20) { setError('PROVIDE A TITLE AND A DESCRIPTION OF AT LEAST 20 CHARACTERS.'); return; } if (observedStartAt && Number.isNaN(Date.parse(observedStartAt))) { setError('OBSERVED START TIME IS INVALID.'); return; } if (!mutation.isPending) mutation.mutate(); }}><label className="block text-xs text-[#A8AAA3]">TITLE *<input value={title} maxLength={120} onChange={event => setTitle(event.target.value)} className={`mt-2 block w-full p-3 ${textInputControl}`} /></label><label className="block text-xs text-[#A8AAA3]">DESCRIPTION *<textarea value={description} maxLength={5000} onChange={event => setDescription(event.target.value)} className={`mt-2 block w-full min-h-40 p-3 ${textInputControl}`} /></label><div className="grid md:grid-cols-2 gap-4"><label className="block text-xs text-[#A8AAA3]">AFFECTED SERVICE<select aria-label="Affected service" value={serviceId} onChange={event => setServiceId(event.target.value)} className={`mt-2 block w-full p-3 ${selectControl}`}><option value="">NO SERVICE</option>{(services.data ?? []).filter(service => service.isActive && service.organizationId === org.id).map(service => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label><label className="block text-xs text-[#A8AAA3]">OBSERVED START TIME<input aria-label="Observed start time" type="datetime-local" value={observedStartAt} onChange={event => setObservedStartAt(event.target.value)} className={`mt-2 block w-full p-3 ${textInputControl}`} /></label></div><label className="block text-xs text-[#A8AAA3]">IMPACT HINT<textarea aria-label="Impact hint" value={impactHint} maxLength={1000} onChange={event => setImpactHint(event.target.value)} className={`mt-2 block w-full min-h-24 p-3 ${textInputControl}`} /></label><p aria-live="polite" className="text-sm text-amber-400">{error}</p><button type="submit" disabled={mutation.isPending} className={primaryActionButton}>{mutation.isPending ? 'CREATING...' : 'CREATE INCIDENT'}</button><p className="text-xs text-[#5C5E58]">AI analysis is unavailable. The incident will still be persisted.</p></form></Panel></div>;
}

export function LiveIncidentRoom() {
  const { context, members, refreshMembers } = useOrganization();
  const org = context!.organization;
  const userId = context!.membership.userId;
  const role = context!.membership.role;
  const gateway = useMemo(getOperationalGateway, []);
  const queryClient = useQueryClient();
  const { incidentId } = useParams();
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium' as IncidentTask['priority'], assigneeUserId: '', dueAt: '' });
  const [taskError, setTaskError] = useState('');
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [blockingReasons, setBlockingReasons] = useState<Record<string, string>>({});
  const [criticalConfirmations, setCriticalConfirmations] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'TASKS' | 'DETAILS'>('TIMELINE');
  const [isTaskComposerOpen, setIsTaskComposerOpen] = useState(false);
  const [isNoteComposerOpen, setIsNoteComposerOpen] = useState(false);
  const taskRequest = useRef(id());
  const noteRequest = useRef(id());
  const canCreateTask = canRole(role, 'CREATE_TASK');
  const canAssign = canRole(role, 'REASSIGN_TASK');
  const canClaim = canRole(role, 'CLAIM_TASK');
  useEffect(() => { if (context) void refreshMembers(); }, [context, refreshMembers]);

  const incidentQuery = useQuery({ queryKey: operationalQueryKeys.incident(mode, org.id, incidentId ?? ''), queryFn: () => gateway.getIncident(org.id, incidentId!), enabled: Boolean(incidentId) });
  const tasksQuery = useQuery({ queryKey: taskQueryKeys.list(mode, org.id, incidentId ?? '', {}), queryFn: () => gateway.listIncidentTasks(org.id, incidentId!), enabled: Boolean(incidentId) });
  const timelineQuery = useQuery({ queryKey: timelineQueryKeys.list(mode, org.id, incidentId ?? '', direction), queryFn: () => gateway.listIncidentTimeline(org.id, incidentId!, direction), enabled: Boolean(incidentId) });
  const invalidateIncident = async () => {
    await queryClient.invalidateQueries({ queryKey: ['operations', mode, org.id] });
  };
  const createTask = useMutation({ mutationFn: () => gateway.createIncidentTask({ organizationId: org.id, incidentId: incidentId!, title: taskForm.title.trim(), description: taskForm.description.trim() || undefined, priority: taskForm.priority, assigneeUserId: canAssign && taskForm.assigneeUserId ? taskForm.assigneeUserId : undefined, dueAt: taskForm.dueAt ? new Date(taskForm.dueAt).toISOString() : undefined, requestId: taskRequest.current }), onSuccess: async () => { setTaskForm({ title: '', description: '', priority: 'medium', assigneeUserId: '', dueAt: '' }); taskRequest.current = id(); await invalidateIncident(); }, onError: () => setTaskError('TASK CREATION FAILED. REVIEW THE VALUES AND TRY AGAIN.') });
  const claimTask = useMutation({ mutationFn: (taskId: string) => gateway.claimTask({ organizationId: org.id, incidentId: incidentId!, taskId, expectedStatus: 'todo', requestId: id() }), onSuccess: invalidateIncident, onError: async () => { setTaskError('TASK ALREADY CLAIMED OR UNAVAILABLE. REFRESHED AUTHORITATIVE TASKS.'); await invalidateIncident(); } });
  const unclaimTask = useMutation({ mutationFn: (taskId: string) => gateway.unclaimTask({ organizationId: org.id, incidentId: incidentId!, taskId, expectedStatus: 'in_progress', requestId: id() }), onSuccess: invalidateIncident, onError: () => setTaskError('TASK COULD NOT BE UNCLAIMED.') });
  const assignTask = useMutation({ mutationFn: ({ taskId, assigneeUserId }: { taskId: string; assigneeUserId: string | null }) => gateway.assignIncidentTask({ organizationId: org.id, incidentId: incidentId!, taskId, assigneeUserId, requestId: id() }), onSuccess: invalidateIncident, onError: () => setTaskError('TASK ASSIGNMENT FAILED.') });
  const updateTask = useMutation({ mutationFn: ({ task, status }: { task: IncidentTask; status: IncidentTask['status'] }) => gateway.updateIncidentTask({ organizationId: org.id, incidentId: incidentId!, taskId: task.id, status, blockingReason: status === 'blocked' ? blockingReasons[task.id] : undefined, confirmCriticalCompletion: status === 'done' ? criticalConfirmations[task.id] === true : undefined, requestId: id() }), onSuccess: invalidateIncident, onError: () => setTaskError('TASK UPDATE FAILED. CHECK REQUIRED CONFIRMATION OR BLOCKING REASON.') });
  const addNote = useMutation({ mutationFn: () => gateway.addIncidentNote({ organizationId: org.id, incidentId: incidentId!, message: note.trim(), requestId: noteRequest.current }), onSuccess: async () => { setNote(''); noteRequest.current = id(); await invalidateIncident(); }, onError: () => setNoteError('NOTE COULD NOT BE ADDED.') });

  if (incidentQuery.isPending) return <State>LOADING INCIDENT...</State>;
  if (incidentQuery.isError) return <State retry={() => void incidentQuery.refetch()}>INCIDENT NOT FOUND OR ACCESS IS UNAVAILABLE.</State>;
  const { incident, service } = incidentQuery.data;
  const taskResult = tasksQuery.data ?? { tasks: incidentQuery.data.tasks, summary: incidentQuery.data.taskSummary ?? emptySummary };
  const timeline = timelineQuery.data?.items ?? incidentQuery.data.timeline ?? incidentQuery.data.updates;
  const assignmentOptions = members.length ? members.filter(member => member.status === 'active') : incidentQuery.data.assignmentOptions;
  const openTaskCount = taskResult.summary.todo + taskResult.summary.inProgress + taskResult.summary.blocked;
  const tabs = ['TIMELINE', 'TASKS', 'DETAILS'] as const;

  return <div className="space-y-6">
    <Panel>
      <p className="font-mono text-[#D6FF3F]">{incident.code}</p>
      <h2 className="text-3xl font-bold text-[#F3F1EA]">{incident.title}</h2>
      <p className="mt-4 text-[#A8AAA3] whitespace-pre-wrap">{incident.description}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-xs font-mono text-[#A8AAA3]">
        <span>{incident.severity}</span>
        <span>{incident.status.toUpperCase()}</span>
        <span>{service?.name ?? 'NO SERVICE'}</span>
        <span>{openTaskCount} OPEN TASKS</span>
      </div>
    </Panel>
    <div className="w-full min-w-0 border-b border-[#242522]" role="tablist" aria-label="Incident Room Sections">
      {tabs.map(tab => <button key={tab} type="button" id={`tab-${tab}`} role="tab" aria-selected={activeTab === tab} aria-controls={`panel-${tab}`} onClick={() => setActiveTab(tab)} className={`${tabButton} ${activeTab === tab ? tabButtonActive : tabButtonInactive}`}>{tab}</button>)}
    </div>
    <main id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="main-workspace min-w-0 w-full max-w-full flex flex-col gap-6">
      {activeTab === 'TIMELINE' && <Panel><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"><h3 className="font-bold text-[#F3F1EA]">INCIDENT TIMELINE</h3><div className="flex flex-wrap gap-2"><select aria-label="Timeline order" value={direction} onChange={event => setDirection(event.target.value as 'desc' | 'asc')} className={selectControl}><option value="desc">LATEST FIRST</option><option value="asc">OLDEST FIRST</option></select><button type="button" onClick={() => setIsNoteComposerOpen(value => !value)} className={isNoteComposerOpen ? neutralActionButton : limeActionButton}>{isNoteComposerOpen ? 'CLOSE NOTE' : 'ADD INTERNAL NOTE'}</button></div></div>{isNoteComposerOpen && <form className="space-y-3 border-b border-[#242522] pb-4 mb-4" onSubmit={event => { event.preventDefault(); setNoteError(''); if (note.trim().length === 0) { setNoteError('NOTE CANNOT BE EMPTY.'); return; } if (!addNote.isPending) addNote.mutate(); }}><textarea aria-label="Internal note" value={note} onChange={event => setNote(event.target.value)} maxLength={5000} className={`w-full min-h-28 ${textInputControl}`} placeholder="Add internal note" /><p aria-live="polite" className="text-xs text-amber-400">{noteError}</p><button type="submit" disabled={addNote.isPending} className={primaryActionButton}>{addNote.isPending ? 'ADDING...' : 'ADD INTERNAL NOTE'}</button></form>}{timelineQuery.isPending ? <p className="text-sm text-[#A8AAA3]">Loading timeline...</p> : timeline.length === 0 ? <p className="text-sm text-[#A8AAA3]">No timeline records yet.</p> : timeline.map(update => <div key={update.id} className="border-t border-[#242522] py-3"><div className="flex flex-wrap justify-between gap-3 text-xs font-mono text-[#5C5E58]"><span>{statusLabel(update.eventType)}</span><span>{new Date(update.occurredAt).toLocaleString()}</span></div><p className="text-sm text-[#A8AAA3] mt-1">{update.message}</p><p className="text-[10px] text-[#5C5E58] mt-1">{update.visibility.toUpperCase()} / {update.actorType.toUpperCase()}</p></div>)}</Panel>}
      {activeTab === 'TASKS' && <Panel>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-[#F3F1EA]">RESPONSE TASKS</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void tasksQuery.refetch()} className={compactNeutralActionButton}>REFRESH</button>
            {canCreateTask && <button type="button" onClick={() => setIsTaskComposerOpen(value => !value)} className={isTaskComposerOpen ? neutralActionButton : limeActionButton}>{isTaskComposerOpen ? 'CLOSE TASK FORM' : 'CREATE TASK'}</button>}
          </div>
        </div>
        {canCreateTask ? isTaskComposerOpen && <form className="space-y-3 border-b border-[#242522] pb-4 mb-4" onSubmit={event => { event.preventDefault(); setTaskError(''); if (taskForm.title.trim().length < 3) { setTaskError('TASK TITLE MUST CONTAIN AT LEAST 3 CHARACTERS.'); return; } if (!createTask.isPending) createTask.mutate(); }}>
          <input aria-label="Task title" value={taskForm.title} maxLength={160} onChange={event => setTaskForm({ ...taskForm, title: event.target.value })} className={`w-full ${textInputControl}`} placeholder="Task title" />
          <textarea aria-label="Task description" value={taskForm.description} maxLength={2000} onChange={event => setTaskForm({ ...taskForm, description: event.target.value })} className={`w-full ${textInputControl}`} placeholder="Optional description" />
          <div className="grid sm:grid-cols-3 gap-3">
            <select aria-label="Task priority" value={taskForm.priority} onChange={event => setTaskForm({ ...taskForm, priority: event.target.value as IncidentTask['priority'] })} className={selectControl}>{['critical', 'high', 'medium', 'low'].map(value => <option key={value}>{value}</option>)}</select>
            {canAssign && <select aria-label="Task assignee" value={taskForm.assigneeUserId} onChange={event => setTaskForm({ ...taskForm, assigneeUserId: event.target.value })} className={selectControl}><option value="">UNASSIGNED</option>{assignmentOptions.map(member => <option key={member.membershipId} value={member.userId}>{member.displayName ?? member.email ?? member.userId}</option>)}</select>}
            <input aria-label="Task due time" type="datetime-local" value={taskForm.dueAt} onChange={event => setTaskForm({ ...taskForm, dueAt: event.target.value })} className={selectControl} />
          </div>
          <p aria-live="polite" className="text-xs text-amber-400">{taskError}</p>
          <button type="submit" disabled={createTask.isPending} className={primaryActionButton}>{createTask.isPending ? 'CREATING...' : 'CREATE TASK'}</button>
        </form> : <p className="text-sm text-[#A8AAA3] border-b border-[#242522] pb-4 mb-4">Task creation is read-only for your membership role.</p>}
        {tasksQuery.isPending ? <p className="text-sm text-[#A8AAA3]">Loading tasks...</p> : taskResult.tasks.length === 0 ? <p className="text-sm text-[#A8AAA3]">No tasks have been created for this incident.</p> : <div className="space-y-3">{taskResult.tasks.map(task => {
          const actions = getTaskActionVisibility(task, role, userId);
          return <div key={task.id} className="border border-[#242522] bg-[#141513]/40 p-3 space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div>
                <h4 className="font-bold text-[#F3F1EA]">{task.title}</h4>
                {task.description && <p className="text-sm text-[#A8AAA3]">{task.description}</p>}
              </div>
              <div className="text-xs font-mono text-[#A8AAA3] sm:text-right">
                <div>{task.priority.toUpperCase()} / {statusLabel(task.status)}</div>
                <div>{memberName(assignmentOptions, task.assigneeUserId)}</div>
                {task.dueAt && <div>DUE {new Date(task.dueAt).toLocaleString()}</div>}
              </div>
            </div>
            {task.status === 'blocked' && task.blockingReason && <p className="text-xs text-amber-400">BLOCKED: {task.blockingReason}</p>}
            {!actions.isTerminal && <div className="flex flex-wrap gap-2">
              {actions.canAssign && <select aria-label={`Assign ${task.title}`} value={task.assigneeUserId ?? ''} onChange={event => assignTask.mutate({ taskId: task.id, assigneeUserId: event.target.value || null })} className={selectControl}><option value="">UNASSIGNED</option>{assignmentOptions.map(member => <option key={member.membershipId} value={member.userId}>{member.displayName ?? member.email ?? member.userId}</option>)}</select>}
              {actions.canClaim && <button type="button" disabled={claimTask.isPending} onClick={() => claimTask.mutate(task.id)} className={limeActionButton}>CLAIM</button>}
              {actions.canUnclaim && <button type="button" disabled={unclaimTask.isPending} onClick={() => unclaimTask.mutate(task.id)} className={neutralActionButton}>UNCLAIM</button>}
              {(actions.canBlock || actions.canResume) && <input aria-label={`Blocking reason for ${task.title}`} value={blockingReasons[task.id] ?? ''} onChange={event => setBlockingReasons({ ...blockingReasons, [task.id]: event.target.value })} className={`min-w-[12rem] flex-1 text-xs ${textInputControl}`} placeholder="Blocking reason" />}
              {actions.canBlock && <button type="button" disabled={updateTask.isPending} onClick={() => updateTask.mutate({ task, status: 'blocked' })} className={warningActionButton}>MARK BLOCKED</button>}
              {actions.canResume && <button type="button" disabled={updateTask.isPending} onClick={() => updateTask.mutate({ task, status: 'in_progress' })} className={limeActionButton}>RESUME</button>}
              {actions.requiresCriticalCompletionConfirmation && <label className="flex items-center gap-2 text-xs text-[#A8AAA3]"><input type="checkbox" checked={criticalConfirmations[task.id] === true} onChange={event => setCriticalConfirmations({ ...criticalConfirmations, [task.id]: event.target.checked })} />CONFIRM CRITICAL</label>}
              {actions.canComplete && <button type="button" disabled={updateTask.isPending} onClick={() => updateTask.mutate({ task, status: 'done' })} className={primaryActionButton}>COMPLETE</button>}
            </div>}
          </div>;
        })}</div>}
      </Panel>}
      {activeTab === 'DETAILS' && <Panel><h3 className="font-bold text-[#F3F1EA] mb-4">INCIDENT DETAILS</h3><dl className="grid sm:grid-cols-2 gap-4 text-sm"><div><dt className="text-[10px] font-mono text-[#5C5E58]">CODE</dt><dd className="text-[#F3F1EA]">{incident.code}</dd></div><div><dt className="text-[10px] font-mono text-[#5C5E58]">STATUS</dt><dd className="text-[#F3F1EA]">{incident.status.toUpperCase()}</dd></div><div><dt className="text-[10px] font-mono text-[#5C5E58]">SEVERITY</dt><dd className="text-[#F3F1EA]">{incident.severity}</dd></div><div><dt className="text-[10px] font-mono text-[#5C5E58]">SERVICE</dt><dd className="text-[#F3F1EA]">{service?.name ?? 'NO SERVICE'}</dd></div><div><dt className="text-[10px] font-mono text-[#5C5E58]">REPORTED</dt><dd className="text-[#F3F1EA]">{new Date(incident.reportedAt).toLocaleString()}</dd></div><div><dt className="text-[10px] font-mono text-[#5C5E58]">PUBLIC VISIBILITY</dt><dd className="text-[#F3F1EA]">{incident.publicVisibility.toUpperCase()}</dd></div></dl><p className="mt-6 text-sm text-[#A8AAA3] whitespace-pre-wrap">{incident.description}</p></Panel>}
    </main>
  </div>;
}
