import { useState } from 'react'; //@ts-expect-error
import CryptoJS from 'crypto-js';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

const Encoder = () => {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState('');

  const encriptar = () => {
    const ciphertext = CryptoJS.AES.encrypt(
      texto,
      'mi_clave_secreta',
    ).toString();
    setResultado(ciphertext);
  };

  const desencriptar = () => {
    const bytes = CryptoJS.AES.decrypt(resultado, 'mi_clave_secreta');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    setResultado(originalText);
  };

  return (
    <div className='p-16 my-16 border border-red-500'>
      <Input
        type='text'
        value={texto}
        className='border border-green-500'
        onChange={(e) => setTexto(e.target.value)}
      />
      <div className='border my-10'>
        <Button onClick={encriptar}>Encriptar</Button>
        <Button onClick={desencriptar}>Desencriptar</Button>
      </div>
      <p className='border p-10'>Resultado: {resultado}</p>
    </div>
  );
};

export default Encoder;
