import { useInventoryProducts } from '../../hooks/useInventoryProducrts';
import { useProducts } from '../../hooks/useProducts';
import {
  useSearch,
  useFilteredProducts,
  usePagination,
} from './useProductHooks';

const LIMIT = 150; // Número de productos a mostrar por carga

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

  const isLoading = productsLoading || inventoryLoading; // Control de carga
  const error = productsError || inventoryError; // Manejo de errores

  const { searchTerm, handleSearchChange, clearSearch, setSearchTerm } =
    useSearch();
  const filteredProducts = useFilteredProducts(
    products,
    inventoryProducts,
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
