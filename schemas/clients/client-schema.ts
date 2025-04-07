import { z } from 'zod';

export const clientSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  lastName: z.string().min(1, { message: 'El apellido es requerido' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z
    .string()
    .min(1, { message: 'El teléfono es requerido' })
    .max(10, { message: 'El teléfono debe tener 10 dígitos' }),
  address: z.string().min(1, { message: 'La dirección es requerida' }),
  subAddress: z.string().optional().or(z.literal('')),
  documentType: z
    .string()
    .min(1, { message: 'El tipo de documento es requerido' }),
  documentNumber: z
    .string()
    .min(1, { message: 'El número de documento es requerido' }),
  notes: z.string().optional().or(z.literal('')),
});

export type Client = z.infer<typeof clientSchema>;
