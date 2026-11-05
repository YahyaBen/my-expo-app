import { z } from 'zod';

export const profileExampleSchema = z.object({
  name: z.string().trim().min(1, 'componentCatalog.forms.nameRequired').max(100, 'auth.max100'),
  email: z
    .string()
    .trim()
    .min(1, 'auth.emailRequired')
    .max(256, 'auth.emailTooLong')
    .pipe(z.email({ error: 'auth.invalidEmail' })),
  password: z.string().min(8, 'auth.passwordMinLength').max(128, 'auth.passwordMaxLength'),
  bio: z.string().trim().max(280, 'componentCatalog.forms.bioTooLong'),
  role: z.enum(['design', 'engineering', 'other']),
  updates: z.boolean(),
  consent: z.boolean().refine((value) => value, 'componentCatalog.forms.consentRequired'),
});

export type ProfileExampleValues = z.infer<typeof profileExampleSchema>;

export const emptyProfileExample: ProfileExampleValues = {
  name: '',
  email: '',
  password: '',
  bio: '',
  role: 'design',
  updates: false,
  consent: false,
};
