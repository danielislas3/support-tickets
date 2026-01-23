import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '@/shared/components/Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    onPageChange: vi.fn(),
  }

  it('renders null when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('renders pagination with correct page info', () => {
    render(<Pagination {...defaultProps} />)
    
    // Check showing text - use getAllByText since multiple elements match
    const showingElements = screen.getAllByText((_content, element) => {
      return element?.textContent?.includes('Mostrando') && 
             element?.textContent?.includes('1') &&
             element?.textContent?.includes('10') &&
             element?.textContent?.includes('50') &&
             element?.textContent?.includes('resultados') || false
    })
    expect(showingElements.length).toBeGreaterThan(0)
    expect(showingElements[0]).toBeInTheDocument()
    
    // Check page numbers (desktop view)
    expect(screen.getByText('1', { selector: 'button' })).toBeInTheDocument()
    expect(screen.getByText('2', { selector: 'button' })).toBeInTheDocument()
    expect(screen.getByText('3', { selector: 'button' })).toBeInTheDocument()
    expect(screen.getByText('4', { selector: 'button' })).toBeInTheDocument()
    expect(screen.getByText('5', { selector: 'button' })).toBeInTheDocument()
    
    // Check navigation buttons (only desktop buttons have aria-labels)
    expect(screen.getAllByLabelText('Página anterior')).toHaveLength(1)
    expect(screen.getAllByLabelText('Página siguiente')).toHaveLength(1)
  })

  it('highlights current page correctly', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    
    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveClass('bg-blue-50')
    expect(currentPageButton).toHaveClass('border-blue-500')
    expect(currentPageButton).toHaveClass('text-blue-600')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
    
    // Other pages should not have current page styles
    const otherPageButton = screen.getByText('1')
    expect(otherPageButton).not.toHaveClass('bg-blue-50')
    expect(otherPageButton).not.toHaveClass('border-blue-500')
    expect(otherPageButton).not.toHaveClass('text-blue-600')
    expect(otherPageButton).not.toHaveAttribute('aria-current')
  })

  it('calls onPageChange with correct page when page number is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />)
    
    const page3Button = screen.getByText('3')
    await user.click(page3Button)
    
    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with previous page when previous button is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    
    render(
      <Pagination 
        {...defaultProps} 
        currentPage={3} 
        onPageChange={onPageChange} 
      />
    )
    
    // Find desktop previous button (inside nav)
    const nav = document.querySelector('nav')
    expect(nav).toBeInTheDocument()
    
    const desktopPreviousButton = nav?.querySelector('[aria-label="Página anterior"]')
    expect(desktopPreviousButton).toBeInTheDocument()
    expect(desktopPreviousButton).not.toBeDisabled()
    
    if (desktopPreviousButton) {
      await user.click(desktopPreviousButton as Element)
    }
    
    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page when next button is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    
    render(
      <Pagination 
        {...defaultProps} 
        currentPage={3} 
        onPageChange={onPageChange} 
      />
    )
    
    // Find desktop next button (inside nav)
    const nav = document.querySelector('nav')
    expect(nav).toBeInTheDocument()
    
    const desktopNextButton = nav?.querySelector('[aria-label="Página siguiente"]')
    expect(desktopNextButton).toBeInTheDocument()
    expect(desktopNextButton).not.toBeDisabled()
    
    if (desktopNextButton) {
      await user.click(desktopNextButton as Element)
    }
    
    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    
    const previousButtons = screen.getAllByLabelText('Página anterior')
    
    previousButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)
    
    const nextButtons = screen.getAllByLabelText('Página siguiente')
    
    nextButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('calculates showing items correctly', () => {
    // Test case 1: first page
    const { unmount } = render(
      <Pagination {...defaultProps} currentPage={1} />
    )
    
    const showingElements1 = screen.getAllByText((_content, element) => {
      return element?.textContent?.includes('Mostrando') && 
             element?.textContent?.includes('1') &&
             element?.textContent?.includes('10') &&
             element?.textContent?.includes('50') &&
             element?.textContent?.includes('resultados') || false
    })
    expect(showingElements1.length).toBeGreaterThan(0)
    expect(showingElements1[0]).toBeInTheDocument()
    
    unmount()
    
    // Test case 2: middle page
    render(
      <Pagination {...defaultProps} currentPage={3} />
    )
    
    const showingElements2 = screen.getAllByText((_content, element) => {
      return element?.textContent?.includes('Mostrando') && 
             element?.textContent?.includes('21') &&
             element?.textContent?.includes('30') &&
             element?.textContent?.includes('50') &&
             element?.textContent?.includes('resultados') || false
    })
    expect(showingElements2.length).toBeGreaterThan(0)
    expect(showingElements2[0]).toBeInTheDocument()
  })

  it('handles mobile pagination buttons', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    
    render(
      <Pagination 
        {...defaultProps} 
        currentPage={2} 
        onPageChange={onPageChange} 
      />
    )
    
    // Mobile previous button - find button within mobile section
    const mobileSection = document.querySelector('.sm\\:hidden')
    expect(mobileSection).toBeInTheDocument()
    
    const mobilePreviousButton = mobileSection?.querySelector('button:first-child')
    expect(mobilePreviousButton).toBeInTheDocument()
    expect(mobilePreviousButton).toHaveTextContent('Anterior')
    
    if (mobilePreviousButton) {
      await user.click(mobilePreviousButton as Element)
    }
    
    expect(onPageChange).toHaveBeenCalledWith(1)
    
    // Mobile next button  
    const mobileNextButton = mobileSection?.querySelector('button:last-child')
    expect(mobileNextButton).toBeInTheDocument()
    expect(mobileNextButton).toHaveTextContent('Siguiente')
    
    if (mobileNextButton) {
      await user.click(mobileNextButton as Element)
    }
    
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('respects min/max page boundaries', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    
    // Test clicking previous on first page
    render(
      <Pagination 
        {...defaultProps} 
        currentPage={1} 
        onPageChange={onPageChange} 
      />
    )
    
    const previousButtons = screen.getAllByLabelText('Página anterior')
    const desktopPreviousButton = previousButtons[0]
    
    // Button should be disabled on first page
    expect(desktopPreviousButton).toBeDisabled()
    
    // Click should not call onPageChange because button is disabled
    await user.click(desktopPreviousButton)
    
    expect(onPageChange).not.toHaveBeenCalled()
  })
})