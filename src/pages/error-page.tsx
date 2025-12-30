import { useRouteError, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className='w-full flex flex-column justify-center items-center bg-slate-800 text-white min-h-[100vh]'>
      <section className='max-w-[600px]'>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>No available data or failed internet conexion.</p>
        <p>
          {/*@ts-ignore*/}
          <i>{error?.statusText || error?.message}</i>
        </p>
        <h3>
          <Link to='/'>Homepage</Link>
        </h3>
      </section>
    </div>
  );
}
