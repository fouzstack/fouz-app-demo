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

// Sistema de colores semántico y accesible
const COLOR_SYSTEM = {
  // ESTADO ACTUAL (Alta importancia)
  success: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400',
    icon: 'text-emerald-400',
  },
  primary: {
    text: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400',
    icon: 'text-blue-400',
  },

  // MOVIMIENTOS (Media importancia)
  warning: {
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400',
    icon: 'text-amber-400',
  },
  info: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400',
    icon: 'text-cyan-400',
  },

  // ALERTAS (Alta visibilidad)
  danger: {
    text: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400',
    icon: 'text-red-400',
  },

  // NEUTRALES (Jerarquía visual)
  neutral: {
    high: 'text-gray-100',
    medium: 'text-gray-300',
    low: 'text-gray-500',
    disabled: 'text-gray-600',
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
  //const textColorClass = getTextColorClass(product.final_products, product.sold_products);
  const cardBorderClass = getCardBorderColor(
    product.final_products,
    product.sold_products,
  );

  return (
    <div
      data-product-id={product.id}
      onClick={() => onClick(product)}
      className={`
        p-6 bg-gray-900 rounded-2xl shadow-xl border-2 border-gray-700
        hover:shadow-2xl cursor-pointer transition-all duration-300
        transform hover:-translate-y-1 min-w-[320px] max-w-[380px] w-full
        hover:border-gray-600
        ${cardBorderClass}
        ${isHighlighted ? 'ring-4 ring-emerald-400 bg-emerald-400/5 scale-105' : ''}
        flex flex-col
        mx-auto group
      `}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(product)}
      role='button'
      aria-label={`Ver detalles de ${product.name}`}
    >
      {/* Header con mejor contraste */}
      <div className='mb-6'>
        <p
          className={`font-bold text-2xl mb-3 ${COLOR_SYSTEM.neutral.high} truncate`}
        >
          {product.name}
        </p>

        {/* KPIs Principales - Máximo contraste */}
        <div className='flex justify-between items-center bg-gray-800 rounded-xl p-4 border border-gray-600'>
          <div className='text-center flex-1'>
            <div className='flex items-center gap-2 justify-center mb-2'>
              <ArchiveBoxIcon
                className={`h-6 w-6 ${COLOR_SYSTEM.success.icon}`}
              />
              <span
                className={`text-sm font-medium ${COLOR_SYSTEM.neutral.medium}`}
              >
                Finales
              </span>
            </div>
            <span className={`text-3xl font-bold ${COLOR_SYSTEM.success.text}`}>
              {formatNumber(product.final_products)}
            </span>
          </div>

          <div className='h-12 w-px bg-gray-600 mx-2'></div>

          <div className='text-center flex-1'>
            <div className='flex items-center gap-2 justify-center mb-2'>
              <ShoppingBagIcon
                className={`h-6 w-6 ${COLOR_SYSTEM.primary.icon}`}
              />
              <span
                className={`text-sm font-medium ${COLOR_SYSTEM.neutral.medium}`}
              >
                Vendidos
              </span>
            </div>
            <span className={`text-3xl font-bold ${COLOR_SYSTEM.primary.text}`}>
              {formatNumber(product.sold_products)}
            </span>
          </div>
        </div>
      </div>

      {/* Valor económico - Destacado pero diferente */}
      <div
        className={`rounded-xl p-4 mb-4 ${COLOR_SYSTEM.success.bg} border ${COLOR_SYSTEM.success.border}`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <BanknotesIcon className={`h-6 w-6 ${COLOR_SYSTEM.success.icon}`} />
            <span
              className={`text-lg font-semibold ${COLOR_SYSTEM.neutral.high}`}
            >
              Importe
            </span>
          </div>
          <span className={`text-2xl font-bold ${COLOR_SYSTEM.success.text}`}>
            {formatCurrency(product.total_cash)}
          </span>
        </div>
      </div>

      {/* Movimientos de inventario - Colores semánticos */}
      <div className='space-y-3 mb-4'>
        <div className='flex justify-between items-center py-2 px-3 rounded-lg bg-gray-800/50'>
          <div className='flex items-center gap-2'>
            <CubeIcon className={`h-5 w-5 ${COLOR_SYSTEM.info.icon}`} />
            <span className={COLOR_SYSTEM.neutral.medium}>
              Inventario Inicial
            </span>
          </div>
          <span className={`font-semibold ${COLOR_SYSTEM.info.text}`}>
            {formatNumber(product.initial_products)}
          </span>
        </div>

        <div className='flex justify-between items-center py-2 px-3 rounded-lg bg-gray-800/50'>
          <div className='flex items-center gap-2'>
            <TruckIcon className={`h-5 w-5 ${COLOR_SYSTEM.info.icon}`} />
            <span className={COLOR_SYSTEM.neutral.medium}>Entradas</span>
          </div>
          <span className={`font-semibold ${COLOR_SYSTEM.info.text}`}>
            {formatNumber(product.incoming_products)}
          </span>
        </div>

        <div className='flex justify-between items-center py-2 px-3 rounded-lg bg-red-400/5 border border-red-400/20'>
          <div className='flex items-center gap-2'>
            <ExclamationCircleIcon
              className={`h-5 w-5 ${COLOR_SYSTEM.danger.icon}`}
            />
            <span className={COLOR_SYSTEM.danger.text}>Pérdidas</span>
          </div>
          <span className={`font-semibold ${COLOR_SYSTEM.danger.text}`}>
            {formatNumber(product.losses)}
          </span>
        </div>
      </div>

      <div className='flex justify-between items-center py-2 px-3 rounded-lg bg-amber-400/5 border border-amber-400/20'>
        <div className='flex items-center gap-2'>
          <ArchiveBoxIcon className={`h-5 w-5 ${COLOR_SYSTEM.warning.icon}`} />
          <span className={COLOR_SYSTEM.warning.text}>A la Venta</span>
        </div>
        <span className={`font-semibold ${COLOR_SYSTEM.warning.text}`}>
          {formatNumber(product.available_products)}
        </span>
      </div>

      {/* Información técnica - Mínima prominencia */}
      <div className='mt-auto pt-3 border-t border-gray-700 text-center'>
        <span className={`text-sm ${COLOR_SYSTEM.neutral.low}`}>
          Precio unitario:{' '}
          <span className={COLOR_SYSTEM.neutral.medium}>
            {formatCurrency(product.price)}
          </span>
        </span>
      </div>

      {/* Indicador de interacción */}
      <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
        <ChevronRightIcon className='h-5 w-5 text-gray-400' />
      </div>
    </div>
  );
};

export default CardProduct;
