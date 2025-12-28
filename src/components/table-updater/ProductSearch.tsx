import React, { useState } from 'react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  show: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch, show }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  if (!show) return null;

  return (
    <form onSubmit={handleSubmit} className='mb-4'>
      <input
        type='text'
        value={query}
        onChange={handleChange}
        placeholder='Buscar producto...'
        className='border rounded p-2 w-full'
      />
    </form>
  );
};

export default ProductSearch;
