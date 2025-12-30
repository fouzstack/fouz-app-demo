import React from 'react';
import { useInventoryTable } from './useInventoryTable'; // Asegúrate de que la ruta es correcta.
import { columns, InventoryMetrics } from './columns'; // Importa tus columnas.

const InventoryTable: React.FC = () => {
  const {
    inventories,
    average_sales_percentage,
    total_cash,
    net_profit,
    total_cost,
    total_losses,
  } = useInventoryTable();
  //console.log(inventories)
  return (
    <div className='container mx-auto max-w-[210mm] p-4 overscroll-auto border'>
      <h2 className='text-lg font-bold mb-2'>Informe de Registros</h2>
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
          {inventories.map(
            (
              inventory: InventoryMetrics,
              index: React.Key | null | undefined,
            ) => (
              <tr key={index} className='border border-gray-400'>
                {columns.map((column) => {
                  // Usar el accessorKey para extraer los datos del inventario.
                  const cellData =
                    column.accessorKey === 'date'
                      ? inventory.date
                      : column.accessorKey === 'total_sales_percentage'
                        ? inventory.total_sales_percentage.toFixed(2) + '%'
                        : column.accessorKey === 'total_revenue'
                          ? `$${inventory.total_revenue.toFixed(2)}`
                          : column.accessorKey === 'gross_profit'
                            ? `$${inventory.gross_profit.toFixed(2)}`
                            : column.accessorKey === 'total_cost'
                              ? `${inventory.total_cost.toFixed(2)}`
                              : column.accessorKey === 'total_losses'
                                ? `$${inventory.total_losses.toFixed(2)}`
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
            ),
          )}
        </tbody>
      </table>
      <div className='w-full max-w-[210mm] bg-cyan-100 text-left border border-gray-400 p-1 px-2'>
        <p className='mr-1 text-gray-900'>Promedio Porcentual de Ventas</p>
        <p className='mr-1 text-gray-900'>
          <span className='text-cyan-700 font-extrabold text-6xl'>
            {average_sales_percentage.toFixed(2)}%
          </span>{' '}
        </p>
        <p className='mr-1 text-gray-900'>
          Ganancia Neta: {net_profit.toFixed(2)} CUP
        </p>
        <p className='mr-1 text-danger'>
          Total de Perdidas: {total_losses.toFixed(2)} CUP
        </p>
        <p className='mr-1 text-gray-900'>
          Total de Ventas: {total_cash.toFixed(2)} CUP
        </p>
        <p className='mr-1 text-gray-900'>
          Inversión: {total_cost.toFixed(2)} CUP
        </p>
      </div>
      <div className='py-8'></div>
    </div>
  );
};

export default InventoryTable;
