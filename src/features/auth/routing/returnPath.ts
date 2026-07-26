const DEFAULT_RETURN_PATH = '/app';

export function getSafeReturnPath(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return DEFAULT_RETURN_PATH;

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return DEFAULT_RETURN_PATH;
  }

  if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('\\')) {
    return DEFAULT_RETURN_PATH;
  }
  if (!decoded.startsWith('/app') || (decoded.length > 4 && !decoded.startsWith('/app/'))) {
    return DEFAULT_RETURN_PATH;
  }

  try {
    const parsed = new URL(decoded, 'https://signalfold.invalid');
    if (parsed.origin !== 'https://signalfold.invalid' || parsed.protocol !== 'https:') {
      return DEFAULT_RETURN_PATH;
    }
  } catch {
    return DEFAULT_RETURN_PATH;
  }

  return decoded;
}
