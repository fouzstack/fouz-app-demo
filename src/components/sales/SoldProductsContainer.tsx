import React, { useState, useMemo } from 'react';
import NotFoundProducts from '../404/NotFoundProducts';
import SoldProductsTable from './SoldProductsTable';
import ProductInfoCard from './ProductInfoCard';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ProcessedProduct } from '../table/productCalculations';
import { useProductTableData } from '../table/useProductTableData';

const SoldProductsContainer: React.FC = () => {
  const { products, handleRowClick } = useProductTableData();
  
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
    <section className="overscroll-auto scrollbar-hide table-auto-center bg-gray-900 min-h-screen">   
            {/* Botón flotante para cambiar filtro */}
            <button
              onClick={toggleFilter}
              className={`flex items-center justify-center z-100 fixed bottom-16 right-2 w-12 h-12 rounded-xl transition-all duration-200 ${
                showSoldProducts 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600' 
                  : 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-600 hover:to-gray-700'
              }`}
              aria-label={showSoldProducts ? 'Mostrar productos no vendidos' : 'Mostrar productos vendidos'}
            >
              {showSoldProducts ? (
                <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
              ) : (
                <XMarkIcon className="h-6 w-6 text-white" />
              )}
            </button>
          

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

