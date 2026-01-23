import { describe, it, expect } from 'vitest'
import { createTicketSchema } from '@/features/tickets/models/validationSchema'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/features/tickets/utils/fileUtils'

describe('validationSchema', () => {
  describe('createTicketSchema', () => {
    const validData = {
      subject: 'Test subject with enough length',
      detail: 'This is a detailed description with more than ten characters',
      priority: 'medium' as const,
    }

    it('validates correct data', () => {
      expect(() => createTicketSchema.parse(validData)).not.toThrow()
    })

    it('requires subject with min 3 characters', () => {
      expect(() => createTicketSchema.parse({ ...validData, subject: 'ab' }))
        .toThrow('El asunto debe tener al menos 3 caracteres')
    })

    it('requires subject with max 100 characters', () => {
      const longSubject = 'a'.repeat(101)
      expect(() => createTicketSchema.parse({ ...validData, subject: longSubject }))
        .toThrow('El asunto no puede exceder 100 caracteres')
    })

    it('requires detail with min 10 characters', () => {
      expect(() => createTicketSchema.parse({ ...validData, detail: 'short' }))
        .toThrow('La descripción debe tener al menos 10 caracteres')
    })

    it('requires detail with max 1000 characters', () => {
      const longDetail = 'a'.repeat(1001)
      expect(() => createTicketSchema.parse({ ...validData, detail: longDetail }))
        .toThrow('La descripción no puede exceder 1000 caracteres')
    })

    it('validates priority enum', () => {
      expect(() => createTicketSchema.parse({ ...validData, priority: 'invalid' }))
        .toThrow('Debes seleccionar una prioridad')
      
      expect(() => createTicketSchema.parse({ ...validData, priority: 'low' })).not.toThrow()
      expect(() => createTicketSchema.parse({ ...validData, priority: 'medium' })).not.toThrow()
      expect(() => createTicketSchema.parse({ ...validData, priority: 'high' })).not.toThrow()
    })

    it('allows optional attachment', () => {
      expect(() => createTicketSchema.parse({ ...validData, attachment: undefined })).not.toThrow()
      expect(() => createTicketSchema.parse(validData)).not.toThrow()
    })

    describe('attachment validation', () => {
      it('accepts valid file types', () => {
        ALLOWED_FILE_TYPES.forEach((type) => {
          const file = new File([''], 'test', { type })
          Object.defineProperty(file, 'size', { value: 1024 })
          expect(() => createTicketSchema.parse({ ...validData, attachment: file })).not.toThrow()
        })
      })

      it('rejects invalid file types', () => {
        const file = new File([''], 'test.exe', { type: 'application/exe' })
        Object.defineProperty(file, 'size', { value: 1024 })
        expect(() => createTicketSchema.parse({ ...validData, attachment: file }))
          .toThrow('Tipo de archivo no permitido')
      })

      it('rejects oversized files', () => {
        const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
        Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 })
        expect(() => createTicketSchema.parse({ ...validData, attachment: file }))
          .toThrow('El archivo no debe exceder 5MB')
      })

      it('accepts files at max size', () => {
        const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
        Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE })
        expect(() => createTicketSchema.parse({ ...validData, attachment: file })).not.toThrow()
      })

      it('requires attachment to be a File instance', () => {
        expect(() => createTicketSchema.parse({ ...validData, attachment: 'not-a-file' }))
          .toThrow('Invalid input: expected File, received string')
      })
    })
  })
})