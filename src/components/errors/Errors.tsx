interface Error {
  error: string;
}

const Errors = ({ error }: Error) => {
  return (
    <p className='text-rose-500 tracking-widest font-extrabold text-xs relative top-[-1em]'>
      {error}
    </p>
  );
};
export default Errors;
