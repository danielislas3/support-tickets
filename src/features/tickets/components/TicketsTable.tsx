import { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useGetTicketsQuery, useDeleteTicketMutation } from '../api/ticketsApi'
import EmptyState from './EmptyState'
import { ITEMS_PER_PAGE } from '../models/ticket'
import DeleteConfirmModal from './DeleteConfirmModal'
import { Pagination } from '@/shared/components'
import TicketTableRow from './TicketTableRow'



function TicketsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [ticketToDelete, setTicketToDelete] = useState<{ id: string; subject: string } | null>(
    null
  )

  const { data, isLoading, error } = useGetTicketsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  })

  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation()

  const handleDeleteClick = (id: string, subject: string) => {
    setTicketToDelete({ id, subject })
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return

    try {
      await deleteTicket(ticketToDelete.id).unwrap()
      setDeleteModalOpen(false)
      setTicketToDelete(null)

      if (data && data.data.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error) {
      console.error('Error deleting ticket:', error)
    }
  }

  const handleCancelDelete = () => {
    setDeleteModalOpen(false)
    setTicketToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <AiOutlineLoading3Quarters className="animate-spin h-10 w-10 text-blue-600" />
          <p className="mt-2 text-sm text-gray-600">Cargando tickets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar los tickets</p>
      </div>
    )
  }

  if (!data || data.data.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asunto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((ticket) => (
              <TicketTableRow
                key={ticket.id}
                ticket={ticket}
                onDelete={handleDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        totalItems={data.total}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        ticketSubject={ticketToDelete?.subject || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default TicketsTable
