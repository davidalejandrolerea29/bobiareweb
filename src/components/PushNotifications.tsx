import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pushAvailable, pushPermission, registerPush, unregisterPush } from '../services/pushNotifications';

export default function PushNotifications() {
  const { user } = useAuth();
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    pushAvailable().then((supported) => {
      if (cancelled) return;
      setAvailable(supported);
      if (supported && pushPermission() === 'granted') {
        registerPush(false).then((ok) => { if (!cancelled) setEnabled(ok); })
          .catch(() => { if (!cancelled) setError('No pudimos registrar las notificaciones. Probá de nuevo.'); });
      }
    }).catch(() => { if (!cancelled) setAvailable(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (!user || !available) return null;

  const toggle = async () => {
    setBusy(true);
    setError('');
    try {
      if (enabled) {
        await unregisterPush();
        setEnabled(false);
      } else {
        const ok = await registerPush(true);
        setEnabled(ok);
        if (!ok) setError('Permití las notificaciones en tu navegador para recibir avisos.');
      }
    } catch {
      setError('No pudimos cambiar las notificaciones. Probá de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
      <div className="rounded-lg border border-neutral-200 bg-white p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {enabled ? <Bell size={20} className="text-primary-600" /> : <BellOff size={20} className="text-neutral-500" />}
          <div><p className="font-medium text-neutral-800">Avisos de mis pedidos</p>
            <p className="text-sm text-neutral-500">Recibí cambios de estado y la factura en este dispositivo.</p></div>
        </div>
        <button type="button" disabled={busy} onClick={toggle}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm text-white disabled:opacity-50">
          {enabled ? 'Desactivar avisos' : 'Activar avisos'}
        </button>
        {error && <p role="alert" className="w-full text-sm text-red-600">{error}</p>}
      </div>
  );
}
