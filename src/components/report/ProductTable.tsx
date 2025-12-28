import { useProductTable } from './useProductTable';
import { columns } from './columns';
import { formatDateAndWeek } from '../../models/utils';

const ProductTable = () => {
  const {
    date,
    processedProducts: products,
    loss,
    isLoading,
    error,
    totality,
    totalCost,
    average_sales_percentage,
  } = useProductTable();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products available.</div>;
  }

  const totalOfLosses = products.reduce(
    (acc, product) => acc + product.loss,
    0,
  );
  const totalOfProfits = products.reduce(
    (accum, product) => accum + product.profits_total,
    0,
  ); // Assuming 'price' is the field to sum.
  const total = totalOfProfits - totalOfLosses;
  return (
    <div className='container mx-auto max-w-[210mm] p-4 overscroll-auto border'>
      <h2 className='text-lg font-bold mb-2'>
        Inventario actual:{' '}
        <span className='text-secondary'>{formatDateAndWeek(date)}</span>
      </h2>
      <table className='w-full max-w-[210mm]'>
        <thead>
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
            <tr key={index} className='border border-gray-400'>
              {columns.map((column) => {
                const cellData =
                  column.accessorKey === 'name'
                    ? product.name
                    : column.accessorKey === 'salesPercentage'
                      ? product.salesPercentage.toFixed(2) + '%'
                      : column.accessorKey === 'price'
                        ? `$${product.price.toFixed(2)}`
                        : column.accessorKey === 'cost'
                          ? `$${product.cost.toFixed(2)}`
                          : column.accessorKey === 'profit'
                            ? `$${product.profit.toFixed(2)}`
                            : column.accessorKey === 'sold_products'
                              ? `${product.sold_products}`
                              : column.accessorKey === 'total_profit'
                                ? `$${product.total_profit}`
                                : column.accessorKey === 'loss'
                                  ? `$${product.loss.toFixed(2)}`
                                  : column.accessorKey === 'net_profit'
                                    ? `$${product.net_profit.toFixed(2)}`
                                    : null;
                return (
                  <td
                    key={column.id}
                    className='border border-gray-400 p-2 text-sm'
                  >
                    {cellData}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full max-w-[210mm] bg-cyan-100 text-left border border-gray-400 p-1 px-2'>
        <p className='mr-1 text-gray-900'>Cantidad Vendida:</p>
        <p className='mr-1 text-gray-900'>
          <span className='text-cyan-700 font-extrabold text-6xl'>
            {average_sales_percentage.toFixed(2)}%
          </span>
        </p>
        <p className={`mr-1 ${total < 0 ? 'text-danger' : 'text-gray-900'} `}>
          Ganancia neta:{' '}
          {total.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          CUP
        </p>
        <p className='mr-1 text-danger'>
          Perdidas:{' '}
          {loss.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          CUP
        </p>
        <p className='mr-1 text-gray-900'>
          Total de Ventas:{' '}
          {totality.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          CUP
        </p>
        <p className='mr-1 text-gray-900'>
          Inversión o Costo:{' '}
          {totalCost.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          CUP
        </p>
      </div>
    </div>
  );
};

export default ProductTable;
