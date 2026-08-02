import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, LoaderCircle } from 'lucide-react';
import { catalogApi } from '../../services/catalogApi';
import { Category, DeliveryTime, ProductDetailResponse } from '../../types';
import ProductForm, { ProductFormInitialData, ProductFormSubmitValues } from './ProductForm';

const EditProductScreen: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    catalogApi
      .product(productId)
      .then(setDetail)
      .catch(() => setLoadError('No se pudo cargar el servicio.'))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="grid min-h-80 place-items-center text-neutral-500">
        <div className="text-center">
          <LoaderCircle size={28} className="mx-auto animate-spin text-primary-600" />
          <p className="mt-3 text-sm">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  if (loadError || !detail) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/admin/servicios')}
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-primary-700"
        >
          <ArrowLeft size={16} /> Volver
        </button>
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" />
          {loadError ?? 'Servicio no encontrado.'}
        </div>
      </div>
    );
  }

  const { product, categories: allCategories, delivery_times: allDeliveryTimes, attribute_types: attributeTypes } = detail;

  const colorType = attributeTypes.find((type) => type.key === 'color_picker');
  const selectedColorIds = colorType ? colorType.attributes.filter((a) => a.selected).map((a) => a.id) : [];

  const initialData: ProductFormInitialData = {
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    offerPrice: product.offer_price ?? '',
    categoryIds: allCategories.filter((c) => c.selected).map((c) => c.id),
    deliveryTimeIds: allDeliveryTimes.filter((d) => d.selected).map((d) => d.id),
    selectedColorIds,
    images: product.images,
  };

  const handleSubmit = async (values: ProductFormSubmitValues) => {
    await catalogApi.update(product.id, {
      product: {
        id: product.id,
        name: values.name,
        description: values.description ?? null,
        price: values.price,
        offer_price: values.offer_price,
        images: values.images?.map((file) => ({ file })),
        attributes: values.attributes,
      },
      categories: buildSelectionList(allCategories, values.category_ids),
      delivery_times: buildSelectionList(allDeliveryTimes, values.delivery_time_ids),
    });
    navigate('/admin/servicios');
  };

  return (
    <ProductForm
      mode="edit"
      initialData={initialData}
      heading="Editar servicio"
      subheading={`Estás editando "${product.name}".`}
      submitLabel="Guardar cambios"
      submittingLabel="Guardando"
      onCancel={() => navigate('/admin/servicios')}
      onSubmit={handleSubmit}
    />
  );
};

const buildSelectionList = (
  all: (Category | DeliveryTime)[],
  selectedIds: number[],
): { id: number; selected: boolean }[] => all.map((item) => ({ id: item.id, selected: selectedIds.includes(item.id) }));

export default EditProductScreen;
