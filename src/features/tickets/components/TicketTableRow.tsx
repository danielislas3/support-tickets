import { Link } from 'react-router-dom'
import { HiEye, HiTrash } from 'react-icons/hi2'
import type { Ticket } from '../models'
import { PriorityBadge, StatusBadge } from './TicketBadge'

interface TicketTableRowProps {
  ticket: Ticket
  onDelete: (id: string, subject: string) => void
}

function TicketTableRow({ ticket, onDelete }: TicketTableRowProps) {
  
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

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.detail}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <PriorityBadge priority={ticket.priority} />
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={ticket.status} />
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(ticket.createdAt)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/ticket/${ticket.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            title="Ver detalles del ticket"
          >
            <HiEye className="w-4 h-4" />
            Ver
          </Link>
          <button
            onClick={() => onDelete(ticket.id, ticket.subject)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            title="Eliminar ticket"
          >
            <HiTrash className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}

export default TicketTableRow
