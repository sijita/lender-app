import { z } from 'zod';

export const paymentSchema = z.object({
  clientId: z
    .number({
      required_error: 'Debe seleccionar un cliente',
      invalid_type_error: 'El cliente es requerido',
    })
    .nullable()
    .refine((val) => val !== null, {
      message: 'Debe seleccionar un cliente',
    }),
  clientName: z.string().optional(),
  loanId: z
    .number({
      required_error: 'Debe seleccionar un préstamo',
      invalid_type_error: 'El préstamo es requerido',
    })
    .nullable()
    .refine((val) => val !== null, {
      message: 'Debe seleccionar un préstamo',
    }),
  amount: z
    .string()
    .min(1, { message: 'El monto es requerido' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El monto debe ser mayor a 0',
    }),
  date: z.date({
    required_error: 'La fecha es requerida',
    invalid_type_error: 'Formato de fecha inválido',
  }),
  method: z.enum(['cash', 'transfer', 'other'], {
    required_error: 'El método de pago es requerido',
  }),
  notes: z.string().optional(),
});

export type Payment = z.infer<typeof paymentSchema>;
