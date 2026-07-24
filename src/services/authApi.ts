import { apiFetch } from './apiClient';
import { AuthSession, User } from '../types';

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiFetch<{ user: User }>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
      auth: false,
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthSession>('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    }),

  me: () => apiFetch<User>('/auth/me'),

  refresh: () => apiFetch<AuthSession>('/auth/refresh', { method: 'POST' }),

  logout: () => apiFetch<{ message: string }>('/auth/logout'),

  roles: () => apiFetch<{ id: number; name: string }[]>('/roles'),
};
