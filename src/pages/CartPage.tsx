import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ChevronRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';

const CartPage: React.FC = () => {
  const { items, removeItem, updateItem, totalPrice } = useCart();

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    // Calculate the new total price
    const product = getProductById(item.productId);
    if (!product) return;
    
    const basePrice = product.basePrice * newQuantity;
    const colorPrice = item.color ? item.color.price * newQuantity : 0;
    const deliveryPrice = item.deliveryOption.price * newQuantity;
    const newTotalPrice = basePrice + colorPrice + deliveryPrice;
    
    // Update the item
    updateItem(id, {
      quantity: newQuantity,
      totalPrice: newTotalPrice,
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-neutral-100 rounded-full">
            <ShoppingBag size={32} className="text-neutral-400" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-neutral-600 mb-8">
            No has agregado ningún servicio a tu carrito aún. Explora nuestros servicios y comienza a transformar tus superficies.
          </p>
          <Link 
            to="/productos"
            className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
          >
            Ver Servicios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-8">
          Tu Carrito
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {items.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                
                return (
                  <div key={item.id} className="p-4 border-b border-neutral-200 last:border-b-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="sm:w-32 h-32 mb-4 sm:mb-0 sm:mr-4">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <h3 className="font-medium text-lg text-neutral-800">
                            {product.name}
                          </h3>
                          <span className="font-medium text-primary-600">
                            ${item.totalPrice.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          {item.model && (
                            <p className="text-sm text-neutral-600 mb-1">
                              <span className="font-medium">Modelo:</span> {item.model}
                            </p>
                          )}
                          {item.color && (
                            <p className="text-sm text-neutral-600 mb-1 flex items-center">
                              <span className="font-medium mr-1">Color:</span> 
                              <span 
                                className="w-3 h-3 rounded-full inline-block mr-1"
                                style={{ backgroundColor: item.color.colorCode }}
                              ></span>
                              {item.color.name}
                            </p>
                          )}
                          <p className="text-sm text-neutral-600 mb-1">
                            <span className="font-medium">Entrega:</span> {item.deliveryOption.description}
                          </p>
                          <p className="text-sm text-neutral-600">
                            <span className="font-medium">Retiro en:</span> {item.pickupLocation}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between">
                          <div className="flex items-center mr-4 mb-2 sm:mb-0">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center border border-r-0 border-neutral-300 rounded-l-md hover:bg-neutral-100 disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="w-10 h-8 flex items-center justify-center border-y border-neutral-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-l-0 border-neutral-300 rounded-r-md hover:bg-neutral-100"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-neutral-500 hover:text-error-500 flex items-center transition-colors"
                          >
                            <Trash2 size={16} className="mr-1" /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-heading font-semibold text-xl mb-4 text-neutral-800">
                Resumen del pedido
              </h2>
              
              <div className="border-b border-neutral-200 pb-4 mb-4">
                {items.map((item) => {
                  const product = getProductById(item.productId);
                  return (
                    <div key={item.id} className="flex justify-between py-2">
                      <span className="text-neutral-600">
                        {item.quantity}x {product?.name}
                      </span>
                      <span className="font-medium">
                        ${item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between py-2 mb-6">
                <span className="font-medium text-neutral-800">Total</span>
                <span className="font-bold text-xl text-primary-600">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
              
              <Link
                to="/checkout"
                className="w-full py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center"
              >
                Proceder al Pago
                <ChevronRight size={18} className="ml-2" />
              </Link>
              
              <div className="mt-6 text-sm text-neutral-600">
                <div className="flex items-start mb-2">
                  <Truck size={16} className="mr-2 mt-1" />
                  <p>
                    Recuerda que los servicios incluyen retiro y entrega en la dirección especificada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;