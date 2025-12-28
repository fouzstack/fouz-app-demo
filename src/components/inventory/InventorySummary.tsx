import { JSX } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import inventory from '../../models/inventorydb';
import { InventoryType, ProductType } from '../../models/models';
import InventoryFallback from './InventoryFallback';
import { useInventoryMetrics } from './useInventoryMetrics';
import { useProductStore } from '../../store/store';
// Iconos Heroicons
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

function formatDateTime(
  input: string | number | Date | { date?: string; time?: string },
): string {
  if (input instanceof Date) {
    return input.toLocaleString();
  }
  if (
    typeof input === 'object' &&
    input !== null &&
    ('date' in input || 'time' in input)
  ) {
    const datePart = input.date ?? '';
    const timePart = input.time ?? '';
    return `${datePart} ${timePart}`.trim();
  }
  return String(input);
}

export default function InventorySummary(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useProductStore((state) => state.dispatch);
  const { data, isLoading, isError } = useQuery<InventoryType, Error>({
    queryKey: ['inventory-one'],
    queryFn: inventory.getInventory,
    staleTime: 1000 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const isObjectEmpty = (data: InventoryType) => {
    return (
      data && Object.keys(data).length === 0 && data.constructor === Object
    );
  };

  if (isLoading) {
    return (
      <div className='p-6 text-center text-gray-400'>
        Cargando información del inventario…
      </div>
    );
  }

  if (isError) {
    return (
      <InventoryFallback message='Ocurrió un error al cargar el inventario.' />
    );
  }

  if (!data || isObjectEmpty(data)) {
    return <InventoryFallback />;
  }

  const {
    totalProducts,
    totalSold,
    totalLosses,
    totalOutOfStock,
    totalMonetaryLost,
    totalNetProceeds,
    totalCash,
    totalTheoricProceeds,
    productsWithLosses,
    totalWithSales,
    totalWithEntries,
    productsWithEntries,
    productsOutOfStock,
    productsWithNegativeProfit,
    totalInvestment,
    products,
  } = useInventoryMetrics(data.products);

  const productsLowStock = products.filter(
    (p) => (p.final_products ?? 0) >= 1 && (p.final_products ?? 0) <= 5,
  );

  const gainRealizationPercent =
    totalTheoricProceeds !== 0
      ? (totalNetProceeds / totalTheoricProceeds) * 100
      : 0;

  const handleClick = (product: ProductType) => {
    dispatch({ type: 'SET_PRODUCT', payload: product });
    navigate('/formulario/editar/producto');
  };

  const scrollListBase =
    'max-h-[calc(1.5rem*5+1.25rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-opacity-30 scrollbar-thumb';

  return (
    <section className='max-w-lg mx-auto p-6 bg-gray-900 text-gray-200 shadow-lg rounded-lg'>
      <h2 className='text-2xl font-semibold text-indigo-400 mb-6 flex items-center'>
        <ChartBarIcon className='h-6 w-6 mr-2 text-indigo-300' />
        Resumen del Inventario
      </h2>

      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <span className='font-medium text-gray-400'>Fecha:</span>
          <span className='text-gray-100'>{formatDateTime(data.date)}</span>
        </div>

        <div className='flex justify-between items-center'>
          <span className='font-medium text-gray-400'>Confeccionado por:</span>
          <span className='text-gray-100'>{data.seller}</span>
        </div>
      </div>

      <div className='mt-6 space-y-4'>
        <div className='flex items-center'>
          <CubeIcon className='h-5 w-5 text-yellow-300 mr-2' />
          <span className='font-medium text-yellow-300'>
            Total de productos en inventario:{' '}
          </span>
          <span className='ml-2 text-yellow-400 font-semibold'>
            {totalProducts}
          </span>
        </div>

        <div className='flex items-center'>
          <ShoppingCartIcon className='h-5 w-5 text-cyan-300 mr-2' />
          <span className='font-medium text-cyan-300'>
            Productos que han tenido ventas:{' '}
          </span>
          <span className='ml-2 text-cyan-400 font-semibold'>
            {totalWithSales}
          </span>
        </div>

        <div className='flex items-center'>
          <ShoppingCartIcon className='h-5 w-5 text-cyan-300 mr-2' />
          <span className='font-medium text-cyan-300'>
            Total de productos vendidos:{' '}
          </span>
          <span className='ml-2 text-cyan-400 font-semibold'>{totalSold}</span>
        </div>

        <div className='flex items-center'>
          <ExclamationTriangleIcon className='h-5 w-5 text-pink-400 mr-2' />
          <span className='font-medium text-pink-400'>
            Productos agotados:{' '}
          </span>
          <span className='ml-2 text-pink-300 font-semibold'>
            {totalOutOfStock}
          </span>
        </div>
        {productsOutOfStock.length > 0 && (
          <div
            className={`${scrollListBase} mt-2 p-2 bg-pink-800/20 border border-pink-600 rounded`}
          >
            <span className='font-semibold text-pink-300 block mb-1'>
              Lista:
            </span>
            <ul className='list-disc list-inside text-pink-200'>
              {productsOutOfStock.map((product, idx) => (
                <li
                  key={idx}
                  className='cursor-pointer hover:underline'
                  onClick={() => handleClick(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr className='border-gray-700 my-4' />

        <div className='flex items-center'>
          <ArrowDownTrayIcon className='h-5 w-5 text-emerald-300 mr-2' />
          <span className='font-medium text-emerald-300'>
            Productos con entradas:{' '}
          </span>
          <span className='ml-2 text-emerald-400 font-semibold'>
            {totalWithEntries}
          </span>
        </div>
        {productsWithEntries.length > 0 && (
          <div
            className={`${scrollListBase} mt-2 p-2 bg-emerald-800/20 border border-emerald-500 rounded`}
          >
            <span className='font-semibold text-emerald-300 block mb-1'>
              Lista:
            </span>
            <ul className='list-disc list-inside text-emerald-200'>
              {productsWithEntries.map((product, idx) => (
                <li
                  key={idx}
                  className='cursor-pointer hover:underline'
                  onClick={() => handleClick(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr className='border-gray-700 my-4' />

        <div className='flex items-center'>
          <ExclamationTriangleIcon className='h-5 w-5 text-yellow-400 mr-2' />
          <span className='font-medium text-yellow-400'>
            Productos con pérdidas o ajustes:{' '}
          </span>
          <span className='ml-2 text-yellow-300 font-semibold'>
            {totalLosses}
          </span>
        </div>
        {productsWithLosses.length > 0 && (
          <div
            className={`${scrollListBase} mt-2 p-2 bg-yellow-800/20 border border-yellow-500 rounded`}
          >
            <span className='font-semibold text-yellow-300 block mb-1'>
              Lista:
            </span>
            <ul className='list-disc list-inside text-yellow-200'>
              {productsWithLosses.map((product, idx) => (
                <li
                  key={idx}
                  className='cursor-pointer hover:underline'
                  onClick={() => handleClick(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {productsLowStock.length > 0 && (
          <>
            <hr className='border-gray-700 my-4' />
            <div className='flex items-center'>
              <ExclamationTriangleIcon className='h-5 w-5 text-orange-300 mr-2' />
              <span className='font-medium text-orange-300'>
                Productos con stock bajo (1-5):{' '}
              </span>
              <span className='ml-2 text-orange-200 font-semibold'>
                {productsLowStock.length}
              </span>
            </div>
            <div
              className={`${scrollListBase} mt-2 p-2 bg-orange-800/20 border border-orange-500 rounded`}
            >
              <span className='font-semibold text-orange-200 block mb-1'>
                Lista:
              </span>
              <ul className='list-disc list-inside text-orange-200'>
                {productsLowStock.map((product, idx) => (
                  <li
                    key={idx}
                    className='cursor-pointer hover:underline'
                    onClick={() => handleClick(product)}
                  >
                    {product.name} (Cant: {product.final_products})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className='mt-4'>
          <span className='font-medium text-yellow-300'>
            Pérdidas monetarias totales:{' '}
          </span>
          <span className='ml-2 text-yellow-200 font-semibold'>
            {totalMonetaryLost.toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {productsWithNegativeProfit.length > 0 && (
          <div className='mt-6 p-3 bg-red-900/20 border border-red-600 rounded'>
            <div className='flex items-center mb-2'>
              <ExclamationTriangleIcon className='h-5 w-5 text-red-400 mr-2' />
              <span className='font-semibold text-red-300'>
                Productos con ganancia negativa:
              </span>
            </div>
            <ul className='list-disc list-inside text-red-200'>
              {productsWithNegativeProfit.map((product, idx) => (
                <li
                  key={idx}
                  className='cursor-pointer hover:underline'
                  onClick={() => handleClick(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
            <p className='mt-2 text-sm text-red-400 italic'>
              Por favor, revise los precios y costos de estos productos para
              evitar déficits.
            </p>
          </div>
        )}

        <hr className='border-gray-700 my-4' />

        <div className='flex justify-between items-center'>
          <span
            className={`font-semibold ${totalNetProceeds < 0 ? 'text-yellow-300' : 'text-emerald-300'}`}
          >
            {totalNetProceeds < 0
              ? 'Déficit total:'
              : 'Ganancia neta obtenida:'}
          </span>
          <span
            className={`ml-2 font-semibold ${totalNetProceeds < 0 ? 'text-yellow-200' : 'text-emerald-200'}`}
          >
            {totalNetProceeds.toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className='flex justify-between items-center mt-2'>
          <span className='font-medium text-blue-300'>
            Máximo de Ganancia Realizable:{' '}
          </span>
          <span className='ml-2 text-blue-200 font-semibold'>
            {totalTheoricProceeds.toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className='flex justify-between items-center mt-2'>
          <span className='font-medium text-indigo-300'>
            Ganancia Realizada:{' '}
          </span>
          <span className='ml-2 text-indigo-200 font-semibold'>
            {gainRealizationPercent.toFixed(2)}%
          </span>
        </div>

        <hr className='border-gray-700 my-4' />

        <div className='flex items-center'>
          <CurrencyDollarIcon className='h-5 w-5 text-emerald-300 mr-2' />
          <span className='font-medium text-emerald-300'>
            Total de Ventas:{' '}
          </span>
          <span className='ml-2 text-emerald-200 font-semibold'>
            {totalCash.toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <hr className='border-gray-700 my-4' />

        <div className='flex items-center'>
          <CurrencyDollarIcon className='h-5 w-5 text-purple-300 mr-2' />
          <span className='font-medium text-purple-300'>
            Valor del Inventario:{' '}
          </span>
          <span className='ml-2 text-purple-200 font-semibold'>
            {totalInvestment.toLocaleString('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </section>
  );
}
