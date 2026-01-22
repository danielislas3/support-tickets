import type { Priority, TicketStatus } from '../models'

/**
 * UI Labels in Spanish for Priority
 */
export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

/**
 * UI Labels in Spanish for Ticket Status
 */
export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Abierto',
  in_progress: 'En Progreso',
  resolved: 'Resuelto',
}

/**
 * Tailwind CSS classes for Priority badges
 */
export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

/**
 * Tailwind CSS classes for Status badges
 */
export const STATUS_COLORS: Record<TicketStatus, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
}
