import type { AttachedFile } from '../models'

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * Allowed file types
 */
export const ALLOWED_FILE_TYPES = [
  'image/jpg',
  'image/png',
  'application/pdf',
  'text/plain',
] as const

/**
 * Convert a File to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Convert a File to AttachedFile format
 */
export const fileToAttachedFile = async (file: File): Promise<AttachedFile> => {
  const base64Data = await fileToBase64(file)

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    data: base64Data,
  }
}

/**
 * Validate file type
 */
export const isValidFileType = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])
}

/**
 * Validate file size
 */
export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE
}

/**
 * Get file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}

/**
 * Get error message for invalid file
 */
export const getFileValidationError = (file: File): string | null => {
  if (!isValidFileType(file)) {
    return 'Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG), PDF y archivos de texto.'
  }

  if (!isValidFileSize(file)) {
    return `El archivo es demasiado grande. Tamaño máximo: ${formatFileSize(MAX_FILE_SIZE)}`
  }

  return null
}
