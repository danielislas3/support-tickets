import { describe, it, expect, vi } from 'vitest'
import * as fileUtils from '@/features/tickets/utils/fileUtils'
const {
  fileToBase64,
  fileToAttachedFile,
  isValidFileType,
  isValidFileSize,
  formatFileSize,
  getFileValidationError,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} = fileUtils

describe('fileUtils', () => {
  describe('fileToBase64', () => {
    it('converts file to base64 string', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        result: 'data:text/plain;base64,dGVzdCBjb250ZW50',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onload: null as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onerror: null as any,
      }
      
      const FileReaderMock = vi.fn(function() { return mockFileReader })
      vi.stubGlobal('FileReader', FileReaderMock)
      
      const promise = fileToBase64(mockFile)
      mockFileReader.onload!()
      
      await expect(promise).resolves.toBe('dGVzdCBjb250ZW50')
      expect(FileReaderMock).toHaveBeenCalled()
      vi.unstubAllGlobals()
    })

    it('rejects on file read error', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onload: null as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onerror: null as any,
      }
      
      const FileReaderMock = vi.fn(function() { return mockFileReader })
      vi.stubGlobal('FileReader', FileReaderMock)
      
      const promise = fileToBase64(mockFile)
      mockFileReader.onerror!()
      
      await expect(promise).rejects.toThrow('Error reading file')
      expect(FileReaderMock).toHaveBeenCalled()
      vi.unstubAllGlobals()
    })
  })

  describe('fileToAttachedFile', () => {
    it('converts file to AttachedFile object', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(mockFile, 'size', { value: 1234 })

      // Mock FileReader to control the base64 result
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        result: 'data:image/jpeg;base64,dGVzdCBjb250ZW50',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onload: null as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onerror: null as any,
      }

      const FileReaderMock = vi.fn(function() { return mockFileReader })
      vi.stubGlobal('FileReader', FileReaderMock)

      const promise = fileToAttachedFile(mockFile)
      mockFileReader.onload!()

      const result = await promise

      expect(result).toEqual({
        name: 'test.jpg',
        type: 'image/jpeg',
        size: 1234,
        data: 'dGVzdCBjb250ZW50',
      })

      vi.unstubAllGlobals()
    })
  })

  describe('isValidFileType', () => {
    it('returns true for allowed file types', () => {
      ALLOWED_FILE_TYPES.forEach((type) => {
        const file = new File([''], 'test', { type })
        expect(isValidFileType(file)).toBe(true)
      })
    })

    it('returns false for disallowed file types', () => {
      const file = new File([''], 'test.exe', { type: 'application/exe' })
      expect(isValidFileType(file)).toBe(false)
    })
  })

  describe('isValidFileSize', () => {
    it('returns true for files under max size', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE })
      expect(isValidFileSize(file)).toBe(true)
    })

    it('returns false for files over max size', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 })
      expect(isValidFileSize(file)).toBe(false)
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(500)).toBe('500 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
    })
  })

  describe('getFileValidationError', () => {
    it('returns null for valid files', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })
      expect(getFileValidationError(file)).toBeNull()
    })

    it('returns error for invalid file type', () => {
      const file = new File([''], 'test.exe', { type: 'application/exe' })
      Object.defineProperty(file, 'size', { value: 1024 })
      const error = getFileValidationError(file)
      expect(error).toBe('Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG), PDF y archivos de texto.')
    })

    it('returns error for oversized file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 })
      const error = getFileValidationError(file)
      expect(error).toBe(`El archivo es demasiado grande. Tamaño máximo: ${formatFileSize(MAX_FILE_SIZE)}`)
    })

    it('prioritizes type error over size error', () => {
      const file = new File([''], 'test.exe', { type: 'application/exe' })
      Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 })
      const error = getFileValidationError(file)
      expect(error).toBe('Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG), PDF y archivos de texto.')
    })
  })
})