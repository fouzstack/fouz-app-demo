import { z, ZodSchema } from 'zod';

// Esquema de validación de Zod
export const ProductModalSchema: ZodSchema = z.object({
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'El precio debe ser un numero positivo!',
    ),
  sold_products: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'La cantidad debe ser un numero positivo!',
    ),
});

export const IncomingProductSchema: ZodSchema = z.object({
  incoming_products: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'La cantidad debe ser un numero positivo!',
    ),
});

export const FinalProductsSchema: ZodSchema = z.object({
  final_products: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'La cantidad debe ser un numero positivo!',
    ),
});

export const TableModalSchema: ZodSchema = z.object({
  cost: z
    .string()
    .optional()
    .transform((val) => parseFloat(val || '0.00'))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'El precio debe ser un numero positivo!',
    ),
  price: z
    .string()
    .optional()
    .transform((val) => parseFloat(val || '0.00'))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'El precio debe ser un numero positivo!',
    ),
  final_products: z
    .string()
    .optional()
    .transform((val) => parseInt(val || '0'))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'La cantidad debe ser un numero positivo!',
    ),
  incoming_products: z
    .string()
    .optional()
    .transform((val) => parseInt(val || '0'))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'La cantidad debe ser un numero positivo!',
    ),
  losses: z
    .string()
    .optional()
    .transform((val) => parseInt(val || '0'))
    .refine(
      (num) => !isNaN(num) && num >= 0,
      'La cantidad debe ser un numero positivo!',
    ),
});

export type FinalProductsFormData = z.infer<typeof FinalProductsSchema>;
export type TableModalFormData = z.infer<typeof TableModalSchema>;
export type ProductModalFormData = z.infer<typeof ProductModalSchema>;
export type IncomingProductFormData = z.infer<typeof IncomingProductSchema>;
