import React, { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useExportToPdf } from "../../hooks/useExportToPdf";

const AdminLTE: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { handleSendJson } = useExportToPdf();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);


  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  return (
    <div
      className="
        flex h-screen w-full 
       bg-[#111318] text-gray-100 
        overflow-hidden
      "
    >
      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
        handleSendJson={handleSendJson}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <div className="flex-shrink-0 sticky top-0 z-40">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col min-h-0 scrollbar-hide">
          <main
            className="
              flex-1 overflow-y-auto scrollbar-hide 
               
            "
          >
            <div
              className="
                max-w-7xl mx-auto 
                bg-[#111318] 
                border border-gray-800 
                rounded-xl 
                shadow-xl shadow-black/30 
                min-h-[calc(100vh-10rem)]
              "
            >
              {children}
            </div>
          </main>
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 sticky bottom-0 z-30">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLTE;
