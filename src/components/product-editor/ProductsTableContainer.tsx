import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundProducts from '../404/NotFoundProducts';
import { ProcessedProduct } from '../table/productCalculations';
import { useProductTableData } from '../table/useProductTableData';
import ProductTableMinimal from '../table/ProductTableMinimal';

const ProductsTableForUpdatingProductContainer: React.FC = () => {
  const { products, handleRowClick } = useProductTableData();
  const navigate = useNavigate();

  const onRowClick = (product: ProcessedProduct): void => {
    handleRowClick(product);
    navigate('/formulario/editar/producto');
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
          heading='Editor'
          accessorKey='final_products'
          data={products}
          onRowClick={onRowClick}
          style={{ backgroundColor: '#880E4F' }}
        />
      </div>
    </section>
  );
};

export default ProductsTableForUpdatingProductContainer;

//http://localhost:5173/#/finales
