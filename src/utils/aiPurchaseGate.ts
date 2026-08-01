// Persistencia local (por navegador) de qué productos ya pasaron el
// control de IA — ver mds/2026-07-27-gate-ia-antes-del-carrito.md. Opción
// "A" del plan original (solo cliente, sin tabla nueva en el backend):
// simple, se puede pasar a persistencia en el backend más adelante si
// hace falta que sobreviva entre dispositivos.

const STORAGE_KEY = 'bobiare_ai_cleared_products';

function readClearedIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export function isProductAiCleared(productId: number): boolean {
  return readClearedIds().includes(productId);
}

export function markProductAiCleared(productId: number): void {
  const ids = readClearedIds();
  if (!ids.includes(productId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, productId]));
  }
}
