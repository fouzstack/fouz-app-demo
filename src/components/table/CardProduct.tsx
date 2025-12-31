import React from 'react';
import { ProcessedProduct } from './productCalculations';
import {
  ArchiveBoxIcon,
  ShoppingBagIcon,
  CubeIcon,
  TruckIcon,
  ExclamationCircleIcon,
  BanknotesIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface CardProductProps {
  product: ProcessedProduct;
  isHighlighted: boolean;
  onClick: (product: ProcessedProduct) => void;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
  getTextColorClass: (
    finalQty: number | undefined,
    soldQty: number | undefined,
  ) => string;
  getCardBorderColor: (
    finalQty: number | undefined,
    soldQty: number | undefined,
  ) => string;
}

// Sistema de colores corporativo simplificado
const COLOR_SYSTEM = {
  // ESTADO ACTUAL (Prioridad 1 - Lo más importante)
  stock: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-900/20',
    border: 'border-emerald-500/40',
    icon: 'text-emerald-400',
  },
  sales: {
    text: 'text-blue-400',
    bg: 'bg-blue-900/20',
    border: 'border-blue-500/40',
    icon: 'text-blue-400',
  },
  
  // ALERTAS (Prioridad 2 - Atención necesaria)
  warning: {
    text: 'text-amber-400',
    bg: 'bg-amber-900/20',
    border: 'border-amber-500/40',
    icon: 'text-amber-400',
  },
  danger: {
    text: 'text-red-400',
    bg: 'bg-red-900/20',
    border: 'border-red-500/40',
    icon: 'text-red-400',
  },
  
  // INFORMACIÓN (Prioridad 3 - Detalles)
  info: {
    text: 'text-gray-400',
    bg: 'bg-gray-800/60',
    border: 'border-gray-700',
    icon: 'text-gray-400',
  },
  
  // JERARQUÍA VISUAL (Escala de grises corporativa)
  neutral: {
    high: 'text-gray-100',       // Títulos importantes
    medium: 'text-gray-300',     // Texto principal
    low: 'text-gray-500',        // Texto secundario
    bg: 'bg-[#111318]',          // Fondo de tarjeta
  },
};

const CardProduct: React.FC<CardProductProps> = ({
  product,
  isHighlighted,
  onClick,
  formatNumber,
  formatCurrency,
  getCardBorderColor,
}) => {
  const cardBorderClass = getCardBorderColor(
    product.final_products,
    product.sold_products,
  );

  // Determinar estado crítico para simplificar
  const isCriticalStock = (product.final_products ?? 0) <= 5;
  const hasSales = (product.sold_products ?? 0) > 0;

  return (
    <div
      data-product-id={product.id}
      onClick={() => onClick(product)}
      className={`
        relative
        bg-[#111318]
        border border-gray-800
        rounded-xl
        shadow-xl shadow-black/30
        cursor-pointer
        transition-all duration-300
        hover:bg-gray-800/60
        hover:border-amber-500/40
        hover:shadow-lg hover:shadow-black/40
        hover:-translate-y-1
        p-5
        w-full
        max-w-sm
        min-w-[320px]
        ${cardBorderClass}
        ${isHighlighted ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0d0f12] bg-amber-400/5' : ''}
        flex flex-col gap-4
        group
      `}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(product)}
      role='button'
      aria-label={`Ver detalles de ${product.name}`}
    >
      {/* Header - Nombre del producto */}
      <div className='mb-2'>
        <h3 className={`
          text-lg font-bold
          ${COLOR_SYSTEM.neutral.high}
          truncate
          mb-1
        `}>
          {product.name}
        </h3>
        <div className='flex items-center gap-2'>
          <span className={`text-sm ${COLOR_SYSTEM.neutral.low}`}>
            Precio unitario:
          </span>
          <span className={`text-sm font-medium ${COLOR_SYSTEM.neutral.medium}`}>
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>

      {/* KPIs CRÍTICOS - Lo más importante (Prioridad 1) */}
      <div className='grid grid-cols-2 gap-4 mb-2'>
        {/* Stock Final */}
        <div className={`
          ${COLOR_SYSTEM.stock.bg}
          border ${COLOR_SYSTEM.stock.border}
          rounded-lg
          p-4
          text-center
          ${isCriticalStock ? 'animate-pulse-gentle' : ''}
        `}>
          <div className='flex flex-col items-center'>
            <div className='flex items-center gap-2 mb-1'>
              <ArchiveBoxIcon className={`h-5 w-5 ${COLOR_SYSTEM.stock.icon}`} />
              <span className={`text-sm font-medium ${COLOR_SYSTEM.neutral.medium}`}>
                Stock
              </span>
            </div>
            <span className={`text-2xl font-bold ${COLOR_SYSTEM.stock.text}`}>
              {formatNumber(product.final_products)}
            </span>
            {isCriticalStock && (
              <span className='text-xs text-amber-400 mt-1'>
                ¡Stock bajo!
              </span>
            )}
          </div>
        </div>

        {/* Ventas */}
        <div className={`
          ${COLOR_SYSTEM.sales.bg}
          border ${COLOR_SYSTEM.sales.border}
          rounded-lg
          p-4
          text-center
        `}>
          <div className='flex flex-col items-center'>
            <div className='flex items-center gap-2 mb-1'>
              <ShoppingBagIcon className={`h-5 w-5 ${COLOR_SYSTEM.sales.icon}`} />
              <span className={`text-sm font-medium ${COLOR_SYSTEM.neutral.medium}`}>
                Vendidos
              </span>
            </div>
            <span className={`text-2xl font-bold ${COLOR_SYSTEM.sales.text}`}>
              {formatNumber(product.sold_products)}
            </span>
            {hasSales && (
              <span className='text-xs text-blue-400 mt-1'>
                En movimiento
              </span>
            )}
          </div>
        </div>
      </div>

      {/* VALOR TOTAL - Destacado pero separado */}
      <div className={`
        bg-gradient-to-r from-[#0f1115] to-[#1a1d24]
        border border-gray-800
        rounded-lg
        p-3
        text-center
        mb-2
      `}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <BanknotesIcon className={`h-5 w-5 text-amber-400`} />
            <span className={`text-sm font-medium ${COLOR_SYSTEM.neutral.medium}`}>
              Valor total
            </span>
          </div>
          <span className={`text-xl font-bold text-amber-400`}>
            {formatCurrency(product.total_cash)}
          </span>
        </div>
      </div>

      {/* MOVIMIENTOS - Información técnica simplificada */}
      <div className='space-y-2'>
        {/* Entradas */}
        <div className='flex justify-between items-center py-2 px-3 rounded-lg bg-gray-800/40'>
          <div className='flex items-center gap-2'>
            <TruckIcon className={`h-4 w-4 ${COLOR_SYSTEM.info.icon}`} />
            <span className={`text-sm ${COLOR_SYSTEM.neutral.medium}`}>
              Entradas
            </span>
          </div>
          <span className={`text-sm font-medium ${COLOR_SYSTEM.info.text}`}>
            {formatNumber(product.incoming_products)}
          </span>
        </div>

        {/* Stock inicial */}
        <div className='flex justify-between items-center py-2 px-3 rounded-lg bg-gray-800/40'>
          <div className='flex items-center gap-2'>
            <CubeIcon className={`h-4 w-4 ${COLOR_SYSTEM.info.icon}`} />
            <span className={`text-sm ${COLOR_SYSTEM.neutral.medium}`}>
              Inicial
            </span>
          </div>
          <span className={`text-sm font-medium ${COLOR_SYSTEM.info.text}`}>
            {formatNumber(product.initial_products)}
          </span>
        </div>

        {/* Pérdidas (solo si existen) */}
        {(product.losses ?? 0) > 0 && (
          <div className={`
            ${COLOR_SYSTEM.danger.bg}
            border ${COLOR_SYSTEM.danger.border}
            rounded-lg
            p-2
          `}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <ExclamationCircleIcon className={`h-4 w-4 ${COLOR_SYSTEM.danger.icon}`} />
                <span className={`text-sm ${COLOR_SYSTEM.danger.text}`}>
                  Pérdidas
                </span>
              </div>
              <span className={`text-sm font-bold ${COLOR_SYSTEM.danger.text}`}>
                {formatNumber(product.losses)}
              </span>
            </div>
          </div>
        )}

        {/* Disponibles para venta */}
        <div className='flex justify-between items-center py-2 px-3 rounded-lg bg-gray-800/40'>
          <div className='flex items-center gap-2'>
            <ArchiveBoxIcon className={`h-4 w-4 ${COLOR_SYSTEM.warning.icon}`} />
            <span className={`text-sm ${COLOR_SYSTEM.neutral.medium}`}>
              Disponibles
            </span>
          </div>
          <span className={`text-sm font-medium ${COLOR_SYSTEM.warning.text}`}>
            {formatNumber(product.available_products)}
          </span>
        </div>
      </div>

      {/* Indicador de interacción sutil */}
      <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <ChevronRightIcon className='h-4 w-4 text-gray-400' />
      </div>

      {/* Estado crítico badge */}
      {isCriticalStock && (
        <div className='absolute -top-2 -right-2'>
          <div className='px-2 py-1 bg-red-400/20 border border-red-400/40 rounded-full'>
            <span className='text-xs font-medium text-red-400'>CRÍTICO</span>
          </div>
        </div>
      )}

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CardProduct;
