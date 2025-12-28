import { useRef, useMemo, useCallback, useEffect, memo } from 'react';
import { ProcessedProduct, Totals } from './productCalculations';
import { useNavigationStore } from './navigationStore';

/* ──────────────────────────────────────────────
   TYPES
────────────────────────────────────────────── */
interface ProductTableFullProps {
  newStyles?: string;
  data: ProcessedProduct[];
  onRowClick: (product: ProcessedProduct) => void;
  totals: Totals;
  averageSalesPercentage: number;
  setShowFullTable?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TableColumn {
  accessorKey: keyof ProcessedProduct | string;
  header: string;
  width: number;
  fixed: boolean;
  align?: 'left' | 'center' | 'right';
  format?: 'currency' | 'number';
  group: 'product' | 'inventory' | 'sales' | 'finance';
}

/* ──────────────────────────────────────────────
   UTILS
────────────────────────────────────────────── */
const getProductKey = (
  product: ProcessedProduct,
  index: number,
  type: 'table' | 'card',
): string => {
  if (product.id != null) return `${type}-${product.id}`;
  if (product.code) return `${type}-${product.code}`;
  return `${type}-${index}`;
};

const align = (a?: 'left' | 'center' | 'right') =>
  a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

/* ──────────────────────────────────────────────
   COLUMN GROUPS
────────────────────────────────────────────── */
export const COLUMN_GROUPS = {
  product: {
    name: 'Producto',
    color: 'bg-blue-950',
    border: 'border-blue-800',
  },
  inventory: {
    name: 'Inventario',
    color: 'bg-green-950',
    border: 'border-green-800',
  },
  sales: {
    name: 'Ventas',
    color: 'bg-purple-950',
    border: 'border-purple-800',
  },
  finance: {
    name: 'Finanzas',
    color: 'bg-amber-950',
    border: 'border-amber-800',
  },
} as const;

/* ──────────────────────────────────────────────
   GROUP HEADER
────────────────────────────────────────────── */
const GroupHeader = ({
  group,
  columnCount,
}: {
  group: keyof typeof COLUMN_GROUPS;
  columnCount: number;
}) => {
  const g = COLUMN_GROUPS[group];
  return (
    <th
      colSpan={columnCount}
      className={`px-4 py-3 border-r border-gray-700 font-bold uppercase tracking-wider text-xs text-center sticky top-0 z-30
        ${g.color} ${g.border} text-white`}
    >
      {g.name}
    </th>
  );
};

/* ──────────────────────────────────────────────
   COLUMNS
────────────────────────────────────────────── */
const useTableColumns = (): TableColumn[] =>
  useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Producto',
        width: 120,
        fixed: true,
        group: 'product',
      },
      {
        accessorKey: 'unit',
        header: 'U/M',
        width: 80,
        align: 'center',
        fixed: false,
        group: 'product',
      },
      {
        accessorKey: 'initial_products',
        header: 'Inicial',
        width: 90,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'incoming_products',
        header: 'Entrada',
        width: 90,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'losses',
        header: 'Ajuste',
        width: 90,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'available_products',
        header: 'A la Venta',
        width: 100,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'final_products',
        header: 'Final',
        width: 90,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'sold_products',
        header: 'Vendido',
        width: 100,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'sales',
      },
      {
        accessorKey: 'price',
        header: 'Precio',
        width: 110,
        align: 'right',
        format: 'currency',
        fixed: false,
        group: 'finance',
      },
      {
        accessorKey: 'total_cash',
        header: 'Importe',
        width: 130,
        align: 'right',
        format: 'currency',
        fixed: false,
        group: 'finance',
      },
    ],
    [],
  );

/* ──────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────── */
const ProductTableFull: React.FC<ProductTableFullProps> = ({
  data,
  totals,
  newStyles,
  setShowFullTable,
  onRowClick,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const columns = useTableColumns();

  const {
    scrollPosition,
    setScrollPosition,
    highlightedProductId,
    setHighlightedProductId,
  } = useNavigationStore();

  const isRestoringRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ───── RESTORE SCROLL */
  useEffect(() => {
    if (!tableContainerRef.current || !scrollPosition) return;
    isRestoringRef.current = true;
    tableContainerRef.current.scrollTop = scrollPosition;
    setTimeout(() => (isRestoringRef.current = false), 150);
  }, [scrollPosition]);

  /* ───── TRACK SCROLL */
  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (isRestoringRef.current) return;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(
        () => setScrollPosition(el.scrollTop),
        100,
      );
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [setScrollPosition]);

  /* ───── SCROLL TO PRODUCT */
  useEffect(() => {
    if (!highlightedProductId) return;

    const el = document.querySelector(
      `[data-product-id="${highlightedProductId}"]`,
    );
    if (el) {
      el.scrollIntoView({ block: 'center' });
    }
  }, [highlightedProductId]);

  /* ───── FORMAT */
  const formatValue = (value: any, col: TableColumn) => {
    if (value == null) return '';
    if (col.format === 'currency')
      return value.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
      });
    if (col.format === 'number')
      return value.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    return value.toString();
  };

  /* ───── CLICK */
  const handleRowClick = useCallback(
    (product: ProcessedProduct) => {
      setHighlightedProductId(product.id ?? null);
      onRowClick(product);
    },
    [onRowClick, setHighlightedProductId],
  );

  /* ───── STYLES */
  const highlightStyles = `
    .highlighted-row {
      border-left: 4px solid yellow;
      background-color: #000000;
    }
    
    .table-header-background {
      background-color: #111827 !important;
    }
    
    .sticky-header-container {
      position: sticky;
      top: 0;
      z-index: 40;
      background-color: #111827;
    }
  `;

  return (
    <>
      <style>{highlightStyles}</style>

      <article className='pb-8 relative scrollbar-hide'>
        <div className='!bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-4'>
          <div
            ref={tableContainerRef}
            style={{ overflow: 'auto', height: '70vh' }}
            className='scrollbar-hide'
          >
            {/* Tabla principal que incluye cabecera, cuerpo y pie */}
            <table
              style={{ tableLayout: 'fixed', minWidth: 1200 }}
              className={`w-full text-lg bg-gray-900 ${newStyles ?? ''}`}
            >
              {/* CABECERA */}
              <thead className='table-header-background sticky top-0 z-40'>
                <tr>
                  <GroupHeader group='product' columnCount={2} />
                  <GroupHeader group='inventory' columnCount={5} />
                  <GroupHeader group='sales' columnCount={1} />
                  <GroupHeader group='finance' columnCount={2} />
                </tr>

                <tr
                  onClick={() => setShowFullTable?.((v) => !v)}
                  className='cursor-pointer'
                >
                  {columns.map((col) => (
                    <th
                      key={col.accessorKey}
                      style={{ width: col.width }}
                      className={`px-3 py-4 border-r border-gray-700 font-semibold uppercase tracking-wider text-xs text-white bg-gray-950
                        ${col.fixed ? 'sticky left-0 z-50 bg-gray-950' : ''}
                        ${align(col.align)}`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* CUERPO */}
              <tbody className='divide-y divide-gray-700'>
                {data.map((row, i) => {
                  const isHighlighted = row.id === highlightedProductId;

                  return (
                    <tr
                      key={getProductKey(row, i, 'table')}
                      data-product-id={row.id ?? ''}
                      onClick={() => handleRowClick(row)}
                      className={`
                        cursor-pointer
                        ${i % 2 ? 'bg-gray-900' : 'bg-gray-800'}
                        hover:bg-gray-700
                        border-l-4 
                        ${isHighlighted ? 'highlighted-row' : ''}
                      `}
                    >
                      {columns.map((col) => {
                        const isNameColumn = col.accessorKey === 'name';

                        return (
                          <td
                            key={`${row.id}-${col.accessorKey}`}
                            style={{ width: col.width }}
                            className={`px-3 py-4 border-r border-gray-700
                              ${align(col.align)}
                              ${col.fixed ? 'sticky left-0 bg-inherit z-10' : ''}
                              ${
                                isNameColumn && isHighlighted
                                  ? 'text-amber-400 font-semibold'
                                  : ''
                              }`}
                          >
                            {formatValue(
                              row[col.accessorKey as keyof ProcessedProduct],
                              col,
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>

              {/* PIE DE TABLA - TOTALES */}
              <tfoot>
                <tr className='text-white font-bold bg-gray-750 sticky bottom-0 z-30'>
                  {columns.map((col, index) => {
                    // Para las primeras 2 columnas (producto y U/M), mostrar "TOTALES"
                    if (index < 2) {
                      return (
                        <td
                          key={`total-${col.accessorKey}`}
                          style={{ width: col.width }}
                          className={`px-3 py-4 ${align(col.align)} border-r border-gray-700
                            ${col.fixed ? 'sticky left-0 bg-gray-800 z-20' : ''}
                            bg-gray-800`}
                        >
                          {index === 0 ? 'TOTALES' : ''}
                        </td>
                      );
                    }

                    // Para las columnas restantes, mostrar los totales correspondientes
                    const totalKey = col.accessorKey as keyof Totals;
                    const hasTotal = totals && totalKey in totals;

                    return (
                      <td
                        key={`total-${col.accessorKey}`}
                        style={{ width: col.width }}
                        className={`px-3 py-4 ${align(col.align)} border-r border-gray-700 bg-gray-800`}
                      >
                        {hasTotal
                          ? formatValue(totals[totalKey], col)
                          : ''}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </article>
    </>
  );
};

export default memo(ProductTableFull);