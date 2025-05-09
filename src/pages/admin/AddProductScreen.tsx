import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- ✅ IMPORTANTE
import { supabase } from '../../services/supabaseClient';
import { Product, ColorOption } from '../../types';

const AddProductScreen = () => {
  const navigate = useNavigate(); // <-- ✅ HOOK DE NAVEGACIÓN

  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    category: '',
    description: '',
    image: '',
    colorId: '',
    timeEstimate: '',
    price: 0,
    imageFile: null,
  });

  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchColors = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('colors').select('*');
      setLoading(false);
      if (error) {
        console.error('Error al cargar los colores:', error);
        alert('❌ Error al cargar los colores');
      } else {
        setColorOptions(data || []);
      }
    };

    fetchColors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProduct(prev => ({
        ...prev,
        imageFile: file,
      }));
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProduct(prev => ({
      ...prev,
      colorId: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = '';

    // ✅ Subir imagen al storage si hay archivo
    if (product.imageFile) {
      const fileExt = product.imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('bobiareimg') // <-- asegúrate que este bucket existe
        .upload(filePath, product.imageFile);

      if (uploadError) {
        console.error('Error al subir la imagen:', uploadError);
        alert('❌ Error al subir la imagen');
        setLoading(false);
        return;
      }

      const { data } = supabase
        .storage
        .from('bobiareimg')
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }

    // ✅ Guardar producto en la tabla
    const { error } = await supabase.from('products').insert([
      {
        name: product.name,
        category: product.category,
        description: product.description,
        image: imageUrl,
        color_id: product.colorId,
        time_estimate: product.timeEstimate,
        price: (product.price),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error('Error al agregar el producto:', error);
      alert('❌ Error al agregar el producto');
    } else {
      alert('✅ Producto agregado con éxito!');
      // ✅ Redirigir al admin
      navigate('/admin'); // <-- aquí pones la ruta correcta de tu admin
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={product.name} onChange={handleInputChange} placeholder="Nombre" className="w-full p-2 border rounded" required />
        <input type="text" name="category" value={product.category} onChange={handleInputChange} placeholder="Categoría" className="w-full p-2 border rounded" required />
        <textarea name="description" value={product.description} onChange={handleInputChange} placeholder="Descripción" className="w-full p-2 border rounded" required />
        <input type="number" name="price" value={product.price} onChange={handleInputChange} placeholder="Precio" className="w-full p-2 border rounded" required />
        <input type="text" name="timeEstimate" value={product.timeEstimate} onChange={handleInputChange} placeholder="Tiempo estimado" className="w-full p-2 border rounded" />
        
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />

        <select value={product.colorId} onChange={handleColorChange} className="w-full p-2 border rounded">
          <option value="">Seleccione un color</option>
          {colorOptions.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name} - ${color.price}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded">
          {loading ? 'Cargando...' : 'Agregar Producto'}
        </button>
      </form>
    </div>
  );
};

export default AddProductScreen;
