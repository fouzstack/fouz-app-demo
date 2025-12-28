// utils/product-mapper.ts
import { ProductType } from '../../models/models';
import { CreateProductFormData } from '../../schemas/product.schema';

export const mapFormDataToProduct = (
  formData: CreateProductFormData,
): Omit<ProductType, 'id'> => {
  const timestamp = new Date().toISOString();

  return {
    code: `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: formData.name,
    unit: formData.unit,
    cost: formData.cost,
    price: formData.price,
    initial_products: 0,
    incoming_products: 0,
    losses: 0,
    final_products: 0,
    created_at: timestamp,
    updated_at: timestamp,
  };
};
