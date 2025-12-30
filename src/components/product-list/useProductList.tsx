import { useMemo } from 'react';
import { useInventoryProducts } from '../../hooks/useInventoryProducrts';
import { useProducts } from '../../hooks/useProducts';
import {
  useSearch,
  useFilteredProducts,
  usePagination,
} from './useProductHooks';

const LIMIT = 150;

const useProductList = () => {
  const {
    products,
    isLoading: productsLoading,
    error: productsError,
    refetch,
  } = useProducts();

  const {
    inventoryProducts,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useInventoryProducts();

  // Memoizar para evitar renders innecesarios
  const memoizedProducts = useMemo(() => products || [], [products]);
  const memoizedInventoryProducts = useMemo(() => inventoryProducts || [], [inventoryProducts]);

  const isLoading = productsLoading || inventoryLoading;
  const error = productsError || inventoryError;

  const { searchTerm, handleSearchChange, clearSearch, setSearchTerm } =
    useSearch();
    
  const filteredProducts = useFilteredProducts(
    memoizedProducts,
    memoizedInventoryProducts,
    searchTerm,
  );
  
  const { displayedProducts, loadMore } = usePagination(
    filteredProducts,
    LIMIT,
  );

  const handleLetterClick = (letter: string) => {
    setSearchTerm((prev) => prev + letter);
  };

  return {
    displayedProducts,
    isLoading,
    error,
    refetch,
    searchTerm,
    handleSearchChange,
    loadMore,
    handleLetterClick,
    clearSearch,
  };
};

export default useProductList;
