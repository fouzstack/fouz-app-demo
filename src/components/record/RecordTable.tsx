import React, { useState, useEffect } from 'react';
import { useRecords } from './useRecords';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { getTotalRecords } from '../../models/records';
import { columns } from './columns'; // Make sure your columns definition includes these keys
import { formatCurrency, roundTwo } from '../helpers';
import FloatingActionButton from './FloatingActionButton'; // Adjust path as necessary
import { normalizeProduct } from './normalizeProduct'; // Adjust path as necessary
import { useExportRecordToPdf } from './useExportRecordToPdf';

// Updated interface to include all necessary total fields
interface TotalValues {
  total_initial_products: number; // Added
  total_incoming_products: number; // Added
  total_losses: number; // Added
  total_sold: number;
  total_cash: number;
  total_final_products: number; // Added
  // Note: total_products is not explicitly added here as it was previously
  // used for available_products. If you need a separate total for available_products,
  // you can add it and adjust the reduce and getTotalColumnValue functions accordingly.
}

const RecordsTable: React.FC = () => {
  const { handleSendJson } = useExportRecordToPdf();
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const {
    data: record,
    isLoading,
    error,
    refetch,
  } = useRecords(currentPosition); // Added refetch for the empty state button

  const MAX_RECORDS_TO_DISPLAY = 10; // Define a constant for clarity

  useEffect(() => {
    const loadTotalRecords = async () => {
      try {
        const total = await getTotalRecords();
        // Ensure we don't try to display more records than we fetch or a reasonable limit
        setTotalRecords(Math.min(total, MAX_RECORDS_TO_DISPLAY));
      } catch (err) {
        console.error('Error loading total records:', err);
      }
    };
    loadTotalRecords();
  }, []);

  const handlePrev = () => {
    // Move to the "older" record, which means increasing the position
    if (currentPosition < totalRecords - 1) {
      setCurrentPosition((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    // Move to the "newer" record, which means decreasing the position
    if (currentPosition > 0) {
      setCurrentPosition((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentPosition(0);
  };

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-800'>
        Error cargando registro: {error.message}
      </div>
    );
  }

  // Normalize products and calculate totals
  const normalizedProducts = record ? normalizeProduct(record.products) : [];

  // Initialize totalValues with default values for all tracked fields
  const totalValues: TotalValues = normalizedProducts.reduce(
    (acc, product) => ({
      total_initial_products: roundTwo(
        (acc.total_initial_products || 0) + (product.initial_products || 0),
      ), // Added
      total_incoming_products: roundTwo(
        (acc.total_incoming_products || 0) + (product.incoming_products || 0),
      ), // Added
      total_losses: roundTwo((acc.total_losses || 0) + (product.losses || 0)), // Added
      total_sold: roundTwo(
        (acc.total_sold || 0) + (product.sold_products || 0),
      ),
      total_cash: (acc.total_cash || 0) + (product.total_cash || 0),
      total_final_products: roundTwo(
        (acc.total_final_products || 0) + (product.final_products || 0),
      ), // Added
    }),
    {
      total_initial_products: 0, // Default
      total_incoming_products: 0, // Default
      total_losses: 0, // Default
      total_sold: 0,
      total_cash: 0,
      total_final_products: 0, // Default
    },
  );

  // Helper to get the correct value for a column in the totals row
  const getTotalColumnValue = (accessorKey: string) => {
    switch (accessorKey) {
      case 'initial_products': // Added case for initial products
        return totalValues.total_initial_products;
      case 'incoming_products': // Added case for incoming products
        return totalValues.total_incoming_products;
      case 'losses': // Added case for losses
        return totalValues.total_losses;
      case 'available_products': // You might still want this total, or remove it if not needed
        // If you need a total for available_products, you'll need to calculate it separately
        // or ensure it's included in the 'totalValues' interface and the reduce function.
        // For now, it will return '-' if not explicitly handled here.
        return '-';
      case 'sold_products':
        return totalValues.total_sold;
      case 'total_cash':
        return totalValues.total_cash;
      case 'final_products': // Added case for final products
        return totalValues.total_final_products;
      default:
        return '-'; // Default to '-' for columns that don't have a total
    }
  };

  return (
    <div className='bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700 p-2 max-w-7xl mx-auto'>
      {record && (
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-xs font-semibold'>
              <span className='italic px-2'>
                {String(record.date)} a las {record.time}
                <span className='text-primary px-2'>{record.seller}</span>
              </span>
            </h2>
          </div>
        </div>
      )}

      <div className='flex items-center space-x-2 py-2 px-2'>
        {/* Dots for navigation */}
        <div className='flex space-x-1'>
          {Array.from(
            { length: totalRecords },
            (
              _,
              i, // Use totalRecords to limit dots
            ) => (
              <button
                key={i}
                onClick={() => setCurrentPosition(i)}
                disabled={totalRecords === 0}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i === currentPosition
                    ? 'bg-blue-600 scale-110 shadow-sm'
                    : i < currentPosition
                      ? 'bg-gray-400'
                      : 'bg-gray-300 hover:bg-gray-400'
                } ${totalRecords === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={`Ir a registro ${i + 1}`}
                title={`Registro ${i + 1}`}
              />
            ),
          )}
        </div>
        <p className='text-xs'>
          {' '}
          <span className='font-black mx-1'>+</span>Antiguo #
          {currentPosition + 1}
        </p>
      </div>

      <div className='overflow-x-auto scrollbar-hide rounded-lg border border-gray-700'>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <span className='ml-2 text-sm'>Cargando inventario...</span>
          </div>
        ) : normalizedProducts.length > 0 ? (
          <table className='min-w-full divide-y divide-gray-600'>
            <thead className='bg-gray-800'>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='bg-gray-900 divide-y divide-gray-700'>
              {normalizedProducts.map((product, idx) => (
                <tr key={idx} className='hover:bg-gray-700 transition-colors'>
                  {columns.map((column) => {
                    // Ensure that the accessorKey is treated as a string for type safety
                    const accessorKey = column.accessorKey as string;
                    const value = product[accessorKey as keyof typeof product];
                    const displayValue = value !== undefined ? value : '-'; // Fallback if undefined

                    return (
                      <td
                        key={column.id}
                        className='px-6 py-4 whitespace-nowrap text-sm'
                      >
                        <span
                          className={
                            typeof displayValue === 'number'
                              ? 'font-mono text-right text-gray-200'
                              : 'text-left text-gray-300'
                          }
                        >
                          {accessorKey === 'total_cash' ||
                          accessorKey === 'price'
                            ? formatCurrency(displayValue as number)
                            : String(displayValue)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Totals Row */}
              <tr className='bg-gray-800 border-t border-gray-700'>
                {columns.map((column) => {
                  const accessorKey = column.accessorKey as string; // Ensure accessorKey is string
                  const totalValue = getTotalColumnValue(accessorKey);
                  return (
                    <td
                      key={column.id}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-200'
                    >
                      <span className='font-bold'>
                        {accessorKey === 'total_cash'
                          ? formatCurrency(totalValue as number)
                          : String(totalValue)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        ) : (
          <div className='text-center py-12 text-gray-500'>
            <p className='text-lg'>📦</p>
            <p className='mt-2'>No hay productos en este registro.</p>
            <button
              onClick={() => refetch()} // Use refetch to retry loading
              className='mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors'
            >
              Recargar
            </button>
          </div>
        )}
      </div>

      <FloatingActionButton
        actions={[
          {
            id: 'action-next',
            label: 'Más Reciente',
            icon: ChevronLeftIcon,
            onClick: handleNext,
            ariaLabel: 'Más Reciente',
          },
          {
            id: 'action-prev',
            label: 'Más Antiguo',
            icon: ChevronRightIcon,
            onClick: handlePrev,
            ariaLabel: 'Más Antiguo',
          },
          {
            id: 'action-future',
            label: 'Resetear',
            icon: PlusIcon,
            onClick: handleReset,
          },
          {
            id: 'export-pdf',
            label: 'Exportar PDF',
            icon: PlusIcon,
            onClick: () => handleSendJson(currentPosition),
          },
        ]}
        position='bottom-right'
      />
    </div>
  );
};

export default RecordsTable;
