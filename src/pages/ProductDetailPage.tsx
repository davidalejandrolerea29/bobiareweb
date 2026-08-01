import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { catalogApi } from '../services/catalogApi';
import { ApiError } from '../services/apiClient';
import { ProductDetailResponse, DeliveryTime, AttributeType } from '../types';
import AttributeSelector, { SelectedAttribute } from '../components/products/AttributeSelector';
import DeliveryTimeSelector from '../components/products/DeliveryTimeSelector';
import AiPurchaseGate from '../components/products/AiPurchaseGate';
import ImageCarousel from '../components/products/ImageCarousel';
import { isProductAiCleared } from '../utils/aiPurchaseGate';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [data, setData] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [pieceDescription, setPieceDescription] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTime | undefined>(undefined);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, SelectedAttribute>>({});
  const [aiCleared, setAiCleared] = useState(false);

  useEffect(() => {
    if (!productId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch al cambiar de producto, sin loop
    setLoading(true);
    catalogApi
      .product(productId)
      .then((response) => {
        setData(response);
        const availableDeliveryTimes = response.delivery_times.filter((d) => d.selected);
        setSelectedDelivery(availableDeliveryTimes[0]);
        setAiCleared(isProductAiCleared(response.product.id));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [productId]);

  const availableDeliveryTimes: DeliveryTime[] = data
    ? data.delivery_times.filter((d) => d.selected)
    : [];

  const availableAttributeTypes: AttributeType[] = data
    ? data.attribute_types
        .map((type) => ({ ...type, attributes: type.attributes.filter((a) => a.selected) }))
        .filter((type) => type.attributes.length > 0)
    : [];

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) setQuantity(newQuantity);
  };

  const unitPrice = data ? Number(data.product.offer_price ?? data.product.price) || 0 : 0;
  const extraCost = selectedDelivery ? Number(selectedDelivery.extra_cost) || 0 : 0;
  const totalPrice = (unitPrice + extraCost) * quantity;

  let addToCartLabel = 'Agregar al carrito';
  if (submitting) addToCartLabel = 'Agregando...';
  else if (!aiCleared) addToCartLabel = 'Confirmá tu pieza para continuar';

  const handleAddToCart = async () => {
    if (!data || !selectedDelivery) return;
    setError(null);
    setSubmitting(true);
    try {
      await addItem({
        product_id: data.product.id,
        delivery_time_id: selectedDelivery.id,
        piece_description: pieceDescription || undefined,
        selected_attributes: Object.values(selectedAttributes),
        quantity,
      });
      navigate('/carrito');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo agregar al carrito');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-neutral-600">Cargando producto...</p>
      </div>
    );
  }

  if (notFound || !data) {
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

  const { product, categories } = data;
  const selectedCategories = categories.filter((c) => c.selected);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/productos"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Volver a productos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <ImageCarousel
            images={product.images.map((img) => img.url)}
            alt={product.name}
            className="rounded-lg shadow-md aspect-video w-full"
          />

          <div>
            {selectedCategories.length > 0 && (
              <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full mb-4">
                {selectedCategories.map((c) => c.description).join(', ')}
              </span>
            )}

            <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-4">
              {product.name}
            </h1>

            <p className="text-neutral-600 mb-8">{product.description}</p>

            <div className="border-t border-neutral-200 pt-6 mb-6">
              <div className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="pieceDescription" className="block text-sm font-medium text-neutral-700 mb-1">
                    Describí la pieza que vas a enviar
                  </label>
                  <textarea
                    id="pieceDescription"
                    value={pieceDescription}
                    onChange={(e) => setPieceDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ej: Tanque de moto Honda XR250, óxido leve en la base"
                  />
                </div>

                <AttributeSelector
                  attributeTypes={availableAttributeTypes}
                  selected={selectedAttributes}
                  onChange={(typeId, value) =>
                    setSelectedAttributes((prev) => {
                      const next = { ...prev };
                      if (value) {
                        next[typeId] = value;
                      } else {
                        delete next[typeId];
                      }
                      return next;
                    })
                  }
                />

                {availableDeliveryTimes.length > 0 && selectedDelivery && (
                  <DeliveryTimeSelector
                    options={availableDeliveryTimes}
                    selectedOption={selectedDelivery}
                    onChange={setSelectedDelivery}
                  />
                )}

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

            {!aiCleared && (
              <AiPurchaseGate
                productId={product.id}
                productName={product.name}
                onCleared={() => setAiCleared(true)}
              />
            )}

            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Precio Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
              {error && <p className="text-sm text-error-500 mb-4">{error}</p>}
              <button
                onClick={handleAddToCart}
                disabled={submitting || !selectedDelivery || !aiCleared}
                title={!aiCleared ? 'Subí una foto de tu pieza para poder agregar al carrito' : undefined}
                className="w-full py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors disabled:opacity-60"
              >
                {addToCartLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
