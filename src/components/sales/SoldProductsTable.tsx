import React, { useRef, useEffect, useCallback, memo } from 'react';

import { useNavigationStore } from '../table/navigationStore';
import { ProcessedProduct } from '../table/productCalculations';
import TableRowProduct from './TableRowProduct';

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
    viewMode,
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

  

  // Funciones utilitarias memoizadas
  const formatNumber = useCallback((value: number): string => {
    return value.toLocaleString('es-MX');
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

      {/* Contenedor principal con scroll */}
      <div
        ref={containerRef}
        className='overflow-y-auto max-h-[calc(100vh-120px)] focus:outline-none'
        tabIndex={-1}
        role='region'
        aria-label='Lista de productos'
      >
        {/* Vista Tabla */}
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
                      {heading}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((product, index) => (
                    <TableRowProduct
                      key={getProductKey(product, index)}
                      product={product}
                      isHighlighted={product.id === highlightedProductId}
                      onClick={handleProductClick}
                      getTextColorClass={getTextColorClass}
                      formatNumber={formatNumber}
                      index={index}                  />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
       

        
      </div>
    </div>
  );
};

export default memo(SoldProductsTable);

