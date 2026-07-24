// Cliente HTTP central contra la API de Laravel. Maneja el header Accept
// (sin él, los errores vuelven en HTML en vez de JSON — ver mds/ del backend),
// la inyección de Authorization/X-Guest-Token, y el parseo de errores.

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'bobiare_token';
const GUEST_TOKEN_KEY = 'bobiare_guest_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const guestTokenStorage = {
  get: () => localStorage.getItem(GUEST_TOKEN_KEY),
  set: (token: string) => localStorage.setItem(GUEST_TOKEN_KEY, token),
  clear: () => localStorage.removeItem(GUEST_TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]> | string;

  constructor(message: string, status: number, errors?: Record<string, string[]> | string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean; // manda Authorization si hay token (default true)
  guestCart?: boolean; // manda X-Guest-Token si no hay usuario logueado (default false)
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, guestCart = false, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  const token = tokenStorage.get();
  if (auth && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  if (guestCart && !token) {
    const guestToken = guestTokenStorage.get();
    if (guestToken) {
      finalHeaders['X-Guest-Token'] = guestToken;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Guarda el guest_token que devuelva el carrito, si vino uno nuevo.
  const cloned = response.clone();
  const data: unknown = await cloned.json().catch(() => null);

  if (
    guestCart &&
    !token &&
    data &&
    typeof data === 'object' &&
    'guest_token' in data &&
    typeof (data as { guest_token?: unknown }).guest_token === 'string'
  ) {
    guestTokenStorage.set((data as { guest_token: string }).guest_token);
  }

  if (!response.ok) {
    const payload = data as { error?: unknown; message?: string; errors?: Record<string, string[]> } | null;
    const errors: Record<string, string[]> | undefined =
      (payload && typeof payload.error === 'object' ? (payload.error as Record<string, string[]>) : undefined) ??
      payload?.errors;
    const firstFieldMessage = errors ? Object.values(errors)[0]?.[0] : undefined;
    const message =
      (typeof payload?.error === 'string' ? payload.error : undefined) ??
      payload?.message ??
      firstFieldMessage ??
      `Error ${response.status}`;
    throw new ApiError(message, response.status, errors);
  }

  return data as T;
}
