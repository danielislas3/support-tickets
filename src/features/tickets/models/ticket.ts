export type Priority = 'low' | 'medium' | 'high'
export type TicketStatus = 'open' | 'in_progress' | 'resolved'

export interface AttachedFile {
  name: string
  type: string
  size: number
  data: string // base64 encoded
}

export interface Ticket {
  id: string
  subject: string
  priority: Priority
  detail: string
  attachment: AttachedFile | null
  createdAt: string // ISO 8601 format
  status: TicketStatus
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export const ITEMS_PER_PAGE = 10