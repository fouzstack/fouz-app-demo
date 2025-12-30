import { UseMutationResult } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';
import { ProductType } from '../../models/models';

export const useToaster = (
  mutation: UseMutationResult<any, Error, Partial<ProductType>, unknown>,
) => {
  React.useEffect(() => {
    if (mutation.isSuccess) {
      const message = mutation.data
        ? mutation.data
        : 'El producto se ha actualizado, pero no se devolvió información adicional.';
      toast.success(`${message}`);
    } else if (mutation.isError) {
      toast.error(`Error al actualizar el producto: ${mutation.error}`);
    }
  }, [mutation.isSuccess, mutation.isError, mutation.data, mutation.error]);
};
