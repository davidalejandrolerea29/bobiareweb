// Analizador de piezas por foto (Claude). Se separa de apiClient porque acá
// el body es multipart/form-data (FormData), no JSON — ver
// backend_bobiare/mds/2026-07-22-endpoint-ai-analyze-piece.md.

import { API_BASE_URL, ApiError, tokenStorage } from './apiClient';
import { PieceAnalysisResponse } from '../types';

export const aiApi = {
  analyzePiece: async (file: File): Promise<PieceAnalysisResponse> => {
    const token = tokenStorage.get();
    if (!token) {
      throw new ApiError('Necesitás iniciar sesión para usar el identificador de piezas.', 401);
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/ai/analyze-piece`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const payload = data as { error?: string; message?: string } | null;
      throw new ApiError(payload?.message ?? `Error ${response.status}`, response.status);
    }

    return data as PieceAnalysisResponse;
  },
};
