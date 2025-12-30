import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundProducts from '../404/NotFoundProducts';
import { ProcessedProduct } from '../table/productCalculations';
import { useProductTableData } from '../table/useProductTableData';
import ProductTableMinimal from '../table/ProductTableMinimal';

const IncomingProductsContainer: React.FC = () => {
  const { products, handleRowClick } = useProductTableData();
  const navigate = useNavigate();

  const onRowClick = (product: ProcessedProduct): void => {
    handleRowClick(product);
    navigate('/actualizar/entradas');
  };

  //const minimalTableData = products.slice(0, 10);

  if (!products.length) {
    return <NotFoundProducts />;
  }

  return (
    <section className='overscroll-auto table-auto-center'>
      <div className='py-2 bg-gray-900'></div>
      <div className=''>
        <ProductTableMinimal
          heading='Entradas'
          accessorKey='incoming_products'
          data={products}
          onRowClick={onRowClick}
          style={{ backgroundColor: '#00e676' }}
        />
      </div>
    </section>
  );
};

export default IncomingProductsContainer;
