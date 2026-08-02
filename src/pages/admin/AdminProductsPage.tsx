import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Pencil, PackagePlus, Search, Trash2 } from 'lucide-react';
import { catalogApi } from '../../services/catalogApi';
import { ApiError } from '../../services/apiClient';
import { ProductSummary } from '../../types';

const formatMoney = (value: string | number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value));

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = () => {
    setLoading(true);
    setActionError(null);
    catalogApi
      .allProducts()
      .then(setProducts)
      .catch((err) => setActionError(err instanceof ApiError ? err.message : 'No se pudieron cargar los servicios'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de la lista
    loadProducts();
  }, []);

  const handleDelete = async (product: ProductSummary) => {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    setActionError(null);
    setDeletingId(product.id);
    try {
      await catalogApi.remove(product.id);
      setProducts((current) => current.filter((p) => p.id !== product.id));
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'No se pudo eliminar el servicio');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return product.name.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Servicios</h2>
          <p className="mt-1 text-sm text-neutral-500">Editá o eliminá los servicios publicados en la tienda.</p>
        </div>
        <Link
          to="/admin/addproduct"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          <PackagePlus size={18} />
          Nuevo servicio
        </Link>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <label className="relative block">
          <span className="sr-only">Buscar servicios</span>
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="Buscar por nombre"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      </section>

      {actionError && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />
          {actionError}
        </div>
      )}

      <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-500">
                <th className="px-5 py-3">Servicio</th>
                <th className="px-5 py-3">Categorías</th>
                <th className="px-5 py-3 text-right">Precio</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {!loading && filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        {product.images[0] && (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-neutral-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">{product.categories.join(', ') || '—'}</td>
                  <td className="px-5 py-4 text-right text-sm font-bold text-neutral-900">
                    {formatMoney(product.offer_price ?? product.price)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/servicios/${product.id}/editar`}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                      >
                        <Pencil size={15} />
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-60"
                      >
                        <Trash2 size={15} />
                        {deletingId === product.id ? 'Eliminando' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center text-sm text-neutral-500">Cargando servicios...</td>
                </tr>
              )}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center">
                    <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-400">
                      <Search size={20} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-neutral-700">No encontramos servicios</p>
                    <p className="mt-1 text-xs text-neutral-500">Probá con otro término de búsqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminProductsPage;
