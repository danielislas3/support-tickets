import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Ticket, PaginationParams, PaginatedResponse } from '../models'
import { storage, STORAGE_KEYS } from '@/shared/lib/storage'

/**
 * Helper to get all tickets from localStorage
 */
const getTicketsFromStorage = (): Ticket[] => {
  return storage.get<Ticket[]>(STORAGE_KEYS.TICKETS) || []
}

/**
 * Helper to save tickets to localStorage
 */
const saveTicketsToStorage = (tickets: Ticket[]): void => {
  storage.set(STORAGE_KEYS.TICKETS, tickets)
}

/**
 * RTK Query API for tickets using localStorage
 */
export const ticketsApi = createApi({
  reducerPath: 'ticketsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Ticket'],
  endpoints: (builder) => ({
    /**
     * Get all tickets with optional pagination
     */
    getTickets: builder.query<PaginatedResponse<Ticket>, Partial<PaginationParams> | void>({
      queryFn: (params) => {
        try {
          const { page = 1, limit = 10 } = params || {}
          const tickets = getTicketsFromStorage()

          const sortedTickets = [...tickets].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )

          // Pagination
          const startIndex = (page - 1) * limit
          const endIndex = startIndex + limit
          const paginatedData = sortedTickets.slice(startIndex, endIndex)
          const totalPages = Math.ceil(tickets.length / limit)

          return {
            data: {
              data: paginatedData,
              total: tickets.length,
              page,
              totalPages,
            },
          }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Failed to fetch tickets',
            },
          }
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Ticket' as const, id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),

    /**
     * Get ticket by ID
     */
    getTicketById: builder.query<Ticket, string>({
      queryFn: (id) => {
        try {
          const tickets = getTicketsFromStorage()
          const ticket = tickets.find((t) => t.id === id)

          if (!ticket) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Ticket not found',
              },
            }
          }

          return { data: ticket }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Failed to fetch ticket',
            },
          }
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Ticket', id }],
    }),

    /**
     * Create new ticket
     */
    createTicket: builder.mutation<Ticket, Omit<Ticket, 'id' | 'createdAt' | 'status'>>({
      queryFn: (newTicket) => {
        try {
          const tickets = getTicketsFromStorage()

          const ticket: Ticket = {
            ...newTicket,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: 'open',
          }

          const updatedTickets = [...tickets, ticket]
          saveTicketsToStorage(updatedTickets)

          return { data: ticket }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Failed to create ticket',
            },
          }
        }
      },
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    /**
     * Update ticket
     */
    updateTicket: builder.mutation<Ticket, { id: string; updates: Partial<Ticket> }>({
      queryFn: ({ id, updates }) => {
        try {
          const tickets = getTicketsFromStorage()
          const ticketIndex = tickets.findIndex((t) => t.id === id)

          if (ticketIndex === -1) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Ticket not found',
              },
            }
          }

          const updatedTicket = { ...tickets[ticketIndex], ...updates }
          const updatedTickets = [...tickets]
          updatedTickets[ticketIndex] = updatedTicket

          saveTicketsToStorage(updatedTickets)

          return { data: updatedTicket }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Failed to update ticket',
            },
          }
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Ticket', id },
        { type: 'Ticket', id: 'LIST' },
      ],
    }),

    /**
     * Delete ticket
     */
    deleteTicket: builder.mutation<void, string>({
      queryFn: (id) => {
        try {
          const tickets = getTicketsFromStorage()
          const updatedTickets = tickets.filter((t) => t.id !== id)

          saveTicketsToStorage(updatedTickets)

          return { data: undefined }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Failed to delete ticket',
            },
          }
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Ticket', id },
        { type: 'Ticket', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApi
