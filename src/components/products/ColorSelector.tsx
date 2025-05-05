import React from 'react';
import { ColorOption } from '../../types';

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: ColorOption | undefined;
  onChange: (color: ColorOption) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, selectedColor, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-3 text-neutral-800">Color</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onChange(color)}
            className={`flex items-center p-3 border rounded-md transition-all ${
              selectedColor?.id === color.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <span 
              className="w-6 h-6 rounded-full mr-2 border border-neutral-200"
              style={{ backgroundColor: color.colorCode }}
            />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{color.name}</span>
              {color.price > 0 && (
                <span className="text-xs text-neutral-500">
                  +${color.price.toLocaleString()}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;