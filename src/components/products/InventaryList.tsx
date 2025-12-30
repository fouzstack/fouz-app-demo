import React from 'react';
import { useQuery } from '@tanstack/react-query';
import InventoryRecordsTable from './InventoryRecordsTable';
import inventory from '../../models/inventorydb';
import { ProductType } from '../../models/models';

const InventoryList = () => {
  const {
    data: inventories,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['inventories'], queryFn: inventory.getAll });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading inventories.</div>;

  return (
    <div className=''>
      {inventories.map(
        (
          inventory: { date: string | number | Date; products: ProductType[] },
          index: React.Key | null | undefined,
        ) => (
          <div key={index} className=''>
            {/* @ts-expect-error*/}
            <InventoryRecordsTable data={inventory} />
          </div>
        ),
      )}
    </div>
  );
};

export default InventoryList;
