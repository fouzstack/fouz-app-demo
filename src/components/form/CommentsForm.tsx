import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contactSchema,
  ContactInterface,
} from '../../schemas/contact.schema.ts';
import { useContactMutation } from './useContactMutation.tsx';
import { contactService } from './contactService.ts';
import EmailsInput from './EmailsInput.tsx';
import Errors from '../../components/errors/Errors.tsx';

interface CommentsFormProps {
  styles?: string;
}

const CommentsForm = ({ styles }: CommentsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInterface>({
    resolver: zodResolver(contactSchema),
  });

  const { mutation } = useContactMutation(contactService);
  //console.log(mutation.data?.Error_Message);

  const onSubmit: SubmitHandler<ContactInterface> = async (data) => {
    await mutation.mutateAsync(data);
  };
  return (
    <section className={`rounded-lg rounded-t-lg ${styles}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='p-8 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
          <div className='mx-auto max-w-screen-md  sm:text-center'>
            <div className='py-2  mb-4 rounded-lg rounded-t-lg '>
              <label htmlFor='comment' className='sr-only'>
                Your comment
              </label>
              <textarea
                {...register('message')}
                rows={6}
                className={`dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white  border border-gray-600 rounded-lg p-2 w-full text-sm text-gray-100  focus:ring-0 placeholder-gray-100 ${styles}`}
                placeholder='Write a comment...'
              ></textarea>
            </div>
            {errors.message?.message ? (
              <div className='text-left py-1'>
                <Errors error={`${errors.message?.message}`} />
              </div>
            ) : null}
            <h2
              className={`mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl ${styles}`}
            >
              Send a comment
            </h2>
            <p className='mx-auto mb-8 max-w-2xl  md:mb-12 sm:text-xl '>
              Stay up to date with the latest trends, announcements and
              exclusive information about React and Django Ninja.
            </p>

            <div className='items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0'>
              <EmailsInput register={register} />
            </div>
            <div className='mx-auto max-w-screen-sm  text-left text-gray-500 newsletter-form-footer dark:text-gray-300'>
              {errors.email?.message ? (
                <div className='text-left py-1'>
                  <Errors error={`${errors.email?.message}`} />
                </div>
              ) : null}
              Protection of your data is granted.{' '}
              <a
                href='#'
                className='font-medium text-primary-600 dark:text-primary-500 hover:underline'
              >
                Read Privacy Policy
              </a>
            </div>
          </div>
        </div>
        {mutation?.failureReason ? (
          <p className='text-red-500'>{`${mutation?.failureReason}`}</p>
        ) : null}
      </form>
    </section>
  );
};
export default CommentsForm;
