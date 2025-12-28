import { z, ZodSchema } from 'zod';

// Esquema de validación de Zod
export const CreateProductSchema: ZodSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  unit: z.string().min(1, 'La unidad de medida es obligatoria'),
  cost: z.number().positive('El costo debe ser mayor que 0'),
  price: z.number().positive('El precio debe ser mayor que 0'),
});

// Esquema de validación de Zod
export const UpdateProductSchema: ZodSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  unit: z.string().min(1, 'La unidad de medida es obligatoria'),
  price: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'Initial must be a positive number',
    ),
  incoming_products: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'Initial must be a positive number',
    ),
  sold_products: z
    .number()
    .nonnegative('Los productos vendidos deben ser cero o más'),
});

// Esquema de validación de Zod
export const ShortProductSchema: ZodSchema = z.object({
  incoming_products: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'Initial must be a positive number',
    ),
});

export type CreateProductFormData = z.infer<typeof CreateProductSchema>;
export type UpdateProductFormData = z.infer<typeof UpdateProductSchema>;
export type ShortProductFormData = z.infer<typeof ShortProductSchema>;
