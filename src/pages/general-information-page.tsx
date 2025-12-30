import { Link } from 'react-router-dom';
import InventorySummary from '../components/inventory/InventorySummary';
//import Dashboard from '../components/inventory/Dashboard';
import AdminLTE from '../components/AdminLTE/AdminLTE.tsx';

const GeneralInformationPage = () => {
  return (
    <AdminLTE>
      <div className='flex flex-col bg-gray-800 py-2 items-center pb-10'>
        <div className='p-4'></div>
        <article className='max-w-md border border-black  rounded rounded-xl'>
          <h1 className='text-center text-xl my-4 text-indigo-300 italic font-black '>
            {' '}
            Información General
          </h1>
          <InventorySummary />

          <div className='p-4 w-full flex justify-center'></div>
          <div className='w-full flex justify-center'>
            <Link
              className='font-medium text-xl px-4 text-indigo-200 italic underline tracking-widest'
              to='/finales'
            >
              Regresar a Finales
            </Link>
          </div>
          <div className='py-4'></div>
        </article>
      </div>
    </AdminLTE>
  );
};
export default GeneralInformationPage;
