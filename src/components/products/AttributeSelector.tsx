import React from 'react';
import { Check } from 'lucide-react';
import { AttributeType, SelectedAttributeSnapshot } from '../../types';

interface AttributeSelectorProps {
  attributeTypes: AttributeType[]; // ya filtrados a los que tienen atributos configurados para este producto
  selected: Record<number, SelectedAttributeSnapshot>; // por attribute_type_id
  onChange: (typeId: number, value: SelectedAttributeSnapshot | undefined) => void;
}

// Genérico a propósito: el backend permite cualquier tipo de atributo
// (color, tamaño, terminación, etc.), no solo colores como en la versión
// vieja. El único tipo con UI propia es "color_picker" (paleta de swatches);
// el resto sigue usando el <select> genérico.
const AttributeSelector: React.FC<AttributeSelectorProps> = ({ attributeTypes, selected, onChange }) => {
  if (attributeTypes.length === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      {attributeTypes.map((type) => {
        if (type.key === 'color_picker') {
          const selectedAttributeId = selected[type.id]?.attribute_id;
          return (
            <div key={type.id}>
              <span className="block text-sm font-medium text-neutral-700 mb-2">
                {type.name ?? type.description}
                {selected[type.id] && (
                  <span className="ml-2 font-normal text-neutral-500">— {selected[type.id].description}</span>
                )}
              </span>
              <div className="flex flex-wrap gap-2">
                {type.attributes.map((attribute) => {
                  const isSelected = attribute.id === selectedAttributeId;
                  return (
                    <button
                      key={attribute.id}
                      type="button"
                      onClick={() =>
                        onChange(
                          type.id,
                          isSelected
                            ? undefined
                            : {
                                attribute_type_id: type.id,
                                attribute_id: attribute.id,
                                description: attribute.description,
                                hex_value: attribute.hex_value,
                              },
                        )
                      }
                      title={attribute.description}
                      aria-label={attribute.description}
                      aria-pressed={isSelected}
                      style={{ backgroundColor: attribute.hex_value ?? undefined }}
                      className={`grid h-9 w-9 place-items-center rounded-full border-2 transition-shadow ${
                        isSelected ? 'border-primary-600 shadow-md' : 'border-neutral-300'
                      } ${!attribute.hex_value ? 'bg-neutral-200' : ''}`}
                    >
                      {isSelected && (
                        <Check
                          size={16}
                          className={isColorDark(attribute.hex_value) ? 'text-white' : 'text-neutral-900'}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        return (
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
        );
      })}
    </div>
  );
};

// Decide si el ícono de "seleccionado" va blanco o negro según qué tan
// oscuro es el color de fondo (luminancia percibida, fórmula estándar YIQ).
function isColorDark(hex?: string | null): boolean {
  if (!hex) return false;
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 150;
}

export default AttributeSelector;
