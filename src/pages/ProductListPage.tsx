import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import { ProductSummary } from '../types';
import { catalogApi } from '../services/catalogApi';

const ProductListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const serviceParam = searchParams.get('service');

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);

  useEffect(() => {
    catalogApi
      .allProducts()
      .then(setProducts)
      .catch((error) => console.error('Error al cargar productos:', error));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (serviceParam) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(serviceParam.toLowerCase())
      );
    }

    if (activeCategory) {
      result = result.filter((product) => product.categories.includes(activeCategory));
    }

    return result;
  }, [products, serviceParam, activeCategory]);

  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category);
  };

  const resetFilters = () => {
    setActiveCategory(null);
  };

  const categories = Array.from(new Set(products.flatMap((product) => product.categories)));

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-2">
            {activeCategory ? `Servicios de ${activeCategory}` : 'Todos los Servicios'}
          </h1>
          <p className="text-neutral-600">
            Encuentra el tratamiento de superficie perfecto para tu proyecto
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between p-3 border border-neutral-200 rounded-md"
            >
              <div className="flex items-center">
                <Filter size={18} className="mr-2" />
                <span>Filtros</span>
              </div>
              <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-lg">Filtros</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  Limpiar
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-3">Categoría</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeCategory === category}
                        onChange={() =>
                          handleCategoryFilter(activeCategory === category ? null : category)
                        }
                        className="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-400"
                      />
                      <span className="text-neutral-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="font-medium text-lg text-neutral-800 mb-2">No se encontraron servicios</h3>
                <p className="text-neutral-600 mb-4">
                  No hay servicios que coincidan con los filtros seleccionados.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
