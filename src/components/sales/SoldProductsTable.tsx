import React, { useRef, useEffect, useCallback, memo } from 'react';
import { useNavigationStore } from '../table/navigationStore';
import { ProcessedProduct } from '../table/productCalculations';

interface SoldProductsTableProps {
  heading: string;
  data: ProcessedProduct[];
  onRowClick: (product: ProcessedProduct) => void;
  loading?: boolean;
  style?: React.CSSProperties;
  setShowFullTable?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Constantes para evitar recreaciones
const COLOR_CLASSES = {
  outOfStock: 'text-red-400',
  lowStock: 'text-orange-400',
  goodStock: 'text-emerald-400 font-semibold',
  normal: 'text-gray-200',
} as const;

const DEFAULT_STYLES: React.CSSProperties = {
  backgroundColor: 'transparent',
};

// LoadingFallback actualizado
const LoadingFallback = memo(() => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0f12]/90 backdrop-blur-xl">
    <div className="bg-[#111318] border border-gray-800 rounded-xl p-8 text-center max-w-sm shadow-2xl shadow-black/40">
      <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-amber-500 mx-auto mb-6"></div>
      <p className="text-gray-300 text-lg font-medium">Cargando productos vendidos...</p>
      <p className="text-gray-400 text-sm mt-2">Procesando datos de ventas</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// EmptyFallback actualizado
const EmptyFallback = memo(() => (
  <div className="flex items-center justify-center min-h-[60vh] px-4">
    <div className="text-center p-8 bg-[#111318] rounded-xl border border-gray-800 max-w-md shadow-xl shadow-black/30">
      <div className="bg-gray-800/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-300 text-lg font-semibold mb-2">No hay productos vendidos</p>
      <p className="text-gray-400">Los productos vendidos aparecerán aquí una vez que se registren ventas</p>
    </div>
  </div>
));

EmptyFallback.displayName = 'EmptyFallback';

// Helper functions
const getTextColorClass = (
  finalQty: number | undefined,
  soldQty: number | undefined,
): keyof typeof COLOR_CLASSES => {
  if ((finalQty ?? 0) === 0) return 'outOfStock';
  if ((finalQty ?? 0) > 0 && (finalQty ?? 0) <= 5) return 'lowStock';
  if ((soldQty ?? 0) > 0 && (finalQty ?? 0) > 5) return 'goodStock';
  return 'normal';
};

// Componente de fila unificado
const TableRow: React.FC<{
  product: ProcessedProduct;
  index: number;
  isHighlighted: boolean;
  onClick: (product: ProcessedProduct) => void;
  formatNumber: (value: number) => string;
}> = ({ product, index, isHighlighted, onClick, formatNumber }) => {
  const textColorClass = getTextColorClass(
    product.final_products,
    product.sold_products
  );

  return (
    <tr
      data-product-id={product.id}
      className={`
        cursor-pointer group
        transition-all duration-300
        hover:bg-gradient-to-r hover:from-gray-800/60 hover:to-gray-700/60
        border-b border-gray-800/50 last:border-b-0
        ${index % 2 === 0 ? 'bg-[#0f172a]' : 'bg-[#1e293b]'}
        ${isHighlighted ? 'highlighted-row' : ''}
        animate-row-fade
      `}
      onClick={() => onClick(product)}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      {/* Columna Nombre */}
      <td className="px-6 py-4 text-sm font-medium text-gray-100 group-hover:text-amber-400 transition-colors duration-200">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-3 ${getStatusColor(product)}`}></div>
          <span className={isHighlighted ? 'font-semibold text-amber-400' : ''}>
            {product.name}
          </span>
        </div>
      </td>

      {/* Columna Cantidad Vendida */}
      <td className={`
        px-6 py-4 text-sm font-semibold text-right
        ${COLOR_CLASSES[textColorClass]}
        group-hover:scale-105 transition-transform duration-200
      `}>
        <div className="flex justify-evenly">
          <span className="text-lg">{formatNumber(product.sold_products)}</span>
          <div className="text-xs text-gray-600 mt-1 mx-1">
            ${product.price.toLocaleString('es-MX')}
          </div>
        </div>
      </td>

      {/* Columna Valor Total */}
      <td className="px-6 py-4 text-sm font-medium text-gray-200 text-right">
        {product.price && product.sold_products > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-emerald-400 font-semibold">
              ${(product.price * product.sold_products).toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>

          </div>
        )}
      </td>
    </tr>
  );
};

// Helper para color de estado
const getStatusColor = (product: ProcessedProduct): string => {
  if ((product.final_products ?? 0) === 0) return 'bg-red-500/60';
  if ((product.final_products ?? 0) > 0 && (product.final_products ?? 0) <= 5) return 'bg-orange-500/60';
  if ((product.sold_products ?? 0) > 0 && (product.final_products ?? 0) > 5) return 'bg-emerald-500/60';
  return 'bg-blue-500/60';
};

// Hook personalizado para gestión de scroll
const useScrollManagement = (
  containerRef: React.RefObject<HTMLDivElement>,
  dataLength: number,
) => {
  const { scrollPosition, setScrollPosition, highlightedProductId } =
    useNavigationStore();
  const isRestoringRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Restaurar scroll position
  useEffect(() => {
    if (!containerRef.current || !dataLength || scrollPosition === 0) return;

    const restoreScroll = () => {
      isRestoringRef.current = true;
      if (containerRef.current) {
        containerRef.current.scrollTop = scrollPosition;
      }

      setTimeout(() => {
        isRestoringRef.current = false;
      }, 150);
    };

    restoreScroll();
  }, [containerRef, dataLength, scrollPosition]);

  // Track scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isRestoringRef.current) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setScrollPosition(container.scrollTop);
      }, 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [containerRef, setScrollPosition]);

  // Scroll automático a producto resaltado
  useEffect(() => {
    if (!highlightedProductId || !containerRef.current) return;

    const scrollToHighlighted = () => {
      const element = document.querySelector(
        `[data-product-id="${highlightedProductId}"]`,
      );
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    };

    const timer = setTimeout(scrollToHighlighted, 100);
    return () => clearTimeout(timer);
  }, [highlightedProductId, containerRef]);

  return { isRestoringRef };
};

// Estilos CSS para animaciones y efectos
const tableStyles = `
  .highlighted-row {
    background: linear-gradient(90deg, rgba(251, 191, 36, 0.15) 0%, transparent 100%) !important;
    border-left: 4px solid rgba(251, 191, 36, 0.8) !important;
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.1);
  }
  
  @keyframes fadeInRow {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-row-fade {
    animation: fadeInRow 0.3s ease-out forwards;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.6);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 114, 128, 0.8);
  }
`;

const SoldProductsTable: React.FC<SoldProductsTableProps> = ({
  heading,
  data,
  onRowClick,
  loading = false,
  style = DEFAULT_STYLES,
  setShowFullTable,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    setHighlightedProductId,
    highlightedProductId,
  } = useNavigationStore();

  // Hook de gestión de scroll
  //@ts-expect-error
  useScrollManagement(containerRef, data.length);

  // Handlers memoizados
  const handleProductClick = useCallback(
    (product: ProcessedProduct) => {
      setHighlightedProductId(product.id ?? null);
      onRowClick(product);
    },
    [onRowClick, setHighlightedProductId],
  );

  // Funciones utilitarias memoizadas
  const formatNumber = useCallback((value: number): string => {
    return value.toLocaleString('es-MX');
  }, []);

  // Handler para header click
  const handleHeaderClick = useCallback(() => {
    if (setShowFullTable) {
      setShowFullTable((prev) => !prev);
    }
  }, [setShowFullTable]);

  /* // Calcular totales
  const totalSold = data.reduce((sum, product) => sum + (product.sold_products || 0), 0);
  const totalRevenue = data.reduce((sum, product) => 
    sum + ((product.price || 0) * (product.sold_products || 0)), 0
  ); */

  // Estados de carga/vacío
  if (loading) return <LoadingFallback />;
  if (data.length === 0) return <EmptyFallback />;

  return (
    <>
      <style>{tableStyles}</style>
      <div className="bg-[#0d0f12] min-h-screen">
        {/* Contenedor principal con scroll */}
        <div
          ref={containerRef}
          className="overflow-y-auto scrollbar-hide  max-h-[calc(100vh-10px)] focus:outline-none"
          tabIndex={-1}
          role="region"
          aria-label={`Lista de ${heading.toLowerCase()}`}
        >
          <div className="max-w-6xl mx-auto ">
            <div
              className="bg-[#111318] border border-gray-800 rounded-xl shadow-2xl shadow-black/30 overflow-hidden"
              style={style}
            >



              
              {/* Cabecera de tabla */}
              <div className="border-b border-gray-800">
                <div
                  onClick={handleHeaderClick}
                  className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] px-6  cursor-pointer hover:from-[#334155] hover:to-[#1e293b] transition-all duration-300 group"
                >
                </div>

                {/* Subcabecera con columnas */}
                <div className="bg-gradient-to-r from-[#15202b] to-[#1e293b] px-6 py-3 border-b border-gray-800">
                  <div className="grid grid-cols-3 text-gray-300 text-sm font-semibold uppercase tracking-wider">
                    <div>Producto</div>
                    <div className="text-right">Vendido</div>
                    <div className="text-right">Total</div>
                  </div>
                </div>
              </div>





              {/* Cuerpo de la tabla */}
              <table className="w-full">
                <tbody>
                  {data.map((product, index) => (
                    <TableRow
                      key={`product-${product.id || product.code || index}`}
                      product={product}
                      index={index}
                      isHighlighted={product.id === highlightedProductId}
                      onClick={handleProductClick}
                      formatNumber={formatNumber}
                    />
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default memo(SoldProductsTable);
