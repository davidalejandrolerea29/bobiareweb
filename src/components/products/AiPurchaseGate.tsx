import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Loader2, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { aiApi } from '../../services/aiApi';
import { ApiError } from '../../services/apiClient';
import { PieceAnalysis } from '../../types';
import { markProductAiCleared } from '../../utils/aiPurchaseGate';

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const errorMessageFor = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 413) return 'La imagen es muy pesada (máx. 8 MB). Probá con otra foto.';
    if (error.status === 415) return 'Formato no admitido. Usá una foto en JPG, PNG o WebP.';
    if (error.status === 422) return 'No pudimos identificar una pieza en esa foto. Probá con otro ángulo o mejor luz.';
    if (error.status === 429) return 'Estamos con mucha demanda en este momento. Probá de nuevo en unos segundos.';
    if (error.status === 503) return 'El identificador de piezas no está disponible ahora mismo. Probá más tarde.';
    return error.message;
  }
  return 'No pudimos analizar la imagen. Probá de nuevo.';
};

interface AiPurchaseGateProps {
  productId: number;
  productName: string;
  /** Se llama cuando el cliente completó el control (subió una foto y la analizamos). */
  onCleared: () => void;
}

/**
 * Bloquea "Agregar al carrito" hasta que el cliente suba una foto de su
 * pieza — ver mds/2026-07-27-gate-ia-antes-del-carrito.md. Requiere sesión
 * (mismo contrato de /ai/analyze-piece que el identificador de la Home),
 * así que a un invitado se le pide loguearse acá, no recién en el checkout.
 */
const AiPurchaseGate: React.FC<AiPurchaseGateProps> = ({ productId, productName, onCleared }) => {
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PieceAnalysis | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setResult(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato no admitido. Usá una foto en JPG, PNG o WebP.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('La imagen es muy pesada (máx. 8 MB). Probá con otra foto.');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const { analysis } = await aiApi.analyzePiece(file);
      setResult(analysis);
      // El control se da por cumplido con el análisis en sí (subir la foto
      // y ver qué dice la IA), no exige que coincida exactamente con el
      // producto que el cliente ya venía eligiendo — si coincidiera
      // además, se marca ese otro producto como aclarado también.
      markProductAiCleared(productId);
      if (analysis.suggested_product_id) {
        markProductAiCleared(analysis.suggested_product_id);
      }
    } catch (err) {
      setError(errorMessageFor(err));
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const suggestsDifferentProduct =
    result && result.suggested_product_id !== null && result.suggested_product_id !== productId;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck size={20} className="text-amber-600" />
        <h3 className="font-heading font-semibold text-lg text-neutral-800">
          Confirmá tu pieza antes de comprar
        </h3>
      </div>
      <p className="text-sm text-neutral-600 mb-4">
        Antes de agregar &ldquo;{productName}&rdquo; al carrito, subí una foto de tu pieza — así
        confirmamos entre los dos que es el servicio correcto.
      </p>

      {!isAuthenticated ? (
        <div className="text-center py-4">
          <p className="text-neutral-700 mb-4 text-sm">
            Iniciá sesión o creá una cuenta para usar el identificador de piezas.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors text-sm"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-neutral-100 text-neutral-800 font-medium rounded-md hover:bg-neutral-200 transition-colors text-sm"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={onInputChange}
            className="hidden"
          />

          {!preview && !loading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white border-2 border-dashed border-amber-300 rounded-lg py-8 flex flex-col items-center gap-2 hover:border-amber-500 hover:bg-amber-50 transition-colors"
            >
              <Camera size={28} className="text-amber-500" />
              <span className="font-medium text-neutral-700 text-sm">Subí una foto de tu pieza</span>
              <span className="text-xs text-neutral-500">JPG, PNG o WebP — máx. 8 MB</span>
            </button>
          )}

          {preview && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={preview}
                alt="Vista previa de la pieza"
                className="max-h-48 rounded-md object-contain"
              />

              {loading && (
                <div className="flex items-center gap-2 text-neutral-600 text-sm">
                  <Loader2 size={18} className="animate-spin" />
                  Analizando la pieza...
                </div>
              )}

              {error && !loading && (
                <div className="w-full flex items-start gap-2 bg-red-50 text-red-700 rounded-md p-3 text-sm">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {result && !loading && (
                <div className="w-full text-left bg-white border border-neutral-200 rounded-md p-4">
                  <p className="text-sm mb-1">
                    <span className="font-medium">La IA identificó: </span>
                    {result.piece_name}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Servicio sugerido: </span>
                    {result.suggested_service}
                  </p>

                  {suggestsDifferentProduct && (
                    <div className="flex items-start gap-2 bg-blue-50 text-blue-800 rounded-md p-3 text-xs mt-3">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>
                        La IA sugiere un servicio distinto al que elegiste — revisalo si querés,
                        pero podés seguir con &ldquo;{productName}&rdquo; si estás segura/o.{' '}
                        <Link
                          to={`/productos/${result.suggested_product_id}`}
                          className="underline font-medium"
                        >
                          Ver el sugerido
                        </Link>
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={onCleared}
                    className="w-full mt-4 inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Continuar con la compra <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AiPurchaseGate;
