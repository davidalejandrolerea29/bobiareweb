import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import { products } from '../data/products';
import { Product } from '../types';

const ProductListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const serviceParam = searchParams.get('service');

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    category: string | null;
    priceRange: [number, number] | null;
  }>({
    category: categoryParam,
    priceRange: null,
  });

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter products based on URL parameters and active filters
  useEffect(() => {
    let result = [...products];

    // Filter by URL parameters first
    if (categoryParam) {
      result = result.filter(product => product.category === categoryParam);
    }

    if (serviceParam) {
      // This is a simplified example - in a real app, you'd have a more complex way to match services
      result = result.filter(product => 
        product.name.toLowerCase().includes(serviceParam.toLowerCase())
      );
    }

    // Apply active filters
    if (activeFilters.category) {
      result = result.filter(product => product.category === activeFilters.category);
    }

    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange;
      result = result.filter(product => 
        product.basePrice >= min && product.basePrice <= max
      );
    }

    setFilteredProducts(result);
  }, [categoryParam, serviceParam, activeFilters]);

  const handleCategoryFilter = (category: string | null) => {
    setActiveFilters(prev => ({
      ...prev,
      category: category,
    }));
  };

  const handlePriceFilter = (range: [number, number] | null) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: range,
    }));
  };

  const resetFilters = () => {
    setActiveFilters({
      category: null,
      priceRange: null,
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-2">
            {categoryParam ? `Servicios de ${categoryParam}` : 'Todos los Servicios'}
          </h1>
          <p className="text-neutral-600">
            Encuentra el tratamiento de superficie perfecto para tu proyecto
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
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

          {/* Filters Sidebar */}
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
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-3">Categoría</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters.category === category}
                        onChange={() => handleCategoryFilter(
                          activeFilters.category === category ? null : category
                        )}
                        className="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-400"
                      />
                      <span className="text-neutral-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div>
                <h3 className="font-medium text-neutral-800 mb-3">Precio</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.priceRange?.toString() === [0, 15000].toString()}
                      onChange={() => handlePriceFilter(
                        activeFilters.priceRange?.toString() === [0, 15000].toString() ? null : [0, 15000]
                      )}
                      className="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-400"
                    />
                    <span className="text-neutral-700">Hasta $15,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.priceRange?.toString() === [15000, 25000].toString()}
                      onChange={() => handlePriceFilter(
                        activeFilters.priceRange?.toString() === [15000, 25000].toString() ? null : [15000, 25000]
                      )}
                      className="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-400"
                    />
                    <span className="text-neutral-700">$15,000 - $25,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.priceRange?.toString() === [25000, 1000000].toString()}
                      onChange={() => handlePriceFilter(
                        activeFilters.priceRange?.toString() === [25000, 1000000].toString() ? null : [25000, 1000000]
                      )}
                      className="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-400"
                    />
                    <span className="text-neutral-700">Más de $25,000</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
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