import { Link } from 'react-router-dom';
import { useCounterStore } from '../../store/counterStore';

export default function Footer() {
  const increase = useCounterStore((state) => state.increase);
  return (
    <footer className='fixed bottom-0 left-0 right-0 bg-gray-950 flex justify-center px-4 w-[100%]'>
      <div className='container text-amber-400 px-2 py-4 bg-gray-950'>
        <div className='flex items-center justify-evenly text-xs'>
          <Link
            onClick={increase}
            to={`/inventario`}
            className='hover:text-yellow-200'
          >
            Inventario
          </Link>
          <Link
            onClick={increase}
            to={`/informacion/general`}
            className='hover:text-yellow-200'
          >
            Análisis
          </Link>
          <Link
            onClick={increase}
            to={`/registros`}
            className='hover:text-yellow-200'
          >
            Registros
          </Link>
        </div>
      </div>
    </footer>
  );
}

/*
          <Link to={`/registros`} className='hover:text-yellow-200'>
            Registros
          </Link>
          <Link to={`/resumen`} className='hover:text-yellow-200'>
            Resumen
          </Link>
*/
