import { useState, useMemo, SetStateAction } from 'react';
import { ProductType } from '../../models/models';
import { normalizeNames } from '../../models/utils';

export const useFilteredProducts = (
  products: ProductType[],
  inventoryProducts: ProductType[],
  searchTerm: string,
) => {
  return useMemo(() => {
    // Si no hay productos, retornar array vacío inmediatamente
    if (!products || products.length === 0) {
      return [];
    }

    // Si inventoryProducts es undefined, usar array vacío
    const inventoryNames = inventoryProducts?.map((prod: ProductType) =>
      normalizeNames(prod.name)
    ) || [];

    return products
      ?.filter(
        (prod: Partial<ProductType>) =>
          (prod?.initial_products ?? 0) + (prod?.incoming_products ?? 0) <= 0,
      )
      .filter((prod) => {
        const normalizedProductName = normalizeNames(prod.name);
        return !inventoryNames.includes(normalizedProductName);
      })
      .filter((prod) =>
        prod?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, inventoryProducts, searchTerm]);
};

export const usePagination = (filteredProducts: ProductType[], limit = 90) => {
  const [currentCount, setCurrentCount] = useState(limit);

  const displayedProducts = useMemo(() => {
    return filteredProducts?.slice(0, currentCount);
  }, [filteredProducts, currentCount]);

  const loadMore = () => {
    setCurrentCount((prevCount) => prevCount + limit);
  };

  return { displayedProducts, loadMore, currentCount, setCurrentCount };
};

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return { searchTerm, handleSearchChange, clearSearch, setSearchTerm };
};
