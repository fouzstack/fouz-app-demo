import { z } from 'zod';

// Schema base con validaciones comunes (relajadas para updates)
export const LossesUpdateSchema = z.object({
  losses: z
    .number()
    .min(0, { message: 'Las perdidas no pueden ser negativas' }),
});
// Tipos inferidos (mismos que antes)
export type LossesUpdateFormData = z.infer<typeof LossesUpdateSchema>;
