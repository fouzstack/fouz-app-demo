import React, { useRef, useEffect, useCallback, memo } from 'react';
import { ProcessedProduct } from './productCalculations';
import { useNavigationStore } from './navigationStore';
import CardProduct from './CardProduct';
import TableRowProduct from './TableRowProduct';
import { ShoppingBagIcon, TableCellsIcon } from '@heroicons/react/24/outline';

interface ProductTableMinimalProps {
  accessorKey: 'incoming_products' | 'losses' | 'final_products';
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

const BORDER_COLORS = {
  outOfStock: 'border-l-red-500/50',
  lowStock: 'border-l-orange-500/50',
  goodStock: 'border-l-emerald-500/50',
  normal: 'border-l-indigo-500/50',
} as const;

const DEFAULT_STYLES: React.CSSProperties = {
  backgroundColor: 'transparent',
};

// Componentes de estado memoizados
const LoadingFallback = memo(() => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0f12]/90 backdrop-blur-xl">
    <div className="bg-[#111318] border border-gray-800 rounded-xl p-8 text-center max-w-sm shadow-2xl shadow-black/40">
      <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-amber-500 mx-auto mb-6"></div>
      <p className="text-gray-300 text-lg font-medium">Cargando inventario...</p>
      <p className="text-gray-400 text-sm mt-2">Preparando datos para visualización</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

const EmptyFallback = memo(() => (
  <div className="flex items-center justify-center min-h-[60vh] px-4">
    <div className="text-center p-8 bg-[#111318] rounded-xl border border-gray-800 max-w-md shadow-xl shadow-black/30">
      <div className="bg-gray-800/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-gray-300 text-lg font-semibold mb-2">No hay productos disponibles</p>
      <p className="text-gray-400">Los productos aparecerán aquí una vez que se agreguen al sistema</p>
    </div>
  </div>
));

EmptyFallback.displayName = 'EmptyFallback';

// Helper functions para compatibilidad con componentes hijos
const getTextColorClass = (
  finalQty: number | undefined,
  soldQty: number | undefined,
): keyof typeof COLOR_CLASSES => {
  if ((finalQty ?? 0) === 0) return 'outOfStock';
  if ((finalQty ?? 0) > 0 && (finalQty ?? 0) <= 5) return 'lowStock';
  if ((soldQty ?? 0) > 0 && (finalQty ?? 0) > 5) return 'goodStock';
  return 'normal';
};

const getCardBorderColor = (
  finalQty: number | undefined,
  soldQty: number | undefined,
): keyof typeof BORDER_COLORS => {
  if ((finalQty ?? 0) === 0) return 'outOfStock';
  if ((finalQty ?? 0) > 0 && (finalQty ?? 0) <= 5) return 'lowStock';
  if ((soldQty ?? 0) > 0 && (finalQty ?? 0) > 5) return 'goodStock';
  return 'normal';
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

      // Reset flag después de un breve delay
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

      // Debounce para evitar updates excesivos
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

    // Delay pequeño para asegurar que el DOM está listo
    const timer = setTimeout(scrollToHighlighted, 100);
    return () => clearTimeout(timer);
  }, [highlightedProductId, containerRef]);

  return { isRestoringRef };
};

// Componente memoizado ProductTableMinimal
const ProductTableMinimal: React.FC<ProductTableMinimalProps> = ({
  accessorKey,
  heading,
  data,
  onRowClick,
  loading = false,
  style = DEFAULT_STYLES,
  setShowFullTable,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    viewMode,
    setViewMode,
    setHighlightedProductId,
    highlightedProductId,
  } = useNavigationStore();

  const isCardView = viewMode === 'card';

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

  const toggleViewMode = useCallback(() => {
    // Guardar posición actual antes de cambiar
    if (containerRef.current) {
      useNavigationStore
        .getState()
        .setScrollPosition(containerRef.current.scrollTop);
    }

    setViewMode(isCardView ? 'table' : 'card');
  }, [isCardView, setViewMode]);

  const handleHeaderClick = useCallback(() => {
    if (setShowFullTable) {
      setShowFullTable((prev) => !prev);
    }
  }, [setShowFullTable]);

  // Funciones utilitarias memoizadas
  const formatNumber = useCallback((value: number): string => {
    return value.toLocaleString('es-MX');
  }, []);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);

  // Generar key única para productos
  const getProductKey = useCallback(
    (product: ProcessedProduct, index: number): string => {
      const baseKey = product.id
        ? `product-${product.id}`
        : product.code
          ? `product-${product.code}`
          : `product-${index}`;

      return `${isCardView ? 'card' : 'table'}-${baseKey}`;
    },
    [isCardView],
  );

  // Estados de carga/vacío
  if (loading) return <LoadingFallback />;
  if (data.length === 0) return <EmptyFallback />;

  return (
    <div className="bg-[#0d0f12] min-h-screen">
      {/* Botón flotante para cambiar vista - UI premium */}
      <button
        onClick={toggleViewMode}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 shadow-2xl shadow-black/50 hover:shadow-amber-500/20 hover:border-amber-500/40 border border-gray-700 hover:scale-105 transition-all duration-300 group"
        aria-label={
          isCardView ? 'Cambiar a vista tabla' : 'Cambiar a vista tarjetas'
        }
        title={isCardView ? 'Vista de tabla' : 'Vista de tarjetas'}
      >
        <div className="relative">
          {isCardView ? (
            <TableCellsIcon className="h-6 w-6 group-hover:text-amber-400 transition-colors duration-200" />
          ) : (
            <ShoppingBagIcon className="h-6 w-6 group-hover:text-emerald-400 transition-colors duration-200" />
          )}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </button>

      

      {/* Contenedor principal con scroll optimizado */}
      <div
        ref={containerRef}
        className="overflow-y-auto scroll-smooth focus:outline-none max-h-[calc(100vh-180px)]"
        tabIndex={-1}
        role="region"
        aria-label={`Lista de ${heading.toLowerCase()}`}
      >
        {/* Vista Tabla - Diseño empresarial */}
        {!isCardView && (
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <div
              className="bg-[#111318] border border-gray-800 rounded-xl shadow-xl shadow-black/30 overflow-hidden animate-fade-in"
              style={style}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      onClick={handleHeaderClick}
                      className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-b border-gray-700 cursor-pointer hover:from-gray-800 hover:to-gray-700 transition-all duration-300 group"
                    >
                      <th className="px-8 py-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-gray-100 font-bold text-lg tracking-wide group-hover:text-amber-400 transition-colors duration-300">
                            {heading}
                          </span>
                          <span className="bg-gray-800/60 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-700 group-hover:border-amber-500/40 transition-colors duration-300">
                            {data.length} items
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {data.map((product, index) => (
                      <TableRowProduct
                        accessorKey={accessorKey}
                        key={getProductKey(product, index)}
                        product={product}
                        isHighlighted={product.id === highlightedProductId}
                        onClick={handleProductClick}
                        getTextColorClass={getTextColorClass}
                        formatNumber={formatNumber}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vista Tarjetas - Grid responsive */}
        {isCardView && (
          <div className="grid gap-6 p-6 max-w-7xl mx-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {data.map((product, index) => (
              <CardProduct
                key={getProductKey(product, index)}
                product={product}
                isHighlighted={product.id === highlightedProductId}
                onClick={handleProductClick}
                getTextColorClass={getTextColorClass}
                getCardBorderColor={getCardBorderColor}
                formatNumber={formatNumber}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}

        {/* Indicador de fin de lista */}
        <div className="px-6 py-4 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <span>Fin de la lista</span>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Mostrando todos los {data.length} productos
          </p>
        </div>
      </div>
      </div>
  );
};

// Export con memo para optimización
export default memo(ProductTableMinimal);
