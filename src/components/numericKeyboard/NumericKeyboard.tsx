import React from 'react';
import BackspaceIcon from '../icons/BackspaceIcon';

interface NumericKeyboardProps {
  onKeyPress: (
    key: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const NumericKeyboard: React.FC<NumericKeyboardProps> = ({ onKeyPress }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'del'],
  ];

  return (
    <div className='bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-xl'>
      <div className='grid grid-cols-3 gap-4'>
        {keys.map((row, rowIndex) =>
          row.map((key, colIndex) => {
            const isDeleteKey = key === 'del';
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                aria-label={isDeleteKey ? 'Borrar' : `Tecla ${key}`}
                className={`bg-gray-800 hover:bg-gray-700 active:bg-gray-600 flex justify-center items-center 
                            rounded-xl p-4  text-xl font-bold text-white transition-transform duration-200 
                            transform hover:scale-105 active:scale-95 shadow-lg`}
                onClick={(event) =>
                  onKeyPress(isDeleteKey ? 'del' : key, event)
                }
                type='button'
              >
                {isDeleteKey ? (
                  <BackspaceIcon color='#FFFFFF' size={28} />
                ) : (
                  key
                )}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
};

export default NumericKeyboard;
