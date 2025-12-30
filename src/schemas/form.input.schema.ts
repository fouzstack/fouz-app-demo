import { z } from 'zod';

export const dataSchema = z.object({
  email: z.string().email({
    message: 'valid email address is required',
  }),
});

export const commentSchema = z.object({
  email: z.string().email({
    message: 'valid email address is required',
  }),
  message: z.string().min(10, 'message is required'),
});

export type CommentInterface = z.infer<typeof commentSchema>;

export type InputData = z.infer<typeof dataSchema>;
