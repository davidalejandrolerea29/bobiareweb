import { apiFetch } from './apiClient';
import { OrderStatus } from '../types';

export interface MessageTemplate {
  status: OrderStatus;
  status_label: string;
  subject: string | null;
  body: string | null;
  banner_image_url: string | null;
  default_subject: string;
  default_body: string;
  is_customized: boolean;
}

export interface MessageTemplateUpdatePayload {
  subject?: string | null;
  body?: string | null;
  banner_image?: string;
  remove_banner?: boolean;
}

export const messageTemplatesApi = {
  list: () => apiFetch<MessageTemplate[]>('/admin/message-templates'),

  update: (status: OrderStatus, payload: MessageTemplateUpdatePayload) =>
    apiFetch<MessageTemplate>(`/admin/message-templates/${status}`, {
      method: 'POST',
      body: payload,
    }),
};
