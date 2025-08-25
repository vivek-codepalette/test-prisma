'use client'

import { useState, useEffect } from 'react'
import { getContacts } from '@/actions/contacts'

interface Contact {
  id: string
  name: string
  email: string
  dateOfBirth: Date | null
  createdAt: Date
  updatedAt: Date
}

interface ContactCardProps {
  contact: Contact
}

function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {new Date(contact.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-2">{contact.email}</p>
      {contact.dateOfBirth && (
        <p className="text-gray-500 text-xs">
          Born: {contact.dateOfBirth.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

interface ContactListProps {
  contacts: Contact[]
  title: string
  isLoading: boolean
  error?: string
}

function ContactList({ contacts, title, isLoading, error }: ContactListProps) {
  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isLoading ? 'Loading contacts...' : `${contacts.length} contacts`}
          </p>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {error ? (
            <div className="text-red-600 text-sm p-4 bg-red-50 rounded-lg">
              Error: {error}
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-20 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-gray-500 text-sm p-8 text-center">
              No contacts found
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [serverActionContacts, setServerActionContacts] = useState<Contact[]>([])
  const [apiContacts, setApiContacts] = useState<Contact[]>([])
  const [serverActionLoading, setServerActionLoading] = useState(true)
  const [apiLoading, setApiLoading] = useState(true)
  const [serverActionError, setServerActionError] = useState<string | undefined>()
  const [apiError, setApiError] = useState<string | undefined>()

  // Fetch contacts using server actions
  const fetchServerActionContacts = async () => {
    try {
      setServerActionLoading(true)
      setServerActionError(undefined)
      const contacts = await getContacts()
      setServerActionContacts(contacts)
    } catch (error) {
      setServerActionError(error instanceof Error ? error.message : 'Failed to fetch contacts')
    } finally {
      setServerActionLoading(false)
    }
  }

  // Fetch contacts from API route
  const fetchApiContacts = async () => {
    try {
      setApiLoading(true)
      setApiError(undefined)
      const response = await fetch('/api/contacts')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const contacts = await response.json()
      setApiContacts(contacts)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to fetch contacts')
    } finally {
      setApiLoading(false)
    }
  }

  useEffect(() => {
    fetchServerActionContacts()
    fetchApiContacts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contact Management System
          </h1>
          <p className="text-gray-600">
            Compare data fetching methods: Server Actions vs API Routes
          </p>
        </div>

        <div className="flex gap-8">
          <ContactList
            contacts={serverActionContacts}
            title="Server Actions"
            isLoading={serverActionLoading}
            error={serverActionError}
          />

          <ContactList
            contacts={apiContacts}
            title="API Route"
            isLoading={apiLoading}
            error={apiError}
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              fetchServerActionContacts()
              fetchApiContacts()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
