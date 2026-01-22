import { useParams } from 'react-router-dom'

function TicketDetail() {
  const { id } = useParams()

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Detalle del Ticket
      </h2>
      <p className="text-gray-600">
        Mostrando detalle del ticket ID: <span className="font-mono font-semibold">{id}</span>
      </p>
      <p className="text-gray-500 mt-2">
        Vista detallada del ticket (próximamente)
      </p>
    </div>
  )
}

export default TicketDetail
