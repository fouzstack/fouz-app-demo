import { z } from 'zod';

// Schema base con validaciones comunes (relajadas para updates)
export const IncomingUpdateSchema = z.object({
  incoming_products: z
    .number()
    .min(0, { message: 'Las entradas no pueden ser negativas' }),
});
// Tipos inferidos (mismos que antes)
export type IncomingUpdateFormData = z.infer<typeof IncomingUpdateSchema>;
