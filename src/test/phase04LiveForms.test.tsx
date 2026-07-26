import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LiveCreateIncident, LiveDashboard, LiveServices } from '@/features/operations/OperationalViews';

const gateway = {
  listServices: vi.fn().mockResolvedValue([{ id:'service-1', organizationId:'org-1', name:'Payments API', slug:'payments-api', criticality:'critical', operationalStatus:'operational', tags:[], isActive:true, isDemo:false }]),
  createService: vi.fn().mockResolvedValue({ id:'service-2', organizationId:'org-1', name:'Checkout', slug:'checkout', criticality:'high', operationalStatus:'operational', tags:[], isActive:true, isDemo:false }),
  updateService: vi.fn(), listIncidents: vi.fn(), getIncident: vi.fn(), createIncident: vi.fn(), seedDemoData: vi.fn(), resetDemoData: vi.fn(),
  getDashboardOverview: vi.fn().mockResolvedValue({ activeIncidentsCount:0, sev1Sev2Active:0, openTasks:null, taskDataAvailable:false, resolvedThisWeek:0, averageTimeToAcknowledge:null, averageTimeToResolve:null, activeIncidents:[], needsAttention:[], recentActivity:[], recentIncidents:[], serviceSummary:{operational:0,degraded:0,outage:0,maintenance:0}, quickCreateCapability:true, demoWorkspaceState:{isDemo:false,canSeed:true} }),
};
vi.mock('@/features/operations/operationalGateway', () => ({ getOperationalGateway: () => gateway }));
vi.mock('@/features/organization/OrganizationProvider', () => ({ useOrganization: () => ({ context:{ organization:{id:'org-1',name:'Acme'}, membership:{role:'admin'} }, members:[{membershipId:'m1',userId:'u1',displayName:'Active Member',role:'admin',status:'active'}], refreshMembers:vi.fn(), selectActiveOrganization:vi.fn() }) }));
const renderView = (view: React.ReactNode) => render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false},mutations:{retry:false}}})}><MemoryRouter>{view}</MemoryRouter></QueryClientProvider>);

describe('Phase 04 live operational forms', () => {
  beforeEach(() => vi.clearAllMocks());
  it('renders the dashboard description with the proven full-width horizontal contract', async () => {
    renderView(<LiveDashboard />);
    const description = await screen.findByTestId('dashboard-empty-description');
    expect(description).toHaveStyle({ width:'100%', maxWidth:'36rem', wordBreak:'normal', overflowWrap:'normal', writingMode:'horizontal-tb' });
    expect(screen.getByRole('link',{name:'CREATE FIRST INCIDENT'})).toBeVisible();
    expect(screen.getByRole('button',{name:'LOAD DEMO WORKSPACE'})).toBeVisible();
    expect(gateway.getDashboardOverview).toHaveBeenCalledTimes(1);
    expect(gateway.createIncident).not.toHaveBeenCalled();
    expect(gateway.seedDemoData).not.toHaveBeenCalled();
  });
  it('Dashboard retry repeats only the overview read', async () => {
    gateway.getDashboardOverview.mockRejectedValueOnce(new Error('NETWORK_ERROR'));
    renderView(<LiveDashboard />);
    await userEvent.click(await screen.findByRole('button', { name: 'RETRY' }));
    await screen.findByTestId('dashboard-empty-description');
    expect(gateway.getDashboardOverview).toHaveBeenCalledTimes(2);
    expect(gateway.createIncident).not.toHaveBeenCalled();
    expect(gateway.seedDemoData).not.toHaveBeenCalled();
  });
  it('exposes the complete admin service contract and submits normalized values once', async () => {
    const user=userEvent.setup(); renderView(<LiveServices />);
    await screen.findByText('Payments API');
    for(const name of ['Service name','Service description','Service criticality','Service operational status','Service owner','Service tags'])expect(screen.getByLabelText(name)).toBeVisible();
    expect(screen.getByLabelText('Service operational status')).toHaveValue('operational');
    expect(screen.getByRole('option',{name:'Active Member'})).toBeVisible();
    await user.type(screen.getByLabelText('Service name'),'Checkout'); await user.selectOptions(screen.getByLabelText('Service criticality'),'high'); await user.type(screen.getByLabelText('Service tags'),'Payments, payments, checkout'); await user.click(screen.getByRole('button',{name:'ADD SERVICE'}));
    await waitFor(()=>expect(gateway.createService).toHaveBeenCalledTimes(1));
    expect(gateway.createService.mock.calls[0][1]).toMatchObject({name:'Checkout',criticality:'high',operationalStatus:'operational',tags:['payments','checkout']});
  });
  it('loads tenant services and excludes protected fields from incident creation input', async () => {
    const user=userEvent.setup(); gateway.createIncident.mockResolvedValueOnce({id:'incident-1'}); renderView(<LiveCreateIncident />);
    await screen.findByRole('option',{name:'Payments API'});
    expect(screen.getByLabelText('Observed start time')).toBeVisible(); expect(screen.getByLabelText('Impact hint')).toBeVisible();
    await user.type(screen.getByText('TITLE *').querySelector('input')!,'Checkout failure'); await user.type(screen.getByText('DESCRIPTION *').querySelector('textarea')!,'Customers cannot complete checkout payments.'); await user.selectOptions(screen.getByLabelText('Affected service'),'service-1'); await user.type(screen.getByLabelText('Impact hint'),'Customer payments affected'); await user.click(screen.getByRole('button',{name:'CREATE INCIDENT'}));
    await waitFor(()=>expect(gateway.createIncident).toHaveBeenCalledTimes(1));
    const payload=gateway.createIncident.mock.calls[0][1]; expect(payload).toMatchObject({serviceId:'service-1',impactHint:'Customer payments affected'}); for(const field of ['code','organizationId','reporterUserId','status','severity','source','isDemo'])expect(payload).not.toHaveProperty(field);
  });

  it('keeps NO SERVICE as default and excludes inactive or cross-tenant options', async () => {
    gateway.listServices.mockResolvedValueOnce([
      { id:'active', organizationId:'org-1', name:'Active Service', isActive:true },
      { id:'inactive', organizationId:'org-1', name:'Inactive Service', isActive:false },
      { id:'foreign', organizationId:'org-2', name:'Foreign Service', isActive:true },
    ]);
    renderView(<LiveCreateIncident />);
    const select = screen.getByLabelText('Affected service');
    await screen.findByRole('option',{name:'Active Service'});
    expect(select).toHaveValue('');
    expect(screen.getByRole('option',{name:'NO SERVICE'})).toBeVisible();
    expect(screen.getByRole('option',{name:'Active Service'})).toBeVisible();
    expect(screen.queryByRole('option',{name:'Inactive Service'})).not.toBeInTheDocument();
    expect(screen.queryByRole('option',{name:'Foreign Service'})).not.toBeInTheDocument();
  });
});
