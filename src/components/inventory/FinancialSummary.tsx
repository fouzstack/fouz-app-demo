import { JSX } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  BanknotesIcon,
  CubeIcon,
} from '@heroicons/react/24/solid';
import inventory from '../../models/inventorydb';
import { InventoryType } from '../../models/models';
import { useInventoryMetrics } from './useInventoryMetrics';
import InventoryFallback from './InventoryFallback';

export default function InventoryFinancialSummary(): JSX.Element {
  const { data, isLoading, isError, error } = useQuery<InventoryType, Error>({
    queryKey: ['inventory-one'],
    queryFn: inventory.getInventory,
    staleTime: 1000 * 60,
  });

  // Estado de carga
  if (isLoading)
    return (
      <div className='text-center text-gray-400 p-6 animate-pulse'>
        Cargando métricas financieras...
      </div>
    );

  // Estado de error o sin datos
  if (isError || !data || !data.products || data.products.length === 0)
    return (
      <InventoryFallback
        message={
          isError
            ? `Error al cargar inventario: ${error?.message ?? 'Error desconocido'}`
            : 'No hay datos disponibles para mostrar.'
        }
      />
    );

  try {
    const {
      totalNetProceeds,
      totalTheoricProceeds,
      totalCash,
      totalInvestment,
    } = useInventoryMetrics(data.products);

    const gainRealizationPercent =
      totalTheoricProceeds !== 0
        ? (totalNetProceeds / totalTheoricProceeds) * 100
        : 0;

    return (
      <section
        className='
          max-w-[420px] mx-auto my-8 
          bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700
          rounded-2xl shadow-2xl border border-gray-700 
          p-6 text-gray-200 select-none
        '
      >
        {/* Título principal */}
        <h2
          className='
            text-[6vw] sm:text-[2vw] md:text-[1.5vw] lg:text-[1.2vw]
            font-semibold text-center text-gray-100 mb-6
            tracking-wide
          '
        >
          Resumen Financiero
        </h2>

        {/* Contenedor de métricas */}
        <div className='flex flex-col gap-5'>
          {/* Ganancia neta obtenida */}
          <MetricCard
            icon={
              <CurrencyDollarIcon className='w-[6vw] sm:w-[3vw] text-emerald-400' />
            }
            title='Ganancia Neta Obtenida'
            value={totalNetProceeds}
            color='emerald'
          />

          {/* Máximo de ganancia realizable */}
          <MetricCard
            icon={<ChartBarIcon className='w-[6vw] sm:w-[3vw] text-blue-400' />}
            title='Ganancia Realizable'
            value={totalTheoricProceeds}
            color='blue'
          />

          {/* Porcentaje de ganancia */}
          <MetricCard
            icon={
              <BanknotesIcon className='w-[6vw] sm:w-[3vw] text-indigo-400' />
            }
            title='Ganancia Realizada'
            value={`${gainRealizationPercent.toFixed(2)}%`}
            color='indigo'
            isCurrency={false}
          />

          {/* Total de ventas */}
          <MetricCard
            icon={
              <BanknotesIcon className='w-[6vw] sm:w-[3vw] text-cyan-400' />
            }
            title='Total de Ventas'
            value={totalCash}
            color='cyan'
          />

          {/* Valor total del inventario */}
          <MetricCard
            icon={<CubeIcon className='w-[6vw] sm:w-[3vw] text-purple-400' />}
            title='Valor del Inventario'
            value={totalInvestment}
            color='purple'
          />
        </div>
      </section>
    );
  } catch (err) {
    console.error('Error al renderizar métricas:', err);
    return (
      <InventoryFallback message='Ocurrió un error inesperado al mostrar los datos del inventario.' />
    );
  }
}

// Subcomponente reutilizable para cada métrica
function MetricCard({
  icon,
  title,
  value,
  color,
  isCurrency = true,
}: {
  icon: JSX.Element;
  title: string;
  value: number | string;
  color: string;
  isCurrency?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 bg-gray-800/60 rounded-lg p-4 hover:bg-gray-700/80 transition`}
    >
      {icon}
      <div className='flex flex-col'>
        <span
          className={`text-[5vw] sm:text-[1.5vw] font-semibold text-${color}-300`}
        >
          {title}
        </span>
        <span
          className={`text-[6vw] sm:text-[1.8vw] font-bold text-${color}-100`}
        >
          {isCurrency && typeof value === 'number'
            ? value.toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN',
              })
            : value}
        </span>
      </div>
    </div>
  );
}
