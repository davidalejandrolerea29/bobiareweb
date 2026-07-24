import React from 'react';
import { AttributeType } from '../../types';

export interface SelectedAttribute {
  attribute_type_id: number;
  attribute_id: number;
  description: string;
  sub_id?: number;
  sub_description?: string;
}

interface AttributeSelectorProps {
  attributeTypes: AttributeType[]; // ya filtrados a los que tienen atributos configurados para este producto
  selected: Record<number, SelectedAttribute>; // por attribute_type_id
  onChange: (typeId: number, value: SelectedAttribute | undefined) => void;
}

// Genérico a propósito: el backend permite cualquier tipo de atributo
// (color, tamaño, terminación, etc.), no solo colores como en la versión vieja.
const AttributeSelector: React.FC<AttributeSelectorProps> = ({ attributeTypes, selected, onChange }) => {
  if (attributeTypes.length === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      {attributeTypes.map((type) => (
        <div key={type.id}>
          <label htmlFor={`attr-${type.id}`} className="block text-sm font-medium text-neutral-700 mb-1">
            {type.name ?? type.description}
          </label>
          <select
            id={`attr-${type.id}`}
            value={selected[type.id]?.attribute_id ?? ''}
            onChange={(e) => {
              const attributeId = Number(e.target.value);
              if (!attributeId) {
                onChange(type.id, undefined);
                return;
              }
              const attribute = type.attributes.find((a) => a.id === attributeId);
              if (!attribute) return;
              onChange(type.id, {
                attribute_type_id: type.id,
                attribute_id: attribute.id,
                description: attribute.description,
              });
            }}
            className="w-full p-3 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Sin especificar</option>
            {type.attributes.map((attribute) => (
              <option key={attribute.id} value={attribute.id}>
                {attribute.description}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default AttributeSelector;
