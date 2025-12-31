import React, { useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import {
  HomeIcon,
  CubeIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  DocumentCheckIcon,
  DocumentCurrencyDollarIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';

import { useCounterStore } from '../../store/counterStore';
import { DeleteInventories } from '../BulkDeleteActions/DeleteInventories';
import { DeleteProducts } from '../BulkDeleteActions/DeleteProducts';
import { RecordsDelete } from '../BulkDeleteActions/RecordsDelete';
//import PointerHand from "../icons/PointerHand";

// ======================================================
// 🎨 PALETA CORPORATIVA
// ======================================================
const premiumColors = {
  background: {
    sidebar: 'bg-[#111318]',
  },
  border: {
    primary: 'border-[#2a2d33]',
  },
  text: {
    primary: 'text-gray-100',
    secondary: 'text-gray-300',
  },
  shadow: {
    sidebar: 'shadow-xl shadow-black/40',
  },
};

// ======================================================
// 🎨 COLORES POR SECCIÓN
// ======================================================
const colorClasses = {
  emerald: { dot: 'bg-emerald-400', text: 'text-emerald-300' },
  blue: { dot: 'bg-blue-400', text: 'text-blue-300' },
  purple: { dot: 'bg-purple-400', text: 'text-purple-300' },
  amber: { dot: 'bg-amber-400', text: 'text-amber-300' },
  red: { dot: 'bg-red-400', text: 'text-red-300' },
};

type ColorKey = keyof typeof colorClasses;

// ======================================================
// 📌 TIPOS
// ======================================================
interface MenuItem {
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  description: string;
}

type SectionType = 'default' | 'danger';

interface MenuSection {
  title: string;
  color: ColorKey;
  type: SectionType;
  items: MenuItem[];
}

// ======================================================
// 📌 MENÚ COMPLETO
// ======================================================
const menuSections: MenuSection[] = [
  {
    title: 'Gestión de Productos',
    color: 'emerald',
    type: 'default',
    items: [
      {
        path: '/crear/producto',
        icon: CubeIcon,
        label: 'Crear Producto',
        description: 'Agregar nuevos productos',
      },
      {
        path: '/',
        icon: HomeIcon,
        label: 'Productos',
        description: 'Lista completa de productos',
      },
      {
        path: '/editar/producto',
        icon: UserGroupIcon,
        label: 'Editar Productos',
        description: 'Modificar productos',
      },
    ],
  },
  {
    title: 'Análisis & Reportes',
    color: 'purple',
    type: 'default',
    items: [
      {
        path: '/finanzas',
        icon: DocumentChartBarIcon,
        label: 'Finanzas',
        description: 'Reportes financieros',
      },
      {
        path: '/informacion/general',
        icon: DocumentChartBarIcon,
        label: 'Análisis',
        description: 'Análisis detallado',
      },
      {
        path: '/registros',
        icon: DocumentCheckIcon,
        label: 'Registros',
        description: 'Historial',
      },
    ],
  },
  {
    title: 'Inventario',
    color: 'amber',
    type: 'default',
    items: [
      {
        path: '/crear/inventario',
        icon: ArrowPathIcon,
        label: 'Iniciar Inventario',
        description: 'Nuevo inventario',
      },
      {
        path: '/exportar/inventario',
        icon: UserGroupIcon,
        label: 'Exportar Inventario',
        description: 'Exportar datos',
      },
      {
        path: '/importar/inventario',
        icon: UserGroupIcon,
        label: 'Importar Inventario',
        description: 'Importar datos',
      },
    ],
  },
  {
    title: 'Operaciones',
    color: 'blue',
    type: 'default',
    items: [
      {
        path: '/entradas',
        icon: ArrowPathIcon,
        label: 'Dar Entrada',
        description: 'Registrar entrada',
      },
      {
        path: '/ajustes',
        icon: ArrowPathIcon,
        label: 'Ajustar',
        description: 'Ajustes de inventario',
      },
      {
        path: '/finales',
        icon: DocumentCurrencyDollarIcon,
        label: 'Cerrar Finales',
        description: 'Cerrar periodos',
      },
    ],
  },
  {
    title: 'Zona de Peligro',
    color: 'red',
    type: 'danger',
    items: [],
  },
];

// ======================================================
// 🔗 LINK CON TOOLTIP + ICONO MANO
// ======================================================
interface NavLinkWithTooltipProps {
  item: MenuItem;
  color: ColorKey;
  sidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

const NavLinkWithTooltip: React.FC<NavLinkWithTooltipProps> = React.memo(
  ({ item, sidebarOpen, closeMobileSidebar }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;

    const linkClass = `
      flex items-center p-3 rounded-lg transition-all duration-300 cursor-pointer select-none group relative border-l-4
      ${isActive ? 'text-amber-400 font-semibold border-amber-500' : 'text-gray-300 hover:text-white border-transparent'}
    `;

    const content = (
      <div className={linkClass}>
        <item.icon
          className={`w-5 h-5 ${
            isActive ? 'text-amber-400' : 'text-gray-400 group-hover:text-white'
          }`}
        />

        {sidebarOpen && <span className='ml-3'>{item.label}</span>}
      </div>
    );

    return sidebarOpen ? (
      <NavLink to={item.path} onClick={closeMobileSidebar}>
        {content}
      </NavLink>
    ) : (
      <Tooltip content={item.description} placement='right'>
        <NavLink to={item.path} onClick={closeMobileSidebar}>
          {content}
        </NavLink>
      </Tooltip>
    );
  },
);

// ======================================================
// 🔥 ZONA DE PELIGRO
// ======================================================
const DangerZone: React.FC = React.memo(() => (
  <div className='space-y-2 p-2'>
    <DeleteProducts />
    <DeleteInventories />
    <RecordsDelete />
  </div>
));

// ======================================================
// 📌 SECCIÓN DROPDOWN
// ======================================================
interface SectionProps {
  section: MenuSection;
  expanded: boolean;
  toggle: () => void;
  sidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

const Section: React.FC<SectionProps> = React.memo(
  ({ section, expanded, toggle, sidebarOpen, closeMobileSidebar }) => {
    const colorConfig = colorClasses[section.color];

    return (
      <div className='space-y-1'>
        {/* HEADER */}
        <div
          onClick={toggle}
          className='flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-300 bg-gray-900/40 hover:bg-gray-800/60 border border-gray-700'
        >
          <div className='flex items-center space-x-2'>
            <div className={`w-1.5 h-1.5 rounded-full ${colorConfig.dot}`} />
            {sidebarOpen && (
              <span className={`text-xs uppercase ${colorConfig.text}`}>
                {section.title}
              </span>
            )}
          </div>

          {sidebarOpen && (
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-300 ${
                expanded ? 'rotate-0' : '-rotate-90'
              } ${colorConfig.text}`}
            />
          )}
        </div>

        {/* CONTENIDO */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {section.type === 'danger' ? (
            <DangerZone />
          ) : (
            <div className='space-y-1 ml-3 mt-2'>
              {section.items.map((item) => (
                <NavLinkWithTooltip
                  key={item.path}
                  item={item}
                  color={section.color}
                  sidebarOpen={sidebarOpen}
                  closeMobileSidebar={closeMobileSidebar}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

// ======================================================
// 🧱 SIDEBAR PRINCIPAL
// ======================================================
interface SidebarProps {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
  handleSendJson: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  mobileSidebarOpen,
  closeMobileSidebar,
  handleSendJson,
}) => {
  const count = useCounterStore((s) => s.count);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(menuSections.map((s) => [s.title, false])),
  );

  const toggle = useCallback((title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  return (
    <>
      {/* DESKTOP */}
      <div
        className={`hidden lg:flex ${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300`}
      >
        <div
          className={`${premiumColors.background.sidebar} ${premiumColors.text.primary} flex flex-col h-full w-full ${premiumColors.shadow.sidebar} border-r ${premiumColors.border.primary}`}
        >
          {/* HEADER */}
          <div className='p-6 border-b border-gray-700'>
            {sidebarOpen ? (
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center'>
                  <span className='font-bold text-gray-900'>{count}</span>
                </div>
                <div>
                  <span className='text-xl font-bold'>Inventario</span>
                  <p className='text-xs text-gray-400'>ANALIZADOR V 1.0</p>
                </div>
              </div>
            ) : (
              <Tooltip content='Inventario'>
                <div className='w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center mx-auto'>
                  <span className='font-bold text-gray-900'>P</span>
                </div>
              </Tooltip>
            )}
          </div>

          {/* MENÚ */}
          <nav className='flex-1 p-4 space-y-3 overflow-y-auto'>
            {menuSections.map((section) => (
              <Section
                key={section.title}
                section={section}
                expanded={expanded[section.title]}
                toggle={() => toggle(section.title)}
                sidebarOpen={sidebarOpen}
                closeMobileSidebar={closeMobileSidebar}
              />
            ))}

            {/* BOTÓN PDF */}
            <div className='pt-4 border-t border-gray-700'>
              <Button
                className='w-full bg-gray-800 hover:bg-gray-700 text-gray-100'
                onPress={handleSendJson}
              >
                <DocumentArrowDownIcon className='w-5 h-5' />
                {sidebarOpen && <span className='ml-3'>Guardar PDF</span>}
              </Button>
            </div>
          </nav>

          {/* FOOTER */}
          <div className='p-4 border-t border-gray-700'>
            <div
              className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}
            >
              <div className='relative'>
                <div className='w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center'>
                  <span className='text-white font-bold'>HS</span>
                </div>
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#111318]' />
              </div>

              {sidebarOpen && (
                <div>
                  <p className='text-sm font-medium'>IPV APK</p>
                  <p className='text-xs text-gray-400'>
                    &copy; {new Date().getFullYear()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black/60 z-40'
          onClick={closeMobileSidebar}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className={`${premiumColors.background.sidebar} ${premiumColors.text.primary} flex flex-col h-full w-72 ${premiumColors.shadow.sidebar}`}
        >
          {/* HEADER */}
          <div className='p-6 border-b border-gray-700'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center'>
                <span className='font-bold text-gray-900'>{count}</span>
              </div>
              <div>
                <span className='text-xl font-bold'>Inventario</span>
                <p className='text-xs text-gray-400'>ANALIZADOR V 1.0</p>
              </div>
            </div>
          </div>

          {/* MENÚ */}
          <nav className='flex-1 p-4 space-y-3 overflow-y-auto'>
            {menuSections.map((section) => (
              <Section
                key={section.title}
                section={section}
                expanded={expanded[section.title]}
                toggle={() => toggle(section.title)}
                sidebarOpen={true}
                closeMobileSidebar={closeMobileSidebar}
              />
            ))}

            <div className='pt-4 border-t space-y-4 border-gray-700'>
              <Button
                className='w-full bg-gray-800 hover:bg-gray-700'
                onPress={handleSendJson}
              >
                <DocumentArrowDownIcon className='w-5 h-5 !text-white' />
                <span className='ml-3 !text-white'>Guardar PDF</span>
              </Button>
              <NavLink className='w-full block text-center p-2 px-4 rounded-xl bg-gray-800 hover:bg-gray-700'  to='/documentacion' onClick={closeMobileSidebar}>
                 Documentacion
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
