import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
  const fetchImageUrl = async () => {
    if (product.image && !product.image.startsWith('http')) {
      // Si la imagen está en Supabase (local), obtenemos la URL pública
      const { data } = supabase.storage
        .from('bobiareimg') // Reemplaza con tu nombre de bucket
        .getPublicUrl(product.image);

      if (data && data.publicUrl) {
        setImageUrl(data.publicUrl); // Aquí asignamos la URL obtenida de Supabase
      } else {
        console.error('No se pudo obtener la URL pública de Supabase');
      }
    } else {
      // Si es una URL externa, usamos la URL tal cual
      setImageUrl(product.image);
    }
  };

  fetchImageUrl();
}, [product.image]);


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} // Usamos la URL pública obtenida
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200">
            <span>Cargando imagen...</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-accent-500 text-white rounded">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-2 text-neutral-800">
          {product.name}
        </h3>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="font-medium text-lg text-primary-600">
            ${product.price.toLocaleString()}
          </span>
          
          <Link 
  to={`/productos/${product.id}`} // Enlazamos a la página de detalles usando el ID del producto
  className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
>
  Ver detalles
  <ArrowRight size={16} className="ml-1" />
</Link>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;
