import { HiExclamationTriangle } from 'react-icons/hi2'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface DeleteConfirmModalProps {
  isOpen: boolean
  ticketSubject: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

function DeleteConfirmModal({
  isOpen,
  ticketSubject,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <HiExclamationTriangle className="h-6 w-6 text-red-600" />
          </div>

          {/* Content */}
          <div className="mt-3 text-center">
            <h3 className="text-lg font-medium text-gray-900">Eliminar Ticket</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                ¿Estás seguro que deseas eliminar el ticket{' '}
                <span className="font-medium text-gray-900">"{ticketSubject}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <AiOutlineLoading3Quarters className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Eliminando...
                </span>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
