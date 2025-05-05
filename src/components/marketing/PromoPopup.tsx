import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PromoPopupProps {
  title: string;
  message: string;
  onClose: () => void;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ title, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible after a short delay to trigger animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(showTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    const closeTimer = setTimeout(onClose, 300);
    return () => {
      clearTimeout(closeTimer);
    };
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-bold text-xl text-neutral-800">{title}</h3>
          <button 
            onClick={handleClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-neutral-600">{message}</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
          >
            ¡Aprovechar ahora!
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;