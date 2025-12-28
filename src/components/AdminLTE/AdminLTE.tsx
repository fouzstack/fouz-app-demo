// components/Dashboard.tsx
import { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { useExportToPdf } from '../../hooks/useExportToPdf';

const AdminLTE = ({ children }: { children: React.ReactNode }) => {
  const { handleSendJson } = useExportToPdf();

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

  return (
    <div className='flex h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white overflow-hidden'>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
        handleSendJson={handleSendJson}
      />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Sticky Header */}
        <div className='flex-shrink-0 sticky top-0 z-40'>
          <Header
            toggleSidebar={toggleSidebar}
            toggleMobileSidebar={toggleMobileSidebar}
          />
        </div>

        {/* Scrollable Content Area */}
        <div className='flex-1 flex flex-col min-h-0'>
          <main className='flex-1 overflow-y-auto scrollbar-hide'>
            <div className='container mx-auto py-1 px-1 scrollbar-hide'>
              <div className='bg-gray-850  min-h-full scrollbar-hide'>{children}</div>
            </div>
          </main>
        </div>

        {/* Sticky Footer */}
        <div className='flex-shrink-0 sticky bottom-0 z-30'>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLTE;
