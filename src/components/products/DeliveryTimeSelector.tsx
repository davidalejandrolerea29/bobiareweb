import React from 'react';
import { DeliveryOption } from '../../types';
import { Truck, Zap, Clock } from 'lucide-react';

interface DeliveryTimeSelectorProps {
  options: DeliveryOption[];
  selectedOption: DeliveryOption;
  onChange: (option: DeliveryOption) => void;
}

const DeliveryTimeSelector: React.FC<DeliveryTimeSelectorProps> = ({ 
  options, 
  selectedOption, 
  onChange 
}) => {
  const getIcon = (days: number) => {
    if (days <= 3) return <Zap className="text-error-500" size={20} />;
    if (days <= 7) return <Clock className="text-warning-500" size={20} />;
    return <Truck className="text-success-500" size={20} />;
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-3 text-neutral-800">Tiempo de Entrega</h3>
      
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.days}
            type="button"
            onClick={() => onChange(option)}
            className={`flex items-center w-full p-4 border rounded-md transition-all ${
              selectedOption.days === option.days
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="mr-3">
              {getIcon(option.days)}
            </div>
            
            <div className="flex-1 text-left">
              <span className="block font-medium">{option.description}</span>
              <span className="text-sm text-neutral-600">
                Tiempo estimado: {option.days} días hábiles
              </span>
            </div>
            
            <div className="ml-auto text-right">
              {option.price > 0 ? (
                <span className="font-medium text-primary-600">+${option.price.toLocaleString()}</span>
              ) : (
                <span className="text-success-500 font-medium">Gratis</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeliveryTimeSelector;