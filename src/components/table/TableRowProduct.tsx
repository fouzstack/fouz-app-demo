import React from 'react';
import { ProcessedProduct } from './productCalculations';

interface TableRowProductProps {
  accessorKey: 'incoming_products' | 'losses' | 'final_products';
  product: ProcessedProduct;
  index: number;
  isHighlighted: boolean;
  onClick: (product: ProcessedProduct) => void;
  formatNumber: (value: number) => string;
  getTextColorClass: (
    finalQty: number | undefined,
    soldQty: number | undefined,
  ) => string;
}

const TableRowProduct: React.FC<TableRowProductProps> = ({
  accessorKey,
  product,
  isHighlighted,
  onClick,
  formatNumber,
  getTextColorClass,
}) => {
  // Objeto lookup type-safe para acceder a los valores
  const valueLookup: Record<TableRowProductProps['accessorKey'], number> = {
    incoming_products: product.incoming_products ?? 0,
    losses: product.losses ?? 0,
    final_products: product.final_products ?? 0,
  };

  const value = valueLookup[accessorKey];
  
  return (
    <tr
      data-product-id={product.id}
      className={`cursor-pointer transition-all duration-300 hover:bg-gray-750 border-b border-gray-700 last:border-b-0  hover:bg-gradient-to-r hover:from-gray-750 hover:to-gray-800 ${
        isHighlighted
          ? 'ring-2 ring-emerald-500 bg-emerald-500/10 animate-pulse'
          : ''
      }`}
      onClick={() => onClick(product)}
    >
      <td className='w-[70%] px-6 py-4 text-sm font-medium text-white bg-gray-800'>
        {product.name}
      </td>
      <td
        className={`w-[30%] px-6 py-4 text-sm font-semibold ${getTextColorClass(
          product.final_products,
          product.sold_products,
        )}`}
      >
        {formatNumber(value)}
      </td>
    </tr>
  );
};

export default TableRowProduct;
