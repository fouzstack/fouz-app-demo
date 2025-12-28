// components/Header.tsx
import { Bars3Icon } from '@heroicons/react/24/outline';
import { PageLocation } from './PageLocation';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

export const Header = ({ toggleSidebar, toggleMobileSidebar }: HeaderProps) => {
  return (
    <header className='bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-700'>
      <div className='flex items-center justify-between px-6 py-1'>
        <div className='flex items-center'>
          <button
            onClick={toggleMobileSidebar}
            className='lg:hidden p-2 rounded-xl text-gray-300 hover:bg-gray-800 transition duration-100'
          >
            <Bars3Icon className='w-6 h-6' />
          </button>
          <button
            onClick={toggleSidebar}
            className='hidden lg:flex p-2 rounded-xl text-gray-300 hover:bg-gray-800 transition duration-100'
          >
            <Bars3Icon className='w-6 h-6' />
          </button>
          <div className='ml-4 text-white'>
            <PageLocation />
          </div>
        </div>

        <UserMenu />
      </div>
    </header>
  );
};
