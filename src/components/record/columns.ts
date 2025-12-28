// ./columns.ts
export interface ColumnType {
  id: number;
  accessorKey: keyof any; // Flexible para campos calculados
  header: string;
  align?: 'left' | 'right' | 'center';
}

export const columns: ColumnType[] = [
  { id: 2, accessorKey: 'name', header: 'Producto', align: 'left' },
  { id: 3, accessorKey: 'unit', header: 'U/M', align: 'left' },
  { id: 4, accessorKey: 'initial_products', header: 'Inicial', align: 'right' },
  {
    id: 5,
    accessorKey: 'incoming_products',
    header: 'Entrada',
    align: 'right',
  },
  { id: 6, accessorKey: 'losses', header: 'Ajuste', align: 'right' },
  {
    id: 7,
    accessorKey: 'available_products',
    header: 'A la Venta',
    align: 'right',
  },
  { id: 8, accessorKey: 'final_products', header: 'Finales', align: 'right' },
  { id: 9, accessorKey: 'sold_products', header: 'Vendido', align: 'right' },
  { id: 10, accessorKey: 'price', header: 'Precio', align: 'right' },
  { id: 11, accessorKey: 'total_cash', header: 'Importe', align: 'right' },
];
