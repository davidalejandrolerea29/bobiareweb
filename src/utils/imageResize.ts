// Achica y comprime una imagen en el navegador (canvas) antes de mandarla
// al backend — el backend guarda el archivo tal cual llega, sin procesar
// (no tiene gd/imagick instalado), así que si no se hace acá, las fotos
// que suba el admin pesan lo mismo que la foto original de la cámara
// (varios MB) — mismo problema que tuvimos con las fotos de stock que se
// cargaron manualmente, ver mds/2026-07-27-imagenes-productos.md.
//
// Siempre re-codifica a JPEG (no preserva transparencia de PNG a propósito
// — son fotos de piezas reales, no logos/íconos, no debería importar).

const MAX_WIDTH = 1200;
const JPEG_QUALITY = 0.8;

export function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(1, MAX_WIDTH / img.width);
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo procesar la imagen en este navegador.'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo leer la imagen.'));
    };

    img.src = objectUrl;
  });
}
