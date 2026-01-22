import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { HiArrowLeft, HiCalendar, HiPencil, HiCheck, HiXMark } from 'react-icons/hi2'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useGetTicketByIdQuery, useUpdateTicketMutation } from '@/features/tickets/api/ticketsApi'
import { PriorityBadge, StatusBadge } from '@/features/tickets/components'
import AttachmentDisplay from '@/features/tickets/components/AttachmentDisplay'
import type { Priority, TicketStatus } from '@/features/tickets/models'

function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedPriority, setEditedPriority] = useState<Priority>('low')
  const [editedStatus, setEditedStatus] = useState<TicketStatus>('open')

  const { data: ticket, isLoading, error } = useGetTicketByIdQuery(id!)
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleEditClick = () => {
    if (ticket) {
      setEditedPriority(ticket.priority)
      setEditedStatus(ticket.status)
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    if (!ticket) return

    try {
      await updateTicket({
        id: ticket.id,
        updates: {
          priority: editedPriority,
          status: editedStatus,
        },
      }).unwrap()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <AiOutlineLoading3Quarters className="animate-spin h-10 w-10 text-blue-600" />
          <p className="mt-2 text-sm text-gray-600">Cargando ticket...</p>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error al cargar el ticket</p>
        <Link
          to="/my-reports"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <HiArrowLeft className="w-4 h-4" />
          Volver a Mis Tickets
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/my-reports')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <HiArrowLeft className="w-5 h-5" />
          Volver a Mis Tickets
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Detalle del Ticket</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{ticket.subject}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiCalendar className="w-4 h-4" />
                <span>Creado el {formatDate(ticket.createdAt)}</span>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                <HiPencil className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        </div>

        {/* Status and Priority Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value as Priority)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as TicketStatus)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resuelto</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                  ) : (
                    <HiCheck className="w-4 h-4" />
                  )}
                  Guardar
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiXMark className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Prioridad</p>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Estado</p>
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
          <p className="text-gray-900 whitespace-pre-wrap">{ticket.detail}</p>
        </div>

        {/* Attachment Section */}
        {ticket.attachment && <AttachmentDisplay attachment={ticket.attachment} />}
      </div>
    </div>
  )
}

export default TicketDetail
