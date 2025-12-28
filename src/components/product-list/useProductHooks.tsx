import { useState, useMemo, SetStateAction, useEffect } from 'react';
import { ProductType } from '../../models/models';
import { normalizeNames } from '../../models/utils';
import { useQueryClient } from '@tanstack/react-query';
import { productdb } from '../../models/product.database';
import jsonProducts from '../../products.json';

export const useFilteredProducts = (
  products: ProductType[],
  inventoryProducts: ProductType[],
  searchTerm: string,
) => {
  const queryClient = useQueryClient();
  // Si products no existe, crea los productos utilizando Dexie
  useEffect(() => {
    const createProductsIfNotExists = async () => {
      if (!products || products.length === 0) {
        //@ts-expect-error
        await productdb.addMany(jsonProducts);
        // Refetch products after creating them
        queryClient.invalidateQueries({ queryKey: ['all-products'] });
      }
    };

    createProductsIfNotExists();
  }, [products, queryClient]);

  const inventoryNames = useMemo(() => {
    return inventoryProducts?.map((prod: ProductType) =>
      normalizeNames(prod.name),
    ); // Normaliza los nombres de productos en inventario
  }, [inventoryProducts]);

  return useMemo(() => {
    // Si inventoryProducts es undefined, retorna los productos directamente
    if (!inventoryProducts) {
      return products;
    }

    return products
      ?.filter(
        (prod: Partial<ProductType>) =>
          (prod?.initial_products ?? 0) + (prod?.incoming_products ?? 0) <= 0,
      )
      .filter((prod) => {
        const normalizedProductName = normalizeNames(prod.name);
        return !inventoryNames?.includes(normalizedProductName); // Filtra los productos que ya están en inventario
      })
      .filter((prod) =>
        prod?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, inventoryNames, searchTerm, inventoryProducts]);
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
