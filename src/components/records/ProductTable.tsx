import React from 'react';
import { useProductTable } from './useProductTable';
import { columns } from './columns.ts';
import Modal from './Modal.tsx';
import { IInventory, initialInventory } from './recordInterface.ts';
import NotFoundProducts from '../404/NotFoundProducts.tsx';
import { formatToCUP } from '../helpers.ts';

const ProductTable = () => {
  const { inventories } = useProductTable();
  const [modal, setModal] = React.useState(false);
  const [stock, setStock] = React.useState(initialInventory);

  function handleCkick(inventory: IInventory) {
    setStock(inventory);
    setModal(true);
  }

  // Filtrar columnas para eliminar la columna "código"
  const filteredColumns = columns.filter(
    (column) => column.accessorKey !== 'code',
  );

  // Función para calcular totales por columna numérica en un inventario dado
  const calculateTotals = (products: IInventory['products']) => {
    return products.reduce(
      (acc, product) => {
        acc.price += product.price;
        acc.initial_products += product.initial_products;
        acc.incoming_products += product.incoming_products;
        acc.losses += product.losses;
        acc.final_products += product.final_products;
        acc.available_products += product.available_products;
        acc.sold_products += product.sold_products;
        acc.total_cash += product.total_cash;
        return acc;
      },
      {
        price: 0,
        initial_products: 0,
        incoming_products: 0,
        losses: 0,
        final_products: 0,
        available_products: 0,
        sold_products: 0,
        total_cash: 0,
      },
    );
  };

  return (
    <>
      {inventories.length > 0 ? (
        <div className='container mx-auto max-w-full lg:max-w-[210mm] overscroll-auto bg-gray-900 rounded-xl shadow-2xl p-2 lg:p-4'>
          {modal ? (
            <Modal setModal={setModal} inventory={stock} />
          ) : (
            <ul className='mb-4 space-y-4 lg:space-y-6'>
              {inventories.map((inventory: IInventory) => {
                const totals = calculateTotals(inventory.products);
                return (
                  <li
                    className='w-full transition-all duration-300 hover:scale-[1.01] hover:shadow-lg'
                    key={String(inventory.time)}
                  >
                    <div className='bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700'>
                      {/* Header de la tabla */}
                      <div
                        className='bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-2 lg:px-4 lg:py-3 border-b border-gray-600 cursor-pointer'
                        onClick={() => handleCkick(inventory)}
                      >
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0'>
                          <div className='flex items-center space-x-2'>
                            <span className='text-gray-300 font-medium text-sm lg:text-base'>
                              {inventory.date}
                            </span>
                            <span className='text-gray-400 hidden sm:inline'>
                              •
                            </span>
                            <span className='text-gray-400 text-sm lg:text-base'>
                              {inventory.time}
                            </span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <span className='text-gray-300 font-medium text-sm lg:text-base'>
                              Vendedor:
                            </span>
                            <span className='text-gray-200 font-semibold bg-gray-700 px-2 py-1 rounded-md text-sm'>
                              {inventory.seller}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contenedor con scroll horizontal */}
                      <div className='overflow-x-auto scrollbar-hide w-full'>
                        <table className='w-full min-w-[700px] lg:min-w-0 lg:max-w-[210mm]'>
                          <thead>
                            <tr className='bg-gradient-to-r from-gray-700 to-gray-600 h-10 lg:h-12'>
                              {filteredColumns.map((column) => (
                                <th
                                  key={
                                    String(column.id) + String(inventory.date)
                                  }
                                  className='border-r border-gray-500 px-2 lg:px-3 text-left text-xs lg:text-sm font-semibold text-gray-200 last:border-r-0 whitespace-nowrap'
                                >
                                  {column.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {inventory.products.map((product, index) => (
                              <tr
                                key={product.id}
                                className={`border-b border-gray-700 transition-colors duration-200 ${
                                  index % 2 === 0
                                    ? 'bg-gray-800'
                                    : 'bg-gray-800/70'
                                } hover:bg-gray-700`}
                              >
                                {filteredColumns.map((column) => (
                                  <td
                                    key={column.id + product.id}
                                    className='border-r border-gray-700 p-2 lg:p-3 text-xs lg:text-sm text-gray-300 last:border-r-0 whitespace-nowrap'
                                  >
                                    {/*@ts-expect-error*/}
                                    {product[column.accessorKey]}
                                  </td>
                                ))}
                              </tr>
                            ))}

                            {/* Fila de totales */}
                            <tr className='bg-gradient-to-r from-amber-700 to-amber-600 font-bold'>
                              {filteredColumns.map((column) => {
                                let totalValue = '';
                                switch (column.accessorKey) {
                                  case 'price':
                                    totalValue = formatToCUP(totals.price);
                                    break;
                                  case 'initial_products':
                                    totalValue =
                                      totals.initial_products.toString();
                                    break;
                                  case 'incoming_products':
                                    totalValue =
                                      totals.incoming_products.toString();
                                    break;
                                  case 'losses':
                                    totalValue = totals.losses.toString();
                                    break;
                                  case 'final_products':
                                    totalValue =
                                      totals.final_products.toString();
                                    break;
                                  case 'available_products':
                                    totalValue =
                                      totals.available_products.toString();
                                    break;
                                  case 'sold_products':
                                    totalValue =
                                      totals.sold_products.toString();
                                    break;
                                  case 'total_cash':
                                    totalValue = formatToCUP(totals.total_cash);
                                    break;
                                  default:
                                    totalValue = '';
                                }
                                return (
                                  <td
                                    key={'total-' + column.id}
                                    className='border-r border-amber-500 p-2 lg:p-3 text-xs lg:text-sm text-right text-gray-900 last:border-r-0 whitespace-nowrap'
                                  >
                                    {totalValue}
                                  </td>
                                );
                              })}
                            </tr>

                            {/* Fila resumen de % ventas y total general existente */}
                            <tr className='bg-gradient-to-r from-gray-700 to-gray-600'>
                              <td
                                colSpan={filteredColumns.length}
                                className='p-3 lg:p-4'
                              >
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0'>
                                  <div className='flex items-center space-x-2'>
                                    <span className='text-gray-300 font-medium text-sm'>
                                      Porcentaje de ventas:
                                    </span>
                                    <span className='text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-sm lg:text-base'>
                                      {inventory.salesPercentage.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className='flex items-center space-x-2'>
                                    <span className='text-gray-300 font-medium text-sm'>
                                      Total ventas:
                                    </span>
                                    <span className='text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full text-sm lg:text-base'>
                                      {formatToCUP(inventory.total)}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <NotFoundProducts />
      )}
    </>
  );
};

export default ProductTable;
