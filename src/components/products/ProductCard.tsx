import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
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
            ${product.basePrice.toLocaleString()}
          </span>
          
          <Link 
          to= '/login'
        //    to={`/productos/${product.id}`}
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