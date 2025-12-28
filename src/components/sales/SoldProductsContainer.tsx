import React, { useState, useMemo } from 'react';
import NotFoundProducts from '../404/NotFoundProducts';
import SoldProductsTable from './SoldProductsTable';
import ProductInfoCard from './ProductInfoCard';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ProcessedProduct } from '../table/productCalculations';
import { useProductTableData } from '../table/useProductTableData';

const SoldProductsContainer: React.FC = () => {
  const { products, totals, averageSalesPercentage, handleRowClick } = useProductTableData();
  
  // Estado para controlar el modal
  const [selectedProduct, setSelectedProduct] = useState<ProcessedProduct | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Estado para el filtro de productos vendidos/no vendidos
  const [showSoldProducts, setShowSoldProducts] = useState(true);

  // Filtrar productos basado en el estado del filtro
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (showSoldProducts) {
        // Mostrar productos vendidos (sold_products > 0)
        return (product.sold_products || 0) > 0;
      } else {
        // Mostrar productos no vendidos (sold_products === 0)
        return (product.sold_products || 0) === 0;
      }
    });
  }, [products, showSoldProducts]);

  const onRowClick = (product: ProcessedProduct): void => {
    handleRowClick(product);
    // Solo mostrar el modal si el producto está vendido
    if ((product.sold_products || 0) > 0) {
      setSelectedProduct(product);
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const toggleFilter = () => {
    setShowSoldProducts(prev => !prev);
  };

  if (!products.length) {
    return <NotFoundProducts />;
  }

  return (
    <section className="overscroll-auto table-auto-center bg-gray-900 min-h-screen">
      {/* Header con estadísticas */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {showSoldProducts ? 'Productos Vendidos' : 'Productos No Vendidos'}
              </h1>
              <p className="text-gray-400 text-sm">
                {filteredProducts.length} productos encontrados
              </p>
            </div>
            
            {/* Botón flotante para cambiar filtro */}
            <button
              onClick={toggleFilter}
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                showSoldProducts 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600' 
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'
              }`}
              aria-label={showSoldProducts ? 'Mostrar productos no vendidos' : 'Mostrar productos vendidos'}
            >
              {showSoldProducts ? (
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
              ) : (
                <XMarkIcon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Total Vendido</p>
              <p className="text-lg font-bold text-emerald-400">
                {totals.sold_products.toLocaleString('es-MX')}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Importe Total</p>
              <p className="text-lg font-bold text-purple-400">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN'
                }).format(totals.total_cash)}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">% Promedio</p>
              <p className="text-lg font-bold text-blue-400">
                {averageSalesPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="">
        <SoldProductsTable
          heading={showSoldProducts ? 'Vendidos' : 'No Vendidos'}
          data={filteredProducts}
          onRowClick={onRowClick}
          style={{ backgroundColor: showSoldProducts ? '#4a148c' : '#757575' }}
        />
      </div>

      {/* Modal de información del producto (solo para vendidos) */}
      {selectedProduct && (
        <ProductInfoCard
          product={selectedProduct}
          isVisible={isModalVisible}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default SoldProductsContainer;

