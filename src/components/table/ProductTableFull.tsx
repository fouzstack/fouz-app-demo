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
  type: 'table' | 'card' | 'cell',
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
    color: 'bg-[#15202b]',
    border: 'border-[#1e3a5f]',
    text: 'text-blue-300',
    hover: 'hover:bg-[#1e293b]',
  },
  inventory: {
    name: 'Inventario',
    color: 'bg-emerald-900/30',
    border: 'border-emerald-800/40',
    text: 'text-emerald-300',
    hover: 'hover:bg-emerald-900/20',
  },
  sales: {
    name: 'Ventas',
    color: 'bg-purple-900/30',
    border: 'border-purple-800/40',
    text: 'text-purple-300',
    hover: 'hover:bg-purple-900/20',
  },
  finance: {
    name: 'Finanzas',
    color: 'bg-amber-900/30',
    border: 'border-amber-800/40',
    text: 'text-amber-300',
    hover: 'hover:bg-amber-900/20',
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
      className={`px-6 py-4 border-r border-[#1e3a5f] font-bold uppercase tracking-wider text-xs text-center sticky top-0 z-30
        ${g.color} ${g.border} ${g.text} border-b border-[#1e3a5f]`}
    >
      <div className='flex items-center justify-center gap-2'>
        <div className='w-2 h-2 rounded-full bg-current opacity-70'></div>
        <span>{g.name}</span>
      </div>
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
        width: 140,
        fixed: true,
        group: 'product',
      },
      {
        accessorKey: 'unit',
        header: 'U/M',
        width: 90,
        align: 'center',
        fixed: false,
        group: 'product',
      },
      {
        accessorKey: 'initial_products',
        header: 'Inicial',
        width: 100,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'incoming_products',
        header: 'Entrada',
        width: 100,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'losses',
        header: 'Ajuste',
        width: 100,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'available_products',
        header: 'A la Venta',
        width: 110,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'final_products',
        header: 'Final',
        width: 100,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'inventory',
      },
      {
        accessorKey: 'sold_products',
        header: 'Vendido',
        width: 110,
        align: 'right',
        format: 'number',
        fixed: false,
        group: 'sales',
      },
      {
        accessorKey: 'price',
        header: 'Precio',
        width: 120,
        align: 'right',
        format: 'currency',
        fixed: false,
        group: 'finance',
      },
      {
        accessorKey: 'total_cash',
        header: 'Importe',
        width: 140,
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
  //const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ───── FORMATTERS */
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }),
    [],
  );

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

  /* ───── RESTORE SCROLL (IMMEDIATE) */
  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el || scrollPosition == null) return;
    isRestoringRef.current = true;
    el.scrollTop = scrollPosition;
    isRestoringRef.current = false;
  }, [scrollPosition]);

  /* ───── TRACK SCROLL */
  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (isRestoringRef.current) return;
      setScrollPosition(el.scrollTop);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [setScrollPosition]);

  /* ───── SCROLL TO PRODUCT (IMMEDIATE) */
  useEffect(() => {
    if (!highlightedProductId) return;
    const container = tableContainerRef.current;
    if (!container) return;

    const row = container.querySelector<HTMLElement>(
      `[data-product-id="${highlightedProductId}"]`,
    );

    if (row) {
      container.scrollTop = row.offsetTop - container.clientHeight / 2;
    }
  }, [highlightedProductId]);

  /* ───── FORMAT */
  const formatValue = useCallback(
    (value: unknown, col: TableColumn): string => {
      if (value == null) return '-';
      if (typeof value !== 'number') return String(value);
      if (col.format === 'currency') return currencyFormatter.format(value);
      if (col.format === 'number') return numberFormatter.format(value);
      return String(value);
    },
    [currencyFormatter, numberFormatter],
  );

  /* ───── CLICK */
  const handleRowClick = useCallback(
    (product: ProcessedProduct) => {
      setHighlightedProductId(product.id ?? null);
      onRowClick(product);
    },
    [onRowClick, setHighlightedProductId],
  );

  return (
    <>
      <article className='relative bg-[#111318] rounded-2xl scrollbar-hide'>
        <div className='bg-[#111318] border border-gray-800 rounded-xl p-1'>
          <div
            ref={tableContainerRef}
            className='overflow-auto  scrollbar-hide max-h-[calc(100vh-135px)] rounded-lg border border-[#1e3a5f]/50 bg-[#111318]'
          >
            <table
              style={{ tableLayout: 'fixed', minWidth: 1300 }}
              className={`w-full text-base bg-transparent ${newStyles ?? ''}`}
            >
              {/* CABECERA */}
              <thead className='sticky top-0 z-40 bg-[#0f172a]'>
                <tr className='border-b border-[#1e3a5f]'>
                  <GroupHeader group='product' columnCount={2} />
                  <GroupHeader group='inventory' columnCount={5} />
                  <GroupHeader group='sales' columnCount={1} />
                  <GroupHeader group='finance' columnCount={2} />
                </tr>

                <tr
                  onClick={() => setShowFullTable?.((v) => !v)}
                  className='cursor-pointer border-b border-[#1e3a5f]'
                >
                  {columns.map((col) => (
                    <th
                      key={col.accessorKey}
                      style={{ width: col.width }}
                      className={`px-4 py-4 border-r border-[#1e3a5f] font-semibold uppercase text-xs
                        ${col.fixed ? 'sticky left-0 z-50 bg-[#15202b]' : ''}
                        ${align(col.align)}
                        ${COLUMN_GROUPS[col.group].text}
                      `}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody className='divide-y divide-[#334155]/30'>
                {data.map((row, i) => {
                  const isHighlighted = row.id === highlightedProductId;
                  const rowBg = i % 2 === 0 ? 'bg-[#0f172a]' : 'bg-[#1e293b]';

                  return (
                    <tr
                      key={getProductKey(row, i, 'table')}
                      data-product-id={row.id ?? ''}
                      onClick={() => handleRowClick(row)}
                      className={`${rowBg} cursor-pointer ${isHighlighted ? 'bg-black text-amber-500' : ''}`}
                    >
                      {columns.map((col, colIndex) => (
                        <td
                          key={`${getProductKey(row, i, 'cell')}-${col.accessorKey}`}
                          style={{ width: col.width }}
                          className={`px-4 py-3 border-r border-[#1e3a5f]/40
                            ${align(col.align)}
                            ${col.fixed && colIndex === 0 ? 'sticky left-0 bg-[#15202b]' : ''}
                          `}
                        >
                          {formatValue(
                            row[col.accessorKey as keyof ProcessedProduct],
                            col,
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>

              {/* FOOTER */}
              <tfoot>
                <tr className='sticky bottom-0 z-30 bg-[#0f172a] border-t border-amber-500/20'>
                  {columns.map((col, index) => {
                    if (index < 2) {
                      return (
                        <td
                          key={col.accessorKey}
                          className='px-4 py-4 text-amber-400 font-bold'
                        >
                          {index === 0 ? 'TOTALES' : ''}
                        </td>
                      );
                    }

                    const key = col.accessorKey as keyof Totals;
                    return (
                      <td
                        key={col.accessorKey}
                        className={`px-4 py-4 font-bold ${align(col.align)}`}
                      >
                        {key in totals ? formatValue(totals[key], col) : '-'}
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
