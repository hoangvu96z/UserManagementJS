export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://vunph.id.vn/api';

type HttpMethod = 'GET' | 'POST' | 'PUT';

export async function apiFetch<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: any;
    token?: string | null;
  } = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || 'Request failed');
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
