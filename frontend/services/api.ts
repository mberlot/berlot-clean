/**
 * Base API client for Strapi REST API.
 * All requests are authenticated with a static API token (read-only).
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions {
  /** Cache revalidation in seconds. Defaults to 60s (ISR). Use 0 for no-store. */
  revalidate?: number | false;
  tags?: string[];
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const url = `${STRAPI_URL}/api${path}`;
  const { revalidate = 60, tags } = options;

  const nextOptions: RequestInit['next'] = {};
  if (revalidate === false) {
    // no-store
  } else {
    nextOptions.revalidate = revalidate;
  }
  if (tags) nextOptions.tags = tags;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      cache: revalidate === false ? 'no-store' : undefined,
      next: nextOptions,
    });
  } catch (err) {
    // Strapi not reachable — return null so callers can render fallback UI
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[API] Strapi unreachable at ${url}`);
    }
    return null as T;
  }

  if (!res.ok) {
    if (process.env.NODE_ENV === 'development') {
      const body = await res.text();
      console.warn(`[API] ${res.status} ${url}\n  → ${body}`);
    }
    return null as T;
  }

  return res.json() as Promise<T>;
}

/** Build a Strapi query string from a plain object (shallow). */
export function buildQuery(params: Record<string, unknown>): string {
  const parts: string[] = [];

  function encode(key: string, value: unknown) {
    if (value === undefined || value === null || value === '') return;
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) =>
        encode(`${key}[${k}]`, v),
      );
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => encode(`${key}[${i}]`, v));
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }

  Object.entries(params).forEach(([k, v]) => encode(k, v));
  return parts.length ? `?${parts.join('&')}` : '';
}
