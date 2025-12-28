import React from 'react';
import { XMarkIcon, CurrencyDollarIcon, ShoppingBagIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { ProcessedProduct } from '../table/productCalculations';

interface ProductInfoCardProps {
  product: ProcessedProduct;
  isVisible: boolean;
  onClose: () => void;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ 
  product, 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString('es-MX');
  };

  const salesPercentage = product.salesPercentage || 0;
  
  // Colores semánticos basados en el porcentaje de ventas
  const getPercentageColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPercentageBgColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-900/30';
    if (percentage >= 50) return 'bg-yellow-900/30';
    return 'bg-red-900/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto scrollbar-hide items-center justify-center bg-black/80 backdrop-blur-sm p-4 ">
      <section className=''>
        
       <div className='py-10'></div>
      <div className="w-full p-2 py-6 mt-8 min-w-xs  max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl animate-fadeIn">
       
        {/* Header con botón de cierre */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-indigo-900/50 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white truncate">
                {product.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6 mt-4">
          
          {/* Tarjeta de Vendido */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-emerald-900/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <ShoppingBagIcon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-200">Vendido</h3>
              </div>
              <div className={`px-3 py-1 rounded-full ${getPercentageBgColor(salesPercentage)}`}>
                <span className={`text-sm font-semibold ${getPercentageColor(salesPercentage)}`}>
                  {salesPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Cantidad:</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {formatNumber(product.sold_products || 0)}
                </span>
              </div>
              
            </div>
          </div>

          {/* Tarjeta de Precio */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-blue-900/30">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Precio</h3>
            </div>
            <div className="text-center py-2">
              <span className="text-3xl font-bold text-blue-400">
                {formatCurrency(product.price || 0)}
              </span>
              <p className="text-sm text-gray-400 mt-1">Por unidad</p>
            </div>
          </div>

          {/* Tarjeta de Importe */}
          <div className="bg-gray-800/50 rounded-xl p-5 border border-purple-900/30">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <ChartBarIcon className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Importe Total</h3>
            </div>
            <div className="text-center py-2">
              <span className="text-4xl font-bold text-purple-400">
                {formatCurrency(product.total_cash || 0)}
              </span>
              <p className="text-sm text-gray-400 mt-1">
                Total generado en ventas
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>  
    </div>
  );
};

export default ProductInfoCard;

