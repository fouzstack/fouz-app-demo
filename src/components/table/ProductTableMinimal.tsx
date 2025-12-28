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
  outOfStock: 'border-l-red-500',
  lowStock: 'border-l-orange-500',
  goodStock: 'border-l-emerald-500',
  normal: 'border-l-indigo-500',
} as const;

const DEFAULT_STYLES: React.CSSProperties = {
  backgroundColor: 'black',
};

const LoadingFallback = memo(() => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'>
    <div className='bg-gray-800 border border-gray-700 rounded-xl p-8 text-center max-w-sm'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4'></div>
      <p className='text-gray-300'>Cargando inventario...</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

const EmptyFallback = memo(() => (
  <div className='flex items-center justify-center min-h-[60vh]'>
    <div className='text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700 max-w-md'>
      <p className='text-gray-400 text-lg'>No hay productos disponibles</p>
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

// Componente memoizado ProductTableMinimal.
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
  //const containerRef = useRef<HTMLDivElement>(null); // Tipo sin | null

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

  // Funciones utilitarias memoizadas
  const formatNumber = useCallback((value: number): string => {
    return value.toLocaleString('es-MX');
  }, []);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
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

  // Handler para header click
  const handleHeaderClick = useCallback(() => {
    if (setShowFullTable) {
      setShowFullTable((prev) => !prev);
    }
  }, [setShowFullTable]);

  // Estados de carga/vacío
  if (loading) return <LoadingFallback />;
  if (data.length === 0) return <EmptyFallback />;

  return (
    <div className='pb-12 bg-gray-900 min-h-screen'>
      {/* Botón flotante para cambiar vista */}
      <button
        onClick={toggleViewMode}
        className='fixed bottom-17 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-2xl hover:scale-110 transition-all duration-200 border border-gray-700'
        aria-label={
          isCardView ? 'Cambiar a vista tabla' : 'Cambiar a vista tarjetas'
        }
      >
        {isCardView ? (
          <TableCellsIcon className='h-6 w-6' />
        ) : (
          <ShoppingBagIcon className='h-6 w-6' />
        )}
      </button>

      {/* Contenedor principal con scroll */}
      <div
        ref={containerRef}
        className='overflow-y-auto scrollbar-hide max-h-[calc(100vh-120px)] focus:outline-none'
        tabIndex={-1}
        role='region'
        aria-label='Lista de productos'
      >
        {/* Vista Tabla */}
        {!isCardView && (
          <div className='max-w-4xl mx-auto px-4 py-6'>
            <div
              className='bg-gray-800/50 border border-gray-700 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden'
              style={style}
            >
              <table className='w-full'>
                <thead>
                  <tr
                    onClick={handleHeaderClick}
                    className='bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all duration-200'
                  >
                    <th className='px-6 py-4 text-center text-gray-300 font-extrabold text-sm uppercase tracking-widest w-[85%]'>
                       { heading }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((product, index) => {
                    return (
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vista Tarjetas */}
        {isCardView && (
          <div className='grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            {data.map((product, index) => {
              return (
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Export con memo para optimización
export default memo(ProductTableMinimal);
