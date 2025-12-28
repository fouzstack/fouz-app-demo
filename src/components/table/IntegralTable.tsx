import React, { useState } from 'react';
import NotFoundProducts from '../404/NotFoundProducts';
import ProductTableFull from './ProductTableFull';
import ProductInfoCard from './ProductInfoCard';
import { useProductTableData } from './useProductTableData';
import { ProcessedProduct } from './productCalculations';

const IntegralTable: React.FC = () => {
  const { products, totals, averageSalesPercentage, handleRowClick } =
    useProductTableData();

  // Estado para controlar el modal
  const [selectedProduct, setSelectedProduct] =
    useState<ProcessedProduct | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onRowClick = (product: ProcessedProduct): void => {
    handleRowClick(product);
    // Mostrar el modal con el producto seleccionado
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  if (!products.length) {
    return <NotFoundProducts />;
  }

  return (
    <section className='overscroll-auto table-auto-center bg-gray-900'>
      <div className='py-2 bg-gray-900'></div>
      <div className=''>
        <ProductTableFull
          data={products}
          onRowClick={onRowClick}
          totals={totals}
          newStyles='!bg-purple-700 !text-white'
          averageSalesPercentage={averageSalesPercentage}
        />
      </div>

      {/* Modal de información del producto */}
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

export default IntegralTable;
