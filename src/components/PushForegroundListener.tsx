import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listenForPush, pushPermission, registerPush } from '../services/pushNotifications';

export default function PushForegroundListener() {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState<{ title: string; body: string; url?: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    if (pushPermission() === 'granted') {
      registerPush(false).catch(() => {});
    }
    listenForPush((title, body, url) => {
      if (!cancelled) setIncoming({ title, body, url });
    }).then((stop) => { if (cancelled) stop?.(); else unsubscribe = stop; }).catch(() => {});
    return () => { cancelled = true; unsubscribe?.(); };
  }, [user]);

  if (!user || !incoming) return null;
  return (
    <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-lg bg-neutral-900 p-4 text-white shadow-xl">
      <p className="font-semibold">{incoming.title}</p><p className="text-sm mt-1">{incoming.body}</p>
      <div className="flex gap-4 mt-3 text-sm">
        {incoming.url && <a href={incoming.url} className="underline">Ver pedido</a>}
        <button type="button" onClick={() => setIncoming(null)} className="underline">Cerrar</button>
      </div>
    </div>
  );
}
