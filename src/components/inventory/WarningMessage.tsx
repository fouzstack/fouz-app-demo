import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recordsdb } from '../../models/records.database';
import { RecordsType } from '../../models/models';
import inventory from '../../models/inventorydb';
import { Button } from '@heroui/button';

interface IMessage {
  setProceed: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

type DateType = Date | string | number;

export function WarningMessage({ setProceed, setMessage }: IMessage) {
  // Use a single query to manage the loading and error states
  const recordsQuery = useQuery({
    queryKey: ['records-products'],
    queryFn: recordsdb.getAll,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const inventoryQuery = useQuery({
    queryKey: ['inventory-one'],
    queryFn: inventory.getInventory,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: records = [] } = recordsQuery;
  const { data = {} } = inventoryQuery;

  const currentDate = new Date();
  const currentInventoryDate = data.date ? new Date(data.date) : null;

  const normalizeDate = (date: DateType) => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const compareDates = (date1: DateType, date2: DateType) => {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);

    // Verifica si las fechas son válidas
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;

    return d1.toDateString() === d2.toDateString();
  };

  const recordsDates = useMemo(
    () => records.map((record: RecordsType) => normalizeDate(record.date)),
    [records],
  );

  const hasCurrentInventoryMatch =
    currentInventoryDate && compareDates(currentInventoryDate, currentDate);
  const hasRecordsMatch =
    recordsDates.includes(normalizeDate(currentDate)) ||
    (currentInventoryDate &&
      recordsDates.includes(normalizeDate(currentInventoryDate)));

  const getMessage = () => {
    if (hasCurrentInventoryMatch && hasRecordsMatch) {
      return '¡Atención! Existe coincidencia de fechas, aún no puedes crear un nuevo inventario. Presione Cancelar!';
    } else if (hasCurrentInventoryMatch) {
      return '¡Atención! Existe coincidencia con la fecha actual, no puedes crear un nuevo inventario. Presione Cancelar!';
    } else if (hasRecordsMatch) {
      return '¡Atención! Existe una coincidencia con las fechas de los registros.  Presione Cancelar!';
    }
    return 'Puedes crear tu nuevo inventario. Presiona "Continuar" para proceder.';
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-xs'>
        <p className='text-center mb-12'>{getMessage()}</p>
        <div className='flex gap-2 justify-evenly'>
          {!hasCurrentInventoryMatch && !hasRecordsMatch ? (
            <Button
              color='primary'
              className='py-2 w-full'
              onClick={() => setProceed(true)}
            >
              Continuar
            </Button>
          ) : null}

          <Button
            color='default'
            className='py-2 w-full'
            onClick={() => {
              setMessage(false);
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
