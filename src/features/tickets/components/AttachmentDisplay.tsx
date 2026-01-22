import { HiDocumentText } from 'react-icons/hi2'
import type { AttachedFile } from '../models'
import { formatFileSize } from '../utils/fileUtils'
interface AttachmentDisplayProps {
  attachment: AttachedFile
}

function AttachmentDisplay({ attachment }: AttachmentDisplayProps) {

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = attachment.data
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Archivo Adjunto</h3>
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <HiDocumentText className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
          <p className="text-xs text-gray-500">
            {formatFileSize(attachment.size)} • {attachment.type}
          </p>
        </div>
        <button
          onClick={handleDownload}
          type="button"
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          Descargar
        </button>
      </div>
    </div>
  )
}

export default AttachmentDisplay
