import { z } from 'zod'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../utils/fileUtils'

/**
 * Zod schema for creating a new ticket
 */
export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(3, 'El asunto debe tener al menos 3 caracteres')
    .max(100, 'El asunto no puede exceder 100 caracteres'),

  detail: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),

  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Debes seleccionar una prioridad',
  }),

  attachment: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true
        return file.size <= MAX_FILE_SIZE
      },
      {
        message: `El archivo no debe exceder ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      }
    )
    .refine(
      (file) => {
        if (!file) return true
        return ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])
      },
      {
        message: 'Tipo de archivo no permitido',
      }
    ),
})

/**
 * TypeScript type inferred from schema
 */
export type CreateTicketFormData = z.infer<typeof createTicketSchema>
