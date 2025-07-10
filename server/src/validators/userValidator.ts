import { z } from 'zod';

export const userValidator = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

export const modifyPasswordValidator = z.object({
  body: z.object({
    oldPassword: z.string().min(6, 'Old password must be at least 6 characters long'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }), 
});