import { NavLink, useLocation } from 'react-router-dom';
import {
  TrashIcon,
  HomeIcon,
  CubeIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  DocumentCheckIcon,
  DocumentCurrencyDollarIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { useCounterStore } from '../../store/counterStore';
import { DeleteInventories } from '../BulkDeleteActions/DeleteInventories';
import { DeleteProducts } from '../BulkDeleteActions/DeleteProducts';
import { RecordsDelete } from '../BulkDeleteActions/RecordsDelete';

// Definir secciones con colores semánticos y descripciones para tooltips
const menuSections = [
  {
    title: 'Gestión de Productos',
    color: 'emerald',
    items: [
      {
        path: '/crear/producto',
        icon: CubeIcon,
        label: 'Crear Producto',
        description: 'Agregar nuevos productos al sistema',
      },
      {
        path: '/',
        icon: HomeIcon,
        label: 'Productos',
        description: 'Ver lista completa de productos',
      },
      {
        path: '/editar/producto',
        icon: UserGroupIcon,
        label: 'Editar Productos',
        description: 'Modificar información de productos existentes',
      },
    ],
  },
  {
    title: 'Operaciones',
    color: 'blue',
    items: [
      {
        path: '/entradas',
        icon: ArrowPathIcon,
        label: 'Dar Entrada',
        description: 'Registrar entrada de mercancía',
      },
      {
        path: '/ajustes',
        icon: ArrowPathIcon,
        label: 'Ajustar',
        description: 'Realizar ajustes de inventario',
      },
      {
        path: '/finales',
        icon: DocumentCurrencyDollarIcon,
        label: 'Cerrar Finales',
        description: 'Cerrar periodos contables',
      },
    ],
  },
  {
    title: 'Análisis & Reportes',
    color: 'purple',
    items: [
      {
        path: '/finanzas',
        icon: DocumentChartBarIcon,
        label: 'Finanzas',
        description: 'Reportes financieros y métricas',
      },
      {
        path: '/informacion/general',
        icon: DocumentChartBarIcon,
        label: 'Análisis',
        description: 'Análisis detallado de datos',
      },
      {
        path: '/registros',
        icon: DocumentCheckIcon,
        label: 'Registros',
        description: 'Historial de transacciones',
      },
    ],
  },
  {
    title: 'Inventario',
    color: 'amber',
    items: [
      {
        path: '/crear/inventario',
        icon: ArrowPathIcon,
        label: 'Iniciar Inventario',
        description: 'Iniciar nuevo proceso de inventario',
      },
      {
        path: '/exportar/inventario',
        icon: UserGroupIcon,
        label: 'Exportar Inventario',
        description: 'Exportar datos de inventario',
      },
      {
        path: '/importar/inventario',
        icon: UserGroupIcon,
        label: 'Importar Inventario',
        description: 'Importar datos de inventario',
      },
    ],
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
  handleSendJson: () => void;
}

export const Sidebar = ({
  sidebarOpen,
  mobileSidebarOpen,
  closeMobileSidebar,
  handleSendJson,
}: SidebarProps) => {
  const location = useLocation();
  const count = useCounterStore((state) => state.count);

  // Mapeo de colores a clases CSS
  const colorClasses = {
    emerald: {
      section: 'from-emerald-900/30 to-emerald-800/20 border-emerald-700/30',
      active: 'from-emerald-600 to-emerald-700 border-emerald-400',
      icon: 'text-emerald-400',
      dot: 'bg-emerald-400',
    },
    blue: {
      section: 'from-blue-900/30 to-blue-800/20 border-blue-700/30',
      active: 'from-blue-600 to-blue-700 border-blue-400',
      icon: 'text-blue-400',
      dot: 'bg-blue-400',
    },
    purple: {
      section: 'from-purple-900/30 to-purple-800/20 border-purple-700/30',
      active: 'from-purple-600 to-purple-700 border-purple-400',
      icon: 'text-purple-400',
      dot: 'bg-purple-400',
    },
    amber: {
      section: 'from-amber-900/30 to-amber-800/20 border-amber-700/30',
      active: 'from-amber-600 to-amber-700 border-amber-400',
      icon: 'text-amber-400',
      dot: 'bg-amber-400',
    },
  };

  const linkClass = (path: string, color: string) => {
    const colorConfig = colorClasses[color as keyof typeof colorClasses];
    const isActive = location.pathname === path;

    return `flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer select-none group relative overflow-hidden border-l-4 ${
      isActive
        ? `bg-gradient-to-r ${colorConfig.active} text-white shadow-lg transform scale-[1.02]`
        : 'text-gray-300 hover:bg-gray-750 hover:text-white border-transparent hover:border-gray-600'
    }`;
  };

  // Componente para enlaces con tooltip
  const NavLinkWithTooltip = ({
    item,
    color,
    sidebarOpen,
  }: {
    item: { path: string; icon: any; label: string; description: string };
    color: string;
    sidebarOpen: boolean;
  }) => {
    const colorConfig = colorClasses[color as keyof typeof colorClasses];
    const isActive = location.pathname === item.path;

    const linkContent = (
      <div className={linkClass(item.path, color)}>
        <item.icon
          className={`w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200 ${colorConfig.icon}`}
        />
        {sidebarOpen && (
          <>
            <span className='ml-3 font-medium'>{item.label}</span>
            {isActive && (
              <div
                className={`absolute right-3 w-2 h-2 rounded-full animate-pulse ${colorConfig.dot}`}
              ></div>
            )}
          </>
        )}
      </div>
    );

    if (!sidebarOpen) {
      return (
        <Tooltip
          content={item.description}
          placement='right'
          showArrow={true}
          classNames={{
            base: 'bg-gray-800 text-white border border-gray-600',
          }}
          delay={300}
        >
          <div className='cursor-pointer'>
            <NavLink to={item.path} onClick={closeMobileSidebar}>
              {linkContent}
            </NavLink>
          </div>
        </Tooltip>
      );
    }

    return (
      <NavLink
        to={item.path}
        onClick={closeMobileSidebar}
        className='cursor-pointer'
      >
        {linkContent}
      </NavLink>
    );
  };

  const SidebarContent = () => (
    <>
      <div className='z-10 flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-700 bg-gray-850'>
        {sidebarOpen && (
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg'>
              <span className='font-bold text-gray-900 text-lg'>{count}</span>
            </div>
            <div>
              <span className='text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                Inventario
              </span>
              <p className='text-xs text-gray-400 mt-1'>ANALIZADOR V 1.0</p>
            </div>
          </div>
        )}
        {!sidebarOpen && (
          <Tooltip
            content='Panel de Inventario'
            placement='right'
            classNames={{
              base: 'bg-gray-800 text-white border border-gray-600',
            }}
          >
            <div className='w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg mx-auto cursor-pointer'>
              <span className='font-bold text-gray-900 text-lg'>P</span>
            </div>
          </Tooltip>
        )}
      </div>

      <nav className='flex-1 p-4 space-y-6 mt-2 overflow-y-auto scrollbar-hide'>
        {menuSections.map((section) => (
          <div key={section.title} className='space-y-2'>
            {/* Section Header - solo se muestra cuando el sidebar está expandido */}
            {sidebarOpen && (
              <div
                className={`px-3 py-2 rounded-lg bg-gradient-to-r ${colorClasses[section.color as keyof typeof colorClasses].section} border`}
              >
                <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-300'>
                  {section.title}
                </h3>
              </div>
            )}

            {/* Section Items */}
            <div className='space-y-1'>
              {section.items.map((item) => (
                <NavLinkWithTooltip
                  key={item.path}
                  item={item}
                  color={section.color}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Acciones y Zona de Peligro */}
        <section className='flex flex-col gap-4 pt-4 border-t border-gray-700'>
          {!sidebarOpen ? (
            <Tooltip
              content='Generar y descargar reporte en PDF'
              placement='right'
              classNames={{
                base: 'bg-gray-800 text-white border border-gray-600',
              }}
            >
              <Button
                className='flex items-center justify-center text-gray-100 bg-gray-750 hover:bg-gray-700 transition-colors duration-200 rounded-lg cursor-pointer w-full min-w-0'
                onPress={handleSendJson}
              >
                <DocumentArrowDownIcon className='w-5 h-5' />
              </Button>
            </Tooltip>
          ) : (
            <Button
              className='flex items-center text-gray-100 bg-gray-750 hover:bg-gray-700 transition-colors duration-200 rounded-lg cursor-pointer'
              onPress={handleSendJson}
            >
              <DocumentArrowDownIcon className='w-5 h-5' />
              <span className='ml-3 text-left flex-1'>Guardar PDF</span>
            </Button>
          )}

          <div className='space-y-3'>
            {sidebarOpen && (
              <div className='flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/30'>
                <TrashIcon className='w-5 h-5 text-red-400 mr-2' />
                <h2 className='text-red-400 font-semibold text-sm'>
                  Zona de Peligro!
                </h2>
              </div>
            )}
            <div className='flex flex-col space-y-2'>
              <DeleteProducts />
              <DeleteInventories />
              <RecordsDelete />
            </div>
          </div>
        </section>
      </nav>

      <div className='flex-shrink-0 p-4 border-t border-gray-700 bg-gray-850'>
        <div
          className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
        >
          {!sidebarOpen ? (
            <Tooltip
              content='IPV APK - Sistema de Inventario'
              placement='right'
              classNames={{
                base: 'bg-gray-800 text-white border border-gray-600',
              }}
            >
              <div className='relative cursor-pointer'>
                <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg'>
                  <span className='text-sm font-bold text-white'>HS</span>
                </div>
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800'></div>
              </div>
            </Tooltip>
          ) : (
            <>
              <div className='relative cursor-pointer'>
                <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg'>
                  <span className='text-sm font-bold text-white'>HS</span>
                </div>
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800'></div>
              </div>
              <div className='flex-1 min-w-0 ml-3'>
                <p className='text-sm font-medium truncate'>IPV APK</p>
                <p className='text-xs text-gray-400 truncate'>
                  &copy; {new Date().getFullYear()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'}`}
      >
        <div className='bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col h-full w-full shadow-2xl border-r border-gray-700'>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm cursor-pointer'
          onClick={closeMobileSidebar}
        />
      )}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col h-full w-72 shadow-2xl'>
          <SidebarContent />
        </div>
      </div>
    </>
  );
};
