import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, User, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/apiClient';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, totalPrice, checkout } = useCart();
  const { isAuthenticated, setSession } = useAuth();

  // Si ya hay sesión, nos saltamos el paso de crear cuenta.
  const [step, setStep] = useState(isAuthenticated ? 2 : 1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    recipient_name: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postal_code: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1 && !isAuthenticated) {
      if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El email es inválido';
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    if (currentStep === 2) {
      if (!formData.recipient_name.trim()) newErrors.recipient_name = 'El nombre de quien recibe es requerido';
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
      if (!formData.street.trim()) newErrors.street = 'La dirección es requerida';
      if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
      if (!formData.province.trim()) newErrors.province = 'La provincia es requerida';
      if (!formData.postal_code.trim()) newErrors.postal_code = 'El código postal es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleConfirm = async () => {
    setFormError(null);
    setSubmitting(true);
    try {
      const response = await checkout({
        shipping_address: {
          recipient_name: formData.recipient_name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postal_code,
        },
        notes: formData.notes || undefined,
        ...(isAuthenticated
          ? {}
          : { name: formData.name, email: formData.email, password: formData.password }),
      });

      if (response.access_token && response.user) {
        setSession({
          access_token: response.access_token,
          token_type: response.token_type ?? 'bearer',
          expires_in: response.expires_in ?? 3600,
          user: response.user,
        });
      }

      navigate(`/confirmacion/${response.id}`);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'No pudimos confirmar tu pedido, intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      navigate('/productos');
    }
  }, [cartLoading, cart, navigate]);

  if (cartLoading || !cart || cart.items.length === 0) {
    return null;
  }

  const items = cart.items;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-8">
          Finalizar Compra
        </h1>

        {/* Checkout Steps Progress */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            {!isAuthenticated && (
              <>
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary-500' : 'text-neutral-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step >= 1 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'
                  }`}>
                    <User size={18} />
                  </div>
                  <span className="text-sm">Tu cuenta</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-500' : 'bg-neutral-200'}`}></div>
              </>
            )}

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
                <CheckCircle size={18} />
              </div>
              <span className="text-sm">Confirmación</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Step 1: Account (solo si no hay sesión) */}
              {step === 1 && !isAuthenticated && (
                <div className="animate-fade-in">
                  <h2 className="font-heading font-semibold text-xl mb-6 text-neutral-800 flex items-center">
                    <User size={20} className="mr-2 text-primary-500" />
                    Creá tu cuenta para hacer el seguimiento del pedido
                  </h2>

                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Nombre completo *</label>
                    <input
                      type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                      className={`w-full p-3 border ${errors.name ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                    <input
                      type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                      className={`w-full p-3 border ${errors.email ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Contraseña *</label>
                    <input
                      type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                      className={`w-full p-3 border ${errors.password ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-error-500">{errors.password}</p>}
                    <p className="mt-1 text-xs text-neutral-500">¿Ya tenés cuenta? <a href="/login" className="text-primary-500">Iniciá sesión</a> antes de continuar.</p>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={handleNext} className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center">
                      Continuar <ChevronRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="font-heading font-semibold text-xl mb-6 text-neutral-800 flex items-center">
                    <Truck size={20} className="mr-2 text-primary-500" />
                    Dirección de envío
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="recipient_name" className="block text-sm font-medium text-neutral-700 mb-1">Nombre de quien recibe *</label>
                      <input
                        type="text" id="recipient_name" name="recipient_name" value={formData.recipient_name} onChange={handleChange}
                        className={`w-full p-3 border ${errors.recipient_name ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.recipient_name && <p className="mt-1 text-sm text-error-500">{errors.recipient_name}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">Teléfono *</label>
                      <input
                        type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                        className={`w-full p-3 border ${errors.phone ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-error-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">Dirección *</label>
                    <input
                      type="text" id="street" name="street" value={formData.street} onChange={handleChange}
                      className={`w-full p-3 border ${errors.street ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                    />
                    {errors.street && <p className="mt-1 text-sm text-error-500">{errors.street}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">Ciudad *</label>
                      <input
                        type="text" id="city" name="city" value={formData.city} onChange={handleChange}
                        className={`w-full p-3 border ${errors.city ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.city && <p className="mt-1 text-sm text-error-500">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-neutral-700 mb-1">Provincia *</label>
                      <input
                        type="text" id="province" name="province" value={formData.province} onChange={handleChange}
                        className={`w-full p-3 border ${errors.province ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                      />
                      {errors.province && <p className="mt-1 text-sm text-error-500">{errors.province}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="postal_code" className="block text-sm font-medium text-neutral-700 mb-1">Código Postal *</label>
                    <input
                      type="text" id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange}
                      className={`w-full p-3 border ${errors.postal_code ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:ring-primary-500 focus:border-primary-500`}
                    />
                    {errors.postal_code && <p className="mt-1 text-sm text-error-500">{errors.postal_code}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">Notas (opcional)</label>
                    <textarea
                      id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2}
                      className="w-full p-3 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="flex justify-between">
                    {!isAuthenticated && (
                      <button type="button" onClick={handleBack} className="px-6 py-3 bg-neutral-200 text-neutral-800 font-medium rounded-md hover:bg-neutral-300 transition-colors">
                        Atrás
                      </button>
                    )}
                    <button type="button" onClick={handleNext} className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center ml-auto">
                      Continuar <ChevronRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & confirm — sin pasarela de pago todavía */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <h2 className="font-heading font-semibold text-xl mb-6 text-neutral-800 flex items-center">
                    <ShieldCheck size={20} className="mr-2 text-primary-500" />
                    Confirmar pedido
                  </h2>

                  <div className="flex items-start bg-primary-50 border border-primary-100 rounded-md p-4 mb-6 text-sm text-neutral-700">
                    <ShieldCheck size={18} className="mr-2 mt-0.5 text-primary-500 flex-shrink-0" />
                    <p>
                      Todavía no tenemos pasarela de pago online conectada. Al confirmar, generamos tu
                      pedido y nuestro equipo te va a contactar por email/teléfono para coordinar el
                      pago de la seña antes de que envíes la pieza.
                    </p>
                  </div>

                  {formError && <p className="text-sm text-error-500 mb-4">{formError}</p>}

                  <div className="flex justify-between">
                    <button type="button" onClick={handleBack} className="px-6 py-3 bg-neutral-200 text-neutral-800 font-medium rounded-md hover:bg-neutral-300 transition-colors">
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={submitting}
                      className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center disabled:opacity-60"
                    >
                      {submitting ? 'Confirmando...' : 'Confirmar Pedido'}
                      <ChevronRight size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-xl mb-4 text-neutral-800">
                Resumen del pedido
              </h2>

              <div className="border-b border-neutral-200 pb-4 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-neutral-800">
                        {item.quantity}x {item.product_name_snapshot}
                      </p>
                      {item.delivery_time_snapshot && (
                        <p className="text-sm text-neutral-600">{item.delivery_time_snapshot.description}</p>
                      )}
                    </div>
                    <span className="font-medium whitespace-nowrap">
                      ${Number(item.subtotal).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between py-2 mb-6 font-bold text-xl">
                <span>Total</span>
                <span className="text-primary-600">${totalPrice.toLocaleString()}</span>
              </div>

              <p className="text-sm text-neutral-500">
                Este total no incluye el envío de vuelta — se coordina y confirma junto al pago de la seña.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
