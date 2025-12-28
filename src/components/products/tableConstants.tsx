export const columnsMaker = () => {
  return [
    {
      accessorKey: 'name',
      header: 'Producto',
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
      header: 'Entradas',
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
