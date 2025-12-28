import { useState } from 'react';
import { useProductTable } from './useProductTable';
import { columns } from './columns';
import SimpleModal from '../modal/SimpleModal';
import { ProcessedProductsTypes, initialProduct } from './types';

const ProductTable = () => {
  const {
    processedProducts: products,
    isLoading,
    error,
    setIsSortedByFinal,
  } = useProductTable();
  const [state, setState] = useState<ProcessedProductsTypes>({
    ...initialProduct,
  });
  const [isModal, setIsModal] = useState(false);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products available.</div>;
  }
  return (
    <>
      {isModal ? (
        <SimpleModal setIsModal={setIsModal}>
          <article className='flex flex-col items-center py-10'>
            <section className='text-left'>
              <h2 className='text-2xl mb-4'>Resumen de Venta</h2>
              <p className='font-extrabold text-gray-700'>{state.name}</p>
              <p>Precio: {state.price} CUP</p>
              <p>Cantidad a la Venta: {state.available}</p>
              <p>Cantidad Vendida: {state.sold}</p>
              <p>Productos Finales: {state.final}</p>
              <p>Porciento de Venta: {state.soldPercentage.toFixed(2)}%</p>
            </section>
          </article>
        </SimpleModal>
      ) : (
        <div className='not-selected container mx-auto max-w-[210mm] py-4 overscroll-auto border'>
          <table className='w-full max-w-[210mm]'>
            <thead
              className='pointer'
              onClick={() => setIsSortedByFinal((st) => !st)}
            >
              <tr className='bg-gray-300 h-[50px]'>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className='border border-gray-400 px-2 text-left text-sm font-medium text-gray-700'
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  onClick={() => {
                    setState(product);
                    setIsModal(true);
                  }}
                  key={index}
                  className='border border-gray-400'
                >
                  {columns.map((column) => {
                    const cellData =
                      column.accessorKey === 'price'
                        ? product.price
                        : column.accessorKey === 'name'
                          ? product.name
                          : column.accessorKey === 'sold'
                            ? product.sold
                            : column.accessorKey === 'final'
                              ? product.final
                              : null;
                    return (
                      <td
                        key={column.id}
                        className={`border border-gray-400 p-2 text-sm ${product.final == 0 ? 'text-danger' : product.finalPercentage < 50 ? 'text-violet-500 ' : 'text-emerald-500'}`}
                      >
                        {column.accessorKey == 'price' ? (
                          <span className='text-black'>{`$${cellData}`}</span>
                        ) : (
                          cellData
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ProductTable;
