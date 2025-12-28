import { useMutation } from '@tanstack/react-query';
import { ContactInterface } from '../../schemas/contact.schema.ts';

interface MutationFnInterface {
  (data: any): Promise<any>;
  (data: { email: string; message: string }): Promise<any>;

  (arg0: ContactInterface): Promise<unknown>;
}

export const useContactMutation = (fetchApi: MutationFnInterface) => {
  const mutation = useMutation({
    mutationFn: (data: ContactInterface) => {
      return fetchApi(data);
    },
  });
  return { mutation };
};
