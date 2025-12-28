// components/Dashboard.jsx
import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  XMarkIcon,
  Bars3Icon,
  ChartBarIcon,
  PuzzlePieceIcon,
  ChevronDownIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const menuItems = [
    { path: '/', icon: HomeIcon, label: 'Inicio' },
    { path: '/informacion/general', icon: ChartBarIcon, label: 'Analisís' },
    { path: '/inventario', icon: PuzzlePieceIcon, label: 'Inventario' },
  ];

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar para desktop */}
      <div
        className={`hidden lg:flex transition-all duration-300 ease-bounce ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className='bg-gray-800 text-white flex flex-col h-full w-full'>
          {/* Header del Sidebar */}
          <div className='flex items-center justify-between p-4 border-b border-gray-700'>
            {sidebarOpen && (
              <div className='flex items-center space-x-2'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                  <span className='font-bold text-white'>P</span>
                </div>
                <span className='text-xl font-bold'>PremiumDash</span>
              </div>
            )}
            {!sidebarOpen && (
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto'>
                <span className='font-bold text-white'>P</span>
              </div>
            )}
          </div>

          {/* Menú de Navegación */}
          <nav className='flex-1 p-4 space-y-2'>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className='flex items-center p-3 rounded-lg transition-all duration-200 ease-bounce hover:bg-gray-700 hover:scale-105'
              >
                <item.icon className='w-6 h-6 flex-shrink-0' />
                {sidebarOpen && (
                  <span className='ml-3 font-medium'>{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer del Sidebar */}
          <div className='p-4 border-t border-gray-700'>
            <div
              className={`flex items-center ${
                sidebarOpen ? 'justify-between' : 'justify-center'
              }`}
            >
              {sidebarOpen && (
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center'>
                    <span className='text-xs font-bold text-white'>JD</span>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>John Doe</p>
                    <p className='text-xs text-gray-400'>Admin</p>
                  </div>
                </div>
              )}
              {!sidebarOpen && (
                <div className='w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center'>
                  <span className='text-xs font-bold text-white'>JD</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar para mobile */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-bounce ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='bg-gray-800 text-white flex flex-col h-full w-64'>
          {/* Header del Sidebar Mobile */}
          <div className='flex items-center justify-between p-4 border-b border-gray-700'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <span className='font-bold text-white'>P</span>
              </div>
              <span className='text-xl font-bold'>PremiumDash</span>
            </div>
            <button
              onClick={closeMobileSidebar}
              className='p-1 rounded-lg hover:bg-gray-700 transition-colors'
            >
              <XMarkIcon className='w-6 h-6' />
            </button>
          </div>

          {/* Menú de Navegación Mobile */}
          <nav className='flex-1 p-4 space-y-2'>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className='flex items-center p-3 rounded-lg transition-all duration-200 ease-bounce hover:bg-gray-700 hover:scale-105 justify-start'
              >
                <item.icon className='w-6 h-6 flex-shrink-0' />
                <span className='ml-3 font-medium'>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Header */}
        <header className='bg-white shadow-sm border-b border-gray-200 z-30'>
          <div className='flex items-center justify-between px-4 py-3'>
            {/* Botón del menú */}
            <div className='flex items-center'>
              <button
                onClick={toggleMobileSidebar}
                className='lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'
              >
                <Bars3Icon className='w-6 h-6' />
              </button>
              <button
                onClick={toggleSidebar}
                className='hidden lg:flex p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors'
              >
                <Bars3Icon className='w-6 h-6' />
              </button>
            </div>
            {/* Iconos de la derecha */}
            <div className='flex items-center space-x-4'>
              {/* Notificaciones */}
              <button className='relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
                <BellIcon className='w-6 h-6' />
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              </button>

              {/* Perfil del usuario */}
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center'>
                  <span className='text-xs font-bold text-white'>JD</span>
                </div>
                <div className='hidden md:block'>
                  <p className='text-sm font-medium text-gray-700'>John Doe</p>
                  <p className='text-xs text-gray-500'>Administrador</p>
                </div>
                <ChevronDownIcon className='w-4 h-4 text-gray-500' />
              </div>
            </div>
          </div>
        </header>

        {/* Contenido Children */}
        <main className='flex-1 overflow-auto bg-gray-50'>
          <div className='container mx-auto p-4 lg:p-6'>{children}</div>
        </main>

        {/* Footer */}
        <footer className='bg-white border-t border-gray-200 py-4'>
          <div className='container mx-auto px-4 lg:px-6'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <p className='text-sm text-gray-600'>
                &copy; {new Date().getFullYear()} PremiumDash. Todos los
                derechos reservados.
              </p>
              <div className='flex space-x-4 mt-2 md:mt-0'>
                <NavLink
                  to='/inventario'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Inventario
                </NavLink>
                <NavLink
                  to='/informacion/general'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Analisís
                </NavLink>
                <NavLink
                  to='/registros'
                  className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Registros
                </NavLink>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

//MagnifyingGlassIcon,
/*  CubeIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  TrashIcon,
  ShareIcon,
  PencilSquareIcon, */
