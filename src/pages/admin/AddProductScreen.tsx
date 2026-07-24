import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogApi } from '../../services/catalogApi';
import { ApiError } from '../../services/apiClient';
import { Category, DeliveryTime } from '../../types';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AddProductScreen: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [deliveryTimes, setDeliveryTimes] = useState<DeliveryTime[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [deliveryTimeIds, setDeliveryTimeIds] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    catalogApi
      .catalogData()
      .then((data) => {
        setCategories(data.categories);
        setDeliveryTimes(data.delivery_times);
      })
      .catch(() => setError('No se pudo cargar categorías y tiempos de entrega'))
      .finally(() => setLoadingCatalog(false));
  }, []);

  const toggleId = (list: number[], id: number) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (categoryIds.length === 0 || deliveryTimeIds.length === 0 || !imageFile) {
      setError('Elegí al menos una categoría, un tiempo de entrega, y subí una imagen.');
      return;
    }

    setSubmitting(true);
    try {
      const imageBase64 = await fileToBase64(imageFile);

      await catalogApi.create({
        name,
        description: description || undefined,
        price: Number(price),
        offer_price: offerPrice ? Number(offerPrice) : null,
        category_ids: categoryIds,
        delivery_time_ids: deliveryTimeIds,
        images: [imageBase64],
      });

      navigate('/admin');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al agregar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCatalog) {
    return <div className="max-w-lg mx-auto p-4 text-center text-neutral-500">Cargando...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Nombre" className="w-full p-2 border rounded" required
        />
        <textarea
          value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción" className="w-full p-2 border rounded"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio" className="w-full p-2 border rounded" required
          />
          <input
            type="number" step="0.01" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="Precio oferta (opcional)" className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Categorías *</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-1 border rounded px-2 py-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryIds.includes(category.id)}
                  onChange={() => setCategoryIds((prev) => toggleId(prev, category.id))}
                />
                {category.description}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Tiempos de entrega disponibles *</p>
          <div className="flex flex-wrap gap-2">
            {deliveryTimes.map((deliveryTime) => (
              <label key={deliveryTime.id} className="flex items-center gap-1 border rounded px-2 py-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryTimeIds.includes(deliveryTime.id)}
                  onChange={() => setDeliveryTimeIds((prev) => toggleId(prev, deliveryTime.id))}
                />
                {deliveryTime.description}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Imagen *</p>
          <input
            type="file" accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full p-2 border rounded"
          />
        </div>

        {error && <p className="text-sm text-error-500">{error}</p>}

        <button type="submit" disabled={submitting} className="w-full bg-primary-500 text-white py-2 rounded disabled:opacity-60">
          {submitting ? 'Guardando...' : 'Agregar Producto'}
        </button>
      </form>
    </div>
  );
};

export default AddProductScreen;
