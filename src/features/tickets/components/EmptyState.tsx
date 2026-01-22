import { Link } from 'react-router-dom'
import { HiDocumentText, HiPlus } from 'react-icons/hi2'

function EmptyState() {
  return (
    <div className="text-center py-12">
      <HiDocumentText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tickets</h3>
      <p className="mt-1 text-sm text-gray-500">
        Comienza creando un nuevo ticket de soporte
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <HiPlus className="-ml-1 mr-2 h-5 w-5" />
          Crear Ticket
        </Link>
      </div>
    </div>
  )
}

export default EmptyState
