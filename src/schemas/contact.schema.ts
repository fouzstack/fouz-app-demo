import { z } from 'zod';

export const contactSchema = z.object({
  email: z
    .string('Email is required')
    .min(6, 'Email is required')
    .email('invalid format!'),
  message: z.string().min(10, 'More than 10 characters'),
});

export type ContactInterface = z.infer<typeof contactSchema>;
