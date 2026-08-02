import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { label: 'Resumen', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Pedidos', to: '/admin/pedidos', icon: ShoppingBag },
  { label: 'Calendario', to: '/admin/calendario', icon: CalendarDays },
  { label: 'Servicios', to: '/admin/servicios', icon: PackagePlus },
];

const pageTitles: Record<string, { title: string; eyebrow: string }> = {
  '/admin': { title: 'Resumen general', eyebrow: 'Panel de control' },
  '/admin/pedidos': { title: 'Gestión de pedidos', eyebrow: 'Operaciones' },
  '/admin/calendario': { title: 'Calendario', eyebrow: 'Planificación' },
  '/admin/servicios': { title: 'Servicios', eyebrow: 'Catálogo' },
  '/admin/addproduct': { title: 'Nuevo servicio', eyebrow: 'Catálogo' },
};

// Match exacto primero; si no hay (ej. /admin/servicios/5/editar), usa el
// prefijo más largo que matchee — así las rutas dinámicas de edición
// heredan el título de su sección sin tener que listar cada id posible.
const resolvePageTitle = (pathname: string) => {
  if (pageTitles[pathname]) return pageTitles[pathname];
  const match = Object.keys(pageTitles)
    .filter((path) => path !== '/admin' && pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0];
  return pageTitles[match] ?? pageTitles['/admin'];
};

const AdminLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const page = resolvePageTitle(location.pathname);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar navegación"
          className="fixed inset-0 z-40 bg-neutral-950/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-neutral-900 text-white transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link to="/admin" className="flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white">
              <img src="/logo2.png" alt="" className="h-7 w-7 object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold">Bobiare</span>
              <span className="block text-xs text-neutral-400">Administración</span>
            </span>
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md text-neutral-400 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Navegación administrativa">
          <p className="mb-3 px-3 text-xs font-semibold uppercase text-neutral-500">Espacio de trabajo</p>
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `group flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={15} className="opacity-0 transition-opacity group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            to="/home"
            className="mb-2 flex h-10 items-center gap-3 rounded-md px-3 text-sm text-neutral-300 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={18} />
            Ver tienda
          </Link>
          <button
            type="button"
            className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-neutral-300 hover:bg-red-500/15 hover:text-red-200"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 lg:hidden"
              onClick={() => setIsOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-primary-600">{page.eyebrow}</p>
              <h1 className="truncate text-lg font-semibold text-neutral-900 sm:text-xl">{page.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-48 truncate text-sm font-semibold text-neutral-900">{user?.name}</p>
              <p className="text-xs text-neutral-500">{user?.role?.name}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
