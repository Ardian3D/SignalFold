export type AppRouteTitle = 'DASHBOARD' | 'INCIDENTS' | 'NEW INCIDENT' | 'INCIDENT ROOM' | 'SERVICE CATALOG' | 'TEAM & MEMBERSHIP' | 'SETTINGS';

export function getAppRouteTitle(pathname: string): AppRouteTitle {
  if (pathname === '/app/settings') return 'SETTINGS';
  if (pathname === '/app/team') return 'TEAM & MEMBERSHIP';
  if (pathname === '/app/services') return 'SERVICE CATALOG';
  if (pathname === '/app/incidents/new') return 'NEW INCIDENT';
  if (pathname === '/app/incidents/SF-2026-0042') return 'INCIDENT ROOM';
  if (pathname.startsWith('/app/incidents/')) return 'INCIDENT ROOM';
  if (pathname === '/app/incidents') return 'INCIDENTS';
  return 'DASHBOARD';
}
