import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import TicketForm from '@/features/tickets/components/TicketForm'
import * as fileUtils from '@/features/tickets/utils/fileUtils'
import { useCreateTicketMutation } from '@/features/tickets/api/ticketsApi'
import { useNavigate } from 'react-router-dom'

// Mock dependencies
vi.mock('@/features/tickets/api/ticketsApi')
vi.mock('@/features/tickets/utils/fileUtils', () => ({
  fileToAttachedFile: vi.fn(),
  getFileValidationError: vi.fn(),
  formatFileSize: vi.fn(),
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'],
}))
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))



describe('TicketForm', () => {
  const mockCreateTicket = vi.fn()
  const mockNavigate = vi.fn()
  const mockUnwrap = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockCreateTicket.mockResolvedValue({ unwrap: mockUnwrap })

    // Setup mocks
    vi.mocked(useCreateTicketMutation).mockReturnValue([
      mockCreateTicket,
      { isLoading: false },
    ])
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    // Default file utils behavior
    vi.mocked(fileUtils.getFileValidationError).mockReturnValue(null)
    vi.mocked(fileUtils.fileToAttachedFile).mockResolvedValue({
      name: 'test-file.jpg',
      type: 'image/jpeg',
      size: 1024,
      data: 'base64-data',
    })
    vi.mocked(fileUtils.formatFileSize).mockImplementation((bytes) => `${bytes} bytes`)
  })

  it('renders the form with all required fields', () => {
    render(<TicketForm />)

    // Check form fields
    expect(screen.getByLabelText(/Asunto/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Prioridad/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Descripción del problema/)).toBeInTheDocument()
    expect(screen.getByText('Seleccionar archivo')).toBeInTheDocument()
    
    // Check buttons
    expect(screen.getByRole('button', { name: 'Reportar Problema' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Limpiar' })).toBeInTheDocument()
    
    // Check file upload info
    expect(screen.getByText('Imágenes, PDF o texto (máx. 5MB)')).toBeInTheDocument()
  })

  it('validates required fields on submit', async () => {
    const user = userEvent.setup()
    render(<TicketForm />)

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: 'Reportar Problema' })
    await user.click(submitButton)

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('El asunto debe tener al menos 3 caracteres')).toBeInTheDocument()
      expect(screen.getByText('La descripción debe tener al menos 10 caracteres')).toBeInTheDocument()
    })
  })

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup()
    // Mock RTK Query mutation response correctly
    const mockUnwrap = vi.fn().mockResolvedValue({ id: 'test-id' })
    mockCreateTicket.mockReturnValue({ unwrap: mockUnwrap })

    render(<TicketForm />)

    // Fill form
    await user.type(screen.getByLabelText(/Asunto/), 'Test subject')
    await user.selectOptions(screen.getByLabelText(/Prioridad/), 'high')
    await user.type(screen.getByLabelText(/Descripción del problema/), 'This is a detailed description of the problem')

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Reportar Problema' })
    await user.click(submitButton)

    // Verify API call
    await waitFor(() => {
      expect(mockCreateTicket).toHaveBeenCalledWith({
        subject: 'Test subject',
        detail: 'This is a detailed description of the problem',
        priority: 'high',
        attachment: null,
      })
      expect(mockUnwrap).toHaveBeenCalled()
    })

    // Verify navigation after success
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/my-reports')
    })
  })

  it('handles file upload and includes it in submission', async () => {
    const user = userEvent.setup()
    const mockUnwrap = vi.fn().mockResolvedValue({})
    mockCreateTicket.mockReturnValue({ unwrap: mockUnwrap })

    // Create mock file
    const mockFile = new File(['test content'], 'test-file.jpg', { type: 'image/jpeg' })
    vi.mocked(fileUtils.getFileValidationError).mockReturnValue(null)
    vi.mocked(fileUtils.fileToAttachedFile).mockResolvedValue({
      name: 'test-file.jpg',
      type: 'image/jpeg',
      size: 1024,
      data: 'base64-data',
    })

    render(<TicketForm />)

    // Fill form
    await user.type(screen.getByLabelText(/Asunto/), 'Test with file')
    await user.type(screen.getByLabelText(/Descripción del problema/), 'Description with file')

    // Upload file
    const fileInput = screen.getByLabelText(/Seleccionar archivo/)
    expect(fileInput).toBeInTheDocument()
    await user.upload(fileInput, mockFile)

    // Should show file preview
    expect(await screen.findByText('test-file.jpg')).toBeInTheDocument()

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Reportar Problema' })
    expect(submitButton).not.toBeDisabled()
    await user.click(submitButton)

    // Verify file conversion was called
    await waitFor(() => {
      expect(vi.mocked(fileUtils.fileToAttachedFile)).toHaveBeenCalledWith(mockFile)
    })

    // Verify API call includes file
    await waitFor(() => {
      expect(mockCreateTicket).toHaveBeenCalledWith({
        subject: 'Test with file',
        detail: 'Description with file',
        priority: 'medium', // default
        attachment: {
          name: 'test-file.jpg',
          type: 'image/jpeg',
          size: 1024,
          data: 'base64-data',
        },
      })
      expect(mockUnwrap).toHaveBeenCalled()
    })
  })

  it('allows removing selected file', async () => {
    const user = userEvent.setup()
    vi.mocked(fileUtils.getFileValidationError).mockReturnValue(null)

    render(<TicketForm />)

    // Upload file
    const mockFile = new File(['test'], 'test-file.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/Seleccionar archivo/)
    await user.upload(fileInput, mockFile)

    // Verify validation was called
    await waitFor(() => {
      expect(vi.mocked(fileUtils.getFileValidationError)).toHaveBeenCalledWith(mockFile)
    })

    // Should show file preview
    expect(await screen.findByText('test-file.jpg')).toBeInTheDocument()

    // Click remove button
    const removeButton = screen.getByRole('button', { name: 'Eliminar archivo' })
    await user.click(removeButton)

    // File preview should disappear
    await waitFor(() => {
      expect(screen.queryByText('test-file.jpg')).not.toBeInTheDocument()
    })
  })

  it('shows loading state while submitting', () => {
    // Mock loading state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(useCreateTicketMutation as any).mockReturnValue([
      vi.fn().mockResolvedValue({ unwrap: vi.fn() }),
      { isLoading: true },
    ])

    render(<TicketForm />)

    // Should show loading text
    expect(screen.getByText('Creando ticket...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Creando ticket...' })).toBeDisabled()
    
    // Clear button should also be disabled
    expect(screen.getByRole('button', { name: 'Limpiar' })).toBeDisabled()
  })

  it('clears form when Limpiar button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(fileUtils.getFileValidationError).mockReturnValue(null)

    render(<TicketForm />)

    // Fill form
    await user.type(screen.getByLabelText(/Asunto/), 'Test subject')
    await user.type(screen.getByLabelText(/Descripción del problema/), 'Test description')

    // Upload file
    const mockFile = new File(['test'], 'test-file.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/Seleccionar archivo/)
    await user.upload(fileInput, mockFile)

    // Click clear button
    const clearButton = screen.getByRole('button', { name: 'Limpiar' })
    await user.click(clearButton)

    // Form should be cleared
    expect(screen.getByLabelText(/Asunto/)).toHaveValue('')
    expect(screen.getByLabelText(/Descripción del problema/)).toHaveValue('')
    expect(screen.queryByText('test-file.jpg')).not.toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock API error
    mockCreateTicket.mockRejectedValue(new Error('API Error'))

    render(<TicketForm />)

    // Fill and submit form
    await user.type(screen.getByLabelText(/Asunto/), 'Test subject')
    await user.type(screen.getByLabelText(/Descripción del problema/), 'Test description')
    
    const submitButton = screen.getByRole('button', { name: 'Reportar Problema' })
    await user.click(submitButton)

    // Should log error but not crash
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating ticket:', expect.any(Error))
    })

    consoleErrorSpy.mockRestore()
  })
})