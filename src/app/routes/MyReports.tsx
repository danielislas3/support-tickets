import { TicketsTable } from '@/features/tickets/components'

function MyReports() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Mis Reportes</h2>
        <p className="text-gray-600 mt-1">Gestiona tus tickets de soporte</p>
      </div>
      <div className="p-6">
        <TicketsTable />
      </div>
    </div>
  )
}

export default MyReports
