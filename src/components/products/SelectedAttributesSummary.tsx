import React from 'react';
import { SelectedAttributeSnapshot } from '../../types';

interface SelectedAttributesSummaryProps {
  attributes: SelectedAttributeSnapshot[];
}

// Lista compacta de los atributos elegidos por el cliente para un item
// (ej. color) — usada en el carrito y en el detalle del pedido. Los que
// tienen hex_value muestran un puntito de color al lado.
const SelectedAttributesSummary: React.FC<SelectedAttributesSummaryProps> = ({ attributes }) => {
  if (!attributes || attributes.length === 0) return null;

  return (
    <p className="text-sm text-neutral-600 mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
      {attributes.map((attr) => (
        <span key={attr.attribute_type_id} className="inline-flex items-center gap-1.5">
          {attr.hex_value && (
            <span
              style={{ backgroundColor: attr.hex_value }}
              className="inline-block h-3 w-3 shrink-0 rounded-full border border-neutral-300"
              aria-hidden="true"
            />
          )}
          {attr.description}
        </span>
      ))}
    </p>
  );
};

export default SelectedAttributesSummary;
