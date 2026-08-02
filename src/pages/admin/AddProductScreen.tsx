import React from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogApi } from '../../services/catalogApi';
import ProductForm, { ProductFormSubmitValues } from './ProductForm';

const AddProductScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: ProductFormSubmitValues) => {
    // El form ya valida que haya al menos una imagen antes de llamar acá.
    await catalogApi.create({
      name: values.name,
      description: values.description,
      price: values.price,
      offer_price: values.offer_price,
      category_ids: values.category_ids,
      delivery_time_ids: values.delivery_time_ids,
      images: values.images ?? [],
      attributes: values.attributes,
    });
    navigate('/admin/servicios');
  };

  return (
    <ProductForm
      mode="create"
      heading="Publicar servicio"
      subheading="Completá la información que verá el cliente en la tienda."
      submitLabel="Publicar"
      submittingLabel="Publicando"
      onCancel={() => navigate('/admin/servicios')}
      onSubmit={handleSubmit}
    />
  );
};

export default AddProductScreen;
