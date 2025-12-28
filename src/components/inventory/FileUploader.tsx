//@ts-nocheck
import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';

//import { jsonrepair } from 'jsonrepair';
import { useCounterStore } from '../../store/counterStore';

const FileUploader = ({
  onFileSelect,
}: {
  onFileSelect: (file: Blob) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const increase = useCounterStore((state) => state.increase);
  const count = useCounterStore((state) => state.count);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onFileSelect(file); // Llamar a la función con el archivo seleccionado
  };

  return (
    <div className='mb-4'>
      <h1 className='text-xl font-black text-gray-600 my-4'>Importar</h1>
      <Input
        type='file'
        accept='.json'
        className='hidden'
        onChange={handleFileChange}
      />
      <Button
        className='w-full bg-blue-500 text-white hover:bg-blue-600'
        isDisabled={count > 30 ? true : false}
        onPress={() => {
          document.querySelector('input[type="file"]').click();
          increase();
        }}
      >
        Importar Inventory
      </Button>
      {selectedFile && (
        <p className='mt-2 text-sm text-gray-600'>
          Archivo seleccionado: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default FileUploader;
