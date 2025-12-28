export const useColumnsMaker =
  (/*refetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<Product, Error>>*/) => {
    return [
      {
        accessorKey: 'name',
        header: 'Producto',
        cell: ({ row }: { row: any }) => (
          <span className='font-extrabold text-emerald-500'>
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: 'unit',
        header: 'U/M',
      },
      {
        accessorKey: 'initial_products',
        header: 'Inicial',
      },
      {
        accessorKey: 'incoming_products',
        header: 'Entrada',
      },
      {
        accessorKey: 'available_products',
        header: 'A la Venta',
      },
      {
        accessorKey: 'final_products',
        header: 'Finales',
      },
      {
        accessorKey: 'sold_products', // Puedes usar un accessor que no exista en los datos, solo para la presentación
        header: 'Vendido', // Título de la columna
        cell: ({ row }: { row: any }) => (
          <span className='font-extrabold text-emerald-500'>
            {row.original.sold_products}
          </span>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Precio',
      },
      {
        accessorKey: 'total_cash',
        header: 'Importe',
      },
    ];
  };
