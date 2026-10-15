import { initializeApp, getApps, getApp } from 'firebase/app';
import { deleteToken, getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { apiFetch } from './apiClient';
import { firebaseConfig, firebaseReady } from './firebaseConfig';

const TOKEN_KEY = 'bobiare_push_token';
const OPT_OUT_KEY = 'bobiare_push_opt_out';

const messaging = async () => {
  if (!firebaseReady || !('serviceWorker' in navigator) || !('Notification' in window) ||
      !window.isSecureContext || !await isSupported()) {
    return null;
  }
  return getMessaging(getApps().length ? getApp() : initializeApp(firebaseConfig));
};

export async function pushAvailable(): Promise<boolean> {
  return (await messaging()) !== null;
}

export function pushPermission(): NotificationPermission | 'unsupported' {
  return 'Notification' in window ? Notification.permission : 'unsupported';
}

export async function registerPush(prompt: boolean): Promise<boolean> {
  if (!prompt && localStorage.getItem(OPT_OUT_KEY) === 'true') return false;
  // El permiso debe pedirse directamente desde el click, antes de awaits.
  if (prompt && await Notification.requestPermission() !== 'granted') return false;
  if (Notification.permission !== 'granted') return false;

  const instance = await messaging();
  if (!instance) return false;

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { type: 'module' });
  const token = await getToken(instance, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) return false;

  await apiFetch('/push/installations', { method: 'POST', body: { token } });
  localStorage.setItem(TOKEN_KEY, token);
  if (prompt) localStorage.removeItem(OPT_OUT_KEY);
  return true;
}

export async function unregisterPush(optOut = true): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);
  let failure: unknown;
  if (token) {
    try {
      await apiFetch('/push/installations', { method: 'DELETE', body: { token } });
    } catch (error) {
      failure = error;
    }
    localStorage.removeItem(TOKEN_KEY);
  }
  const instance = await messaging();
  try {
    if (instance) await deleteToken(instance);
  } catch (error) {
    failure ??= error;
  }
  if (optOut) localStorage.setItem(OPT_OUT_KEY, 'true');
  if (failure) throw failure;
}

export async function listenForPush(callback: (title: string, body: string, orderUrl?: string) => void): Promise<(() => void) | null> {
  const instance = await messaging();
  if (!instance) return null;
  return onMessage(instance, (payload) => {
    callback(payload.notification?.title ?? 'Bobiare', payload.notification?.body ?? 'Tenés una novedad',
      payload.fcmOptions?.link);
  });
}
