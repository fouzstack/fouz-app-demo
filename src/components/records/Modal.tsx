import { columns } from './columns.ts';
import { IInventory } from './recordInterface.ts';

interface IModal {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  inventory: IInventory;
}

const Modal = ({ setModal, inventory }: IModal) => {
  return (
    <div className='w-full container mx-auto max-w-[210mm] overscroll-auto'>
      <article
        onClick={() => {
          setModal(false);
        }}
        className='pointer w-full'
        key={String(inventory.time)}
      >
        <table className='w-full '>
          <thead>
            <tr>
              <td colSpan={11} className='text-gray-950'>
                <div className='flex justify-between px-2'>
                  <span>{`${inventory.date}, ${inventory.time}`}</span>
                  <span>{inventory.seller}</span>
                </div>
              </td>
            </tr>
            <tr className='bg-gray-700 h-[50px]'>
              {columns.map((column) => (
                <th
                  key={String(column.id) + String(inventory.date)}
                  className='border border-gray-400 px-2 text-left text-sm font-medium text-white'
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-gray-800'>
            {inventory?.products.map((product: any) => (
              <tr key={product.id} className='border border-gray-400'>
                {columns.map((column) => (
                  <td
                    key={column.id + product.id}
                    className='border text-gray-50 border-gray-400 p-2 text-sm'
                  >
                    {product[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tr>
            <td colSpan={11} className='bg-gray-800 text-yellow-100'>
              <div className='flex justify-between px-2'>
                <span>{inventory.salesPercentage.toFixed(2)} %</span>
                <span>Ventas: {inventory.total}</span>
              </div>
            </td>
          </tr>
        </table>
      </article>
    </div>
  );
};

export default Modal;

/* const modalActions = () => {
    closeModal();
    navigate(-1);
  };
 */
