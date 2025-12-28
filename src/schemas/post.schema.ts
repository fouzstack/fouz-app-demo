import { z } from 'zod';
import { InputGeneric } from './types';

export const PostSchema = z.object({
  author_id: z.string(),
  title: z.string().min(4, '*Title is required'),
  overview: z.string().min(10, '*Overview is required'),
  categories: z.string().min(1, '*Select one at least'),
  content: z.string().min(10, '*Markdown content is required'),
});

export type PostCreate = z.infer<typeof PostSchema>;
export type PostUpdate = z.infer<typeof PostSchema>;
export type Post = PostCreate | PostUpdate;

export type InputProps = InputGeneric<Post>;
