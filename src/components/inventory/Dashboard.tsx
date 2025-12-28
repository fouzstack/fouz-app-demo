import React, { useState, ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BlogIcon from '../icons/BlogIcon';
import ShareIcon from '../icons/ShareIcon';
import UserEditIcon from '../icons/UserEditIcon';
import { formatDateAndTime } from '../../models/utils';
import { useExportToPdf } from '../../hooks/useExportToPdf';
import { CloseIcon } from '../icons/close-icon';
import { useCounterStore } from '../../store/counterStore';

interface Option {
  option: number;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface DashboardProps {
  children: ReactNode;
  className?: string;
}

const Dashboard = ({
  children,
  className = 'flex-1 overflow-auto p-8',
}: DashboardProps) => {
  const increase = useCounterStore((state) => state.increase);
  const navigate = useNavigate();
  const { handleSendJson } = useExportToPdf();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const options: Option[] = [
    {
      option: 1,
      label: 'Guardar PDF',
      icon: <ShareIcon size={20} />,
      action: () => {
        handleSendJson();
        setSidebarOpen(false);
      },
    },
    {
      option: 2,
      label: 'Exportar Importar',
      icon: <ShareIcon size={20} />,
      action: () => {
        navigate('/exportar/importar/inventario');
        setSidebarOpen(false);
      },
    },
    {
      option: 3,
      label: 'Iniciar Inventario',
      icon: <UserEditIcon size={20} color='#00897b' />,
      action: () => {
        navigate('/crear/inventario');
        setSidebarOpen(false);
      },
    },
    {
      option: 4,
      label: 'Análisis',
      icon: <BlogIcon size={20} color='#0f78ef' />,
      action: () => {
        navigate('/informacion/general');
        setSidebarOpen(false);
      },
    },
  ];

  const formatted = formatDateAndTime();

  return (
    <div className='flex flex-col h-screen bg-gray-50 text-gray-700 font-sans'>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-40 z-30'
          onClick={() => setSidebarOpen(false)}
          aria-hidden='true'
        />
      )}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 right-0 w-[300px] bg-gray-800 text-gray-200 transform ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'
        } transition-transform duration-200 ease-in-out z-40`}
        role='dialog'
        aria-modal='true'
      >
        <div className='flex justify-between items-center px-4 py-4 border-b border-gray-700'>
          <h2 className='text-lg font-semibold'>Opciones</h2>
          <button
            aria-label='Cerrar sidebar'
            onClick={() => setSidebarOpen(false)}
            className='p-1 hover:bg-gray-700 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400'
          >
            <CloseIcon className='h-4 w-4' />
          </button>
        </div>
        <nav className='mt-4 px-8 flex flex-col space-y-1'>
          {options.map((opt) => (
            <button
              key={opt.label}
              className='flex items-center px-4 py-3 rounded-md hover:bg-teal-600 transition-colors font-semibold'
              onClick={opt.action}
              aria-label={opt.label}
            >
              {opt.icon}
              <span className='ml-3'>{opt.label}</span>
            </button>
          ))}
          <div className='mt-8 px-4 py-4 border-t border-teal-500'>
            <h3 className='text-teal-400 font-bold mb-3 tracking-wide uppercase text-sm'>
              Funciones Premium
            </h3>
            <ul className='text-gray-400 list-disc list-inside space-y-1 text-sm'>
              <li>Reportes avanzados</li>
              <li>Historial ilimitado</li>
              <li>Soporte prioritario</li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <div className='flex-1 flex flex-col overflow-auto bg-white'>
        {/* Header */}
        <header className='fixed top-0 left-0 right-0 h-14 backdrop-blur-sm bg-gray-900/90 text-gray-300  flex items-center justify-between  z-30 shadow-sm'>
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label='Abrir menú de opciones'
            className='w-full px-6 flex items-center justify-between space-x-3 p-2 rounded-md hover:bg-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400'
          >
            <svg
              className='h-6 w-6 text-gray-200'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='3' y1='12' x2='21' y2='12' />
              <line x1='3' y1='6' x2='21' y2='6' />
              <line x1='3' y1='18' x2='21' y2='18' />
            </svg>
            <p className='font-semibold text-gray-300'>
              {formatted.date}, {formatted.time}
            </p>
          </button>
        </header>

        {/* Spacer */}
        <div className='h-14' />

        {/* Main content */}
        <section className={className}>{children}</section>

        {/* Footer */}
        <footer className='fixed bottom-0 left-0 right-0 bg-gray-900 text-gray-300 flex justify-center space-x-10 py-4 border-t border-gray-700'>
          <Link
            to='/'
            className='hover:text-teal-400 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded'
          >
            Inicio
          </Link>
          <Link
            to='/informacion/general'
            onClick={increase}
            className='hover:text-teal-400 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded'
          >
            Análisis
          </Link>
          <Link
            to='/registros'
            onClick={increase}
            className='hover:text-teal-400 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded'
          >
            Registros
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
