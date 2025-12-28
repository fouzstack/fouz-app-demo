import { UseFormRegister } from 'react-hook-form';
import { ContactInterface } from '../../schemas/contact.schema.ts';

type EmailInputProps = {
  register: UseFormRegister<ContactInterface>;
};

const EmailsInput = ({ register }: EmailInputProps) => {
  return (
    <>
      <div className='relative w-full'>
        <label
          htmlFor='email'
          className='hidden sr-only mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          Email address
        </label>
        <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
          <svg
            className='w-4 h-4 text-gray-500 dark:text-gray-400'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 16'
          >
            <path d='m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z' />
            <path d='M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z' />
          </svg>
        </div>
        <input
          className='block p-3 pl-9 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
          placeholder='Enter your email'
          {...register('email')}
        />
      </div>
      <div>
        <button className='py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>
          Send
        </button>
      </div>
    </>
  );
};

export default EmailsInput;

//https://github.com/gfouz/react-ninja
//https://github.com/gfouz/ninja-server
