import { TicketForm } from '@/features/tickets/components'

function ReportTicket() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reportar Problema</h2>
        <p className="text-gray-600 mt-1">
          Completa el formulario para reportar un nuevo problema
        </p>
      </div>
      <TicketForm />
    </div>
  )
}

export default ReportTicket
