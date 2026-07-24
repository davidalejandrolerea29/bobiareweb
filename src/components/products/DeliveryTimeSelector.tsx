import React from 'react';
import { DeliveryTime } from '../../types';
import { Truck, Zap, Clock } from 'lucide-react';

interface DeliveryTimeSelectorProps {
  options: DeliveryTime[];
  selectedOption: DeliveryTime | undefined;
  onChange: (option: DeliveryTime) => void;
}

const DeliveryTimeSelector: React.FC<DeliveryTimeSelectorProps> = ({
  options,
  selectedOption,
  onChange,
}) => {
  const getIcon = (days: number | null) => {
    if (days !== null && days <= 3) return <Zap className="text-error-500" size={20} />;
    if (days !== null && days <= 7) return <Clock className="text-warning-500" size={20} />;
    return <Truck className="text-success-500" size={20} />;
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-3 text-neutral-800">Tiempo de Entrega</h3>

      <div className="space-y-3">
        {options.map((option) => {
          const extraCost = Number(option.extra_cost);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option)}
              className={`flex items-center w-full p-4 border rounded-md transition-all ${
                selectedOption?.id === option.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="mr-3">{getIcon(option.business_days)}</div>

              <div className="flex-1 text-left">
                <span className="block font-medium">{option.description}</span>
              </div>

              <div className="ml-auto text-right">
                {extraCost > 0 ? (
                  <span className="font-medium text-primary-600">+${extraCost.toLocaleString()}</span>
                ) : (
                  <span className="text-success-500 font-medium">Sin cargo extra</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTimeSelector;
