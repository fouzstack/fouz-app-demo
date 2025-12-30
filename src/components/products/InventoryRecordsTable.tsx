import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useColumnsMaker } from './useColumnsMaker';
import { useProductFilter } from '../../hooks/useProductFilter';
import { RecordsType } from '../../models/models';
import { InternationalDateFormater } from '../../models/utils';
//import Modal from './Modal';  // Asegúrate de importar tu componente de modal

function InventoryRecordsTable({ data }: { data: RecordsType }) {
  // Procesar todos los productos y filtrarlos por `available_products`
  const { products, date } = data;
  const processedProducts = useProductFilter(products);
  const tableColumns = useColumnsMaker();
  const columns = React.useMemo(() => tableColumns, []);

  const table = useReactTable({
    columns,
    data: processedProducts,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalImportes = processedProducts.reduce(
    (acc: any, product: { total_cash: any }) => acc + product.total_cash,
    0,
  );
  return (
    <section className='overflow-x-auto p-4 table-auto-center'>
      <div className='' style={{ maxWidth: '210mm', maxHeight: '297mm' }}>
        <h2 className='text-lg font-bold mb-2'>
          {InternationalDateFormater(date)}
        </h2>

        <table className='min-w-full border-collapse border border-gray-400'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className='bg-gray-300' key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className='border border-gray-400 p-2 text-left text-sm font-medium text-gray-700'
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map((row) => {
                //const isSoldGreaterThanAvailable = row.original.sold_products > product.available(row.original);

                return (
                  <tr
                    className={`bg-white pointer border border-gray-400`}
                    key={row.id}
                    // onClick={() => handleRowClick( /*row?.original*/) }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className='border border-gray-400 p-2 text-sm'
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
          <tfoot>
            <tr className='bg-gray-200 font-bold'>
              <td colSpan={8} className='text-right'>
                <p className='mr-1 text-gray-500'>Total:</p>
              </td>
              <td className='border border-gray-400 p-2'>
                <p className='mr-1 text-gray-500'>{totalImportes}</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default InventoryRecordsTable;
