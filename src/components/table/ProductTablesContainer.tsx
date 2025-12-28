import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductTableData } from './useProductTableData';
import ProductTableMinimal from './ProductTableMinimal';
import ProductTableFull from './ProductTableFull';
import NotFoundProducts from '../404/NotFoundProducts';
import { ProcessedProduct } from './productCalculations';

const ProductTablesContainer: React.FC = () => {
  const { products, totals, averageSalesPercentage, handleRowClick } =
    useProductTableData();
  const navigate = useNavigate();
  const [showFullTable, setShowFullTable] = useState<boolean>(false);

  const onRowClick = (product: ProcessedProduct): void => {
    handleRowClick(product);
    navigate('/actualizar/finales');
  };

  //const minimalTableData = products.slice(0, 10);

  if (!products.length) {
    return <NotFoundProducts />;
  }

  return (
    <section className='overscroll-auto table-auto-center'>
      {showFullTable ? (
        <div style={{ maxWidth: '210mm' }} className='pt-4'>
          <ProductTableFull
            data={products}
            onRowClick={onRowClick}
            totals={totals}
            averageSalesPercentage={averageSalesPercentage}
            setShowFullTable={setShowFullTable}
          />
        </div>
      ) : (
        <div className='pt-4'>
          <ProductTableMinimal
            heading='Finales'
            accessorKey='final_products'
            data={products}
            onRowClick={onRowClick}
            setShowFullTable={setShowFullTable}
            style={{ backgroundColor: '#00b0ff' }}
          />
        </div>
      )}
    </section>
  );
};

export default ProductTablesContainer;
