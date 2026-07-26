export type RedirectAuthRuntime = {
  supportsHostedRedirectAuth: boolean;
};

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

export function getRedirectAuthRuntime(location: Pick<Location, 'hostname'> | null = typeof window === 'undefined' ? null : window.location): RedirectAuthRuntime {
  return {
    supportsHostedRedirectAuth: location !== null && !LOCAL_HOSTNAMES.has(location.hostname.toLowerCase()),
  };
}
