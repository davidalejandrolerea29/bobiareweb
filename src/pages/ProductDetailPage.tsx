import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Truck, Info } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';


import { useCart } from '../context/CartContext';
import { getProductById, getRelatedProducts, colorOptions, deliveryOptions } from '../data/products';
import { Product, ColorOption, DeliveryOption } from '../types';
import ProductGrid from '../components/products/ProductGrid';
import ColorSelector from '../components/products/ColorSelector';
import DeliveryTimeSelector from '../components/products/DeliveryTimeSelector';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>(colorOptions[0]);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(deliveryOptions[0]);
  const [model, setModel] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setRelatedProducts(getRelatedProducts(productId, foundProduct.category));
      }
      setLoading(false);
    }
  }, [productId]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    const basePrice = product.basePrice * quantity;
    const colorPrice = selectedColor ? selectedColor.price * quantity : 0;
    const deliveryPrice = selectedDelivery.price * quantity;
    
    return basePrice + colorPrice + deliveryPrice;
  };

  const handleAddToCart = () => {
    if (!product || !selectedDelivery) return;
    
    // Validate required fields
    if (!pickupLocation) {
      alert('Por favor, ingresa la dirección de retiro.');
      return;
    }
    
    const cartItem = {
      id: uuidv4(),
      productId: product.id,
      quantity,
      model,
      color: selectedColor,
      deliveryOption: selectedDelivery,
      pickupLocation,
      notes,
      totalPrice: calculateTotalPrice(),
    };
    
    addItem(cartItem);
    navigate('/carrito');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-neutral-600">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-4">
          Producto no encontrado
        </h2>
        <p className="text-neutral-600 mb-8">
          Lo sentimos, el producto que estás buscando no está disponible.
        </p>
        <Link 
          to="/productos"
          className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
        >
          Ver todos los productos
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/productos"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Volver a productos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover aspect-video"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full mb-4">
              {product.category}
            </span>
            
            <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-primary-600">
                ${product.basePrice.toLocaleString()}
              </span>
              <span className="text-sm text-neutral-500 ml-2">
                Precio base
              </span>
            </div>
            
            <p className="text-neutral-600 mb-8">
              {product.description}
            </p>
            
            <div className="border-t border-neutral-200 pt-6 mb-6">
              <div className="flex flex-col space-y-4">
                {/* Model Input */}
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-neutral-700 mb-1">
                    Modelo (ej: Honda CBR 600)
                  </label>
                  <input
                    type="text"
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-3 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Especifica el modelo de tu vehículo/producto"
                  />
                </div>
                
                {/* Color Selection */}
                <ColorSelector 
                  colors={colorOptions} 
                  selectedColor={selectedColor} 
                  onChange={setSelectedColor}
                />
                
                {/* Delivery Time Selection */}
                <DeliveryTimeSelector 
                  options={deliveryOptions}
                  selectedOption={selectedDelivery}
                  onChange={setSelectedDelivery}
                />
                
                {/* Pickup Location */}
                <div className="mb-6">
                  <label htmlFor="pickup" className="block text-sm font-medium text-neutral-700 mb-1">
                    Dirección de Retiro *
                  </label>
                  <input
                    type="text"
                    id="pickup"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full p-3 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ingresa la dirección de retiro completa"
                    required
                  />
                </div>
                
                {/* Special Notes */}
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
                    Notas Especiales (Opcional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Información adicional importante para el trabajo"
                  />
                </div>
                
                {/* Quantity */}
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-1">
                    Cantidad
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center border border-r-0 border-neutral-300 rounded-l-md hover:bg-neutral-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 h-10 border-y border-neutral-300 text-center focus:ring-0 focus:border-neutral-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center border border-l-0 border-neutral-300 rounded-r-md hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total Price and Add to Cart */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Precio Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${calculateTotalPrice().toLocaleString()}
                </span>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center"
              >
                <Check size={18} className="mr-2" />
                Agregar al Carrito
              </button>
            </div>
            
            {/* Delivery Info */}
            <div className="flex items-start">
              <Truck size={20} className="text-neutral-500 mr-2 mt-1" />
              <p className="text-sm text-neutral-600">
                El servicio incluye retiro y entrega por transporte especializado. Recibirás confirmación una vez que tu pedido sea procesado.
              </p>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-neutral-200 pt-10">
            <ProductGrid 
              products={relatedProducts} 
              title="Servicios Relacionados"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;