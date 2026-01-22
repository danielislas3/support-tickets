import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useCreateTicketMutation } from '../api/ticketsApi'
import { createTicketSchema, type CreateTicketFormData } from '../models/validationSchema'
import { fileToAttachedFile, formatFileSize, getFileValidationError } from '../utils/fileUtils'
import { PRIORITY_LABELS } from '../utils/labels'

function TicketForm() {
  const navigate = useNavigate()
  const [createTicket, { isLoading }] = useCreateTicketMutation()
  const [fileError, setFileError] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: '',
      detail: '',
      priority: 'medium',
    },
  })

  const selectedFile = watch('attachment')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError(null)

    if (!file) {
      setSelectedFileName(null)
      setValue('attachment', undefined)
      return
    }

    const error = getFileValidationError(file)
    if (error) {
      setFileError(error)
      setSelectedFileName(null)
      setValue('attachment', undefined)
      event.target.value = ''
      return
    }

    setSelectedFileName(file.name)
    setValue('attachment', file)
  }

  const removeFile = () => {
    setSelectedFileName(null)
    setFileError(null)
    setValue('attachment', undefined)
    // Reset file input
    const fileInput = document.getElementById('attachment') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      let attachedFile = null

      if (data.attachment) {
        attachedFile = await fileToAttachedFile(data.attachment)
      }

      await createTicket({
        subject: data.subject,
        detail: data.detail,
        priority: data.priority,
        attachment: attachedFile,
      }).unwrap()

      // Success: reset form and redirect
      reset()
      setSelectedFileName(null)
      navigate('/mis-reportes')
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Asunto <span className="text-red-500">*</span>
        </label>
        <input
          {...register('subject')}
          type="text"
          id="subject"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            errors.subject ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ingresa el asunto del problema"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Prioridad <span className="text-red-500">*</span>
        </label>
        <select
          {...register('priority')}
          id="priority"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            errors.priority ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
        )}
      </div>

      {/* Detail */}
      <div>
        <label htmlFor="detail" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del problema <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('detail')}
          id="detail"
          rows={5}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
            errors.detail ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe el problema con detalle..."
        />
        {errors.detail && (
          <p className="mt-1 text-sm text-red-600">{errors.detail.message}</p>
        )}
      </div>

      {/* File Upload */}
      <div>
        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
          Archivo adjunto (opcional)
        </label>
        <div className="mt-1">
          <input
            type="file"
            id="attachment"
            onChange={handleFileChange}
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt"
          />
          <label
            htmlFor="attachment"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            Seleccionar archivo
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Imágenes, PDF o texto (máx. 5MB)
          </p>
        </div>

        {/* Selected file preview */}
        {selectedFileName && (
          <div className="mt-2 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFileName}</p>
                {selectedFile && (
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* File error */}
        {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
        {errors.attachment && (
          <p className="mt-1 text-sm text-red-600">{errors.attachment.message as string}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creando ticket...
            </span>
          ) : (
            'Reportar Problema'
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            reset()
            setSelectedFileName(null)
            setFileError(null)
          }}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Limpiar
        </button>
      </div>
    </form>
  )
}

export default TicketForm
