import React from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) => {
  const location = useLocation();

  // ============================
  // 📌 TÍTULO SEGÚN LA RUTA
  // ============================
  const getPageTitle = (): string => {
    const path = location.pathname;

    if (path === "/") return "Productos";
    if (path.includes("crear/producto")) return "Crear Producto";
    if (path.includes("editar/producto")) return "Editar Productos";
    if (path.includes("entradas")) return "Entradas";
    if (path.includes("ajustes")) return "Ajustes de Inventario";
    if (path.includes("finales")) return "Cierre de Finales";
    if (path.includes("finanzas")) return "Finanzas";
    if (path.includes("informacion/general")) return "Análisis General";
    if (path.includes("registros")) return "Registros";
    if (path.includes("crear/inventario")) return "Nuevo Inventario";
    if (path.includes("exportar/inventario")) return "Exportar Inventario";
    if (path.includes("importar/inventario")) return "Importar Inventario";
    if (path.includes("/tabla/integral")) return "Tabla Integral";
    if (path.includes("/ventas")) return "Ventas";

    return "Panel de Control";
  };

  return (
    <header
      className="
        w-full h-16 flex items-center justify-between px-4 lg:px-6
        bg-[#0f1115] border-b border-[#2a2d33]
        shadow-lg shadow-black/20
        sticky top-0 z-30
      "
    >
      {/* ============================
          📌 BOTÓN SIDEBAR DESKTOP
      ============================ */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="
          hidden lg:flex items-center justify-center
          w-10 h-10 rounded-lg
          bg-gray-800 hover:bg-gray-700
          transition-all duration-200
          text-gray-300 hover:text-white
        "
      >
        {sidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* ============================
          📌 BOTÓN SIDEBAR MÓVIL
      ============================ */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="
          lg:hidden flex items-center justify-center
          w-10 h-10 rounded-lg
          bg-gray-800 hover:bg-gray-700
          transition-all duration-200
          text-gray-300 hover:text-white
        "
      >
        {mobileSidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* ============================
          📌 TÍTULO DE LA PÁGINA
      ============================ */}
      <h1
        className="
          text-lg lg:text-xl font-semibold
          text-gray-100 tracking-wide
          select-none
        "
      >
        {getPageTitle()}
      </h1>

      {/* ============================
          📌 PERFIL / USUARIO
      ============================ */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div
            className="
              w-10 h-10 rounded-full
              bg-gradient-to-r from-emerald-500 to-green-600
              flex items-center justify-center
              shadow-md shadow-black/30
            "
          >
            <span className="text-white font-bold">HS</span>
          </div>

          {/* Estado online */}
          <div
            className="
              absolute bottom-0 right-0
              w-3 h-3 rounded-full
              bg-green-400 border-2 border-[#0f1115]
            "
          />
        </div>
      </div>
    </header>
  );
};
