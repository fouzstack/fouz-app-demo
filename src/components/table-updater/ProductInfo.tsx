import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  BanknotesIcon,
  ArrowUpRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'; // O usa solid si prefieres

import { useProductStore } from '../../store/store';

const ProductInfo = () => {
  const navigate = useNavigate();
  const product = useProductStore((state) => state.product);

  // Destructuración y valores por defecto para seguridad
  const initial = product?.initial_products ?? 0;
  const incoming = product?.incoming_products ?? 0;
  const losses = product?.losses ?? 0;
  const price = product?.price ?? 0;
  const cost = product?.cost ?? 0;

  // Cálculos
  const monetaryLost = losses * cost;
  const available = initial + incoming - losses;
  const final =
    product?.final_products === null
      ? available
      : (product?.final_products ?? available);
  const sold = available - final;
  const proceeds = (price - cost) * sold;
  const netProceeds = proceeds - monetaryLost;
  const totalCash = sold * price;

  // Formateador de moneda
  const formatCurrency = (value: number) =>
    value.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Helper para formatear números decimales
  const formatQuantity = (value: number) =>
    value.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Determinar si mostrar alerta visual para finales o vendidos
  const isFinalZeroOrNegative = final <= 0;
  const isSoldZeroOrNegative = sold <= 0;

  return (
    <section className='py-4 my-6 bg-gray-900 text-gray-200 rounded-xl shadow-lg'>
      {/* Header del Producto */}
      <div className='flex items-center justify-between px-6 pb-4 border-b border-gray-700'>
        <h2 className='text-2xl font-semibold'>
          {product?.name || 'Nombre del Producto'}
        </h2>
      </div>

      {/* Contenido Principal con Iconos y Mejor Estructura */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4'>
        {/* Sección de Costos y Precios */}
        <div className='bg-gray-800 p-4 rounded-lg shadow'>
          <h3 className='text-lg font-medium mb-3 text-gray-300 flex items-center'>
            <CurrencyDollarIcon className='h-5 w-5 mr-2 text-gray-400' />
            Costos y Precios
          </h3>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-400'>Costo Unitario</span>
              <span className='text-xl font-bold'>{formatCurrency(cost)}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-400'>Precio de Venta</span>
              <span className='text-xl font-bold text-green-400'>
                {formatCurrency(price)}
              </span>
            </div>
          </div>
        </div>

        {/* Sección de Inventario */}
        <div className='bg-gray-800 p-4 rounded-lg shadow'>
          <h3 className='text-lg font-medium mb-3 text-gray-300 flex items-center'>
            <ArchiveBoxIcon className='h-5 w-5 mr-2 text-gray-400' />
            Estado del Inventario
          </h3>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <p className='text-sm text-gray-400'>Inicial</p>
              <p className='text-lg'>{formatQuantity(initial)}</p>
            </div>
            <div>
              <p className='text-sm text-gray-400'>Entrada</p>
              <p className='text-lg text-blue-400'>
                {formatQuantity(incoming)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-400'>Ajuste (Pérdidas)</p>
              <p className='text-lg text-red-400'>{formatQuantity(losses)}</p>
            </div>
            <div>
              <p className='text-sm text-gray-400'>Disponible para Venta</p>
              <p className='text-lg font-semibold'>
                {formatQuantity(available)}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Ventas y Utilidades */}
        <div className='md:col-span-2 bg-gray-800 p-4 rounded-lg shadow'>
          <h3 className='text-lg font-medium mb-3 text-gray-300 flex items-center'>
            <ArrowUpRightIcon className='h-5 w-5 mr-2 text-gray-400' />
            Detalle de Ventas
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-400'>Finales en Stock</span>
              <span
                className={`text-xl font-bold ${
                  isFinalZeroOrNegative ? 'text-yellow-400' : 'text-gray-200'
                }`}
              >
                {formatQuantity(final)}
                {isFinalZeroOrNegative && (
                  <ExclamationTriangleIcon className='h-4 w-4 inline-block ml-1 text-yellow-400' />
                )}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-400'>Unidades Vendidas</span>
              <span
                className={`text-xl font-bold ${
                  isSoldZeroOrNegative ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                {formatQuantity(sold)}
                {isSoldZeroOrNegative && (
                  <ExclamationTriangleIcon className='h-4 w-4 inline-block ml-1 text-yellow-400' />
                )}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-400'>Ingresos Totales</span>
              <span className='text-xl font-bold'>
                {formatCurrency(totalCash)}
              </span>
            </div>
          </div>
        </div>

        {/* Resumen Financiero */}
        <div className='md:col-span-2 bg-gray-800 p-4 rounded-lg shadow'>
          <h3 className='text-lg font-medium mb-3 text-gray-300 flex items-center'>
            <BanknotesIcon className='h-5 w-5 mr-2 text-gray-400' />
            Resumen Financiero
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-400'>
                Costo de Mercancía Vendida (CMV)
              </span>
              <span className='text-xl font-bold'>
                {formatCurrency(cost * (initial + incoming - losses - final))}{' '}
                {/* Asumiendo CMV basado en lo que se *debería* haber vendido */}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-400'>Pérdida por Ajustes</span>
              <span className='text-xl font-bold text-red-400'>
                {formatCurrency(monetaryLost)}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm text-gray-400'>
                Ganancia Neta (Después de Pérdidas)
              </span>
              <span
                className={`text-xl font-bold ${
                  netProceeds < 0 ? 'text-red-400' : 'text-green-400'
                }`}
              >
                {formatCurrency(netProceeds)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Header del Producto */}
      <div className='flex items-center justify-between px-6 pb-4 border-b border-gray-700'>
        <h2 className='text-2xl font-semibold'>
          {product?.name || 'Nombre del Producto'}
        </h2>
        {/* Podrías añadir un botón de editar aquí también si prefieres */}
        <button
          onClick={() => navigate('/finales')}
          className='px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        >
          Regresar
        </button>
      </div>
      {/* MaterialDropdown si es necesario, aquí iría si fuera parte de la información */}
      {/* <MaterialDropdown product={product} /> */}
    </section>
  );
};

export default ProductInfo;
