import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, CreditCard, User, Truck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Information
    address: '',
    city: '',
    state: '',
    postalCode: '',
    
    // Payment Information
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El email es inválido';
      }
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    }
    
    if (currentStep === 2) {
      if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
      if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
      if (!formData.state.trim()) newErrors.state = 'La provincia es requerida';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'El código postal es requerido';
    }
    
    if (currentStep === 3) {
      if (!formData.cardName.trim()) newErrors.cardName = 'El nombre en la tarjeta es requerido';
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'El número de tarjeta es requerido';
      } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
      }
      if (!formData.expMonth.trim()) newErrors.expMonth = 'El mes de expiración es requerido';
      if (!formData.expYear.trim()) newErrors.expYear = 'El año de expiración es requerido';
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'El código de seguridad es requerido';
      } else if (formData.cvv.length !== 3) {
        newErrors.cvv = 'El código debe tener 3 dígitos';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(step)) {
      // In a real app, you would process the payment here
      // For now, we'll just simulate a successful payment
      
      // Generate a random order ID
      const orderId = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Clear the cart
      clearCart();
      
      // Navigate to the confirmation page
      navigate(`/confirmacion/${orderId}`);
    }
  };
  
  // If cart is empty, redirect to products
  if (items.length === 0) {
    navigate('/productos');
    return null;
  }
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-8">
          Finalizar Compra
        </h1>
        
        {/* Checkout Steps Progress */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary-500' : 'text-neutral-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 1 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                <User size={18} />
              </div>
              <span className="text-sm">Información</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-500' : 'bg-neutral-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary-500' : 'text-neutral-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 2 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                <Truck size={18} />
              </div>
              <span className="text-sm">Envío</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary-500' : 'bg-neutral-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary-500' : 'text-neutral-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 3 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                <CreditCard size={18} />
              </div>
              <span className="text-sm">Pago</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 4 ? 'bg-primary-500' : 'bg-neutral-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 4 ? 'text-primary-500' : 'text-neutral-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 4 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>
                <CheckCircle size={18} />
              </div>
              <span className="text-sm">Confirmación</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Customer Information */}
                {step === 1 && (
                  <div className="animate-fade-in">
                    <h2 className="font-heading font-semibold text-xl mb-6 text-neutral-800 flex items-center">
                      <User size={20} className="mr-2 text-primary-500" />
                      Información Personal
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full p-3 border ${errors.firstName ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-error-500">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full p-3 border ${errors.lastName ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-error-500">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-3 border ${errors.email ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-error-500">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-3 border ${errors.phone ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-error-500">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center"
                      >
                        Continuar
                        <ChevronRight size={18} className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Shipping Information */}
                {step === 2 && (
                  <div className="animate-fade-in">
                    <h2 className="font-heading font-semibold text-xl mb-6 text-neutral-800 flex items-center">
                      <Truck size={20} className="mr-2 text-primary-500" />
                      Información de Envío
                    </h2>
                    
                    <div className="mb-6">
                      <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full p-3 border ${errors.address ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-error-500">{errors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full p-3 border ${errors.city ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-error-500">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                          Provincia *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`w-full p-3 border ${errors.state ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-error-500">{errors.state}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`w-full p-3 border ${errors.postalCode ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-error-500">{errors.postalCode}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3 bg-neutral-200 text-neutral-800 font-medium rounded-md hover:bg-neutral-300 transition-colors"
                      >
                        Atrás
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center"
                      >
                        Continuar
                        <ChevronRight size={18} className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Payment Information */}
                {step === 3 && (
                  <div className="animate-fade-in">
                    <h2 className="font-heading font-semibold text-xl mb-6 text-neutral-800 flex items-center">
                      <CreditCard size={20} className="mr-2 text-primary-500" />
                      Información de Pago
                    </h2>
                    
                    <div className="flex items-center justify-center mb-6 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md">
                      <Lock size={14} className="mr-2 text-primary-500" />
                      La información de pago es segura y encriptada
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="cardName" className="block text-sm font-medium text-neutral-700 mb-1">
                        Nombre en la tarjeta *
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className={`w-full p-3 border ${errors.cardName ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-sm text-error-500">{errors.cardName}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                        Número de tarjeta *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="0000 0000 0000 0000"
                        className={`w-full p-3 border ${errors.cardNumber ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-error-500">{errors.cardNumber}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div>
                        <label htmlFor="expMonth" className="block text-sm font-medium text-neutral-700 mb-1">
                          Mes (MM) *
                        </label>
                        <input
                          type="text"
                          id="expMonth"
                          name="expMonth"
                          value={formData.expMonth}
                          onChange={handleChange}
                          placeholder="MM"
                          className={`w-full p-3 border ${errors.expMonth ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.expMonth && (
                          <p className="mt-1 text-sm text-error-500">{errors.expMonth}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="expYear" className="block text-sm font-medium text-neutral-700 mb-1">
                          Año (YY) *
                        </label>
                        <input
                          type="text"
                          id="expYear"
                          name="expYear"
                          value={formData.expYear}
                          onChange={handleChange}
                          placeholder="YY"
                          className={`w-full p-3 border ${errors.expYear ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.expYear && (
                          <p className="mt-1 text-sm text-error-500">{errors.expYear}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          className={`w-full p-3 border ${errors.cvv ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-error-500">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3 bg-neutral-200 text-neutral-800 font-medium rounded-md hover:bg-neutral-300 transition-colors"
                      >
                        Atrás
                      </button>
                      
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center"
                      >
                        Finalizar Pedido
                        <ChevronRight size={18} className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-xl mb-4 text-neutral-800">
                Resumen del pedido
              </h2>
              
              <div className="border-b border-neutral-200 pb-4 mb-4">
                {items.map((item) => {
                  const product = getProductById(item.productId);
                  return (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-neutral-800">
                          {item.quantity}x {product?.name}
                        </p>
                        {item.model && (
                          <p className="text-sm text-neutral-600">Modelo: {item.model}</p>
                        )}
                        {item.color && (
                          <p className="text-sm text-neutral-600 flex items-center">
                            Color: 
                            <span 
                              className="w-3 h-3 rounded-full inline-block mx-1"
                              style={{ backgroundColor: item.color.colorCode }}
                            ></span>
                            {item.color.name}
                          </p>
                        )}
                      </div>
                      <span className="font-medium whitespace-nowrap">
                        ${item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between py-2 font-medium text-neutral-800">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between py-2 font-medium text-neutral-800">
                <span>Envío</span>
                <span className="text-success-500">Incluido</span>
              </div>
              
              <div className="flex justify-between py-2 mb-6 font-bold text-xl">
                <span>Total</span>
                <span className="text-primary-600">${totalPrice.toLocaleString()}</span>
              </div>
              
              <div className="text-sm text-neutral-600">
                <p className="mb-2">
                  Al finalizar la compra, aceptas nuestros <a href="#" className="text-primary-500">Términos y Condiciones</a> y <a href="#" className="text-primary-500">Política de Privacidad</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;