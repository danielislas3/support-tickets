import { render, screen } from '@testing-library/react'
import { PriorityBadge, StatusBadge } from '@/features/tickets/components/TicketBadge'
import type { Priority, TicketStatus } from '@/features/tickets/models'

describe('TicketBadge Components', () => {
  describe('PriorityBadge', () => {
    it('renders low priority badge with correct label and class', () => {
      render(<PriorityBadge priority="low" />)
      
      const badge = screen.getByText('Baja')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-gray-100')
      expect(badge).toHaveClass('text-gray-800')
    })

    it('renders medium priority badge with correct label and class', () => {
      render(<PriorityBadge priority="medium" />)
      
      const badge = screen.getByText('Media')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-yellow-100')
      expect(badge).toHaveClass('text-yellow-800')
    })

    it('renders high priority badge with correct label and class', () => {
      render(<PriorityBadge priority="high" />)
      
      const badge = screen.getByText('Alta')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-red-100')
      expect(badge).toHaveClass('text-red-800')
    })

    it('has correct base classes for all priorities', () => {
      const priorities: Priority[] = ['low', 'medium', 'high']
      
      priorities.forEach((priority) => {
        const { unmount } = render(<PriorityBadge priority={priority} />)
        const badge = screen.getByText(
          priority === 'low' ? 'Baja' :
          priority === 'medium' ? 'Media' : 'Alta'
        )
        
        expect(badge).toHaveClass('inline-flex')
        expect(badge).toHaveClass('items-center')
        expect(badge).toHaveClass('px-2.5')
        expect(badge).toHaveClass('py-0.5')
        expect(badge).toHaveClass('rounded-full')
        expect(badge).toHaveClass('text-xs')
        expect(badge).toHaveClass('font-medium')
        
        unmount()
      })
    })
  })

  describe('StatusBadge', () => {
    it('renders open status badge with correct label and class', () => {
      render(<StatusBadge status="open" />)
      
      const badge = screen.getByText('Abierto')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-blue-100')
      expect(badge).toHaveClass('text-blue-800')
    })

    it('renders in_progress status badge with correct label and class', () => {
      render(<StatusBadge status="in_progress" />)
      
      const badge = screen.getByText('En Progreso')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-purple-100')
      expect(badge).toHaveClass('text-purple-800')
    })

    it('renders resolved status badge with correct label and class', () => {
      render(<StatusBadge status="resolved" />)
      
      const badge = screen.getByText('Resuelto')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-green-100')
      expect(badge).toHaveClass('text-green-800')
    })

    it('has correct base classes for all statuses', () => {
      const statuses: TicketStatus[] = ['open', 'in_progress', 'resolved']
      
      statuses.forEach((status) => {
        const { unmount } = render(<StatusBadge status={status} />)
        const badge = screen.getByText(
          status === 'open' ? 'Abierto' :
          status === 'in_progress' ? 'En Progreso' : 'Resuelto'
        )
        
        expect(badge).toHaveClass('inline-flex')
        expect(badge).toHaveClass('items-center')
        expect(badge).toHaveClass('px-2.5')
        expect(badge).toHaveClass('py-0.5')
        expect(badge).toHaveClass('rounded-full')
        expect(badge).toHaveClass('text-xs')
        expect(badge).toHaveClass('font-medium')
        
        unmount()
      })
    })
  })
})