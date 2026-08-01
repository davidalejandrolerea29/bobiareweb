import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
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

const PieceAnalyzer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PieceAnalysis | null>(null);

  const reset = () => {
    setPreview(null);
    setError(null);
    setResult(null);
  };

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

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 mb-4 text-sm font-medium">
            <Sparkles size={16} />
            Identificador de piezas con IA
          </div>
          <h2 className="font-heading text-3xl font-bold mb-3">
            ¿No sabés qué servicio necesitás?
          </h2>
          <p className="text-white/90">
            Subí una foto de tu pieza y te decimos qué tratamiento le hace falta — por ejemplo,
            si subís una llanta oxidada, te vamos a sugerir granallado y pintura.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white text-neutral-800 rounded-lg shadow-lg p-6">
          {!isAuthenticated ? (
            <div className="text-center py-6">
              <Camera size={40} className="mx-auto text-primary-400 mb-3" />
              <p className="text-neutral-700 mb-4">
                Iniciá sesión o creá una cuenta para usar el identificador de piezas.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-neutral-100 text-neutral-800 font-medium rounded-md hover:bg-neutral-200 transition-colors"
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
                  className="w-full border-2 border-dashed border-primary-300 rounded-lg py-10 flex flex-col items-center gap-2 hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <Camera size={32} className="text-primary-500" />
                  <span className="font-medium text-neutral-700">Subí una foto de tu pieza</span>
                  <span className="text-sm text-neutral-500">JPG, PNG o WebP — máx. 8 MB</span>
                </button>
              )}

              {preview && (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={preview}
                    alt="Vista previa de la pieza"
                    className="max-h-64 rounded-md object-contain"
                  />

                  {loading && (
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Loader2 size={20} className="animate-spin" />
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
                    <div className="w-full text-left border border-neutral-200 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading font-semibold text-lg">{result.piece_name}</h3>
                        <span className="text-xs font-medium bg-primary-100 text-primary-700 rounded-full px-2 py-1">
                          {Math.round(result.confidence * 100)}% de confianza
                        </span>
                      </div>
                      <p className="text-neutral-600 text-sm mb-3">{result.description}</p>

                      {result.detected_damage.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {result.detected_damage.map((damage) => (
                            <span
                              key={damage}
                              className="text-xs bg-neutral-100 text-neutral-700 rounded-full px-2 py-1"
                            >
                              {damage}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm mb-1">
                        <span className="font-medium">Servicio sugerido: </span>
                        {result.suggested_service}
                      </p>

                      {result.suggested_product_id && (
                        <Link
                          to={`/productos/${result.suggested_product_id}`}
                          className="inline-block mt-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                        >
                          Ver servicio sugerido →
                        </Link>
                      )}

                      <p className="text-xs text-neutral-400 mt-3">{result.disclaimer}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={reset}
                    className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    Subir otra foto
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PieceAnalyzer;
