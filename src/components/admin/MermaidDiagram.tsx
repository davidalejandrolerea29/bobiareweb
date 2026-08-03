import React, { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  definition: string;
}

let initialized = false;

const ensureInitialized = () => {
  if (initialized) return;
  mermaid.initialize({ startOnLoad: false, theme: 'base', securityLevel: 'strict' });
  initialized = true;
};

// Wrapper mínimo de mermaid para React — mermaid no es un componente, es
// una función que renderiza a un string de SVG, así que hay que llamarla
// a mano en un efecto y volcar el resultado con dangerouslySetInnerHTML
// (el contenido es SVG generado por mermaid a partir de texto fijo
// nuestro, no de input de usuario, así que no hay riesgo de XSS acá).
const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ definition }) => {
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/:/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureInitialized();
    let cancelled = false;

    mermaid
      .render(id, definition)
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo dibujar el diagrama.');
      });

    return () => {
      cancelled = true;
    };
  }, [definition, id]);

  if (error) {
    return <p className="text-sm text-neutral-500">{error}</p>;
  }

  return <div ref={containerRef} className="mermaid-diagram overflow-x-auto" />;
};

export default MermaidDiagram;
