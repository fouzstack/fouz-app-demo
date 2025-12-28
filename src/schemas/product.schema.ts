import { z } from 'zod';

export const UpdateInventoryProductSchema = z.object({
  name: z.string().min(1, { message: 'El nombre del producto es requerido' }),
  unit: z
    .string()
    .min(1, { message: 'La unidad de medida es requerida' })
    .max(5, { message: 'Solo 5 caracteres permitidos' }),
  cost: z.number().min(0, { message: 'El costo no puede ser negativo' }), // Min 0 para flexibilidad (se ajustará en Create)
  price: z.number().min(0, { message: 'El precio no puede ser negativo' }), // Min 0 para flexibilidad
});

// Schema base con validaciones comunes (relajadas para updates)
const ProductBaseSchema = z.object({
  name: z.string().min(1, { message: 'El nombre del producto es requerido' }),
  unit: z
    .string()
    .min(1, { message: 'La unidad de medida es requerida' })
    .max(5, { message: 'Solo 5 caracteres permitidos' }),
  cost: z.number().min(0, { message: 'El costo no puede ser negativo' }), // Min 0 para flexibilidad (se ajustará en Create)
  price: z.number().min(0, { message: 'El precio no puede ser negativo' }), // Min 0 para flexibilidad
});

// Create: Extiende el base y endurece cost/price
export const CreateProductSchema = ProductBaseSchema.extend({
  cost: z.number().min(0.01, { message: 'El costo debe ser mayor que cero' }),
  price: z
    .number()
    .min(0.01, { message: 'El precio de venta debe ser mayor que cero' }),
});

// Update: Extiende el base directamente y agrega campos extras
export const UpdateProductSchema = ProductBaseSchema.extend({
  // incoming_products y losses se mejoran abajo (ver siguiente sección)
  incoming_products: z
    .number()
    .min(0, { message: 'Las entradas no pueden ser negativas' }),
  losses: z
    .number()
    .min(0, { message: 'Las pérdidas no pueden ser negativas' }),
});

// Tipos inferidos (mismos que antes)
export type CreateProductFormData = z.infer<typeof CreateProductSchema>;
export type UpdateProductFormData = z.infer<typeof UpdateProductSchema>;
export type UpdateInventoryProductFormData = z.infer<
  typeof UpdateInventoryProductSchema
>;

export const FinalProductsSchema = z.object({
  final_products: z
    .string()
    .transform((val) => parseFloat(val || '0.00'))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'La cantidad debe ser un numero positivo!',
    ),
});

export type FinalProductsFormData = z.infer<typeof FinalProductsSchema>;
