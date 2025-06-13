import { z } from 'zod';

export const loanSchema = z.object({
  id: z.number().optional(),
  clientId: z.number({
    required_error: 'Debe seleccionar un cliente',
    invalid_type_error: 'El cliente es requerido',
  }),
  amount: z
    .string()
    .min(1, { message: 'El monto es requerido' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El monto debe ser mayor a 0',
    }),
  interestRate: z
    .string()
    .min(1, { message: 'La tasa de interés es requerida' })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'La tasa de interés debe ser un número válido',
    }),
  term: z
    .string()
    .min(1, { message: 'El plazo es requerido' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El plazo debe ser mayor a 0',
    }),
  startDate: z.date({
    required_error: 'La fecha de inicio es requerida',
  }),
  paymentDate: z.date({
    required_error: 'La fecha de pago es requerida',
  }),
  paymentFrequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly'], {
    required_error: 'La frecuencia de pago es requerida',
  }),
  partialQuota: z.string().optional(),
  status: z
    .enum(['active', 'completed', 'defaulted'], {
      required_error: 'El estado del préstamo es requerido',
    })
    .default('active'),
  notes: z.string().optional(),
});

// Extended schema that includes calculated fields
export const loanWithCalculatedFieldsSchema = loanSchema.extend({
  interest: z.number(),
  quota: z.number(),
  pendingQuotas: z.number(),
  totalAmount: z.number(),
  outstanding: z.number(),
  paidAmount: z.number().optional(),
});

export type Loan = z.infer<typeof loanSchema>;
export type LoanWithCalculatedFields = z.infer<
  typeof loanWithCalculatedFieldsSchema
>;
