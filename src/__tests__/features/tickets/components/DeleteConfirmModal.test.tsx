import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteConfirmModal from '@/features/tickets/components/DeleteConfirmModal'

describe('DeleteConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    ticketSubject: 'Test Ticket',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    isDeleting: false,
  }

  it('renders null when isOpen is false', () => {
    const { container } = render(
      <DeleteConfirmModal {...defaultProps} isOpen={false} />
    )
    
    // Should render nothing
    expect(container.firstChild).toBeNull()
  })

  it('renders modal with correct content when isOpen is true', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    
    // Check title
    expect(screen.getByText('Eliminar Ticket')).toBeInTheDocument()
    
    // Check ticket subject in message
    expect(screen.getByText(/Test Ticket/)).toBeInTheDocument()
    expect(screen.getByText(/¿Estás seguro que deseas eliminar el ticket/)).toBeInTheDocument()
    expect(screen.getByText(/Esta acción no se puede deshacer./)).toBeInTheDocument()
    
    // Check buttons
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
    
    // Check warning icon (SVG with red color)
    const warningIcon = document.querySelector('.text-red-600')
    expect(warningIcon).toBeInTheDocument()
  })

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    
    render(<DeleteConfirmModal {...defaultProps} onCancel={onCancel} />)
    
    const cancelButton = screen.getByText('Cancelar')
    await user.click(cancelButton)
    
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when background overlay is clicked', () => {
    const onCancel = vi.fn()
    
    render(<DeleteConfirmModal {...defaultProps} onCancel={onCancel} />)
    
    // The overlay is a div with onClick handler
    const overlay = document.querySelector('.fixed.inset-0.bg-black')
    expect(overlay).toBeInTheDocument()
    
    if (overlay) {
      fireEvent.click(overlay)
      expect(onCancel).toHaveBeenCalledTimes(1)
    }
  })

  it('calls onConfirm when Delete button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    
    render(<DeleteConfirmModal {...defaultProps} onConfirm={onConfirm} />)
    
    const deleteButton = screen.getByText('Eliminar')
    await user.click(deleteButton)
    
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when isDeleting is true', () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={true} />)
    
    // Should show loading text
    expect(screen.getByText('Eliminando...')).toBeInTheDocument()
    
    // Should show loading spinner
    const loadingSpinner = document.querySelector('.animate-spin')
    expect(loadingSpinner).toBeInTheDocument()
    
    // Buttons should be disabled
    const cancelButton = screen.getByText('Cancelar')
    const deleteButton = screen.getByText('Eliminando...').closest('button')
    
    expect(cancelButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('disables buttons when isDeleting is true', () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={true} />)
    
    const cancelButton = screen.getByText('Cancelar')
    const deleteButton = screen.getByText('Eliminando...').closest('button')
    
    expect(cancelButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('has correct accessibility attributes', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    
    const deleteButton = screen.getByText('Eliminar')
    expect(deleteButton).toHaveAttribute('type', 'button')
    
    const cancelButton = screen.getByText('Cancelar')
    expect(cancelButton).toHaveAttribute('type', 'button')
  })
})