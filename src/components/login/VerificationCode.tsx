import React from 'react';
import { z } from 'zod';
import { Button } from '@heroui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; //@ts-expect-error
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { USER_ACTION_TYPES } from '../../store/userActions';
//import { useCounterStore } from '../../store/counterStore';
import EyeButton from './EyeButton';

// Este es el texto encriptado obtenido del archivo JSON
//const encryptedCode1 = 'U2FsdGVkX1/ROcMtEGRd6r5dVY6aVX0PoBnHUCCUW8A=';
const encryptedCode = 'U2FsdGVkX1/2FVvm0gD88vJ/F3RowJBAtI/wNU27DSQ=';

const codeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});
type codeSchemaFormData = z.infer<typeof codeSchema>;

const VerificationCode = () => {
  const [type, setType] = React.useState('password');
  //const reset = useCounterStore((state) => state.reset);
  const dispatch = useUserStore((state) => state.dispatch);
  const handleVerificationSuccess = () => {
    dispatch({
      type: USER_ACTION_TYPES.VERIFY,
      payload: {
        isAuth: false,
        isVerified: true,
        username: undefined,
        password: undefined,
      },
    });
    return true;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<codeSchemaFormData>({
    resolver: zodResolver(codeSchema),
  });

  // variable para almacenar el código original
  const [originalCode, setOriginalCode] = useState<string>('');

  useEffect(() => {
    // Decodificando el código encriptado
    const decode = () => {
      const bytes = CryptoJS.AES.decrypt(encryptedCode, 'mi_clave_secreta');
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      setOriginalCode(decryptedText);
    };
    decode();
  }, []);

  const onSubmit = (data: { code: string }) => {
    // Verificando si el código ingresado coincide con el original
    if (data.code === originalCode) {
      handleVerificationSuccess();

      //handleVerificationSuccess() && localStorage.setItem('counter', JSON.stringify({state:{count:0},version:0}))
    } else {
      alert('Invalid code. Please try again.');
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='min-h-screen flex flex-col items-center p-8 bg-gradient-to-r from-violet-900 to-yellow-500'
    >
      <label className='mb-2 text-white text-2xl font-bold' htmlFor='code'>
        Verification Code!
      </label>
      <div className='relative'>
        <input
          id='code'
          type={type}
          {...register('code')}
          className='border rounded p-2 mb-2 text-white bg-transparent onFocus:bg-transparent'
          autoComplete='off'
        />
        <EyeButton color='black' type={type} setType={setType} />
      </div>
      {errors.code && (
        <span className='text-red-500 bg-white rounded rounded-md px-2'>
          {errors.code.message}
        </span>
      )}
      <Button
        className='bg-gradient-to-br from-purple-600 to-black text-white mt-4 px-16 py-2'
        type='submit'
      >
        Verify
      </Button>
    </form>
  );
};

export default VerificationCode;
